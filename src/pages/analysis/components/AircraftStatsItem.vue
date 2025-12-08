<template>
    <div class="aircraft-stats-item">
        <div class="aircraft-header">
            <span class="aircraft-reg">{{ aircraftReg }}</span>
            <span v-if="aircraftType" class="aircraft-type">{{ aircraftType }}</span>
        </div>
        
        <div class="stats-section">
            <div class="stat-row">
                <SummaryItem
                    label="航班"
                    :stats="getCounterStats()"
                    unit="班"
                    :is-counter="true"
                />
            </div>
            <div class="stat-row">
                <SummaryItem
                    label="货量"
                    :stats="stats.netWeightCargo"
                    unit="吨"
                />
            </div>
            <div class="stat-row">
                <SummaryItem
                    label="时间"
                    :stats="stats.hour"
                    unit="小时"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SummaryItem from './SummaryItem.vue';

const props = defineProps({
    aircraftReg: { type: String, required: true },
    aircraftType: { type: String, default: '' },
    stats: {
        type: Object,
        required: true
    }
});

// 兼容两种数据结构的counter统计
const getCounterStats = () => {
    // 如果stats包含counter字段，返回完整的counter统计对象
    if (props.stats && props.stats.counter !== undefined) {
        return {
            total: props.stats.counter,
            min: props.stats.counter,
            max: props.stats.counter,
            avg: props.stats.counter
        };
    }
    
    // 如果stats本身就是counter数字
    if (typeof props.stats === 'number') {
        return {
            total: props.stats,
            min: props.stats,
            max: props.stats,
            avg: props.stats
        };
    }
    
    // 默认返回空对象
    return { total: 0, min: 0, max: 0, avg: 0 };
};
</script>

<style lang="less" scoped>
.aircraft-stats-item {
    background-color: #fff;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    border-left: 3px solid #1890ff;
}

.aircraft-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;

    .aircraft-reg {
        font-size: 14px;
        font-weight: bold;
        color: #1890ff;
    }

    .aircraft-type {
        font-size: 12px;
        color: #666;
        background-color: #f0f0f0;
        padding: 1px 6px;
        border-radius: 3px;
    }
}

.stats-section {
    .stat-row {
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>