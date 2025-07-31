<template>
    <view class="public-container">
        <!-- <Swiper /> -->

        <!-- 快捷按钮 -->
        <!-- <view class="quick-actions">
            <view v-for="(action, idx) in actions" :key="idx" class="action-item" @click="handleAction(action)">
                {{ action.name }}
            </view>
        </view> -->
        <!-- <zl-shortcut :links="links" class="links" /> -->
        <!-- <News /> -->
        <DutyAct />
        <!-- <test /> -->
        <!-- 保留原有注释代码 -->
        <!-- <div class="public-wrapper">
        <lhaVue />
    </div> -->
    </view>
</template>

<script lang="ts" setup>
import lhaVue from './lha.vue'
import { ref } from 'vue'
import Swiper from './swiper.vue'
import News from './news.vue'
import Duty from '../staff/duty.vue'
import DutyAct from '@/pages/guanli/dutyAct.vue'

const links = ref([
    { size: 6, class: 'location', text: '公司介绍', link: 'public/about', },
    { size: 6, class: 'location', text: '产品案例', link: 'public/product' },
    { size: 6, class: 'location', text: '服务中心', link: 'public/service/service' },
    { size: 6, class: 'location', text: '运价计算器', link: '' },
    { size: 6, class: 'location', text: '航班查询', link: '' },
    { size: 6, class: 'location', text: '招标公告', link: 'public/bid' },
    { size: 6, class: 'location', text: '人才招聘', link: '' }
])



const handleAction = (action: any) => {
    const url = action?.link.trim() || ''
    // 新增跳转逻辑
    if (url !== '') {
        uni.navigateTo({ url })
    } else {
        console.warn(`"${action.name}"的跳转链接为空`)
    }
}

</script>

<style lang="less" scoped>
@import "@/css/base.less";

.public-container {
    padding: 20rpx;
}

.links {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 4px;
}

.quick-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 30rpx;

    .action-item {
        width: 30%;
        height: 100rpx;
        background-color: #f5f5f5;
        border-radius: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20rpx;
        font-size: 28rpx;
    }
}
</style>
