<template>
  <view class="bind-container">
    <view v-if="loading" class="loading">
      <text class="loading-text">正在绑定...</text>
    </view>
    <view v-else-if="success" class="success">
      <text class="icon">✓</text>
      <text class="message">绑定成功！</text>
    </view>
    <view v-else-if="error" class="error">
      <text class="icon">✕</text>
      <text class="message">{{ error }}</text>
      <button class="retry-btn" @click="handleRetry">重试</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getWxCode } from '@/utils/request';
import { loginWithOAuthTicket } from '@/api/user.api';
import { CONFIG } from '@/config';

const loading = ref(true);
const success = ref(false);
const error = ref('');
const oauthticket = ref('');

onLoad(async (options) => {
  // 获取oauthticket
  if (options?.oauthticket) {
    oauthticket.value = options.oauthticket;
  } else if (options?.scene) {
    oauthticket.value = decodeURIComponent(options.scene);
  } else {
    error.value = '无效的绑定凭证';
    loading.value = false;
    return;
  }

  await handleBind();
});

const handleBind = async () => {
  loading.value = true;
  error.value = '';

  try {
    // 获取微信code
    const code = await getWxCode();

    // 调用带凭证登录接口
    const result = await loginWithOAuthTicket(code, oauthticket.value);

    // 设置token
    uni.setStorageSync(CONFIG.key.token, result.token);

    if (result.isFirstBind) {
      // 首次绑定，显示成功提示
      success.value = true;
      loading.value = false;
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' });
      }, 2000);
    } else {
      // 已绑定，直接跳转
      uni.reLaunch({ url: '/pages/index/index' });
    }
  } catch (e: any) {
    console.error('绑定失败', e);
    error.value = e.message || '绑定失败，请重试';
    loading.value = false;
  }
};

const handleRetry = () => {
  handleBind();
};
</script>

<style lang="less" scoped>
.bind-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 40rpx;
  box-sizing: border-box;
}

.loading,
.success,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.loading-text {
  font-size: 32rpx;
  color: #666;
}

.icon {
  font-size: 120rpx;
  line-height: 1;
  margin-bottom: 40rpx;
}

.success .icon {
  color: #52c41a;
}

.error .icon {
  color: #f5222d;
}

.message {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 60rpx;
}

.retry-btn {
  width: 300rpx;
  margin-top: 20rpx;
}
</style>
