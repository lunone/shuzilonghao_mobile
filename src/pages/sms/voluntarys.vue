<template>
    <view v-if="voluntarys.length === 0">暂无主动报告</view>
    <!-- <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
    @scrolltolower="lower" @scroll="scroll"> -->
    <view class="report-list" style="height: 800px;">
        <!-- <scroll-view class="report-list" ref="scrollContainer" @scrolltolower="handleScroll"> -->
        <voluntary v-for="(voluntary, index) in voluntarys" :key="index" :data="voluntary" />
        <view v-if="loading" class="loading">加载中...</view>
        <!-- </scroll-view> -->
        <uni-load-more status="more" :content-text="contentText" @clickLoadMore="handleScroll"></uni-load-more>
    </view>

</template>
<script setup lang="ts">
import api from '@/utils/api';
import { onMounted, ref, Ref } from 'vue';
import CONFIG from '@/config';
import dayjs from 'dayjs';
import voluntary from './card/voluntary.vue';

const voluntarys: Ref<any[]> = ref([]);
const scrollContainer = ref<HTMLElement | null>(null);
const loading = ref(false);
const page = ref(1);
const size = 10;

const endDate = dayjs().format('YYYY-MM-DD');
const startDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
const contentText = {
    contentdown: '点击查看更多',
    contentrefresh: '加载中',
    contentnomore: '没有更多'
};
// 获取事件列表
const fetchData = async (currentPage: number) => {
    loading.value = true;
    try {
        const resVoluntary = await api(CONFIG.url.smsVoluntarys, { startDate, endDate, page: currentPage, size });
        console.log('resVoluntary', resVoluntary);
        voluntarys.value = voluntarys.value.concat(resVoluntary.data);
    } catch (err) {
        console.error('获取事件列表失败', err);
    } finally {
        loading.value = false;
    }
};

// 处理滚动事件
const handleScroll = () => {
    console.log('滚动事件触发');
    // if (scrollContainer.value) {
    // const { scrollTop, clientHeight, scrollHeight } = scrollContainer.value;
    // console.log('scrollTop', scrollTop, 'clientHeight', clientHeight, 'scrollHeight', scrollHeight)
    // if (scrollTop + clientHeight >= scrollHeight - 10 && !loading.value) {
    loadMore();
    // }
    // }
};

// 加载更多数据
const loadMore = () => {
    page.value++;
    fetchData(page.value);
};

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