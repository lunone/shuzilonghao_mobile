<template>
    <div class="chart-wrpper">
        <ucharts :option="option" @select="showTip" :height="150" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, computed } from 'vue';
import dayjs from 'dayjs';
import api from '@/utils/api';
import _ from 'lodash';
import { FlightItem } from '@/interface';
import ucharts from '@/components/ucharts/ucharts.vue';
import { offsetCorrect } from '@/utils/ucharts';

const dayLenth = 22;
const flights: Ref<FlightItem[]> = ref([]);
const option = ref();
const fetchFlishgts = async () => {
    const startDate = dayjs().add(0, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().add(dayLenth, 'day').format('YYYY-MM-DD');
    try {
        const res = await api('/flight/date/', { startDate, endDate }) as FlightItem[];
        flights.value = res;
        option.value = setOption(res);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// const colorList = [
//     '#c23531', '#2f4554', '#61a0a8', '#d48265',
//     '#91c7ae', '#749f83', '#ca8622', '#bda29a',
//     '#6e7074', '#546570', '#c4ccd3'
// ];
let dates;
let flightCounts;
function setOption(flights) {
    if (flights.length == 0) {
        return
    }
    const groupedFlights = flights?.reduce((acc, flight) => {
        const date = dayjs(flight.date).format('YYYY-MM-DD');
        // 初始化日期对应的航班数量为0
        acc[date] = acc[date] ?? 0;
        // 如果没有取消的，则将航班数量加1
        if (!flight.flagCs && !flight.flagPatch)
            acc[date]++;
        return acc;
    }, {} as Record<string, number>) ?? {};
    const avgDay = _.mean(Object.values(groupedFlights));
    dates = Object.keys(groupedFlights).sort();
    flightCounts = dates.map(date => groupedFlights[date]);

    return {
        type: 'column',
        categories: dates,
        series: [
            {
                name: "目标值",
                data: flightCounts.map(value => {
                    // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
                    const diff = (value - avgDay) / avgDay;
                    const color = diff > 0.4 ? '#d48264' : (diff < -0.4) ? '#c4ccd3' : "#91c7ae";
                    return { color, value }
                })
            },
        ],
        animation: false,
        // background: "#FFFFFF",
        // padding: [2, 2, 2, 2],
        legend: { show: false, },
        xAxis: {
            // labelCount: 8,// 这个确实会自动控制显示标签数量,但是不显示的标签的val就是''了,没办法formatter
            formatter: (val, index) => index % 3 != 1 ? '' : dayjs(val).format('M/D'),
        },
        yAxis: {
            disabled: true,
        },
        extra: {
            column: { width: 16 }
        }
    }
};
const showTip = (chart: any, event) => {
    // const event2 = _.cloneDeep(event);
    // offsetCorrect(event, 16, 0);
    // const textList = _.reduce(flightCounts, (all, v, k) => [...all, { text: v, color: '#000' }],
    //     [{ text: dayjs(dates[index]).format('M月D'), color: '#000' }]);
    chart.showToolTip(event, {
        formatter: ({ color, value }, date) => {
            const flighs = _.filter(flights.value, (flight) => flight.date == date);
            const groupedFlights = _.groupBy(flighs, 'acType');
            return dayjs(date).format('M月D') + ":" + _.reduce(groupedFlights, (result, flights, key) => result + "\n" + `${key}(${flights.length})`, '');
        }
    });
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