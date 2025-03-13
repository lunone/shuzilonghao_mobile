<template>
    <div class="star-wrapper">
        <div class="title">{{ text }}</div>
        <div class="star">
            <div class="name">{{ getCity(starList.name) }}</div>
            <div class="counter">{{ numberByWan(starList.counter) }}班</div>
            <div class="weight">{{ numberByWan(starList.netWeightCargo) }}吨</div>
            <div class="hour">{{ numberByWan(starList.hour) }}小时</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from 'vue';
import { useAirportStore } from '@/store/airport.store';
import { numberByWan } from '@/utils/tools';
import CONFIG from '@/config';
import api from '@/utils/api';
import dayjs from 'dayjs';
import { StatSingle } from '@/interface/flight.interface';


const { getCity, fetchAirports } = useAirportStore();

const props = defineProps({
    startDate: { type: Date, default: () => dayjs().startOf('year').toDate() },
    endDate: { type: Date, default: () => dayjs().toDate() },
})
const text = computed(() => {
    return `${dayjs(props.startDate).format('YYYY-MM-DD')}-${dayjs(props.endDate).format('YYYY-MM-DD')}`
})
const starSrc = ref({}) as Ref<Record<string, any>>;
const starList = computed(() => {
    if (!Object.values(starSrc.value).length) return { name: 'ZHCC', } as StatSingle;
    const item = starSrc.value;
    const src = {
        name: 'ZHCC',
        counter: +item.counter.toFixed(2),
        hour: item.hour.toFixed(2),
        netWeightCargo: +(item.netWeightCargo / 1e3).toFixed(2)
    };
    return src;
}) as Ref<StatSingle>;
onMounted(() => {
    const data = { station: 'ZHCC', startDate: props.startDate, endDate: props.endDate }
    Promise.all([
        fetchAirports(),
        api(CONFIG.url.statByStation, data).then(res => starSrc.value = res || {})
    ])
})
</script>
<style lang="less" scoped>
@import '@/css/base.less';

.star-wrapper {
    width: 100%;
    margin: 0;
    .column;

    .star {
        .row;
        justify-content: space-between;
        width: 100%;

        .name,
        .counter,
        .weight,
        .hour {
            border: 0;
        }
    }


}
</style>