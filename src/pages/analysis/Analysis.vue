<template>
    <div>

        <navigator class="item" hover-class="navigator-hover" url="/pages/analysis/year">
            <i class="icon zl-icon" :class="`zl-icon-j5`" />
            <view class="text"> 年度分析 </view>
        </navigator>

        <navigator class="item" hover-class="navigator-hover" url="/pages/analysis/airlines">
            <i class="icon zl-icon" :class="`zl-icon-j5`" />
            <view class="text"> 站点分析 </view>
        </navigator>
        <navigator class="item" hover-class="navigator-hover" url="/pages/analysis/airplane">
            <i class="icon zl-icon" :class="`zl-icon-j5`" />
            <view class="text"> 飞机分析 </view>
        </navigator>

        <Profile :userId="`A00725`"   />


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