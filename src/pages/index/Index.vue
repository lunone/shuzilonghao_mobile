<template>
    <div class="main-container">
        <!-- <header class="section header"> -->
        <!-- <div class="logo"> -->
        <!-- <van-notice-bar left-icon="volume-o" text="点击第二行的按钮可进入各子模块。" /> -->

        <!-- </div> -->
        <!-- <div class="user"> 
                <VanIcon name="user" />
            </div> -->
        <!-- </header> -->
        <div class="section overview">
            <StatVue class="day" :range="`day`" />
            <StatVue class="year" />
        </div>
        <ShortcutVue class="shortcut" />
        <!--      <van-skeleton>
            <template #template> 
                <div :style="{ display: 'flex', width: '100%' }">
                    <van-skeleton-image />
                    <div :style="{ flex: 1, marginLeft: '16px' }">
                        <div style="color: #999;">商务系统上线后，这里放收入分析</div>
                        <van-skeleton-paragraph row-width="60%" />
                        <van-skeleton-paragraph />
                    </div>
                </div>
            </template>
</van-skeleton> -->
        <div class="section asset">
            <AircraftVue class="aircraft" />
            <HrVue class="hr" />
        </div>

        <FlightVue class="section flight" />
        <PlanVue class="section plan" />


        <dividerVue class="more">其他值得放在首页的项</dividerVue>


        <!-- <button @click="open">打开弹窗</button> -->
        <!-- <uni-popup ref="popup" type="bottom">底部弹出 Popup 自定义圆角</uni-popup> -->
     

    </div>
</template>

<script lang="ts" setup>
import StatVue from '@/pages/index/stat.vue';
import ShortcutVue from '@/pages/index/shortcut.vue';
import FlightVue from '@/pages/index/flight.vue';
import HrVue from '@/pages/index/hr.vue';
import AircraftVue from '@/pages/index/aircraft.vue';
import PlanVue from '@/pages/index/plan.vue';
import dividerVue from '@/components/divider.vue';
// import ucharts from '@/components/ucharts/ucharts.vue';

import { useStore } from '@/store';
import { User } from '@/interface';
import { onMounted, ref } from 'vue';
// const searchText = ref('');
// const store = useStore();


onMounted(() => {
    // 获取code
    uni.login({
        provider: 'weixin',
        success: res => {
            console.log('通过uni方法登录微信by', res.code);
        }
    });

});
</script>


<style lang="less" scoped>
@import "@/base.less";

.main-container {
    background-color: #f3f3f3;
    display: flex;
    flex-direction: column;

    &>.section {
        padding: 10px;
        border-radius: 8px;
        background-color: #fff;
        margin: 4px 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        box-sizing: border-box;
    }

    .header {
        background-color: #fafafa;
        // padding: 10px;
        display: flex;
        justify-content: center;
        border: 0;
        // margin: 0 0 8px 0;
        // border-bottom: #c52005 solid 2px;
        box-shadow: none;

        .logo {
            flex: 1;
        }

        .user {
            color: #969799;
            font-size: 2rem;
        }
    }

    .overview {
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 8px;
        margin: 4px 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        /* 添加渐变背景 */
        // background: linear-gradient(to bottom right, #c52005, #fa5430);
        background: linear-gradient(to bottom right, #c52005, #f87557);

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
                background-color: #e0e0e0;
                /* 更浅的颜色 */
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
                /* 更浅的内阴影 */
            }
        }

        .year {
            margin-top: 2px;
        }
    }

    .shortcut {
        background-color: transparent;
        border-radius: 0;
        box-shadow: 0 0 0;
        padding: 2px 0
    }

    .asset {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;

        // gap: 10px;
        .aircraft,
        .hr {
            width: 50%;
        }
    }

    .more {
        .shadow-none;
        background-color: transparent;
    }
}
</style>