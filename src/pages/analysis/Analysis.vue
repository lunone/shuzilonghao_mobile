<template>
    <div>
        <!-- <zl-nav title="经营状况" text="主页" url='/home' /> -->
        <!-- <van-cell title="点击选择时间段" :value="dateRangeText" @click="show = true" /> -->
        <!-- <van-calendar :first-day-of-week="1" v-model:show="show" :min-date="minDate" :max-date="maxDate" type="range"
            :max-range="31" @confirm="onConfirm" /> -->
        <!-- <calendar :first-day-of-week="1" v-model:show="show" :min-date="minDate" :max-date="maxDate" type="range"
            :max-range="31" @confirm="onConfirm" /> -->
        <uni-datetime-picker v-model="range" type="daterange" @change="onConfirm" :start="minDate" :end="maxDate"
            rangeSeparator="至" />

        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
            <zl-tabs v-model:active="activeTab">
                <zl-tab title="总览" icon="calendar">
                    <overview-vue :data="flights" :dateRange="dateRange" />
                </zl-tab>
                <!-- <zl-tab title="站点分析" icon="location">
                    <stations-vue :data="flights" :dateRange="dateRange" />
                </zl-tab>
                <zl-tab title="飞机分析" icon="airplane">
                    <airplane-vue :data="flights" :dateRange="dateRange" />
                </zl-tab> -->
            </zl-tabs>

            <!-- <van-back-top /> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue';
import overviewVue from '@/pages/analysis/overview.vue';
import stationsVue from '@/pages/analysis/station.vue';
import airplaneVue from '@/pages/analysis/airplane.vue';
// import zlNav from '@/components/Nav.vue';
import dayjs from 'dayjs';
import api from '@/utils/api';
import _ from 'lodash';
import { title } from 'process';
import calendar from '@/components/zl/calendar.vue';

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');
// 定义当前激活的 Tab，默认为 'weight'
const activeTab = ref('');

const dateformatStr = 'YYYY-MM-DD';
// 定义 Tab 配置数组
// const tabs = [
//     { title: '总览', icon: 'calendar', name: 'weight', component: OverviewVue },
//     { title: '站点分析', icon: 'location', name: 'station', component: stationsVue },
//     { title: '飞机分析', icon: 'airplane', name: 'aircraft', component: airplaneVue },
// ];
const tabs = {
    overview: { title: "总览", icon: "calendar" },
    station: { title: "站点分析", icon: "location" },
    aircraft: { title: "飞机分析", icon: "airplane" }
};
// 计算3年前的日期
const minDate = dayjs().subtract(3, 'year').startOf('day').format(dateformatStr);
// 今天的日期
const maxDate = dayjs().add(-1, 'day').startOf('day').format(dateformatStr);

// 初始化dateRange为过去的一周
const dateRange = ref<[Date, Date]>([
    dayjs().subtract(7, 'day').startOf('day').toDate(),
    dayjs().subtract(1, 'day').startOf('day').toDate()
]);
const range = ref([
    dayjs().subtract(7, 'day').startOf('day').format(dateformatStr),
    dayjs().subtract(7, 'day').startOf('day').format(dateformatStr)
]);
// const show = ref(false);

// const formatDate = (date: Date) => {
//     return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
// };

// const dateRangeText = computed(() => {
//     const [start, end] = dateRange.value;
//     return `${formatDate(start)} - ${formatDate(end)}`;
// });

const flights: Ref<any[]> = ref([]);
// 使用watch监控props.startDate和props.endDate变化,并在控制台输出变化提示
watch(() => dateRange, async () => {
    // console.log('dates changed', newStartDate, newEndDate, oldStartDate, oldEndDate);
    const [newStartDate, newEndDate] = dateRange.value;
    // 使用props.endDate或当前日期
    const endDate = dayjs(newEndDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    // 如果startDate未传入，则使用endDate的7天前作为startDate
    const startDate = newStartDate ? dayjs(newStartDate).startOf('day').format('YYYY-MM-DD HH:mm:ss') : dayjs(newEndDate).subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    loading.value = true;
    error.value = '';
    try {
        const res = await api('/flight/atd/', { startDate, endDate }) as any[];
        console.log('#####', startDate, endDate, res);
        flights.value = res;
    } catch (err) {
        error.value = '获取机场信息失败';
    } finally {
        loading.value = false;
    }
}, { deep: true, immediate: true });


const onConfirm = (values: [Date, Date]) => {
    // show.value = false;
    // dateRange.value = values;
    console.log(values);
};

</script>

<style lang="less" scoped>
/* 添加样式 */
@import "@/base.less";
</style>