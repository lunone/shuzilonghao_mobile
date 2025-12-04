<template>
    <div class="region-card" v-if="displayData">
        <div class="card-header">
            <span class="region-name">{{ title }}</span>
            <span class="time-label" v-if="timeLabel">{{ timeLabel }}</span>
        </div>
        <div class="card-body">
            <div v-for="item in displayData" :key="item.label" class="metric-item">
                <uni-icons :type="item.icon" size="24" color="#333"></uni-icons>
                <div class="metric-text">
                    <span class="label">{{ item.label }}</span>
                    <span class="value">{{ item.value }}</span>
                </div>
                <div class="trend-chart"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

type StatItem = {
    label: string;
    value: string | number;
    icon: string;
};

const props = defineProps({
    title: { type: String, required: true },
    timeLabel: { type: String, default: '' },
    data: { type: Array as () => StatItem[], required: true },
});

const displayData = computed(() => props.data);
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.region-card {
    width: 100%;
    height: 100%;
    background: #f7f8fa;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-sizing: border-box;
}

.card-header {
    display: flex;
    align-items: baseline;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;

    .region-name {
        font-weight: bold;
        font-size: 16px;
        color: #333;
    }

    .time-label {
        font-size: 12px;
        color: #999;
        margin-left: 8px;
    }
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.metric-item {
    display: flex;
    align-items: center;
    gap: 12px;

    .metric-text {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .label {
            font-size: 14px;
            color: #666;
        }

        .value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
    }

    .trend-chart {
        width: 60px;
        height: 20px;
        background-color: #eee; // 趋势图占位符
        border-radius: 4px;
    }
}
</style>