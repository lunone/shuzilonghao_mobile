<template>
  <view class="link-component" @click="navigate">
    <text v-if="!isLink">{{ value }}</text>
    <text v-else class="link-text">{{ value }}</text>
  </view>
</template>

<script>
export default {
  name: 'UniversalLink',
  props: {
    // 是否可跳转
    isLink: {
      type: Boolean,
      default: false
    },
    // 要显示的值
    value: {
      type: String,
      required: true
    },
    // 数据类型: airplane, flight, airport
    type: {
      type: String,
      required: true
    },
    // 数据对象的ID，用于跳转
    itemId: {
      type: [String, Number],
      required: false
    }
  },
  methods: {
    navigate() {
      if (!this.isLink) return;
      
      // 根据类型跳转到不同的详情页
      const routeMap = {
        airplane: '/pages/airplane/airplaneDetail',
        flight: '/pages/flight/flightDetail',
        airport: '/pages/airport/airportDetail'
      };

      const route = routeMap[this.type];
      if (!route) {
        console.warn(`未知的链接类型: ${this.type}`);
        return;
      }

      // 构建跳转参数
      const params = this.itemId ? { id: this.itemId } : {};
      
      // 执行跳转
      uni.navigateTo({
        url: `${route}?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`
      });
    }
  }
}
</script>

<style scoped>
.link-text {
  color: #007aff;
}
</style>