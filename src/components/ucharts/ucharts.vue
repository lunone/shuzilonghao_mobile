<template>
    <view class="wrapper">
        <canvas :canvas-id="id" :id="id" type="2d" :canvas2d="true" class="chart" @touchend="tap"
            :style="`height:${height}px`" />
    </view>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, watch } from 'vue';
import uCharts from './u-charts.min';
import _ from 'lodash';
let chart;
const id = "canvas" //"exjLSzTaRXxTPxXoOISiSyKXwIjfdWQk";
const emits = defineEmits(['select'])
const props = defineProps({
    option: { type: Object, default: () => { } },
    height: { type: String, default: '250' }
});
// 获取当前实例,不能放在再深层次,会导致获取不到
const _this = getCurrentInstance();
watch(() => props.option, val => {
    // console.log('[uCharts]:option changed$$$$$', val)
    setTimeout(() => {// 延时执行，防止getCurrentInstance获取到的高度宽度为0
        // console.log('[uCharts]:option changed', val)
        draw(val)
    }, 3e2);
}, { deep: true, immediate: true })
function draw(data) {
    const { pixelRatio } = uni.getSystemInfoSync();
    // 将选择器的选取范围更改为自定义组件(使用getCurrentInstance获取)内，返回一个 SelectorQuery 对象实例
    uni.createSelectorQuery().in(_this)
        // 在当前页面下选择第一个匹配选择器 selector 的节点，返回一个 NodesRef 对象实例，可以用于获取节点信息。
        .select('#' + id)
        // 获取节点的相关信息。第一个参数是节点相关信息配置（必选）；第二参数可选是方法的回调函数，参数是指定的相关节点信息。
        .fields({ node: true, size: true })
        // 执行所有的请求。请求结果按请求次序构成数组，在 callback 的第一个参数中返回。
        .exec(res => {
            let { node, width, height } = res[0] || {};
            console.log('[uCharts]:准备绘图', res[0], width, height)
            if (!res[0]) { return };
            console.log('[uCharts]:绘图中', res[0])
            const context = node.getContext('2d');
            width = width ? width * 1 : 150;
            height = height ? height * 0.8 : 200;
            // 防止变模糊
            node.width = width * pixelRatio;
            node.height = height * pixelRatio;
            chart = new uCharts(_.merge({
                type: "column",
                animation: true,
                background: "#333333",
                // color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [2, 2, 20, 2],
                // legend: { show: false, },
                extra: {
                    column: {
                        type: "group",
                        width: 30,
                        activeBgColor: "#000000",
                        activeBgOpacity: 0.08
                    }
                }
            }, data, {
                canvas2d: true, context, pixelRatio,
                // canvas的宽度高度，单位为px
                width: width * pixelRatio,
                height: height * pixelRatio,
            }))
        });
}
function tap(e) {
    // chart.touchLegend(e);
    // chart.showToolTip(e);
    emits('select', chart, e);
}
</script>

<style scoped lang="less">
.wrapper {
    display: flex;
    justify-content: center;

    .chart {
        width: 100%;
        border: red 1px solid;
    }
}
</style>