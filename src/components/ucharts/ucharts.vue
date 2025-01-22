<template>
    <view class="chart-wrapper">
        <canvas canvas-id="column" id="column" class="chart" @touchend="tap" :style="`height:${height}px`" />
    </view>
</template>

<script lang="ts">
// !important 不要费心思改setup句式,uniapp的bug,兼容性问题,访问不到dom就老实了.
import _ from 'lodash';
import uCharts from './u-charts.min';


const uChartsInstance = {};
export default {
    data() {
        return {};
    },
    emits: ['select'],
    props: {
        option: { type: Object, default: () => { } },
        height: { type: String, default: '150' }
    },
    // note:uniapp的bug,直接获取不到this.props.option,只能通过一次computed来获取
    computed: {},
    watch: {
        option: {
            handler(newVal, oldVal) {
                this.drawCharts(newVal);
            },
            deep: true,
        }
    },
    mounted() { },
    methods: {
        drawCharts(data) {
            console.log('drawCharts--------', data);
            const id = 'column';
            const ctx = uni.createCanvasContext(id, this);
            const info = uni.getSystemInfoSync();
            const height = 150;
            const width = Math.floor(info.screenWidth - 30);
            const opt = _.merge({
                canvas2d: true,
                // canvas的宽度，单位为px
                width: width,
                height: height, animation: true,
                background: "#FFFFFF",
                padding: [2, 2, 2, 2],
                legend: {
                    show: false,
                },
                xAxis: {
                    disableGrid: true,
                    // gridEval: 22,
                    // labelCount: 8,
                },
                yAxis: {
                    disabled: true,
                    // data: [{ min: 0 }]
                },
                extra: {
                    column: {// 柱状图分组样式
                        type: "group",
                        width: 16,
                    }
                },
            }, data, {
                type: "column",
                context: ctx,
            })
            uChartsInstance[id] = new uCharts(opt);
        },
        tap(e) {
            this.$emit('select', uChartsInstance[e.target.id], e);
        }
    }
};
</script>

<style scoped lang="less">
.chart-wrapper {
    display: flex;
    justify-content: center;

    .chart {
        width: 100%;
    }
}
</style>