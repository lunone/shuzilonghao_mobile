<template>
  <view class="qr-test-container">
    <view class="tip">
      <text>点击下方按钮，手动调用扫码功能，用于测试开发环境下的扫码登录流程。</text>
    </view>
    <button @click="handleScanCode">手动扫码</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const handleScanCode = () => {
  uni.scanCode({
    onlyFromCamera: true,
    success: (res) => {
      console.log('扫码成功：', res);
      // 微信小程序码, res.path 是解码后的地址, e.g., pages/auth/scan?scene=xxx
      // 普通二维码, res.result 是二维码内容, e.g., https://example.com?scene=xxx
      const scanResult = res.path || res.result;
      let ticketId = null;

      if (scanResult) {
        const sceneReg = /[?&]scene=([^&]+)/;
        const match = scanResult.match(sceneReg);
        if (match) {
          ticketId = match;
        }
      }

      if (ticketId) {
        uni.navigateTo({
          url: `/pages/auth/scan?scene=${encodeURIComponent(ticketId)}`,
        });
      } else {
        console.error('二维码内容解析失败: 未找到scene参数');
        uni.showToast({
          title: '无效的二维码',
          icon: 'none',
        });
      }
    },
    fail: (err) => {
      console.error('扫码失败：', err);
      uni.showToast({
        title: '扫码失败',
        icon: 'none',
      });
    },
  });
};
</script>

<style lang="less" scoped>
.qr-test-container {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.tip {
  color: #666;
  font-size: 28rpx;
  margin-bottom: 60rpx;
  text-align: center;
}
</style>