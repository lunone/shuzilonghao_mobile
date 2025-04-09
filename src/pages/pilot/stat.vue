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
            <PieChart :data="timeData" />
        </div>

        <div class="stat-item">
            <h3>最近队友</h3>
            最近经常和一下人员一起飞行：
            <ul class="mates">
                <li class="mate">张三</li>
                <li class="mate">李四</li>
                <li class="mate">王五</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PieChart from '@/components/ucharts/pie.vue'

const timeRanges = [
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
    { label: '年', value: 'year' }
]
const activeRange = ref('week')

function rangeChange(range) {
    activeRange.value = range
    // 这里可以添加获取对应时间段数据的逻辑
    console.log('时间范围切换为:', range)
}

// 模拟数据
const flightHours = ref('120')
const flightCount = ref('15')

const siteData = ref([
    { name: '郑州-上海', value: 20 },
    { name: '郑州-北京', value: 20 },
    { name: '郑州-大阪', value: 20 },
    { name: '郑州-东京', value: 10 },
    { name: '郑州-首尔', value: 10 },
    { name: '郑州-香港', value: 10 },
    { name: '郑州-澳门', value: 10 },
    { name: '郑州-台北', value: 10 },
    { name: '郑州-高雄', value: 10 }
])

const timeData = ref([
    { name: '早班(00:00-08:00)', value: 20 },
    { name: '晚班(16:00-24:00)', value: 20 },
    { name: '白班(08:00-16:00)', value: 20 },
    { name: '夜班(24:00-00:00)', value: 20 }
])
</script>

<style scoped lang="less">
.stat-container {
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
