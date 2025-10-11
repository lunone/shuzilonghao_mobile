<template>
    <EventVue :data="event" v-for="event in events" :key="event.id" />
</template>
<script lang="ts" setup>
import { getSmsEvents } from '@/api/sms.api';
import { onMounted, PropType, ref, Ref, watch } from 'vue';
import EventVue from './card/event.vue';
import dayjs from 'dayjs';

const events: Ref<any[]> = ref([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const size = 300;
const props = defineProps({
    range: {
        type: Object as PropType<[Date, Date]>, default: () => [
            dayjs().add(-11, 'day').toDate(),
            dayjs().add(-1, 'day').toDate(),
        ]
    }
});
const fetchData = async (currentPage: number) => {
    loading.value = true;
    // page.value++;
    try {
        const [startDate, endDate] = props.range;
        const eventData = await getSmsEvents({ startDate, endDate });
        console.log(`resEvents---------`, eventData);
        for (let event of eventData) {
            const { dep, arr, acReg } = event;
            const crews = (event.crews || '').split(/[,\s;、。\.]+/);
            event.crews = crews;
            event.acReg = (acReg || '').replace('-', '');
        }
        events.value = events.value.concat(eventData);
        loading.value = false;
        finished.value = events.value.length > eventData.total;
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
