<template>
    <StationStatsCard :title="title" :timeLabel="timeLabel" :data="chartData" />
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { useAirportStore } from '@/store/airport.store';
import dayjs from 'dayjs';
import { getStatByStation, StationStats } from '@/api/statistics.api';
import StationStatsCard from './components/StationStatsCard.vue';

const { getCity, fetchAirports } = useAirportStore();

const props = defineProps({
    station: { type: String, required: true },
    startDate: { type: Date, default: () => dayjs().startOf('year').toDate() },
    endDate: { type: Date, default: () => dayjs().toDate() },
});

const stat = ref<StationStats | null>(null);
const title = ref('');
const timeLabel = ref('- 今年');

const chartData = computed(() => {
    if (!stat.value) return [];
    return [
        { label: '航班', value: `${stat.value.flightCount} 班`, icon: 'paperplane-filled' },
        { label: '货量', value: `${((stat.value.netWeightCargo || 0) / 1000).toFixed(2)} 吨`, icon: 'gift-filled' },
        { label: '小时', value: `${(stat.value.totalHours || 0).toFixed(2)} 小时`, icon: 'refreshempty' },
    ];
});

async function loadData() {
    try {
        await fetchAirports();
        title.value = `${getCity(props.station)} (${props.station})`;
        const res = await getStatByStation({ station: props.station, startDate: props.startDate, endDate: props.endDate });
        
        // @ts-ignore
        const data = res.data || res; // 兼容 {data: ...} 和直接返回对象两种情况

        if (data && typeof data === 'object') {
            stat.value = {
                station: props.station,
                flightCount: data.counter || 0,
                netWeightCargo: data.netWeightCargo || 0,
                totalHours: data.hour || 0,
                averageDelay: 0
            };
        } else {
            stat.value = {
                station: props.station,
                flightCount: 0,
                netWeightCargo: 0,
                totalHours: 0,
                averageDelay: 0
            };
        }
    } catch (err) {
        console.error(`加载站点 ${props.station} 统计数据失败`, err);
        stat.value = {
            station: props.station,
            flightCount: 0,
            netWeightCargo: 0,
            totalHours: 0,
            averageDelay: 0
        };
    }
}

onMounted(loadData);
</script>
