<template>
  <div class="main-container">
    <div class="placeholder">
      <div class="placeholder-icon">🏢</div>
      <div class="placeholder-text">办公功能</div>
      <div class="placeholder-desc">此功能正在开发中，敬请期待</div>
    </div>
  </div>
  <!-- 引入 custom-tab-bar 组件 -->
  <CustomTabBar />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user.store'
// 引入 custom-tab-bar 组件
import CustomTabBar from '@/custom-tab-bar/index.vue';

// 使用 userStore
const userStore = useUserStore()

// 输出当前用户权限信息到控制台
onMounted(async () => {
  // 等待用户信息加载完
  await userStore.fetchMe()
})
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.main-container {
  background-color: #f3f3f3;
  display: flex;
  flex-direction: column;
  padding-bottom: 120rpx; // 为tabbar留出空间
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: @padding-page;
  text-align: center;

  .placeholder-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }

  .placeholder-text {
    font-size: 36rpx;
    font-weight: bold;
    color: @color-text;
    margin-bottom: 20rpx;
  }

  .placeholder-desc {
    font-size: 28rpx;
    color: #999;
  }
}
</style>