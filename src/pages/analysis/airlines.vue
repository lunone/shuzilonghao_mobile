<template>
    <zl-date-range-picker v-model="dateRange" />
    <press-calendar />
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div  >

        <div class="button-group">
            <span class="btn" :class="currentStation == code4 ? `hover` : ``" v-for="code4 in stations" :key="code4"
                @click="stationClick(code4)">
                {{ code4City(code4) }}
            </span>
        </div>
        <div class="way">
            <div class="arr">进港</div>
            <switch @change="isDep = !isDep" :size="20" />
            <div class="dep">出港</div>
        </div>

        <div class="airlines">
            <airline v-for="(stats, code4) in filterStation" :key="code4" :stats="stats"
                :dep="code4City(isDep ? currentStation : code4)" :arr="code4City(!isDep ? currentStation : code4)" />
        </div>

    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, Ref, onMounted } from 'vue';
import CONFIG from '@/config';
import api from '@/utils/api';
import basisStore from '@/store/basis.store';
import { AirportItem, statItem } from '@/interface';
import dayjs from 'dayjs';
import airline from './airline/airline.vue';
import zlDateRangePicker from '@/components/zl/dateRangePicker.vue';
const store = basisStore();
// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');


// ZHCC-ZHYC:{'B220M':{avgNEtcargo:number……}}
type Res = Record<string, Record<string, statItem>>
const isDep: Ref<boolean> = ref(false);
const airlineStats = ref({}) as Ref<Res>;
const airports = ref({}) as Ref<Record<string, AirportItem>>;

const dateRange = ref([
    dayjs().add(-11, 'day').toDate(),
    dayjs().add(-1, 'day').endOf('day').toDate()
]) as Ref<[Date, Date]>;
const code4City = (code4: string) => airports.value[code4]?.city || code4;
const currentStation = ref('');
const stationClick = (name: string) => currentStation.value = name;
const stations = computed(() => {
    if (!airlineStats.value) return [];
    return [...new Set(Object.keys(airlineStats.value).reduce((acc, cur) => [...acc, ...cur.split('-')], []))];
})
const filterStation = computed(() => {
    const temp = {} as Record<string, Record<string, statItem>>;
    for (let key in airlineStats.value) {
        const [dep, arr] = key.split('-');
        let selectStation = isDep.value ? dep : arr;
        let otherStation = isDep.value ? arr : dep;
        if (selectStation === currentStation.value) {
            temp[otherStation] = airlineStats.value[key];
        }
    }
    return temp;
});
const fetchData = async (startDate: Date, endDate: Date) => {
    loading.value = true;
    error.value = '';
    try {
        const res = await api(CONFIG.url.statByAirline, { startDate, endDate }) as Res;
        airports.value = await store.fetchAirports();
        console.log('统计', res);
        airlineStats.value = res;
        stationClick(stations.value[0]);
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
@import "@/css/base.less";

.loading,
.error {
    text-align: center;
    margin-top: 20px;
}

.button-group {
    display: flex;
    flex-wrap: wrap; // 允许换行
    gap: 10px; // 按钮之间的间距
    justify-content: center; // 按钮水平居中
    padding: 10px; // 添加内边距


    .btn {
        flex: 1 1 auto; // 自动宽度，但不会小于其内容宽度
        min-width: 40px; // 设置最小宽度
        max-width: 140px; // 设置最da宽度
        padding: 6px 14px; // 按钮内边距
        border-radius: 5px;
        color: #414141;
        background-color: #ecf3fa;
        text-align: center;

        &.hover {
            background-color: #81a8d3;
        }
    }
}

.way {
    display: flex;
    justify-content: center;
    /* 使子元素水平居中 */
    align-items: center;
    margin-bottom: 6px;
    /* 添加底部间距 */

    border-radius: 5px;



    .dep,
    .arr {
        font-weight: bold;
        color: #999;
        margin: 0 10px;
        /* 子元素之间的间距 */
    }

    .hover {
        color: #333;
    }
}

.airlines {
    border-radius: 8px;
    margin: 20px 10px;


}
</style>