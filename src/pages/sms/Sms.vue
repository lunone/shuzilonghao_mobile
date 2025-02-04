<template>
    <!-- <nav-vue title="安全管理" text="主页" url='/home' /> -->
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="error" class="error">{{ error }}</view>
    <view v-else>
        <view class="summary">
            最近一个月， {{ recentEventCount }} 事件报告 ， {{ selfs.length }} 自愿报告<br>
        </view>
        <zl-tabs v-model:active="activeTab" >
            <zl-tab title="主动报告 列表">
                <view v-if="selfs.length === 0">暂无主动报告</view>
                <view class="report-list" v-else>
                    <voluntary v-for="(self, index) in selfs" :key="index" :data="self" />
                </view>
            </zl-tab>
            <zl-tab title="事件 列表">
                <van-list>
                    <EventVue :data="event" v-for="event in events" :key="event.id" />
                </van-list>
            </zl-tab>
        </zl-tabs>
        <back-top />
    </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref } from 'vue';
// import NavVue from '@/components/Nav.vue';
import api from '@/utils/api';
import dayjs from 'dayjs';
import { EventItem } from '@/interface';
import voluntary from './card/voluntary.vue';
import EventVue from './card/event.vue';

import backTop from '@/components/zl/backTop.vue';

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

// 定义事件列表和自愿报告列表
const events: Ref<EventItem[]> = ref([]);
const selfs: Ref<any[]> = ref([]);
const voluntaryReports: Ref<any[]> = ref([]); // 暂时用空数组占位

// 定义当前激活的 Tab，默认为 'events'
const activeTab = ref('events');

// 计算最近一个月的事件报告数量
const recentEventCount = computed(() => {
    // const oneMonthAgo = dayjs().subtract(1, 'month').toDate();
    return events.value.length;
});

// 计算自愿报告数量
const voluntaryReportCount = computed(() => voluntaryReports.value.length);

// 获取事件列表
const fetchData = async () => {
    loading.value = true;
    error.value = '';
    const endDate = dayjs().format('YYYY-MM-DD');
    const startDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    try {
        const res = await api('/sms/event/list', { startDate, endDate }) as EventItem[];
        const resSelf = await api('/sms/self/list', { startDate, endDate }) as EventItem[];
        events.value = res;
        selfs.value = resSelf;
    } catch (err) {
        error.value = '获取事件列表失败';
    } finally {
        loading.value = false;
    }
};

// 组件挂载时获取事件列表
onMounted(() => {
    fetchData();
});

</script>

<style lang="less" scoped>
.loading,
.error {
    text-align: center;
    margin-top: 20px;
}

.summary {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
}

.van-cell {
    padding: 10px;
    border-bottom: 1px solid #eee;
}



.report-list {
    padding: 16px;


}

/* 添加这段样式后  */
:root:root {
    --van-step-line-color: red;
}
</style>