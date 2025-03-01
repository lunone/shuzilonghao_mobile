<template>
    <!-- <nav-vue title="安全管理" text="主页" url='/home' /> -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
        <div class="summary">
            最近一个月， {{ events.length }} 事件报告 ， {{ 'voluntarys.length' }} 自愿报告<br>
        </div>
        <press-tabs :active="current" @change="onClickItem">
            <press-tab title="主动报告"  >
                <voluntarys   />
            </press-tab>
            <press-tab title="事件" >
                <EventVue :data="event" v-for="event in events" :key="event.id" />
            </press-tab>
            
        </press-tabs>
        <!-- <back-top /> -->

    </div>
   
    
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

const current = ref(0);
const onClickItem = e => current.value = current != e.currentIndex ? e.currentIndex : current.value;

const endDate = dayjs().toDate();
const startDate = dayjs().subtract(1, 'month').toDate();
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