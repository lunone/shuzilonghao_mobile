<template>
  <view class="container">
    <view class="content-wrapper">
      <image class="status-icon" src="/static/images/server_error.png" mode="aspectFit"></image>
      <text class="title">服务暂不可用</text>
      <view class="status-box">
        <text class="message">{{ serverStatus }}</text>
      </view>
      <view class="button-group">
        <button class="button clear-button" @click="handleClearCache">
          <text class="button-text">清理缓存</text>
        </button>
        <button class="button retry-button" @click="handleRetry">
          <text class="button-text">点击重试</text>
        </button>
      </view>
      <text class="contact">若问题持续，请联系技术支持</text>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getServerStatus } from '@/api/user.api';
import { CONFIG } from '@/config';

export default defineComponent({
  name: 'ErrorPage',
  setup() {
    const serverStatus = ref('正在获取服务器状态...');

    const fetchServerStatus = async () => {
      const response = await getServerStatus();
      serverStatus.value = response?.message || '获取服务器状态失败。';
    };

    const handleClearCache = () => {
      uni.showModal({
        title: '确认操作',
        content: '此操作将清除所有本地缓存，您需要重新登录。是否继续？',
        confirmText: '确认清除',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.clearStorageSync();
            uni.showToast({ title: '本地缓存已清空', icon: 'success' });
          }
        },
      });
    };

    const handleRetry = () => {
      uni.reLaunch({
        url: CONFIG.page.index,
      });
    };

    onMounted(() => {
      fetchServerStatus();
    });

    return {
      serverStatus,
      handleClearCache,
      handleRetry,
    };
  },
});
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f8fa;
  padding: 40rpx;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600rpx;
  text-align: center;
}

.status-icon {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 500;
  color: #303133;
  margin-bottom: 20rpx;
}

.status-box {
  background-color: #ffffff;
  border: 1rpx solid #e4e7ed;
  border-radius: 16rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 60rpx;
  width: 100%;
}

.message {
  font-size: 28rpx;
  color: #606266;
  line-height: 1.6;
}

.button-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.button {
  border-radius: 40rpx;
  padding: 18rpx 0;
  font-size: 28rpx;
  cursor: pointer;
  width: 48%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    border: none;
  }
}

.clear-button {
  background-color: #f2f3f5;
  color: #303133;
  border: 1rpx solid #dcdfe6;

  &:active {
    background-color: #e8e9eb;
  }
}

.retry-button {
  background-color: #007aff;
  color: white;
  border: 1rpx solid #007aff;

  &:active {
    background-color: #0056b3;
  }
}

.button-text {
  color: inherit;
}

.contact {
  margin-top: 40rpx;
  font-size: 24rpx;
  color: #909399;
}
</style>