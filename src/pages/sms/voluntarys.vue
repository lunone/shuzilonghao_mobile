<template>
    <!-- <view v-if="voluntarys.length === 0">暂无主动报告</view> -->
    <view class="report-list" style="height: 800px;">
        <press-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了"
            :load="loadMore">
            <voluntary v-for="(voluntary, index) in voluntarys" :key="index" :data="voluntary" />
        </press-list>
    </view>

</template>
<script setup lang="ts">
import api from '@/utils/api';
import { onMounted, ref, Ref, watch } from 'vue';
import CONFIG from '@/config';
import dayjs from 'dayjs';
import voluntary from './card/voluntary.vue';

const props = defineProps({
    startDate: { type: String, default: dayjs().add(-1, 'month').format('YYYY-MM-DD') },
    endDate: { type: String, default: dayjs().format('YYYY-MM-DD') },
});

const voluntarys: Ref<any[]> = ref([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
// const size = 300;


// 获取事件列表
const fetchData = async (currentPage: number = 1) => {
    loading.value = true;
    // page.value++;
    try {
        const resVoluntary = await api(CONFIG.url.smsVoluntarys, { startDate: props.startDate, endDate: props.endDate });
        // console.log('resVoluntary', resVoluntary, props);
        voluntarys.value = voluntarys.value.concat(resVoluntary);
        loading.value = false;
        // finished.value = voluntarys.value.length > resVoluntary.total;, page: currentPage, size
    } catch (err) {
        console.error('获取事件列表失败', err);
    } finally {
        loading.value = false;
    }
};

// 加载更多数据
const loadMore = () => {
    console.log('loadmore');
    fetchData(page.value);
}

watch(() => props, () => {
    // console.log('组件挂载时获取事件列表', page.value, props);
    fetchData(page.value);
    voluntarys.value = [];
    // page.value = 1;
}, { immediate: true, deep: true })
// 组件挂载时获取事件列表
onMounted(() => {
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