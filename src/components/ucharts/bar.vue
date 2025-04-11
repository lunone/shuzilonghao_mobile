<template>
    <div class="chart-wrpper" >
        <ucharts :option="chartOption" @select="handleSelect" :height="120" />
    </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import ucharts from '@/components/ucharts/ucharts.vue'

const props = defineProps({
    data: { type: Array as PropType<Array<{ name: string, value: number }>>, required: true }, // 饼图数据
    // title: { type: String, default: '' }, // 图表标题
})

// 计算总数值
const totalValue = computed(() => {
    return props.data.reduce((sum, item) => sum + item.value, 0)
})

// 生成图表配置
const chartOption = computed(() => ({
    type: "column",
    categories: props.data.map(item => item.name),
    series: [{
        data: props.data.map(item => ({
            ...item,
            labelText: `${item.name} ${((item.value / totalValue.value) * 100).toFixed(1)}%`
        })),
        formatter: (val, index) => val ? val : '',
    }],
    padding: [30, 0, 10, 0],
    animation: false,
    xAxis: {
        // labelCount: 12,// 这个确实会自动控制显示标签数量,但是不显示的标签的val就是''了,没办法formatter
        formatter: (val, index, opts) => {
            return index % 2 != 0 ? '' : val
        },
    },
    yAxis: {
        disableGrid: true,
        disabled: true,
        data: [{ min: 0 }]
    },
    extra: {
        column: {
            width: 12,
        }
    },
    rotate: false,
    rotateLock: false,
}))

// 点击事件处理
function handleSelect(chart, event) {
    // const index = chart.getCurrentDataIndex(event)
    // const item = props.data[index]
    // // const percent = ((item.value / totalValue.value) * 100).toFixed(2)

    // chart.showToolTip(event, {
    //     textList: [
    //         { text: item.name, color: null },
    //         { text: `数值: ${item.value}`, color: "#1890FF" },
    //         // { text: `占比: ${percent}%`, color: "#91CB74" }
    //     ]
    // })
}
</script>
<style lang="less" scoped>

</style>