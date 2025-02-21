<template>
    <EventVue :data="event" v-for="event in events" :key="event.id" />
</template>
<script lang="ts" setup>
import api from '@/utils/api';
import { onMounted, ref, Ref, watch } from 'vue';
import CONFIG from '@/config';
import EventVue from './card/event.vue';
import dayjs from 'dayjs';
const events: Ref<any[]> = ref([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const size = 300;
const props = defineProps({
    startDate: { type: String, default: dayjs().add(-1, 'month').format('YYYY-MM-DD') },
    endDate: { type: String, default: dayjs().format('YYYY-MM-DD') },
});
const fetchData = async (currentPage: number) => {
    loading.value = true;
    // page.value++;
    try {
        const res = await api(CONFIG.url.smsEvents, { startDate: props.startDate, endDate: props.endDate,  });
        console.log('resEvents', events.value, props);
        events.value = events.value.concat(res);
        loading.value = false;
        finished.value = events.value.length > res.total;
    } catch (err) {
        console.error('获取事件列表失败', err);
    } finally {
        loading.value = false;
    }
};
watch(() => props, () => {
    console.log('组件挂载时获取事件列表', page.value, props);
    fetchData(page.value);
    events.value = [];
    page.value = 1;
}, { immediate: true, deep: true })
</script>
