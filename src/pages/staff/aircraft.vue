<template>
    <view class="flight-wrapper">
        <view class="total">
            <i class="icon zl-icon-aircraft" />
            <view class="text">
                {{Object.values(stat).reduce((acc, cur) => acc + cur, 0)}} 架
            </view>
        </view>
        <view class="detail">
            <view class="section" v-for="number, acTypeLong in stat" :key="acTypeLong">
                <text class="title">{{ acTypeLong }} </text>
                <text class="value">{{ number }}</text>
                <text class="unit">架</text>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import usebasisStore from '@/store/basis.store';

import { AircraftItem } from '@/interface';
import dayjs from 'dayjs';

const store = usebasisStore();
// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');
// 定义机队数据
const aircrafts = ref<AircraftItem[]>([]);

const stat = computed(() => {// todo:页面变更飞机变0
    const today = dayjs().startOf('day');
    const stat: Record<string, number> = {}

    for (let aircraft of aircrafts.value) {
        const startDate = dayjs(aircraft.startDate || -1).startOf('day');
        const endDate = dayjs(aircraft.endDate).startOf('day');
        if (!aircraft.endDate || (startDate.isBefore(today) && endDate.isAfter(today))) {
            if (aircraft.regId.length < 6) {
                // 统计在役飞机,738前面俩字符
                // const acType = aircraft.acType.slice(0, 3);
                // console.log(aircraft.acTypeLong, aircraft.acReg,aircraft.acType);
                const acTypeLong = aircraft.acTypeLong;
                stat[acTypeLong] = stat[acTypeLong] || 0;
                stat[acTypeLong]++;
            }
        }
    }
    return stat;
})

// 从store获取信息
const fetchAircrafts = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await store.getAircrafts();
        // console.log('res---', res);
        aircrafts.value = Object.values(res);
    } catch (err) {
        error.value = '获取飞机信息失败';
    } finally {
        loading.value = false;
    }
};
// 初始化时获取数据
onMounted(() => {
    fetchAircrafts();
    // fetchMels();
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