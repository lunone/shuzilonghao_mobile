<template>
    <div class="chart-wrpper">
        <bar-chart :option="option" class="chart" /> 
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import dayjs from 'dayjs';
import api from '@/utils/api';
import _ from 'lodash';
import { FlightItem } from '@/interface';
import BarChart from '@/components/chart/chart.vue';

const dayLenth = 21;
const flights: Ref<FlightItem[]> = ref([]);
const option = ref({});

const fetchFlishgts = async () => {
    const startDate = dayjs().add(0, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().add(dayLenth, 'day').format('YYYY-MM-DD');
    try {
        const res = await api('/flight/date/', { startDate, endDate }) as FlightItem[];
		// console.log(res,'ddddd')
        flights.value = res;
        processFlights();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
// const colorList = [
//     '#c23531', '#2f4554', '#61a0a8', '#d48265',
//     '#91c7ae', '#749f83', '#ca8622', '#bda29a',
//     '#6e7074', '#546570', '#c4ccd3'
// ];

const processFlights = () => {
    const groupedFlights = flights.value?.reduce((acc, flight) => {
        const date = dayjs(flight.date).format('M.D');
        // 初始化日期对应的航班数量为0
        acc[date] = acc[date] ?? 0;
        // 如果没有取消的，则将航班数量加1
        if (!flight.flagCs && !flight.flagPatch)
            acc[date]++;
        return acc;
    }, {} as Record<string, number>) ?? {};
    const avgDay = _.mean(Object.values(groupedFlights));
    const dates = Object.keys(groupedFlights).sort();
    const flightCounts = dates.map(date => groupedFlights[date]);

    option.value = {
        title: {
            text: `计划航班`,//${dayLenth}天
            left: 'right',
            // color: '#fff',
            textStyle: {
                color: '#777',//文字颜色               
                // fontStyle: 'normal', //字体风格,'normal','italic','oblique'
                fontWeight: 'bold', //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                // fontFamily: 'sans-serif',//字体系列
                fontSize: 16//字体大小
            }

        },
        tooltip: { show: false },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
                formatter: (val: string, key: number) => key == 0 ? '今' : val,
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: (val: string, key: number) => key % 3 == 0 ? val : '',
            }
        },
        grid: {
            top: '20px',    // 顶部刻度消失
            left: '-25px',// 让y轴不显示刻度的空白消失
            right: '-3px',// 让y轴最后不显示多的那一点
            bottom: '0',
            containLabel: true
        },
        series: [
            {
                name: '航班',
                data: flightCounts,
                type: 'bar',
                itemStyle: {
                    color: (params: any) => {
                        // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
                        const diff = (params.value - avgDay) / avgDay;
                        if (diff > 0.4) {
                            return '#d48264';
                        } else if (diff < -0.4) {
                            return '#c4ccd3';
                        } else {
                            return '#91c7ae';
                        }
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#ccc',
                    formatter: (params: any) => {
                        return params.value;
                    }
                }
            }
        ]
    };
};
const selectchanged = (params: any) => {
    console.log(params);
    // const date = params.name;
    // const flight = flights.value.find(flight => dayjs(flight.std).format('M.D') === date);
    // if (flight) {
    //     const flightDate = dayjs(flight.std).format('YYYY-MM-DD');
    //     const flightNo = flight.flightNo;
    //    const acReg = flight.acReg;
    // }
}
onMounted(() => {
    fetchFlishgts();
});
</script>

<style lang="less" scoped>
.chart {
    height: 160px;

}
</style>