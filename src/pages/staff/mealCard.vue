<template>
  <view class="meal-card" @click="goToDetail">
    <view class="header">
      <view class="title">{{ meal.title }}</view>
      <view class="time">{{ meal.time }}</view>
    </view>
    <view class="menu"> {{ menuText }} </view>
  </view>
</template>

<script setup lang="ts">
import { computed,  } from 'vue';

const props = defineProps({
  meal: {
    type: Object,
    required: true,
  },
});

const menuText = computed(() => props.meal.menus.join(' · '));

const goToDetail = () => {
  uni.navigateTo({
    url: `/pages/living/mealDetail?id=${props.meal.id}`,
  });
};
</script>

<style lang="less" scoped>
.meal-card {
  display: inline-block;
  width: 500rpx; /* Approximately 2/3 of the screen width */
  height: 230rpx;
  margin: 0 20rpx;
  padding: 25rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  vertical-align: top;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .title {
    font-size: 26rpx;
    font-weight: normal;
    color: #888;
  }

  .time {
    font-size: 22rpx;
    color: #aaa;
  }

  .menu {
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Limit to 3 lines */
    -webkit-box-orient: vertical;
    white-space: normal;
  }
}
</style>
