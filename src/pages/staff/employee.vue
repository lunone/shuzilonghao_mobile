<template>
    <div class="main-container">

        <div class="section overview">
            <StatVue class="day" :range="`day`" />
            <StatVue class="year" />
        </div>
        <!-- <DutyAct /> -->
        <div class="section duty">
            <Duty />
        </div>
        <div class="section ">
            <Flight />
        </div>
    </div>
</template>

<script lang="ts" setup>

import StatVue from './stat.vue';
import Duty from '../staff/duty.vue';
import Flight from '../flight/flight.vue';
import DutyAct from '@/pages/guanli/dutyAct.vue'

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
        margin: 5px @margin-page;
        box-sizing: border-box;
        box-shadow: @shadow-base;
    }

    &>.overview {
        // background-color: #f9f9f9;
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
    &>.duty{

    }
}
</style>