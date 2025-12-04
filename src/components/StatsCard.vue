<template>
    <div class="stats-card" :class="{ 'with-header': showHeader }">
        <!-- 头部标题区域 -->
        <div v-if="showHeader && title" class="card-header">
            <span class="title">{{ title }}</span>
            <span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
        </div>
        
        <!-- 统计项列表 -->
        <div class="stats-container">
            <div v-for="stat in normalizedStats" :key="stat.label" class="stat-item">
                <i :class="[stat.iconClass, 'stat-icon']" :style="{ color: stat.color }"></i>
                <span class="stat-label">{{ stat.label }}:</span>
                <span class="stat-value">{{ formatValue(stat.value, stat.unit) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 统计项接口
interface StatItem {
    label: string;
    value: number | string;
    unit?: string;
    iconClass: string;
    color?: string;
    formatter?: (value: number | string) => string;
}

interface Props {
    // 标题配置
    title?: string;
    subtitle?: string;
    showHeader?: boolean;
    
    // 统计数据
    stats: StatItem[];
    
    // 数值格式化
    valueFormatter?: (value: number | string, unit?: string) => string;
}

const props = withDefaults(defineProps<Props>(), {
    showHeader: false,
    valueFormatter: (value: number | string, unit?: string) => {
        if (typeof value === 'number') {
            // 处理大数字显示
            if (value >= 1000000) {
                return (value / 1000000).toFixed(2) + (unit ? ` ${unit}` : '');
            } else if (value >= 1000) {
                return value.toLocaleString() + (unit ? ` ${unit}` : '');
            }
            return value.toLocaleString() + (unit ? ` ${unit}` : '');
        }
        return value + (unit ? ` ${unit}` : '');
    }
});

// 标准化统计项数据
const normalizedStats = computed(() => {
    return props.stats.map(stat => ({
        ...stat,
        value: stat.value,
        unit: stat.unit || '',
        iconClass: stat.iconClass || 'stat-icon',
        color: stat.color || '#333',
        formatter: stat.formatter || ((value: number | string) => 
            props.valueFormatter!(value, stat.unit)
        )
    }));
});

// 格式化数值
const formatValue = (value: number | string, unit?: string) => {
    return props.valueFormatter!(value, unit);
};
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.stats-card {
    width: 100%;
    background: #f7f8fa;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-sizing: border-box;

    &.with-header {
        .card-header {
            display: flex;
            align-items: baseline;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
            
            .title {
                font-weight: bold;
                font-size: 16px;
                color: #333;
            }
            
            .subtitle {
                font-size: 12px;
                color: #999;
                margin-left: 8px;
            }
        }
    }
}

.stats-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stat-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
    
    .stat-icon {
        font-size: 16px;
        margin-right: 8px;
        width: 20px;
        text-align: center;
    }
    
    .stat-label {
        color: #666;
        margin-right: 4px;
        min-width: 32px;
    }
    
    .stat-value {
        color: #333;
        font-weight: 500;
    }
}
</style>