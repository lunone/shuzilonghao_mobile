<template>
    <ucharts :option="option" @select="showTip" :height="150" />
</template>
<script setup lang="ts">
import ucharts from '@/components/ucharts/ucharts.vue';
import { FlightItem } from '@/interface';
import dayjs from 'dayjs';
import * as _ from 'radash';
import { watch, computed, ref, Ref } from 'vue';

const props = defineProps<{ data: FlightItem[], dateRange: [string, string] }>();

const dateFormatStr = 'YYYY-MM-DD';


const flightsGroupByDate: Ref<Record<string, any[]>> = ref({});

const option = ref();
watch(() => props.data, () => {
    // console.log('data changed');
    const data: Record<string, number> = {};
    // 默认选中最后一个的日期
    let endDate = '';
    const flightsGroupByDateTemp = props.data.reduce((acc, f) => {
        const key = dayjs(f.atd).format(dateFormatStr);
        return { ...acc, [key]: [...(acc[key] || []), f] };
    }, {});
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
    const avgDay = yData.reduce((acc, cur) => +cur + acc, 0) / yData.length;
    // console.log(data, dates, yData, avgDay);
    const maxLength = 11;
    let step = 1
    // 如果数组长度小于或等于11，直接返回整个数组
    if (dates.length > maxLength) {
        // 计算间隔
        step = Math.ceil(dates.length / maxLength);

    }



    option.value = {
        type: 'column',
        categories: dates,
        series: [
            {
                name: "货重",
                data: yData.map(value => {
                    // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
                    const diff = (value - avgDay) / avgDay;
                    const color = diff > 0.2 ? '#d48264' : (diff < -0.2) ? '#c4ccd3' : "#91c7ae";
                    return { color, value }
                })
            },
        ],
        animation: false,
        // background: "#FFFFFF",
        padding: [15, 0, 10, 0],
        legend: { show: false, },
        xAxis: {
            disableGrid: true,
            // labelCount: 8,// 这个确实会自动控制显示标签数量,但是不显示的标签的val就是''了,没办法formatter
            formatter: (val, index) => index % step != 0 ? '' : dayjs(val).format('M/D'),
        },
        yAxis: {
            disabled: true,
            disableGrid: true,
            data: [{ min: 0 }]
        },
        extra: {
            column: {
                width: 16
            }
        }
    }
}, { immediate: true });

function showTip(chart, event, info) {
    console.log('showTip', event, info);
    // chart.touchLegend(event);
    const { clientX, pageY } = event.changedTouches[0];
    chart.showToolTip(event, {
        formatter: ({ color, value }, date) => {
            return chart.opts.height + '|' + chart.opts.pix + '|' + info.pixelRatio
            //`x:${clientX.toFixed(1)} y:${pageY.toFixed(1)},offsetY:${offsetY}`;
        }
    });
}
</script>