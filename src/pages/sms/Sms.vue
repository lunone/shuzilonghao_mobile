<template>
    <!-- <nav-vue title="安全管理" text="主页" url='/home' /> -->
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="error" class="error">{{ error }}</view>
    <view v-else>
        <view class="summary">
            最近一个月， {{ events.length }} 事件报告 ， {{ 'voluntarys.length' }} 自愿报告<br>
        </view>
        <!-- <zl-tabs v-model:active="activeTab">
            <zl-tab title="主动报告 列表" name="voluntary" />

            <zl-tab title="事件 列表" name="events">
                <EventVue :data="event" v-for="event in events" :key="event.id" />
            </zl-tab>
        </zl-tabs> -->
        <!-- <back-top /> -->
         
    </view>
    <voluntarys v-show="activeTab === 'voluntary'" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref } from 'vue';
// import NavVue from '@/components/Nav.vue';
import api from '@/utils/api';
import dayjs from 'dayjs';
import { EventItem } from '@/interface';
import EventVue from './card/event.vue';
import CONFIG from '@/config';
// import backTop from '@/components/zl/backTop.vue';
import voluntarys from './voluntarys.vue';

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

// 定义事件列表和自愿报告列表
const events: Ref<EventItem[]> = ref([]);

// 定义当前激活的 Tab，默认为 'events'
const activeTab = ref('voluntary');
const endDate = dayjs().format('YYYY-MM-DD');
const startDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
// 获取事件列表
const fetchData = async () => {
    loading.value = true;
    error.value = '';

    try {
        const res = await api(CONFIG.url.smsEvents, { startDate, endDate }) as EventItem[];
        events.value = res;
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