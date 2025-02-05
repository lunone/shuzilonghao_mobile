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

    <div class="section asset">
      <AircraftVue class="aircraft" />
      <HrVue class="hr" />
    </div>

    <FlightVue class="section flight" />
    <PlanVue class="section plan" />


    <dividerVue class="more">其他值得放在首页的项</dividerVue>


  </div>
</template>

<script lang="ts" setup>
import StatVue from '@/pages/index/stat.vue';
import ShortcutVue from '@/pages/index/shortcut.vue';
import FlightVue from '@/pages/index/flight.vue';
import HrVue from '@/pages/index/hr.vue';
import AircraftVue from '@/pages/index/aircraft.vue';
import PlanVue from '@/pages/index/plan.vue';
import dividerVue from '@/components/zl/divider.vue';
import { onMounted, ref } from 'vue';

onMounted(() => {
  // 获取code
  // uni.login({
  //   provider: 'weixin',
  //   success: res => {
  //     console.log('通过uni方法登录微信by', res.code);
  //   }
  // });

});
</script>


<style lang="less" scoped>
@import "@/css/base.less";

.main-container {
  background-color: #f3f3f3;
  display: flex;
  flex-direction: column;

  &>.section {
    padding: @padding-page;
    border-radius: @radius-base;
    background-color: @color-block;
    margin: @margin-page @margin-page;
    border-top-left-radius: @radius-sm;
    border-top-right-radius: @radius-sm;
    box-sizing: border-box;
    box-shadow: @shadow-base;
  }

  &>.overview {
    background-color: #f9f9f9;
    border-radius: @radius-base;
    margin: 0 @margin-page;
    // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* 添加渐变背景 */
    // background: linear-gradient(to bottom right, #c52005, #fa5430);
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
        /* 更浅的颜色 */
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        /* 更浅的内阴影 */
      }
    }

    .year {
      margin-top: 2px;
    }
  }

  &>.shortcut {
    background-color: transparent;
    border-radius: 0;
    box-shadow: 0;
    padding: @padding-mini 0
  }

  &>.asset {
    .row;
    flex-wrap: wrap;

    .aircraft,
    .hr {
      width: 50%;
    }
  }

  &>.plan {}

  &>.more {
    box-shadow: none;
    background-color: transparent;
  }
}
</style>