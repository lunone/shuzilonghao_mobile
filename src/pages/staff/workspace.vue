<template>
  <div class="main-container">
    <div v-if="userStore.hasPermission('page:flight:list')" class="section">
      <Flight />
    </div>
  </div>
  <!-- 引入 custom-tab-bar 组件 -->
  <CustomTabBar />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user.store'
import Flight from '@/pages/flight/flight.vue';
// 引入 custom-tab-bar 组件
import CustomTabBar from '@/components/zl/tabbar.vue';

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

  &>.section {
    padding: @padding-page;
    border-radius: @radius-base;
    background-color: @color-block;
    margin: 5px @margin-page;
    box-sizing: border-box;
    box-shadow: @shadow-base;
  }
}
</style>