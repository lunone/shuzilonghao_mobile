<template>
    <!-- 轮播图 -->
    <swiper class="swiper" circular :indicator-dots="swiperConfig.indicatorDots" :autoplay="swiperConfig.autoplay"
        :interval="swiperConfig.interval" :duration="swiperConfig.duration">
        <swiper-item v-for="item of items" :key="item.id">
            <div class="swiper-item ">
                <image :src="item.image" mode="aspectFill" />
                <text class="text">{{ item.text }}</text>
            </div>
        </swiper-item>
    </swiper>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const items = ref([
    { id: '001', text: '图片1', image: 'https://picsum.photos/200/300?random=1' },
    { id: '002', text: '图片2', image: 'https://picsum.photos/200/300?random=2' },
    { id: '003', text: '图片3', image: 'https://picsum.photos/200/300?random=3' }
])
const swiperConfig = ref({
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
})
</script>
<style lang="less" scoped>
.swiper {
    height: 300rpx;
    margin-bottom: 30rpx;

    .swiper-item {
        width: 100%;
        // background: red;
        height: 100%
    }

    image {
        width: 100%;
        height: 100%;
    }
}
</style>