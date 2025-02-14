<template>
    <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
        这部分数据需要接入 航投人力资源系统,
        <br>该功能为实现，仅为展示
    </van-notice-bar>
    如果是行政人员:<b>行政班</b><br>

    如果是维修人员，显示倒班日期:
    <van-calendar :first-day-of-week="1" title="日历" :row-height="25" :poppable="false" :show-confirm="false"
        :show-mark="true" :show-title="false" :show-subtitle="false" :min-date="dateRange[0]" :max-date="dateRange[1]">
        <template #text="{ date, text, type, topInfo, bottomInfo, className }">
            <view class="day">
                <view class="mark" v-if="Math.random() > 0.7">
                    <i class="icon zl-icon-j5duty" />
                </view>
                <view v-else class="">{{ text }}</view>
            </view>
        </template>
    </van-calendar :first-day-of-week="1">
    如果是飞行员，显示航班日期:
    <van-calendar :first-day-of-week="1" title="日历" :row-height="25" :poppable="false" :show-confirm="false"
        :show-mark="true" :show-title="false" :show-subtitle="false" :min-date="dateRange[0]" :max-date="dateRange[1]">
        <template #text="{ date, text, type, topInfo, bottomInfo, className }">
            <view class="day">
                <view class="mark" v-if="Math.random() > 0.7">
                    <i class="icon zl-icon-dep" />
                </view>
                <view v-else class="">{{ text }}</view>
            </view>
        </template>
    </van-calendar :first-day-of-week="1">
</template>
<script setup lang="ts">
import { ref } from 'vue';


const dateRange = ref([new Date(2024, 11, 1), new Date(2024, 11, 30)]);
</script>