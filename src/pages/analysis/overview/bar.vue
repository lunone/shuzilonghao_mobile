<template>
    <ucharts :option="option" @select="showTip" />
</template>
<script setup lang="ts">
import ucharts from '@/components/ucharts/ucharts.vue';
import { FlightItem } from '@/interface';
import dayjs from 'dayjs';
import _ from 'lodash';
import { watch, computed, ref, Ref } from 'vue';

const props = defineProps<{ data: FlightItem[], dateRange: [string, string] }>();

const dateFormatStr = 'YYYY-MM-DD';


const flightsGroupByDate: Ref<Record<string, any[]>> = ref({});

const option = ref();
watch(() => props.data, () => {
    console.log('data changed');
    const data: Record<string, number> = {};
    // 默认选中最后一个的日期
    let endDate = '';
    const flightsGroupByDateTemp = _.groupBy(props.data, f => dayjs(f.atd).format(dateFormatStr));
    for (let date in flightsGroupByDateTemp) {
        endDate = date;
        const flights = flightsGroupByDateTemp[date];
        data[date] = +((flights?.reduce((acc, flight) => acc + flight.netWeightCargo!, 0) || 0) / 1e3).toFixed(2);
    }
    flightsGroupByDate.value = flightsGroupByDateTemp;
    // 初始化饼图
    // dayChange({ name: dayjs(endDate).format(dateFormatStr) });
    const dates = Object.keys(data);
    const yData = Object.values(data);
    const avgDay = _.reduce(yData, (acc, cur) => +cur + acc, 0) / yData.length;
    console.log(data, dates, yData, avgDay);

    option.value = {
        categories: dates,
        series: [
            {
                name: "货重",
                data: yData,
                //  _.map(yData, value => {
                //     // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
                //     const diff = (value - avgDay) / avgDay;
                //     const color = diff > 0.4 ? '#d48264' : (diff < -0.4) ? '#c4ccd3' : "#91c7ae";
                //     return { color, value }
                // })
            },
        ],
        animation: false,
        // background: "#FFFFFF",
        // padding: [2, 2, 2, 2],
        legend: { show: false, },
        xAxis: {
            // labelCount: 8,// 这个确实会自动控制显示标签数量,但是不显示的标签的val就是''了,没办法formatter
            formatter: (val, index) => index % 2 != 1 ? '' : dayjs(val).format('M/D'),
        },
        yAxis: {
            // disabled:true,
            data: [{ min: 0 }]
        }
    }
}, { immediate: true });

// : Ref<Record<string, any>> = computed(() => {

//     // {
//     //     title: {
//     //         text: '每日运输量',
//     //         left: 'right'
//     //     },
//     //     tooltip: {
//     //         trigger: 'axis',
//     //         axisPointer: {
//     //             type: 'shadow'
//     //         }
//     //     },
//     //     xAxis: {
//     //         data: xData,
//     //         type: 'category',
//     //         axisLabel: {
//     //             formatter: (val: string, key: number) => dayjs(val).format('M/D'),
//     //             // rotate: 90, // 旋转角度，可以根据需要调整
//     //             // interval: 0, // 强制显示所有标签
//     //             // margin: 10 // 标签与轴线之间的距离
//     //         }
//     //     },
//     //     yAxis: {
//     //         type: 'value'
//     //     },
//     //     grid: {
//     //         top: '20px',    // 顶部刻度消失
//     //         // left: '-25px',// 让y轴不显示刻度的空白消失
//     //         // right: '-3px',// 让y轴最后不显示多的那一点
//     //         bottom: '0',
//     //         containLabel: true
//     //     },
//     //     series: [
//     //         {
//     //             name: '货重',
//     //             data: yData,
//     //             type: 'bar', itemStyle: {
//     //                 color: (params: any) => {
//     //                     // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
//     //                     const diff = (params.value - avgDay) / avgDay;
//     //                     if (diff > 0.1) {
//     //                         return '#d48264';
//     //                     } else if (diff < -0.1) {
//     //                         return '#c4ccd3';
//     //                     } else {
//     //                         return '#91c7ae';
//     //                     }
//     //                 }
//     //             },
//     //         }
//     //     ]
//     // }
// });
const showTip = (date: string) => {
    // dayChange({ name: date });
}
</script>