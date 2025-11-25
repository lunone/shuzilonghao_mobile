<template>
  <view class="auth-container">
    <view v-if="ticketId" class="content">
      <text class="logo">💻</text>
      <text class="title">授权登录桌面应用</text>
      <button :loading="loading" @click="handleConfirmLogin">
        确认登录
      </button>
    </view>
    <view v-else class="error-tip">
      <text>{{ error }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { confirmQrLogin } from '@/api/user.api';

const ticketId = ref<string | null>(null);
const loading = ref(false);
const error = ref('');

onLoad((options) => {
  if (options && options.scene) {
    const scene = decodeURIComponent(options.scene);
    console.log('获取到的 ticketId:', scene);
    ticketId.value = scene;
  } else {
    console.error('未在启动参数中找到 scene');
    error.value = '无效的二维码';
    uni.showToast({
      title: '无效的二维码',
      icon: 'none',
      duration: 2000,
      complete: () => {
        setTimeout(() => {
          uni.navigateBack();
        }, 2000);
      },
    });
  }
});

const handleConfirmLogin = async () => {
  if (!ticketId.value) {
    uni.showToast({ title: '无效的操作', icon: 'none' });
    return;
  }
  loading.value = true;
  try {
    await confirmQrLogin(ticketId.value);
    uni.showToast({
      title: '授权成功！',
      icon: 'success',
      duration: 2000,
      complete: () => {
        setTimeout(() => {
          uni.navigateBack();
        }, 2000);
      },
    });
  } catch (e) {
    // request封装中已包含错误提示，此处无需重复提示
    console.error('扫码登录确认失败', e);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="less" scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 40rpx;
  box-sizing: border-box;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo {
  font-size: 150rpx;
  line-height: 1;
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  color: #333;
  margin-bottom: 80rpx;
}

button {
  width: 100%;
}

.error-tip {
  color: #f56c6c;
}
</style>