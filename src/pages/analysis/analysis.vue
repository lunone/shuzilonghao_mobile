<template>
    <div>

        <navigator class="item" hover-class="navigator-hover" url="/pages/analysis/year">
            <i :class="` zl-icon-j5`" />
            <view class="text"> 年度分析 </view>
        </navigator>

        <navigator class="item" hover-class="navigator-hover" url="/pages/analysis/overview">
            <i :class="` zl-icon-j5`" />
            <view class="text"> 趋势分析 </view>
        </navigator>
        <navigator class="item" hover-class="navigator-hover" url="/pages/analysis/airlines">
            <i :class="` zl-icon-j5`" />
            <view class="text"> 站点分析 </view>
        </navigator>


    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue';
import CONFIG from '@/config';
import Profile from '../hr/profile.vue';

</script>

<style lang="less" scoped>
/* 添加样式 */
@import "@/css/base.less";
</style>