<template>
    <div class="stat-container">
        <!-- 胶囊样式时间选择器 -->
        <div class="time-range">
            <div v-for="item in timeRanges" :key="item.value"
                :class="['range-item', { active: activeRange === item.value }]" @click="rangeChange(item.value)">
                {{ item.label }}
            </div>
        </div>

        <!-- 统计项 -->
        <div class="stat-item">
            <h3>年产值</h3>
            <div class="time-stat">{{ flightHours }}小时, {{ flightCount }}班</div>
            <div class="weight">运输xx吨货(非独享)</div>
        </div>

        <div class="stat-item">
            <h3>最近飞行站点</h3>
            <PieChart :data="siteData" />
        </div>

        <div class="stat-item">
            <h3>最近飞行时间段</h3>
            <PieChart :data="hours" />
        </div>

        <div class="stat-item">
            <h3>最近队友</h3>
            最近经常和一下人员一起飞行：
            <div class="mates">
                <div v-for="mate in mates" class="mate" @click="select(mate.pcode)">
                    {{ getPilot(mate.pcode) ? getPilot(mate.pcode).name : mate.pcode }}
                    ({{ mate.flightCount }}班)
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PieChart from '@/components/ucharts/pie.vue'
import { CONFIG } from '@/config'
import { api } from '@/utils/api'
import { usePilotStore } from '@/store/pilot.store'
import { useAirportStore } from '@/store/airport.store'
import _ from 'lodash'
const timeRanges = [
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
    { label: '年', value: 'year' }
]
const { getPilot } = usePilotStore();
const { getCity } = useAirportStore();
const activeRange = ref('week')
const mates = ref([]);
const airlines = ref([]);
const hours = ref([]);
function rangeChange(range) {
    activeRange.value = range
    // 这里可以添加获取对应时间段数据的逻辑
    console.log('时间范围切换为:', range)
}
const select = (pcode: any) => {
    console.log('sel', pcode);
    // 跳转到page/pilot/participater，携带参数pcode
    uni.navigateTo({ url: `/pages/pilot/portrait?pcode=${pcode}` });
};
// 模拟数据
const flightHours = ref('120')
const flightCount = ref('15')

const siteData = computed(() => {
    if (!airlines.value) return [];
    const arr = _.cloneDeep(airlines.value);
    const res = arr.map(item => {
        const arr = item.name.split('-');
        const name = `${getCity(arr[0])}-${getCity(arr[1])}(${item.value})`;
        return { name, value: item.value }
    });
    return res;
})

// const timeData = computed(() => {
//     if (!hours.value) return [];
//     const arr = _.cloneDeep(hours.value); 
//     const res = arr.map(item => {
//         const arr = item.name.split('-');
//         const name = `${arr[0]}-${arr[1]}(${item.value})`;
//         return { name, value: item.value } 
//     })
//     return res;
// })


// ref([
//     { name: '早班(00:00-08:00)', value: 20 },
//     { name: '晚班(16:00-24:00)', value: 20 },
//     { name: '白班(08:00-16:00)', value: 20 },
//     { name: '夜班(24:00-00:00)', value: 20 }
// ])
onMounted(() => {
    // 初始化获取周数据
    Promise.all([
        api(CONFIG.url.crewMate, { startDate: '2024-01-01', endDate: '2024-01-31', pcode: 'FL100076' }).then(res => mates.value = res),
        api(CONFIG.url.crewAirline, { startDate: '2024-01-01', endDate: '2024-01-31', pcode: 'FL100076' }).then(res => airlines.value = res),
        api(CONFIG.url.crewTime, { startDate: '2024-01-01', endDate: '2024-01-31', pcode: 'FL100076' }).then(res => hours.value = res),
    ]).then(res => {
        console.log('promise all res:', res);
    })

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

            &:hover {
                background: #1890ff;
                color: white;
            }
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

    .stat-item {
        margin-bottom: 30px;

        h3 {
            margin-bottom: 10px;
            font-size: 16px;
            color: #333;
        }

        .time-stat {
            font-size: 24px;
            color: #1890ff;
            font-weight: bold;
        }
    }
}
</style>
