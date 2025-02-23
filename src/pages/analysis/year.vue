<template>
    <div class="year" v-for="stat, year in stats" :key="year">
        <div class="title">{{ year }}年</div>
        <div class="detail">
            <div class="kv counter">
                <div class="key">航班</div>
                <div class="value"><zl-number :value="stat.counter" /> </div>
            </div>
            <div class="kv netWeightCargo">
                <div class="key">总重</div>
                <div class="value"> <zl-number :value="stat.netWeightCargo" /> </div>
            </div>
            <div class="kv hours">
                <div class="key">飞行小时</div>
                <div class="value"><zl-number :value="stat.hours" /> </div>
            </div>
        </div>
    </div>
    月度
</template>
<script setup lang="ts">
import CONFIG from '@/config';
import api from '@/utils/api';
import basisStore from '@/store/basis.store';
import { AirportItem } from '@/interface';
import dayjs from 'dayjs';
import airline from './airline/airline.vue';
import zlDateRangePicker from '@/components/zl/dateRangePicker.vue';
import { Ref, ref, watch } from 'vue';
import _ from 'lodash';
const store = basisStore();
// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

type statItem = {
    counter: number,
    hours: number,
    netWeightCargo: number,
    month?: string,
}
// ZHCC-ZHYC:{'B220M':{avgNEtcargo:number……}}
type Res = Record<string, Record<string, statItem>>
const airlineStats = ref({}) as Ref<Res>;
const airports = ref({}) as Ref<Record<string, AirportItem>>;
const stats = ref({}) as Ref<Record<string, statItem>>;

const dateRange = ref([
    dayjs().add(-2, 'year').startOf('year').toDate(),
    dayjs().add(-1, 'day').endOf('day').toDate()
]) as Ref<[Date, Date]>;
const fetchData = async (startDate: Date, endDate: Date) => {
    loading.value = true;
    error.value = '';
    try {
        const res = await api(CONFIG.url.statMonth, { startDate, endDate }) as statItem[];
        // airports.value = await store.getAirports();
        // 按照year分组
        const yearGroup = _.groupBy(res, (item) => item.month.slice(0, 2));
        const yearStat = _.mapValues(yearGroup, (monthGroup) => {
            return {
                counter: _.sumBy(monthGroup, 'counter'),
                hours: +(_.sumBy(monthGroup, 'hours')).toFixed(2),
                netWeightCargo: +(_.sumBy(monthGroup, 'netWeightCargo') / 1e3).toFixed(2),
            }
        })
        stats.value = yearStat;
        console.log('统计', res, yearStat);
        // airlineStats.value = res;
        // stationClick(stations.value[0]);
    } catch (err) {
        console.log(err)
        error.value = '获取信息失败';
    } finally {
        loading.value = false;
    }
};
watch(() => dateRange.value, () => {
    const [startDate, endDate] = dateRange.value

    fetchData(startDate, endDate);
}, { immediate: true, deep: true })
</script>
<style lang="less" scoped>
@primary-color: #C52305;
@secondary-color: #943928;
@accent-color: #085E7B;
@text-color: #333;

.year {
    background-color: #f9f9f9;
    border-radius: 8px;
    margin: 16px;
    padding: 12px;
    /* 减小内边距 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @media (max-width: 768px) {
        margin: 8px;
        padding: 8px;
    }

    .title {
        font-size: 20px;
        /* 减小字体大小 */
        font-weight: bold;
        color: @primary-color;
        /* 使用主色 */
        margin-bottom: 12px;
        /* 减小间距 */

        @media (max-width: 768px) {
            font-size: 18px;
        }
    }

    .detail {
        display: flex;
        flex-wrap: wrap;
        width: 100%;

        .kv {
            flex: 1 1 30%;
            margin-bottom: 12px;
            /* 减小间距 */
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            @media (max-width: 768px) {
                flex: 1 1 45%;
            }

            .key {
                font-size: 14px;
                /* 减小字体大小 */
                color: @secondary-color;
                /* 使用辅助色 */
                margin-bottom: 4px;
            }

            .value {
                font-size: 16px;
                /* 减小字体大小 */
                font-weight: bold;
                color: @text-color;
                /* 使用文本颜色 */
            }
        }
    }
}
</style>