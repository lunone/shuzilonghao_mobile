<template>
    <div>
        <uni-datetime-picker v-model="range" type="daterange" @change="onConfirm" :start="minDate" rangeSeparator="至"
            :end="maxDate" />
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
            <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
                activeColor="#007aff" />
            <view class="content">
                <view v-show="current === 0">
                    <overview-vue :data="flights" :dateRange="range" />
                </view>
                <view v-show="current === 1">
                    <stations-vue :data="flights" :dateRange="range" />
                </view>
                <view v-show="current === 2">
                    <airplane-vue :data="flights" :dateRange="range" />
                </view>
            </view>
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

const dateformatStr = 'YYYY-MM-DD';
// 定义 Tab 配置数组

// 计算3年前的日期
const minDate = dayjs().subtract(3, 'year').startOf('day').format(dateformatStr);
// 今天的日期
const maxDate = dayjs().add(-1, 'day').startOf('day').format(dateformatStr);

const range = ref<[string, string]>([
    dayjs().subtract(20, 'day').startOf('day').format(dateformatStr),
    dayjs().subtract(1, 'day').startOf('day').format(dateformatStr)
]);
const items = ref(['总览', '站点分析', '飞机分析']);
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


const onConfirm = (values: [Date, Date]) => {
    // show.value = false;
    // dateRange.value = values;
    console.log(values);
};

</script>

<style lang="less" scoped>
/* 添加样式 */
@import "@/css/base.less";
</style>