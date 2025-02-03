<template>
    <nav-vue title="销售情况" text="主页" url='/home' />
    <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
        由于商务系统尚未建设，内容仅为演示，非真实数据
        <br>建议商务系统建设方式选择自研，预计能为公司节省200万元左右。
    </van-notice-bar>

    <van-cell title="点击选择时间段" :value="dateRangeText" @click="show = true" />
    <van-calendar :first-day-of-week="1"  v-model:show="show" type="range" :max-range="31" :min-date="dateRange[0]" :max-date="dateRange[1]" />
    <div class="sales-overview">
        <div class="total-view">
            <div class="title">总览</div>
            <p>共收入XXXX万，</p>
            <p>包机XX班，收入XXX万，</p>
            <p>自营XXX单，收入XXX万，单均价xxx元</p>
        </div>
        <div class="sales-trend">
            <!-- <v-chart id="chart-bar" class="chart"></v-chart> -->
            <v-chart class="bar" :option="optionBar" />
        </div>
        <div class="suppliers">
            <div class="title">自营排名</div>
            <ul>
                <li v-for="(supplier, index) in suppliers" :key="index">
                    <img :src="supplier.logo" alt="供应商logo" />
                    <span>{{ supplier.name }}</span>
                    <span>{{ supplier.orders }}单</span>
                    <span>{{ supplier.weight }}m</span>
                    <span>{{ supplier.ton }}吨</span>
                    <span>{{ supplier.revenue }}万元</span>
                </li>
            </ul>
        </div>
        <div class="goods-analysis">
            <v-chart class="pie" :option="optionPie" />
        </div>
    </div>
</template>

<script setup lang="ts">
import NavVue from '@/components/Nav.vue';
import { ref, onMounted, Ref, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, PieChart } from 'echarts/charts';
import dayjs from 'dayjs';
import api from '@/utils/api';

import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import * as _ from 'radash';


const show = ref(false);

const dateRange = ref([new Date(2024, 11, 1), new Date(2024, 11, 30)]);
const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

const dateRangeText = computed(() => {
    const [start, end] = dateRange.value;
    return `${formatDate(start)} - ${formatDate(end)}`;
});


use([
    CanvasRenderer,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

// 示例数据
const suppliers = ref([
    {
        logo: 'https://placehold.co/50x50',
        name: '供应商A',
        orders: 'XXX',
        weight: 'XXX',
        ton: 'XXX',
        revenue: 'XXX'
    },
    {
        logo: 'https://placehold.co/50x50',
        name: '供应商B',
        orders: 'XXX',
        weight: 'XXX',
        ton: 'XXX',
        revenue: 'XXX'
    },
    {
        logo: 'https://placehold.co/50x50',
        name: '供应商C',
        orders: 'XXX',
        weight: 'XXX',
        ton: 'XXX',
        revenue: 'XXX'
    }
]);

// 初始化柱状图
// const chartBar = useECharts();
const optionBar = ref({
    title: {
        text: `销售分析`,//${dayLenth}天
        left: 'right',
        // color: '#fff',
        textStyle: {
            color: '#777',//文字颜色               
            // fontStyle: 'normal', //字体风格,'normal','italic','oblique'
            fontWeight: 'bold', //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            // fontFamily: 'sans-serif',//字体系列
            fontSize: 16//字体大小
        }
    },

    legend: {
        data: ['包机', '自营']
    },


    tooltip: { show: false },
    xAxis: {
        type: 'category',
        data: ['1.9', '1.10', '1.11', '1.12', '1.13', '1.14', '今'],
        axisLabel: {
            formatter: (val: string, key: number) => key == 0 ? '1.9' : val,
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: (val: string, key: number) => key % 3 == 0 ? val : '',
        }
    },
    grid: {
        // top: '20px',    // 顶部刻度消失
        // left: '-25px',// 让y轴不显示刻度的空白消失
        // right: '-3px',// 让y轴最后不显示多的那一点
        // bottom: '0',
        // containLabel: true
    },
    series: [
        {
            name: '包机',
            type: 'bar',
            data: [32, 28, 25, 26, 27, 24, 20]
        },
        {
            name: '自营',
            type: 'bar',
            data: [33, 28, 25, 25, 27, 24, 20]
        }
    ]
});

// 初始化饼图
// const chartPie = useECharts();
const optionPie = ref({
    title: {
        text: '货物分析',
        left: 'right',
    },
    tooltip: {},
    // legend: {
    //     orient: 'vertical',
    //     left: 'left'
    // },
    series: [
        {
            name: '物品分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            data: [
                { value: 335, name: '电子产品' },
                { value: 310, name: '服装' },
                { value: 234, name: '食品' },
                { value: 145, name: '药品' },
                { value: 1048, name: '其他' }
            ],
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },

    ]
});
</script>

<style scoped>
.sales-overview {
    display: flex;
    flex-direction: column;
    align-items: center;

    &>* {
        width: 100%;
        margin: 6px;
    }
}



.total-view {
    margin: 1rem 0;
}


.suppliers ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.suppliers li {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.bar,
.pie {
    height: 250px;
    width: 100%;
}
</style>