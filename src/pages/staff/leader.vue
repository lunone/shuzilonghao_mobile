<template>
    <div class="main-container">
        <div class="section overview">
            <StatVue class="day" :range="`day`" />
            <StatVue class="year" />
        </div>
        <zl-shortcut class="shortcut" :links="links" />
        <div class="section income">
            <IncomeVue />
        </div>

        <div class="section asset">
            <AircraftVue class="aircraft" />
            <HrVue class="hr" />
        </div>

        <todayFlightVue class="section flight" />
        <PlanVue class="section plan" />
        <dividerVue class="more">其他值得放在首页的项</dividerVue>
    </div>
</template>
<script lang="ts" setup>
import StatVue from './stat.vue';
import todayFlightVue from './today.vue';
import HrVue from './hr.vue';
import AircraftVue from './aircraft.vue';
import PlanVue from './plan.vue';
import dividerVue from '@/components/zl/divider.vue';
import IncomeVue from './income.vue';
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

    &>.shortcut {
        background-color: transparent;
        border-radius: 0;
        box-shadow: 0;
        padding: @padding-mini 0
    }

    &>.income {}

    &>.asset {
        .row;
        flex-wrap: wrap;

        .aircraft,
        .hr {
            width: 50%;
        }
    }


    &>.more {
        box-shadow: none;
        background-color: transparent;
    }
}
</style>