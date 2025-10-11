<template>
    <zl-date-range-picker v-model="dateRange" />
    <press-calendar />
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
        <div class="airlines">
            <!-- 注意: 这里需要修改子组件 airline.vue 以接收 airlineStat prop，或者在此处创建一个新的简单布局来展示航空公司数据。以下是一个简化的示例布局。-->
            <div v-for="stat in airlineStats" :key="stat.airlineCode" class="airline-card">
                <h4>{{ stat.airlineName }} ({{ stat.airlineCode }})</h4>
                <p>航班数: {{ stat.flightCount }}</p>
                <p>总小时: {{ stat.totalHours }}</p>
                <p>市场份额: {{ (stat.marketShare * 100).toFixed(2) }}%</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch, Ref } from 'vue';
import dayjs from 'dayjs';
import zlDateRangePicker from '@/components/zl/dateRangePicker.vue';
import { getStatByAirline, AirlineStats } from '@/api/statistics.api';

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

const airlineStats: Ref<AirlineStats[]> = ref([]);

const dateRange = ref([
    dayjs().add(-11, 'day').toDate(),
    dayjs().add(-1, 'day').endOf('day').toDate()
]) as Ref<[Date, Date]>;
const fetchData = async (startDate: Date, endDate: Date) => {
    loading.value = true;
    error.value = '';
    try {
        const data = await getStatByAirline({ startDate, endDate });
        console.log('统计', data);
        airlineStats.value = data;
    } catch (err) {
        console.log(err)
        error.value = '获取信息失败';
    } finally {
        loading.value = false;
    }
};
watch(() => dateRange.value, () => {
    const [startDate, endDate] = dateRange.value
    fetchData(startDate, endDate);
}, { immediate: true, deep: true })

</script>
<style lang="less" scoped>
@import "@/css/base.less";

.loading,
.error {
    text-align: center;
    margin-top: 20px;
}

.airlines {
    border-radius: 8px;
    margin: 20px 10px;

    .airline-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        background-color: #fff;

        h4 {
            margin: 0 0 12px 0;
            color: #fcb6b6;
            font-size: 1.1rem;
        }

        p {
            margin: 6px 0;
            color: #666;
            font-size: 0.9rem;
        }
    }
}
</style>
