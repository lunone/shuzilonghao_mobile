<template>
  <span class="mel-status-badge" :class="statusClass">
    <uni-icons v-if="showIcon" :type="statusIcon" size="12" />
    <span class="status-text">{{ displayText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  status: string;              // 状态值
  showIcon?: boolean;          // 是否显示图标
  customText?: string;         // 自定义文本
  size?: 'small' | 'medium' | 'large'; // 尺寸
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
  size: 'medium'
});

// 状态配置
const statusConfig = {
  '已批准': {
    class: 'status-approved',
    icon: 'checkmarkempty',
    color: '#27ae60'
  },
  '待批准': {
    class: 'status-pending',
    icon: 'clock',
    color: '#f39c12'
  },
  '已拒绝': {
    class: 'status-rejected',
    icon: 'closeempty',
    color: '#e74c3c'
  },
  '进行中': {
    class: 'status-progress',
    icon: 'loop',
    color: '#3498db'
  },
  '已关闭': {
    class: 'status-closed',
    icon: 'flag',
    color: '#95a5a6'
  }
};

// 计算属性
const statusClass = computed(() => {
  const config = statusConfig[props.status as keyof typeof statusConfig];
  return [
    'status-badge',
    config?.class || 'status-default',
    `size-${props.size}`
  ];
});

const statusIcon = computed(() => {
  const config = statusConfig[props.status as keyof typeof statusConfig];
  return config?.icon || 'info';
});

const displayText = computed(() => {
  return props.customText || props.status;
});
</script>

<style lang="less" scoped>
.mel-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  
  &.status-approved {
    background: #d4edda;
    color: #27ae60;
  }
  
  &.status-pending {
    background: #fff3cd;
    color: #f39c12;
  }
  
  &.status-rejected {
    background: #f8d7da;
    color: #e74c3c;
  }
  
  &.status-progress {
    background: #d1ecf1;
    color: #3498db;
  }
  
  &.status-closed {
    background: #f8f9fa;
    color: #95a5a6;
  }
  
  &.status-default {
    background: #f0f0f0;
    color: #666;
  }
  
  &.size-small {
    padding: 1px 6px;
    font-size: 10px;
  }
  
  &.size-large {
    padding: 4px 12px;
    font-size: 14px;
  }
  
  .status-text {
    line-height: 1;
  }
}
</style>