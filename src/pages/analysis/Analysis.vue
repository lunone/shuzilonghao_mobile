<template>
    <div>
        <press-cell title="选择日期区间" :value="date" @click="showCalender" />
        <press-calendar :show="show" type="range" @close="show = false" @confirm="onConfirm" />

        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
            <press-tabs :active="current" @change="onClickItem">
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
            <!-- <van-back-top /> -->
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
const date = ref(''), show = ref(false)
const dateformatStr = 'YYYY-MM-DD';
// 定义 Tab 配置数组
function showCalender() {
    show.value = true;
}


function formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

function onConfirm(detail) {
    console.log(detail);
    const [start, end] = detail;
    show.value = false;
    date.value = `${formatDate(start)} - ${formatDate(end)}`;
}
// 计算3年前的日期
const minDate = dayjs().subtract(3, 'year').startOf('day').format(dateformatStr);
// 今天的日期
const maxDate = dayjs().add(-1, 'day').startOf('day').format(dateformatStr);

const range = ref<[string, string]>([
    dayjs().subtract(20, 'day').startOf('day').format(dateformatStr),
    dayjs().subtract(1, 'day').startOf('day').format(dateformatStr)
]);



const current = ref(0);
const onClickItem = e => current.value = current != e.currentIndex ? e.currentIndex : current.value;

const flights: Ref<any[]> = ref([]);
// 使用watch监控props.startDate和props.endDate变化,并在控制台输出变化提示
watch(() => range, async () => {
    // console.log('dates changed', newStartDate, newEndDate, oldStartDate, oldEndDate);
    const [newStartDate, newEndDate] = range.value;
    // 使用props.endDate或当前日期
    const endDate = dayjs(newEndDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    // 如果startDate未传入，则使用endDate的7天前作为startDate
    const startDate = newStartDate ? dayjs(newStartDate).startOf('day').format('YYYY-MM-DD HH:mm:ss') : dayjs(newEndDate).subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    loading.value = true;
    error.value = '';
    try {
        const res = await api(CONFIG.url.flightsATD, { startDate, endDate }) as any[];
        // console.log('#####', startDate, endDate, res);
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