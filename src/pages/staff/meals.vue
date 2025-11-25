<template>
  <scroll-view class="scroll-view-container" scroll-x="true" :scroll-left="scrollLeft" scroll-with-animation="true">
    <view class="meals-grid">
      <view v-for="meal in meals" :id="'meal-' + meal.id" :key="meal.id" class="meal-wrapper">
        <meal-card :meal="meal" />
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import MealCard from './mealCard.vue';

const meals = ref([
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

const scrollLeft = ref(0);

const getMealTime = (timeStr: string) => {
  const now = new Date();
  const [hour, minute] = timeStr.split(':').map(Number);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
};

onMounted(() => {
  const now = new Date();
  let nextMealIndex = 0;

  for (let i = 0; i < meals.value.length; i++) {
    const meal = meals.value[i];
    const [startTimeStr] = meal.time.split(' - ');
    const mealStartTime = getMealTime(startTimeStr);
    if (now < mealStartTime) {
      nextMealIndex = i;
      break;
    }
    nextMealIndex = i;
  }
  
  // Each card is 500rpx wide, with a 40rpx gap. Total width is 540rpx.
  const cardTotalWidth = 540;
  
  // Convert rpx to px for scroll-left property
  const screenWidth = uni.getSystemInfoSync().screenWidth;
  const rpx2px = screenWidth / 750;
  
  const targetScrollLeft = nextMealIndex * cardTotalWidth * rpx2px;

  nextTick(() => {
    scrollLeft.value = targetScrollLeft;
  });
});

</script>

<style lang="less" scoped>
.meals {
  margin: 10rpx 0;
}
.scroll-view-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  /* Hide scrollbar for a cleaner look */
  &::-webkit-scrollbar {
    display: none;
  }
}

.meals-grid {
  display: inline-grid; /* Use inline-grid to work inside scroll-view */
  grid-auto-flow: column;
  grid-auto-columns: 500rpx; /* Set each card's width */
  gap: 40rpx; /* Set space between cards */
  /* Add small padding on both sides */
  padding: 0 5rpx;
  height: 100%;
  box-sizing: border-box;
}

.meal-wrapper {
  /* Grid handles the layout, so no special styles needed here */
  /* Adding height to ensure wrapper fills the grid cell */
  height: 100%;
}

.meals {
  margin: 10rpx 0;
}

</style>
