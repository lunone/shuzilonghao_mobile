<template>
    <div class="analysis-wrapper">
        <!-- <div class="item history"> -->
        <div class="item" v-for="item in data" :key="item.link">
            <i :class="`icon zl-icon-${item.class}`" />
            <navigator :url="item.link" class="link">
                <view class="text"> {{ item.text }} </view>
            </navigator>
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue';
import CONFIG from '@/config';
import Profile from '../hr/profile.vue';
import { it } from 'node:test';
const data = ref([
    { link: '/pages/analysis/year', class: 'analysis', text: '历史概况' },
    { link: '/pages/analysis/overview', class: 'health', text: '趋势分析' },
    { link: '/pages/analysis/airlines', class: 'location', text: '航线分析' },
]);
</script>
<style lang="less" scoped>
/* 添加样式 */
@import "@/css/base.less";

.analysis-wrapper {
    .column;
    background-color: #fff;
    // height: 100vh;
    justify-content: flex-start;
    width: 100%;
    padding: 0 10px;

    .item {
        .row;
        background-color: antiquewhite;
        justify-content: start;
        box-sizing: border-box;
        border-radius: 16px;
        width: 100%;
        padding: 0 10px;
        height: 10vh;

        margin-bottom: 10px;

        &:first-child {
            margin-top: 10px;
        }

        .icon {
            margin-right: 10px;
            font-size: 2rem;
        }

        .link {
            font-size: 1.4rem;
        }
    }



}
</style>