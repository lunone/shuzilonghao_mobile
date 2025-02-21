<template>
    <EventVue :data="event" v-for="event in events" :key="event.id" />
</template>
<script lang="ts" setup>
import api from '@/utils/api';
import { onMounted, PropType, ref, Ref, watch } from 'vue';
import CONFIG from '@/config';
import EventVue from './card/event.vue';
import dayjs from 'dayjs';
import useUserStore from '@/store/user.store';
import useBasisStore from '@/store/basis.store';
const store = useUserStore();
const basis = useBasisStore();
const events: Ref<any[]> = ref([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const size = 300;
const props = defineProps({
    // startDate: { type: String, default: dayjs().add(-1, 'month').format('YYYY-MM-DD') },
    // endDate: { type: String, default: dayjs().format('YYYY-MM-DD') },
    range: {
        type: Object as PropType<[string, string]>, default: () => [
            dayjs().add(-11, 'day').format('YYYY-MM-DD'),
            dayjs().add(-1, 'day').format('YYYY-MM-DD'),
        ]
    }
});
const fetchData = async (currentPage: number) => {
    loading.value = true;
    // page.value++;
    try {
        const [startDate, endDate] = props.range;
        const resEvents = await api(CONFIG.url.smsEvents, { startDate, endDate });
        const nameToUserId = await store.getNameToUserId();
        const airportsCode3 = await basis.getAirportsCode3();
        for (let event of resEvents) {
            const { dep, arr, acReg } = event;
            const crews = (event.crews || '').split('、');
            const newCrews = [];
            for (let crew of crews) {
                const userId = nameToUserId[crew];
                newCrews.push({ userId, name: crew, });
            }
            // 举报人
            event.reporter = nameToUserId[event.reporter] || event.reporter;
            for (let s of event.status) {
                s.creator = nameToUserId[s.creator] || s.creator;
                // 状态更新人
                s.updater = nameToUserId[s.updater] || s.updater;
                s.reporter = nameToUserId[s.reporter] || s.reporter;
            }
            event.crews = newCrews;
            event.acReg = (acReg || '').replace('-', '');
            // console.log(JSON.stringify(event), event, dep, airportsCode3[dep])
            event.dep = airportsCode3[dep]?.city || dep;
            event.arr = airportsCode3[arr]?.city || arr;
        }

        // console.log('resEvents', res);
        events.value = events.value.concat(resEvents);
        loading.value = false;
        finished.value = events.value.length > resEvents.total;
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
