<template>
    <div class="flight-wrapper">
        <div class="total">
            <i class="icon zl-icon-aircraft" />
            <div class="text">
                {{Object.values(stat).reduce((acc, cur) => acc + cur, 0)}} 架
            </div>
        </div>
        <div class="detail">
            <div class="section" v-for="number, acTypeLong in stat" :key="acTypeLong">
                <text class="title">{{ acTypeLong }} </text>
                <text class="value">{{ number }}</text>
                <text class="unit">架</text>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import useBasisStore from '@/store/basis.store';
import dayjs from 'dayjs';

const store = useBasisStore();

const stat = computed(() => {// todo:页面变更飞机变0
    const today = dayjs().startOf('day');
    const stat: Record<string, number> = {}
    if (!store.aircraftsArr.length) return stat;
    for (let aircraft of store.aircraftsArr) {
        const startDate = dayjs(aircraft.startDate || -1).startOf('day');
        const endDate = dayjs(aircraft.endDate).startOf('day');
        if (!aircraft.endDate || (startDate.isBefore(today) && endDate.isAfter(today))) {
            if (aircraft.regId.length < 6) {
                const acTypeLong = aircraft.acTypeLong;
                stat[acTypeLong] = stat[acTypeLong] || 0;
                stat[acTypeLong]++;
            }
        }
    }
    return stat;
})

onMounted(() => {
    store.getAircrafts();
});

</script>
<style lang="less" scoped>
@import "@/css/base.less";

.flight-wrapper {
    display: flex;
    align-items: stretch;
    background: #fff;


    .total {
        flex: 0 0 35%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-right: 2px;

        .icon {
            color: @color-staff-hr-text;
            font-size: 34px;
            margin-bottom: 2px;
        }

        .text {
            color: @color-staff-hr-text;
            font-size: .9rem;
            margin-top: -5px;
            white-space: nowrap;
        }
    }

    .detail {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 2px;

        .section {
            display: flex;
            align-items: center;
            padding: 0 4px;
            margin: 0;
            border-bottom: dashed 1px @color-staff-hr-border;

            &:last-child {
                border-bottom: 0;
            }

            .title {
                color: @color-staff-hr-text;
                font-size: 0.95rem;
                white-space: nowrap;
                // min-width: 2em; // 保证至少显示2个汉字
            }

            .value {
                flex: 1;
                color: @color-staff-hr-value;
                font-weight: bold;
                text-align: center;
            }

            .unit {
                color: @color-staff-hr-unit;
                font-size: 0.85rem;
            }
        }
    }
}
</style>