<template>
    <div class="main-container">
        <!-- #ifdef H5 || MP-WEIXIN -->
        <button v-if="isDev" @click="goToQrTest">手动扫码(dev)</button>
        <!-- #endif -->
        <!-- 使用 v-if 和 hasPermission 控制显示 -->
        <div v-if="userStore.hasPermission('page:stat:comp')" class="section overview">
            <StatVue class="day" :range="`day`" />
            <StatVue class="year" />
        </div>

        <!-- <zl-shortcut class="shortcut" :links="links" /> -->
        
        <div v-if="userStore.hasPermission('page:duty:list')" class="section duty">
            <Duty />
        </div>
        <Meals class="meals" />

        <Flight />
    </div>
    <!-- 引入 custom-tab-bar 组件 -->
    <CustomTabBar />
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/store/user.store'
import StatVue from '@/pages/staff/stat.vue';
import Duty from '@/pages/staff/duty.vue';
import Meals from '@/pages/staff/meals.vue';

import Flight from '@/pages/flight/flight.vue';
// 引入 custom-tab-bar 组件
import CustomTabBar from '@/components/zl/tabbar.vue';
// 使用 userStore
const userStore = useUserStore()
const isDev = computed(() => process.env.NODE_ENV === 'development');

const goToQrTest = () => {
    uni.navigateTo({
        url: '/pages/public/qr_test'
    });
};
const links = [
    [
        { size: 12, link: '/pages/analysis/analysis', class: 'analysis', text: '运行分析' },
        { size: 6, link: '/pages/airplane/airplane', class: 'airplane', text: '机队' },
        { size: 6, link: '/pages/sale/sale', class: 'sale', text: '销售', error: '敬请期待' },
        { size: 6, link: '/pages/hr/Hr', class: 'person', text: '人员', error: '敬请期待' },
    ],
    [
        { size: 8, link: '/pages/sms/sms', class: 'sms', text: '安全' },
        { size: 8, link: '/pages/pilot/pilot', class: 'pilot', text: '飞行' },
        { size: 8, link: '/pages/maintenance/maintenance', class: 'maintenance', text: '维修', error: '敬请期待' },
    ],
];
// 输出当前用户权限信息到控制台
onMounted(async () => {
    // 等待用户信息加载完
    await userStore.fetchMe()
})
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.main-container {
    background-color: #f3f3f3;
    display: flex;
    flex-direction: column;
    padding-bottom: 120rpx; // 为tabbar留出空间

    &>.section {
        padding: @padding-page;
        border-radius: @radius-base;
        background-color: @color-block;
        margin: 5px @margin-page;
        box-sizing: border-box;
        box-shadow: @shadow-base;
    }

    &>.overview {
        border-radius: @radius-base;
        margin: 0 @margin-page;
        background: linear-gradient(to bottom right, @color-primary, @color-secondary);

        .day {
            position: relative;
            padding-bottom: 10px;
            margin-bottom: 10px;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 10%;
                right: 10%;
                height: 2px;
                background-color: #f55b5b;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
            }
        }

        .year {
            margin-top: 2px;
        }
    }

    &>.duty {}
}
</style>