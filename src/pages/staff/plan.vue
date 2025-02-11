<template>
    <div class="chart-wrpper">
        <ucharts :option="option" @select="showTip" :height="150" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, computed } from 'vue';
import dayjs from 'dayjs';
import api from '@/utils/api';
import { FlightItem } from '@/interface';
import ucharts from '@/components/ucharts/ucharts.vue';
import CONFIG from '@/config';

const dayLenth = 22;
const flights: Ref<FlightItem[]> = ref([]);
const option = ref();
const fetchFlishgts = async () => {
    const startDate = dayjs().add(0, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().add(dayLenth, 'day').format('YYYY-MM-DD');
    try {
        const res = await api(CONFIG.url.flightDate, { startDate, endDate }) as FlightItem[];
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
let dates, groupedFlights;
function setOption(flights: FlightItem[]) {
    if (flights.length == 0) {
        return
    }
    let totalCount = 0;
    groupedFlights = flights?.reduce((acc, flight) => {
        const date = dayjs(flight.date).format('YYYY-MM-DD');
        // 初始化日期对应的航班数量为0
        acc[date] = acc[date] || [];
        // 如果没有取消的，则将航班数量加1
        if (!flight.flagCs && !flight.flagPatch) {
            totalCount++;
            acc[date].push(flight);
        }
        return acc;
    }, {}) ?? {};

    const avgDay = totalCount / Object.keys(groupedFlights).length || 0;
    dates = Object.keys(groupedFlights).sort();
    // flightCounts = dates.map(date => groupedFlights[date].length);

    return {
        type: 'column',
        categories: dates,
        series: [
            {
                name: "排班量",
                data: dates.map(date => {
                    const flights = groupedFlights[date];
                    // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
                    const diff = (flights.length - avgDay) / avgDay;
                    const color = diff > 0.4 ? '#d48264' : (diff < -0.4) ? '#c4ccd3' : "#91c7ae";
                    return { color, value: flights.length }
                })
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

    // 根据索引获取对应的航班数据
    const flights = groupedFlights[dates[item.index]];

    // 将航班数据按 acType 分组
    const groupFlights = flights.reduce((acc, flight) => {
        // 如果 acc 中没有当前 acType 的数组，则初始化为空数组
        acc[flight.acType] = acc[flight.acType] || [];
        // 将当前航班添加到对应 acType 的数组中
        acc[flight.acType].push(flight);
        return acc;
    }, {}) as Record<string, FlightItem[]>;

    // 将分组后的航班数据转换为文本格式，用于显示在提示框中
    const arr = Object.keys(groupFlights).map(acType => ({
        text: `${acType}: ${groupFlights[acType].length}`
    }));

    // 显示工具提示框，包含日期和各 acType 的航班数量
    chart.showToolTip(event, {
        textList: [
            { text: dayjs(dates[item.index]).format('M月D') ,color:"#9820FF"}, // 显示日期
            ...arr // 显示各 acType 的航班数量
        ]
    });
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