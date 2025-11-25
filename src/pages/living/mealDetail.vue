<template>
  <view class="meal-detail-container">
    <template v-if="meal">
      <image class="meal-image" :src="meal.details.image" mode="aspectFill"></image>
      <view class="content-card">
        <view class="title">{{ meal.title }}</view>
        <view class="time">{{ meal.time }}</view>
        <view class="divider"></view>
        <view class="section-title">菜品介绍</view>
        <view class="content">{{ meal.details.content }}</view>
        <view class="section-title">今日菜谱</view>
        <view class="menu-list">
          <view v-for="(item, index) in meal.menus" :key="index" class="menu-item">{{ item }}</view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="loading">加载中...</view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// Mock data, in a real app this would be fetched from a store or API
const allMeals = ref([
    {
    id: 'breakfast',
    title: '早餐',
    time: '07:00 - 09:00',
    menus: ['豆浆', '油条', '鸡蛋', '咸菜'],
    details: {
      image: 'https://img.js.design/assets/img/64b65a3899e99745a999a5e3.png',
      content: '早餐提供丰富的选择，包括热豆浆、香脆油条、煮鸡蛋和多种开胃咸菜，为您开启充满活力的一天。'
    }
  },
  {
    id: 'lunch',
    title: '午餐',
    time: '11:30 - 13:30',
    menus: ['红烧肉', '番茄炒蛋', '清炒时蔬', '米饭'],
    details: {
      image: 'https://img.js.design/assets/img/61aa55504bab34767e4915d3.png',
      content: '午餐菜品丰富，主打红烧肉肥而不腻，搭配酸甜可口的番茄炒蛋和清淡的炒时蔬，营养均衡。'
    }
  },
  {
    id: 'dinner',
    title: '晚餐',
    time: '17:30 - 19:30',
    menus: ['清蒸鱼', '麻婆豆腐', '凉拌黄瓜', '紫菜汤'],
    details: {
      image: 'https://img.js.design/assets/img/61a495378bab34767e14e913.png',
      content: '晚餐注重清淡与口味的结合，有鲜美的清蒸鱼，开胃的麻婆豆腐，爽口的凉拌黄瓜，以及一碗热腾腾的紫菜汤。'
    }
  },
  {
    id: 'supper',
    title: '夜宵',
    time: '21:00 - 23:00',
    menus: ['小馄饨', '炒面', '烧烤'],
     details: {
      image: 'https://img.js.design/assets/img/6232b4b482912646a85539f3.png',
      content: '夜宵提供温暖的小馄饨、香喷喷的炒面和各种烧烤，满足您深夜的味蕾。'
    }
  }
]);

const meal = ref(null);

onLoad((options) => {
  if (options.id) {
    const foundMeal = allMeals.value.find(m => m.id === options.id);
    meal.value = foundMeal;
    if (foundMeal) {
        uni.setNavigationBarTitle({
            title: foundMeal.title
        });
    }
  }
});

</script>

<style lang="less" scoped>
.meal-detail-container {
  .meal-image {
    width: 100%;
    height: 400rpx;
  }
  .content-card {
    padding: 30rpx;
    background-color: #fff;
    border-radius: 30rpx 30rpx 0 0;
    margin-top: -30rpx;
    position: relative;

    .title {
      font-size: 40rpx;
      font-weight: bold;
    }
    .time {
      font-size: 28rpx;
      color: #999;
      margin-top: 10rpx;
    }
    .divider {
      height: 1rpx;
      background-color: #eee;
      margin: 30rpx 0;
    }
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    .content {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 40rpx;
    }
    .menu-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      .menu-item {
        background-color: #f5f5f5;
        padding: 10rpx 20rpx;
        border-radius: 8rpx;
        font-size: 26rpx;
        color: #555;
      }
    }
  }
  .loading {
    text-align: center;
    padding: 50rpx;
    color: #999;
  }
}
</style>
