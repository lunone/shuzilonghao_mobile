<template>
    <div class="stat-container">
        <!-- 胶囊样式时间选择器 -->
        <div class="time-range">
            <div v-for="item in timeRanges" :key="item.value"
                :class="['range-item', { active: activeRange === item.value }]" @click=" activeRange = item.value">
                {{ item.label }}
            </div>
        </div>
        <!-- 统计项 -->
        <div class="item">
            <h3>工作量</h3>
            <span>从{{ startDateText }}</span>至<span>今天({{ dayjs().format('YYYY-MM-DD') }})</span>
            <div>共{{ dayjs().diff(startDateText, 'day') }}天,飞了 {{ sum.days }}天</div>
            <div>合计{{ sum.flightHours }}小时, {{ sum.count }}班</div>
        </div>

        <div class="item">
            <h3>航线分析</h3>
            <PieChart :data="siteData" />
        </div>

        <div class="item">
            <h3>飞行时长分析</h3>
            <PieChart :data="flightHourData" />
        </div>

        <div class="item">
            <h3>起飞分析(24小时分布图)</h3>
            <BarChart :data="atdData" />
        </div>

        <div class="item">
            <h3>机搭子分析</h3>
            最近经常和一下人员一起飞行：
            <div class="mates">
                <div v-for="mate in mates" :key="mate.pcode" class="mate" @click="select(mate.pcode)">
                    {{ getName(mate) }}
                    ({{ mate.flightCount }}班)
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { api } from '@/utils/api'
import { CONFIG } from '@/config'
import { computed, onMounted, ref, watch } from 'vue'
import PieChart from '@/components/ucharts/pie.vue'
import BarChart from '@/components/ucharts/bar.vue'
// import hourChart from '@/pages/pilot/portrait/hour.vue'
import { usePilotStore } from '@/store/pilot.store'
import { useAirportStore } from '@/store/airport.store'
import dayjs from 'dayjs'
import _ from 'lodash'
const { getPilot } = usePilotStore();
const { getCity } = useAirportStore();
const timeRanges = [
    { label: '月', value: '1month' },
    { label: '季', value: '3month' },
    { label: '年', value: '1year' }
]
const props = defineProps({
    pcode: { type: String, default: '' }
})
const activeRange = ref('1month')
const mates = ref([]);
const airlines = ref([]);
const atds = ref([]);
const flightHours = ref([]);
const startDateText = ref('');
watch([activeRange, () => props.pcode], ([range]) => {
    if (props.pcode == '') return;
    let startDate, endDate = new Date();
    range.replace(/^(\d+)(\w+)$/, (match, num, unit) => {
        const $startDate = dayjs().subtract(parseInt(num), unit);
        startDate = $startDate.toDate();
        startDateText.value = $startDate.format('YYYY-MM-DD');
        return ''
    })
    const parms = { endDate, startDate, pcode: props.pcode }
    console.log('时间范围切换为:', range, parms)
    Promise.all([
        api(CONFIG.url.crewMate, parms).then(res => mates.value = res),
        api(CONFIG.url.crewFatigue, parms).then(res => {
            console.log('promise all res:', res);
            airlines.value = res.airlines;
            atds.value = res.atds;
            flightHours.value = res.flightHours;
            sum.value = { count: res.totalCount, flightHours: res.totalFlightHours, days: res.totalDays }
        }),
    ])
}, { immediate: true, deep: true });
const select = (pcode: any) => {
    console.log('sel', pcode);
    // 跳转到page/pilot/participater，携带参数pcode
    uni.navigateTo({ url: `/pages/pilot/portrait?pcode=${pcode}` });
};
function getName(mate: { pcode: string, userId: string, flightCount: number }) {
    const pilot = getPilot(mate.pcode)?.name
    // console.log
    return pilot ? pilot : mate.pcode
}
// const flightHours = ref('120')
const sum = ref({ count: 0, flightHours: 0, days: 0 })

const siteData = computed(() => {
    if (!airlines.value) return [];
    const arr = _.cloneDeep(airlines.value);
    const res = arr.map(item => {
        const arr = item.name.split('-');
        const name = `${getCity(arr[0])}-${getCity(arr[1])}(${item.value}班)`;
        return { name, value: item.value }
    });
    return res;
})
const atdData = computed(() => {
    if (!atds.value) return [];
    const arr = _.cloneDeep(atds.value);
    return arr;
})
const flightHourData = computed(() => {
    if (!flightHours.value) return [];
    const arr = _.cloneDeep(flightHours.value);
    const res = arr.map(item => {
        const name = `${item.name}小时(${item.value}班)`;
        return { name, value: item.value }
    });
    return res;
})

onMounted(() => {
    // 初始化获取周数据
})
</script>

<style scoped lang="less">
.stat-container {
    .mates {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;

        .mate {
            padding: 6px 12px;
            background: #f0f7ff;
            border-radius: 16px;
            color: #1890ff;
            cursor: pointer;
            transition: all 0.2s;
        }
    }

    .time-range {
        display: flex;
        margin: 4px 20% 20px;
        background: #f5f5f5;
        border-radius: 20px;
        padding: 4px;

        .range-item {
            flex: 1;
            text-align: center;
            color: #333;
            padding: 8px 0;
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.3s;

            &.active {
                background: #1890ff;
                color: white;
                font-weight: bold;
            }
        }
    }

    .item {
        margin: 8px 0 8px 0;

        h3 {
            margin-bottom: 8px;
            font-size: 16px;
            color: #333;
            font-weight: bold;
        }

        .time-stat {
            font-size: 24px;
            color: #1890ff;
            font-weight: bold;
        }
    }
}
</style>
