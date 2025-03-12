<template>
    <div class="star-wrapper">
        <div class="title">{{ text }}</div>
        <div class="star" v-for="(item, index) in starList" :key="index">
            <div class="name">{{ getCity(item.name) }}</div>
            <div class="counter">{{ numberByWan(item.counter) }}班</div>
            <div class="weight">{{ numberByWan(item.netWeightCargo) }}吨</div>
            <div class="hour">{{ numberByWan(item.hours) }}小时</div>
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
const airportStore = useAirportStore();
const { getCity } = airportStore;

const props = defineProps({
    startDate: { type: Date, default: () => dayjs().startOf('year').toDate() },
    endDate: { type: Date, default: () => dayjs().toDate() },

})
const text = computed(() => {
    return `${dayjs(props.startDate).format('YYYY-MM-DD')}-${dayjs(props.endDate).format('YYYY-MM-DD')}`
})
const starSrc = ref({}) as Ref<Record<string, any>>;
const starList = computed(() => {
    if (!Object.values(starSrc.value).length) return [];
    const src = [
        { name: 'ZHCC', ...starSrc.value }
    ] as { name: string, counter: number, netWeightCargo: number, hours: number }[];

    src.map(item => {
        item.hours = +item.hours.toFixed(2);
        item.netWeightCargo = +(item.netWeightCargo / 1e3).toFixed(2)
    })
    return src;
})
onMounted(() => {
    const data = { station: 'ZHCC', startDate: props.startDate, endDate: props.endDate }
    Promise.all([
        airportStore.fetchAirports(),
        api(CONFIG.url.statByStation, data).then(res => starSrc.value = res || [])
    ])
    airportStore.fetchAirports();
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
        .hour {}
    }


}
</style>