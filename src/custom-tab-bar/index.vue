<template>
  <view class="tab-bar">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="tab-bar-item"
      :class="{ active: current === index }"
      @click="switchTab(item, index)"
    >
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const current = ref(0)
const list = ref([
  {
    pagePath: "pages/staff/home",
    text: "主页"
  },
  {
    pagePath: "pages/staff/workspace",
    text: "工作台"
  },
  {
    pagePath: "pages/staff/office",
    text: "办公"
  },
  {
    pagePath: "pages/staff/profile",
    text: "我"
  }
])

const switchTab = (item: any, index: number) => {
  current.value = index
  uni.switchTab({
    url: `/${item.pagePath}`
  })
}

const setCurrent = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const route = currentPage.route
  
  const currentIndex = list.value.findIndex(item => item.pagePath === route)
  if (currentIndex !== -1) {
    current.value = currentIndex
  }
}

onMounted(() => {
  setCurrent()
})
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #ffffff;
  display: flex;
  border-top: 1rpx solid #e5e5e5;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10rpx 0;
}

.tab-text {
  font-size: 28rpx;
  color: #7A7E83;
  font-weight: 500;
}

.tab-bar-item.active .tab-text {
  color: #3cc51f;
  font-weight: bold;
}
</style>