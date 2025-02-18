<template>
    <div>
        <press-cell title="选择日期区间" :value="dateStr" @click="showCalender" />
        <press-calendar :show="show" type="range" @close="show = false" @confirm="onConfirm" allow-same-day
            :min-date="minDate" :max-date="maxDate" :show-confirm="false" :show-title="false" :show-subtitle="false"
            :first-day-of-week="1" :default-date="defaultRange" />


        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
            <press-tabs :active="currentTab" @change="onClickItem">
                <press-tab title="总览">
                    <overview-vue :data="flights" :dateRange="range" />
                </press-tab>
                <press-tab title="站点分析">
                    <stations-vue :data="flights" :dateRange="range" />
                </press-tab>
                <press-tab title="飞机分析">
                    <airplane-vue :data="flights" :dateRange="range" />
                </press-tab>
            </press-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue';
import CONFIG from '@/config';
import overviewVue from '@/pages/analysis/overview.vue';
import stationsVue from '@/pages/analysis/station.vue';
import airplaneVue from '@/pages/analysis/airplane.vue';
import dayjs from 'dayjs';
import api from '@/utils/api';

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

const show = ref(false)
const showCalender = () => show.value = true;

// 计算3年前的日期
const minDate = dayjs().subtract(3, 'year').startOf('day').valueOf();
// 今天的日期
const maxDate = dayjs().add(-1, 'day').startOf('day').valueOf();
const dateformatStr = 'YYYY-MM-DD';
const range = ref<[string, string]>([
    dayjs().subtract(20, 'day').startOf('day').format(dateformatStr),
    dayjs().subtract(1, 'day').startOf('day').format(dateformatStr)
]);
const dateStr = computed(() => `${dayjs(range.value[0]).format('M/d')} - ${dayjs(range.value[1]).format('M/d')}`);
const defaultRange = computed(() => [dayjs(range.value[0]).valueOf(), dayjs(range.value[1]).valueOf()])
function onConfirm(detail: [Date, Date]) {
    const [start, end] = detail;
    show.value = false;
    range.value = [
        dayjs(start).format(dateformatStr),
        dayjs(end).format(dateformatStr),
    ];
}


const currentTab = ref(0);
const onClickItem = e => currentTab.value = currentTab != e.currentIndex ? e.currentIndex : currentTab.value;

const flights: Ref<any[]> = ref([]);
// 使用watch监控props.startDate和props.endDate变化,并在控制台输出变化提示
watch(() => range, async () => {
    console.log('dates changed', range.value);
    const [newStartDate, newEndDate] = range.value;
    // 使用props.endDate或当前日期
    const endDate = dayjs(newEndDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    // 如果startDate未传入，则使用endDate的7天前作为startDate
    const startDate = newStartDate ? dayjs(newStartDate).startOf('day').format('YYYY-MM-DD HH:mm:ss') : dayjs(newEndDate).subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    loading.value = true;
    error.value = '';
    try {
        const res = await api(CONFIG.url.flightsATD, { startDate, endDate }) as any[];
        console.log('#####', startDate, endDate, res);
        // 过滤掉备降和取消航班
        // res.forEach(flight => {
        //     if (flight.dep == 'ZGSZ' || flight.arr == 'ZGSZ') {
        //         console.log('#####', flight);
        //     }
        // });
        // 
        flights.value = res.filter(flight => !flight.flagPatch && !flight.flagCs && !flight.flagVr);
    } catch (err) {
        error.value = '获取机场信息失败';
    } finally {
        loading.value = false;
    }
}, { deep: true, immediate: true });




</script>

<style lang="less" scoped>
/* 添加样式 */
@import "@/css/base.less";
</style>