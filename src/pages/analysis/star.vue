<template>
    <div class="star-wrapper">
        <div class="title">{{ getCity(starList.name) }}今年</div>
        <div class="star">
            <template v-for="(unit, key) in fields" :key="key">
                <div class="item">
                    <span class="value">{{ numberByWan(starList[key]) }}</span>
                    <span class="unit">{{ unit }}</span>
                </div>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from 'vue';
import { useAirportStore } from '@/store/airport.store';
import { numberByWan } from '@/utils/tools';
import dayjs from 'dayjs';
import { getStatByStation } from '@/api/statistics.api';
import { StatSingle } from '@/interface/flight.interface';

const fields = { counter: '班', netWeightCargo: '吨', hour: '小时' }
const { getCity, fetchAirports } = useAirportStore();

const props = defineProps({
    startDate: { type: Date, default: () => dayjs().startOf('year').toDate() },
    endDate: { type: Date, default: () => dayjs().toDate() },
})
// const text = computed(() => {
//     return `${dayjs(props.startDate).format('YYYY-MM-DD')}-${dayjs(props.endDate).format('YYYY-MM-DD')}`
// })
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
async function loadData() {
    const data = { station: 'ZHCC', startDate: props.startDate, endDate: props.endDate }
    try {
        const [airportsResult, statResult] = await Promise.all([
            fetchAirports(),
            getStatByStation(data)
        ]);
        starSrc.value = statResult || {};
    } catch (err) {
        console.error('加载数据失败', err);
    }
}

onMounted(loadData)
</script>
<style lang="less" scoped>
@import '@/css/base.less';

.star-wrapper {
    .column;
    width: 100%;
    margin: 0;
    // gap: 6px; // 增加垂直间距
    // padding: 10px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .title {
        font-size: 18px;
        font-weight: 500;
        color: #747474;
        // padding-bottom: 8px;
        font-weight: bold;
        border-bottom: 1px solid #eee;
        align-self: flex-start;
        margin: 6px 20px 0;
    }


    .star {
        .row;
        justify-content: space-between;
        width: 100%;
        gap: 8px; // 增加子项间距
        // padding: 12px 0;

        .name,
        .item {
            border: 0;
            flex: 1;
            text-align: center;
            padding: 8px;
            transition: all 0.3s;

            .value {
                font-size: 16px;
                color: #182027;
                font-weight: 600;
                margin-right: 4px;
            }

            .unit {
                font-size: 12px;
                color: #99a9bf;
            }
        }

        .name {
            font-weight: 500;
            color: #303133;
            text-align: left;
            flex: 1.2;
        }
    }

}
</style>
