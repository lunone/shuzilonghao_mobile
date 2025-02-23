<template>
    <div class="chart-wrpper">
        <ucharts :option="option" @select="showTip" :height="120" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, computed } from 'vue';
import dayjs from 'dayjs';
import api from '@/utils/api';
import { FlightItem } from '@/interface';
import ucharts from '@/components/ucharts/ucharts.vue';
import CONFIG from '@/config';
import _ from 'lodash-es';

const dayLenth = 22;
const flights: Ref<Record<string, Record<string, number>>> = ref({});
const option = ref();
const fetchFlishgts = async () => {
    const startDate = dayjs().add(0, 'day').toDate();
    const endDate = dayjs().add(dayLenth, 'day').toDate();
    try {
        const res = await api(CONFIG.url.flightPlan, { startDate, endDate });
        flights.value = res;
        option.value = setOption(res);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
let dates, groupedFlights;
function setOption(flights: Record<string, Record<string, number>>) {
    // 将每日的各种类型的航班数量加一块
    groupedFlights = _.mapValues(flights, flts => _.sum(Object.values(flts)));
    // 算出平均数
    const avgDay = _.mean(Object.values(groupedFlights));
    dates = Object.keys(groupedFlights).sort();

    return {
        type: 'column',
        categories: dates,
        series: [
            {
                name: "排班量",
                data: dates.map(date => {
                    const flightCounter = groupedFlights[date];
                    // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
                    const diff = (flightCounter - avgDay) / avgDay;
                    // console.log('---------',diff, flightCounter, avgDay)
                    const color = diff > 0.4 ? '#C52305' : (diff < -0.4) ? '#C52305' : "#E27C69";
                    return { color, value: flightCounter - Math.round(avgDay / 3) }
                }),
                formatter: val => val + Math.round(avgDay / 3),
                textOffset: 18,
            },
        ],
        animation: false,
        xAxis: {
            // labelCount: 3,// 这个确实会自动控制显示标签数量,但是不显示的标签的val就是''了,没办法formatter
            formatter: (val, index, opts) => {
                return index % 3 != 1 ? '' : dayjs(val).format('M/D')
            },
            disableGrid: true,
        },
        yAxis: {
            disabled: true,
            data: [{ min: 0 }]
        },
        extra: {
            column: { width: 14 }
        }
    }
};
const showTip = (chart, event) => {
    // 获取图表中当前事件的数据索引
    const item = chart.getCurrentDataIndex(event);
    const date = dates[item.index];
    // 将分组后的航班数据转换为文本格式，用于显示在提示框中
    const textList = _.reduce(flights.value[date], (acc, counter, acType) => [...acc, {
        text: `${acType}: ${counter}`, color: "#3870FF"
    }], [{ text: dayjs(date).format('M月D'), color: "#9820FF" }]);

    // 显示工具提示框，包含日期和各 acType 的航班数量
    chart.showToolTip(event, { textList });
};

onMounted(() => {
    fetchFlishgts();
});
</script>

<style lang="less" scoped>
.chart {
    height: 160px;

}
</style>