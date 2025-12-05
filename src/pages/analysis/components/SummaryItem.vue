<template>
    <div class="summary-item">
        <div class="header">
            <span class="label">{{ label }}</span>
            <span class="total-value">{{ formattedTotal }} {{ unit }}</span>
        </div>
        <div v-if="!isCounter" class="details">
            <div class="progress-bar-wrapper">
                <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="stats-text">
                <span>Min: {{ formattedMin }}</span>
                <span>Avg: {{ formattedAvg }}</span>
                <span>Max: {{ formattedMax }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    label: { type: String, required: true },
    stats: { type: Object, required: true },
    unit: { type: String, default: '' },
    isCounter: { type: Boolean, default: false },
});

const formatValue = (value: number) => {
    if (value === undefined || value === null) return 'N/A';
    return value % 1 === 0 ? value : value.toFixed(1);
};

const formattedTotal = computed(() => formatValue(props.stats.total));
const formattedMin = computed(() => formatValue(props.stats.min));
const formattedAvg = computed(() => formatValue(props.stats.avg));
const formattedMax = computed(() => formatValue(props.stats.max));

const progress = computed(() => {
    if (props.isCounter) return 0;
    const { min, avg, max } = props.stats;
    if (max === min) return 100;
    const percentage = ((avg - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100
});
</script>

<style lang="less" scoped>
.summary-item {
    width: 100%;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;

    .label {
        font-size: 14px;
        color: #666;
    }

    .total-value {
        font-size: 16px;
        font-weight: bold;
        color: #333;
    }
}

.details {
    .progress-bar-wrapper {
        height: 6px;
        background-color: #e9ecef;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 6px;

        .progress-bar {
            height: 100%;
            background-color: #52c41a;
            border-radius: 3px;
        }
    }

    .stats-text {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #999;
    }
}
</style>