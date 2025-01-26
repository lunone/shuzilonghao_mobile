<template>
    <!-- 饼图容器 -->
    <van-cell :title="pieGroupTitle">
        <!-- 右侧切换按钮 -->
        <template #right-icon>
            <van-switch v-model="groupByField" size="24px" />
        </template>
    </van-cell>
    <!-- 饼图组件 -->
    <!-- <PieChartVue class="line-chart" :option="pieData" :height="`40vh`" /> @select="showTip"  -->
    <ucharts :option="pieData" />

</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, reactive, Ref, ref } from 'vue'
import _ from 'lodash'
import ucharts from '@/components/ucharts/ucharts.vue';

import api from '@/utils/api'
import { useStore } from '@/store';
import { AirportItem } from '@/interface';
import dayjs from 'dayjs';

// 定义组件props
const props = defineProps({
    // 数据源
    data: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    date: { type: String, default: '' },
});
// 定义 airports 数据，用于存储机场信息
const airports = ref<Record<string, AirportItem>>({});


const store = useStore();

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

// 分组字段切换状态
const groupByField = ref(false)
// 饼图标题
const pieGroupTitle = ref('')

// 获取机场数据

// 获取机场信息
const fetchAirports = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await store.useAirportsCode4();
        airports.value = res;
        pieData.value = getOption();
    } catch (err) {
        error.value = '获取机场信息失败';
    } finally {
        loading.value = false;
    }
};

// 组件挂载时获取机场信息
onMounted(() => {
    fetchAirports();
});

// 计算饼图数据
const pieData = ref({})
// : Ref<Record<string, any>> = computed(
const getOption = () => {
    // 设置饼图标题
    pieGroupTitle.value = `${['进港', '出港'][+groupByField.value]}量`
    // 按出发/到达机场分组
    const flightsGroupByDep = _.groupBy(props.data, ['arr', 'dep'][+groupByField.value])
    const data: Record<string, any>[] = [];
    // 计算货物净重总和
    let total = 0;
    // 遍历分组数据
    _.forEach(flightsGroupByDep, (flights, dep) => {
        const name = dep;
        const value = _.sumBy(flights, 'netWeightCargo');
        const labelText = `${airports.value[dep]?.city} :${(value / 1e3).toFixed(1)}`
        if (value > 0) {
            data.push({ name, value, labelText });
        }
        total += value;
    })
    console.log('-----------------', data)
    const tips = `${['进港', '出港'][+groupByField.value]}量`;
    return {
        type: "ring",
        animation: false,
        rotate: false,
        rotateLock: false,
        // color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        // padding: [5, 5, 5, 5],
        dataLabel: true,
        // enableScroll: false,
        series: [
            {
                // data: [{ "name": "一班", "value": 50 }, { "name": "二班", "value": 30 }, { "name": "三班", "value": 20 }, { "name": "四班", "value": 18 }, { "name": "五班", "value": 8 }]
                data
            }
        ],
        // legend: {
        //     show: true,
        //     position: "right",
        //     lineHeight: 25
        // },
        title: {
            name: "总重",
            fontSize: 15,
            color: "#666666"
        },
        subtitle: {
            name: (total / 1e3).toFixed(2),
            fontSize: 14,
            color: "#7cb5ec"
        },
        extra: {
            ring: {
                ringWidth: 60,
                activeOpacity: 0.5,
                activeRadius: 10,
                offsetAngle: 0,
                labelWidth: 15,
                border: true,
                borderWidth: 3,
                borderColor: "#FFFFFF"
            }
        }
    }
    // return {
    //     title: {
    //         text: dayjs(props.date).format('YYYY-MM-DD') + ' ' + tips,
    //         left: 'right',
    //     },
    //     tooltip: {
    //         trigger: 'item',
    //         formatter: '{a} <br/>{b} : {c} ({d}%)',
    //     },
    //     grid: {
    //         top: '20px',    // 顶部刻度消失
    //         left: '-25px',// 让y轴不显示刻度的空白消失
    //         right: '-3px',// 让y轴最后不显示多的那一点
    //         bottom: '0',
    //         containLabel: true
    //     },
    //     series: [
    //         {
    //             name: tips,
    //             type: 'pie',
    //             radius: ['40%', '70%'],
    //             avoidLabelOverlap: false,
    //             itemStyle: {
    //                 borderRadius: 10,
    //                 borderColor: '#fff',
    //                 borderWidth: 2
    //             },
    //             data,
    //             emphasis: {
    //                 itemStyle: {
    //                     shadowBlur: 10,
    //                     shadowOffsetX: 0,
    //                     shadowColor: 'rgba(0, 0, 0, 0.5)',
    //                 },
    //             },
    //         },
    //     ],
    // };
}

</script>

<style lang="less" scoped>
/* 饼图样式 */
.line-chart {
    width: 100%;
    height: 300px;
}
</style>
