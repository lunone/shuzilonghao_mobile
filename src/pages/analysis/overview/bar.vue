<template>
    <ucharts :option="option" @select="showTip" :height="150" />
</template>
<script setup lang="ts">
import ucharts from '@/components/ucharts/ucharts.vue';
import { FlightItem } from '@/interface';
import dayjs from 'dayjs';
import { text } from 'stream/consumers';
import { watch, computed, ref, Ref } from 'vue';

const props = defineProps<{ data: FlightItem[], dateRange: [string, string] }>();

const dateFormatStr = 'YYYY-MM-DD';


// const flightsGroupByDate: Ref<Record<string, any[]>> = ref({});

const option = ref();
let dates, groupFlights;
watch(() => props.data, () => {
    // const data: Record<string, { weight: number, count: number, hour: number }> = {};
    // 默认选中最后一个的日期
    const weights = [], hours = [], counters = [];
    let endDate = '';
    dates = [];
    // 循环props.data,分组日期和航班
    groupFlights = props.data.reduce((acc, f) => {
        const date = dayjs(f.atd).format(dateFormatStr);
        return { ...acc, [date]: [...(acc[date] || []), f] };
    }, {});
    // 计算每天的数据
    for (let date in groupFlights) {
        dates.push(date);
        endDate = date;
        let weight = 0, hour = 0, counter = 0;
        groupFlights[date].forEach(f => {
            weight += f.netWeightCargo || 0;
            hour += dayjs(f.ata).diff(dayjs(f.atd), 'minute') || 0;
            counter++;
            //     if (!data[date]) {
            //         data[date] = { weight: 0, count: 0, hour: 0 };
            //     } else {
            //         data[date].weight += f.netWeightCargo || 0;
            //         data[date].count++;
            //         data[date].hour += dayjs(f.atd).diff(f.std, 'minute');
            //     }
        })
        weights.push((weight / 1e3).toFixed(2));
        hours.push((hour / 60).toFixed(2));
        counters.push(counter);
        // 最后处理小数
        // data[date].hour = +((data[date].hour / data[date].count) / 60).toFixed(2);
        // data[date].weight = +(data[date].weight / 1e3).toFixed(2);
    }
    // flightsGroupByDate.value = groupFlights;
    // 初始化饼图
    // dayChange({ name: dayjs(endDate).format(dateFormatStr) });
    // const dates = Object.keys(data);
    // const yData = Object.values(data);
    // const avgDay = yData.reduce((acc, cur) => +cur + acc, 0) / yData.length;
    // console.log(data, dates, yData, avgDay);
    const maxLength = 11;
    let step = 1
    // 如果数组长度小于或等于11，直接返回整个数组
    if (dates.length > maxLength) {     // 计算间隔
        step = Math.ceil(dates.length / maxLength);
    }
    // const weight = [];
    // 生成weight ,hour,counter三个数组
    // for (let date of dates) {
    //     weight.push(groupFlights[date]?.length || 0)
    // }
    // 取出hour的最大最小
    let hourMax = 0, hourMin = 0;
    for (let hour of hours) {
        hourMax = Math.max(hourMax, hour);
        hourMin = Math.min(hourMin, hour);
    }

    option.value = {
        type: "mix",
        categories: dates,
        series: [
            {
                color: "#aaaaaa",
                name: "货重", type: "column",
                data: weights
                //  yData.map(value => {
                //     // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
                //     const diff = (value - avgDay) / avgDay;
                //     const color = diff > 0.2 ? '#d48264' : (diff < -0.2) ? '#c4ccd3' : "#91c7ae";
                //     return { color, value }
                // })
            }, {
                name: '小时', type: "line",
                // data 过于接近,起伏不明显.假设最小值为10吧,最大值是200.然后val按比例转换.
                // 这里面的10是最小值对应的位置,500最大值,应该是货重的500决定了高低
                data: hours.map(val => {
                    return 10+(+val - hourMin) / (hourMax - hourMin) * 500;
                })

            },
            // { name: '班次', type: "column", data: counters }
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
            // disableGrid: true,
            data: [{
                min: 0,
                // disabled: true,
            },
            {
                disabled: false,
                min: 10, max: 50,
            }]
        },
        extra: {
            mix: {
                column: {
                    width: 16
                }
            }
        }
    }
}, { immediate: true });

function showTip(chart, event) {
    // 获取图表中当前事件的数据索引
    const item = chart.getCurrentDataIndex(event);
    console.log('showTip', item);

    // chart.touchLegend(event);
    // const { clientX, pageY } = event.changedTouches[0];
    chart.showToolTip(event, {
        textList: [
            { text: '日期', color: null },
            { text: '重量', color: "#1890FF" },
            { text: '占比', color: "#91CB74" }
        ]
        // formatter: ({ color, value }, date) => {
        //     return chart.opts.height + '|' + chart.opts.pix + '|' + info.pixelRatio
        //     //`x:${clientX.toFixed(1)} y:${pageY.toFixed(1)},offsetY:${offsetY}`;
        // }
    });
}
</script>