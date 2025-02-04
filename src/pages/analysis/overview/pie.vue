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
    <ucharts :option="pieData" @select="showTip" :height="250" />

</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, reactive, Ref, ref } from 'vue'
import * as _ from 'radash';
import ucharts from '@/components/ucharts/ucharts.vue';

import api from '@/utils/api'
import { useStore } from '@/store';
import { AirportItem } from '@/interface';
import dayjs from 'dayjs';
import { offsetCorrect } from '@/utils/ucharts';

// 定义组件props
const props = defineProps({
    // 数据源
    data: { type: Object as PropType<any[]>, default: () => ({}) },
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
function getOption() {
    // 设置饼图标题
    pieGroupTitle.value = `${['进港', '出港'][+groupByField.value]}量`;

    const data: Record<string, any>[] = [];
    let total = 0;
    const flightsGroupByDep: Record<string, { name: string, value: number, labelText: string }> = {};

    // 使用一个循环同时进行分组和数据处理
    props.data.forEach(f => {
        const key = f[['arr', 'dep'][+groupByField.value]];
        const name = key;
        const value = f.netWeightCargo;
        const labelText = `${airports.value[key]?.city} :${(value / 1e3).toFixed(1)}`;

        if (!flightsGroupByDep[name]) {
            flightsGroupByDep[name] = { name, value: 0, labelText };
        }
        flightsGroupByDep[name].value += value;
        total += value;
    });

    // 将分组后的数据转换为数组
    Object.values(flightsGroupByDep).forEach(item => item.value > 0 && data.push(item));

    const tips = `${['进港', '出港'][+groupByField.value]}量`;
    return {
        type: "ring",
        animation: false,
        rotate: false,
        rotateLock: false,
        padding: [20, 0, 0, 20],
        dataLabel: true,
        series: [{ data }],
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
    };
}
function showTip(chart, event) {
    console.log('showTip', event);
    // page screen client
    // offsetCorrect(event, 0, 149+94);
    chart.touchLegend(event);
    chart.showToolTip(event, {
        // index: 2,
        // offset: { x, y },//不传offset显示位置为点击的坐标
        textList: [
            { text: "2022年销量", color: null },
            { text: "大米：100万斤", color: "#1890FF" },
            { text: "豆油：10吨", color: "#91CB74" }
        ]
    });
}
</script>

<style lang="less" scoped>
/* 饼图样式 */
.line-chart {
    width: 100%;
    height: 300px;
}
</style>
