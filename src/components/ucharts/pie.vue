<template>
    <ucharts :option="chartOption" @select="handleSelect" :height="height" />
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import ucharts from './ucharts.vue'

const props = defineProps({
    data: { type: Array as PropType<Array<{ name: string, value: number }>>, required: true }, // 饼图数据
    height: { type: Number, default: 250 }, // 图表高度
    title: { type: String, default: '' }, // 图表标题
    showLabel: { type: Boolean, default: true }, // 是否显示数据标签
    ringWidth: { type: Number, default: 60 } // 环形宽度
})

// 计算总数值
const totalValue = computed(() => {
    return props.data.reduce((sum, item) => sum + item.value, 0)
})

// 生成图表配置
const chartOption = computed(() => ({
    type: "ring",
    animation: false,
    rotate: false,
    rotateLock: false,
    padding: [20, 0, 0, 20],
    dataLabel: props.showLabel,
    series: [{
        data: props.data.map(item => ({
            ...item,
            labelText: `${item.name} ${((item.value / totalValue.value) * 100).toFixed(1)}%`
        }))
    }],
    title: props.title ? {
        name: props.title,
        fontSize: 15,
        color: "#666666"
    } : undefined,
    extra: {
        ring: {
            ringWidth: props.ringWidth,
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: true,
            borderWidth: 3,
            borderColor: "#FFFFFF"
        }
    }
}))

// 点击事件处理
function handleSelect(chart, event) {
    const index = chart.getCurrentDataIndex(event)
    const item = props.data[index]
    const percent = ((item.value / totalValue.value) * 100).toFixed(2)

    chart.showToolTip(event, {
        textList: [
            { text: item.name, color: null },
            { text: `数值: ${item.value}`, color: "#1890FF" },
            { text: `占比: ${percent}%`, color: "#91CB74" }
        ]
    })
}
</script>
