<template>
    <div class="performance">
        <div class="title">考核信息</div>
        <div class="item">
            <div class="date">2024年3季度</div>
            <div class="score">C</div>
        </div>
        <div class="item">
            <div class="date">2024年2季度</div>
            <div class="score">C</div>
        </div>
        <div class="item">
            <div class="date">2024年1季度</div>
            <div class="score">C</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
</script>
<style lang="less" scoped>
@import "@/css/base.less";

.performance {
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    overflow-y: auto;

    .title {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
        text-align: center;
    }

    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10rpx;
        border-bottom: 1rpx solid #f0f0f0;

        &:last-child {
            border-bottom: none;
        }

        .date {
            font-size: 28rpx;
            color: #666;
            text-align: left;
        }

        .score {
            font-size: 32rpx;
            font-weight: bold;
            color: #ff9900; // 醒目的橙色
            text-align: right;
        }
    }
}
</style>