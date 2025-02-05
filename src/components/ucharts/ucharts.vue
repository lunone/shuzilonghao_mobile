<template>
    <!-- <div class="info">宽{{ ele.width }}高{{ ele.height }}左{{ ele.left }}右{{ ele.right }}</div> -->
    <view class="wrapper">
        <canvas :canvas-id="id" :id="id" type="2d" :canvas2d="true" class="chart" @touchend="tap"
            :style="`height:${height}px`" />
    </view>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, watch } from 'vue';
import uCharts from './u-charts.min';
import { merge } from 'lodash-es';
let chart;
const id = "canvas" //"exjLSzTaRXxTPxXoOISiSyKXwIjfdWQk";
const emits = defineEmits(['select']);
// const ele = ref<Record<string, any>>({});
const props = defineProps({
    option: { type: Object, default: () => { } },
    height: { type: Number, default: 200 }
});
const margin = { left: 0, right: 0, top: 0, bottom: 0 };
// 获取当前实例,不能放在再深层次,会导致获取不到
const _this = getCurrentInstance();
watch(() => props.option, (val, oldVal) => {
    setTimeout(() => {// 延时执行，防止getCurrentInstance获取到的高度宽度为0
        if (val && Object.keys(val).length) {
            // 深拷贝防止重复触发
            draw(val)
        }
    }, 1e3);
}, { deep: true, immediate: true })
function draw(data) {
    const { pixelRatio, screenWidth } = uni.getSystemInfoSync();
    // 将选择器的选取范围更改为自定义组件(使用getCurrentInstance获取)内，返回一个 SelectorQuery 对象实例
    uni.createSelectorQuery().in(_this)
        // 在当前页面下选择第一个匹配选择器 selector 的节点，返回一个 NodesRef 对象实例，可以用于获取节点信息。
        .select('#' + id)
        // 获取节点的相关信息。第一个参数是节点相关信息配置（必选）；第二参数可选是方法的回调函数，参数是指定的相关节点信息。
        .fields({ node: true, size: true, rect: true, scrollOffset: true })// * 此处报错是uni的ts写的有问题,把第二个回调函数搞成必须的了.实际不影响
        // 执行所有的请求。请求结果按请求次序构成数组，在 callback 的第一个参数中返回。
        .exec(res => {
            let { node, width, height, left, right, top, bottom } = res[0] || {};
            // ele.value.left = left, ele.value.right = right, ele.value.top = top,
            //     ele.value.bottom = bottom, ele.value.width = width, ele.value.height = height;
            margin.left = left, margin.right = right, margin.top = top, margin.bottom = bottom;
            // console.log('[uCharts]:准备绘图', res[0], res[0].node.id, data.type, width, height)
            if (!res[0]) return console.warn('[uCharts]:未找到节点', _this);
            console.log(`[uCharts]:${res[0].node.id}绘图中`, `屏宽`, screenWidth, '节点', res[0], '入参', data)
            const context = node.getContext('2d');
            width = (width ? width : 320) * pixelRatio;
            height = (height ? height : 180) * pixelRatio;
            // 防止变模糊
            node.width = width;
            node.height = height;
            const chartOption = merge({
                type: "column",
                animation: true,
                background: "#333333",
                // color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [0, 0, 0, 0],
                legend: { show: false },
                xAxis: {}
            }, data, {
                canvas2d: true,
                context, pixelRatio,
                width, height,// canvas的宽度高度，单位为px
            });
            chart = new uCharts(chartOption)
        });
}
function tap(e) {
    // console.log('[uCharts]:tap', e);
    // - (opts.height / opts.pix / 2) * (opts.pix - 1)
    const opts = chart.opts;
    // const info = uni.getSystemInfoSync();
    // console.log('[uCharts]:tap', chart, info)
    // 似乎ucharts的bug,在判断触摸点是否在图表范围内时的算法:pageY - e.currentTarget.offsetTop 这个我理解的已经是正常的0到图高了.
    // 但是它又减去了一个- (opts.height / opts.pix / 2) * (opts.pix - 1),opts.height / opts.pix / 2这部分是半张图高,opts.pix - 1,就是被扩张的部分.
    // 相当于比如原来150高,3倍分辨率,实际上就是被扩高了2倍图高.其实这块我也没有看懂为什么这么处理
    // 但是导致的结果是实际获得的getTouches取到的值是以中心轴对称的正负值,而看后的代码得知,判断是否点击再图标内部的函数是isInExactChartArea,这里是0到图高
    // 所以初步判定为uchart的bug.
    // 为了保持兼容性,这里不修改ucharts,把它错误的在这里修正.
    // 根据ucharts y = (touches.pageY - e.currentTarget.offsetTop - (opts.height / opts.pix / 2) * (opts.pix - 1)) * opts.pix;
    // 所以只需要给pageY加上opts.height / opts.pix / 2 * (opts.pix - 1) 即可
    // offsetCorrect(e, -margin.left, (opts.height / opts.pix / 2) * (opts.pix - 1));
    // console.log('offsetCorrect---------------------', chart)
    e.changedTouches[0].clientX -= margin.left;
    e.changedTouches[0].pageY += (opts.height / opts.pix / 2) * (opts.pix - 1);
    // 后面的margin矫正留给offsetCorrect处理., info
    emits('select', chart, e);
}
</script>

<style scoped lang="less">
.wrapper {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    .chart {
        width: 100%;
        // border: red 1px solid;
    }
}
</style>