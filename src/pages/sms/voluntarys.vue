<template>
    <!-- <view v-if="voluntarys.length === 0">暂无主动报告</view> v-model="loading" :finished="finished" :load="loadMore"-->
    <view class="report-list" style="height: 800px;">
        <press-list :immediate-check="false" finished-text="没有更多了">
            <voluntary v-for="(voluntary, index) in voluntarys" :key="index" :data="voluntary" />
        </press-list>
    </view>

</template>
<script setup lang="ts">
import api from '@/utils/api';
import { onMounted, PropType, ref, Ref, watch } from 'vue';
import CONFIG from '@/config';
import dayjs from 'dayjs';
import voluntary from './card/voluntary.vue';
import useUserStore from '@/store/user.store';
const store = useUserStore();
const props = defineProps({
    range: {
        type: Object as PropType<[Date, Date]>, default: () => [
            dayjs().add(-11, 'day').toDate(),
            dayjs().add(-1, 'day').toDate(),
        ]
    }
});
const emits = defineEmits(['loading', 'finished'])
const voluntarys: Ref<any[]> = ref([]);
// const loading = ref(false);
// const finished = ref(false);
const page = ref(1);
// const size = 300;


// 获取事件列表
const fetchData = async (currentPage: number = 1) => {
    // loading.value = true;
    // page.value++;
    emits('loading', true);
    try {
        const [startDate, endDate] = props.range;
        const resVoluntary = await api(CONFIG.url.smsVoluntarys, { startDate, endDate });
        console.log(`resVoluntary`,resVoluntary)
        const nameToUserId = await store.getNameToUserId();
        // 给answer的添加userId;
        for (let voluntary of resVoluntary) {
            voluntary.userId = nameToUserId[voluntary?.userName];
            for (let answer of voluntary.answers) {
                answer.userId = nameToUserId[answer?.userName];
            }
        }
        voluntarys.value = voluntarys.value.concat(resVoluntary);
        // loading.value = false;

    } catch (err) {
        console.error('获取事件列表失败', err);
    } finally {
        // loading.value = false;
        emits('loading', false);
    }
};

// 加载更多数据
const loadMore = () => {
    console.log('loadmore');
    fetchData(page.value);
}

watch(() => props, (old, newVal) => {
    console.log('组件change表', JSON.stringify(old), JSON.stringify(newVal))
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
    // height: 100vh;
    /* 根据需要调整高度 */
    padding: 10px;
    overflow-y: auto;
}

.loading {
    text-align: center;
    padding: 10px;
}
</style>