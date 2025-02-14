<template>
    <van-divider>薪酬数据</van-divider>
    普通员工显示薪点，
    <view class="salary">{{ }}</view>

    <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
        这部分数据在系统有简单信息，不知道是否能与线下完全对得上
    </van-notice-bar>
    <view class="level-title">级别:副驾F3</view>

    <van-divider>飞行员额外显示</van-divider>
    <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
        这部分数据在 财务 未上网
    </van-notice-bar>
    <view class="level">
        <view class="level-details">
            <view class="level-item">打包费：{{ }}</view>
            <view class="level-item">转会费：{{ }}</view>
            <view class="level-item">安家费：{{ a }}</view>
        </view>
    </view>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
const a = 1;
</script>