<template>
  <view v-if="isLoading" class="page-loading">
    <view class="loading-overlay">
      <view class="loading-content">
        <view class="loading-spinner">
          <view class="spinner-circle"></view>
          <view class="spinner-circle"></view>
          <view class="spinner-circle"></view>
        </view>
        <text class="loading-text">{{ text || '加载中...' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  text?: string
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '加载中...',
  isLoading: false
})


</script>

<style lang="less" scoped>
@import "@/css/base.less";

.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-overlay {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  display: flex;
  gap: 2px;
}

.spinner-circle {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: @color-primary;
  opacity: 0.6;
  animation: loading-bounce 1.4s ease-in-out infinite both;

  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }

  &:nth-child(3) {
    animation-delay: 0s;
  }
}

@keyframes loading-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.6;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}


</style>
