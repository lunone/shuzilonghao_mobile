<template>
    <!-- <view v-if="voluntarys.length === 0">暂无主动报告</view> -->
    <view class="report-list" style="height: 800px;">
        <press-list v-model="loading" :finished="finished" :immediate-check="immediateCheck" finished-text="没有更多了"
            @load="loadMore">
            <voluntary v-for="(voluntary, index) in voluntarys" :key="index" :data="voluntary" />
        </press-list>
    </view>

</template>
<script setup lang="ts">
import api from '@/utils/api';
import { onMounted, ref, Ref } from 'vue';
import CONFIG from '@/config';
import dayjs from 'dayjs';
import voluntary from './card/voluntary.vue';

const voluntarys: Ref<any[]> = ref([]);
const loading = ref(false);
const finished = ref(false);
const immediateCheck = ref(false);
const page = ref(1);
const size = 10;

const endDate = dayjs().format('YYYY-MM-DD');
const startDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD');

// 获取事件列表
const fetchData = async (currentPage: number) => {
    loading.value = true;
    page.value++;
    try {
        const resVoluntary = await api(CONFIG.url.smsVoluntarys, { startDate, endDate, page: currentPage, size });
        console.log('resVoluntary', resVoluntary);
        voluntarys.value = voluntarys.value.concat(resVoluntary.data);

        loading.value = false;
        finished.value = voluntarys.value.length > resVoluntary.total;
    } catch (err) {
        console.error('获取事件列表失败', err);
    } finally {
        loading.value = false;
    }
};



// 加载更多数据
const loadMore = () => fetchData(page.value);


// 组件挂载时获取事件列表
onMounted(() => {
    console.log('组件挂载时获取事件列表');
    fetchData(page.value);
});
</script>
<style lang="less" scoped>
.report-list {
    height: 100vh;
    /* 根据需要调整高度 */
    overflow-y: auto;
}

.loading {
    text-align: center;
    padding: 10px;
}
</style>