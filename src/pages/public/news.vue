<template>
    <!-- 公告新闻 -->
    <view class="news-list">
        <view v-for="(news, i) in newsList" :key="i" class="news-item" @click="handleNewsClick(news)">
            <text class="news-title">{{ news.title }}</text>
            <text class="news-date">{{ news.date }}</text>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const newsList = ref([
    { title: '公司荣获2023年度最佳航空公司', date: '2023-12-15' },
    { title: '新航线开通：北京-新加坡直飞', date: '2023-11-20' },
    { title: '夏季特惠机票限时抢购', date: '2023-10-05' }
])
const handleNewsClick = (news: any) => {
    // 处理新闻点击
    console.log('点击新闻:', news.title)
}
</script>
<style lang="less" scoped>
.news-list {
    .news-item {
        padding: 20rpx 0;
        border-bottom: 1rpx solid #eee;

        .news-title {
            font-size: 28rpx;
            color: #333;
        }

        .news-date {
            font-size: 24rpx;
            color: #999;
            margin-top: 10rpx;
            display: block;
        }
    }
}
</style>