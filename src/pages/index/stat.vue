<template>
    <view class="wrapper">
        <view class="lastyear">
            <view class="title"> {{ props.range == 'year' ? '去年' : '前日' }} </view>
            <view class="counter">
                <text class="value">{{ lastYear.counter }}</text>
                <text class="unit">班</text>
            </view>
            <view class="weight">
                <text class="value">{{ lastYear.weight }}</text>
                <text class="unit">吨</text>
            </view>
            <view class="hour">
                <text class="value">{{ lastYear.hours }}</text>
                <text class="unit">小时</text>
            </view>
        </view>
        <view class="thisyear">
            <text class="title"> {{ props.range == 'year' ? '今年' : '昨日' }} </text>
            <view class="counter">
                <text class="value">{{ thisYear.counter }}</text>
                <text class="unit">班</text>
            </view>
            <view class="weight">
                <text class="value">{{ thisYear.weight }}</text>
                <text class="unit">吨</text>
            </view>
            <view class="hour">
                <view class="value">{{ thisYear.hours }}</view>
                <view class="unit">小时</view>
            </view>
        </view>
        <view class="rate">
            <text class="title">变化 </text>
            <view class="counter">
                <text class="value">{{ rate.counter }}</text>
                <text class="unit">%</text>
            </view>
            <view class="weight">
                <text class="value">{{ rate.weight }}</text>
                <text class="unit">%</text>
            </view>
            <view class="hour">
                <text class="value">{{ rate.hour }}</text>
                <text class="unit">%</text> 
            </view>
 
        </view>
        <view class="remark" v-if="props.range == 'year'">
            <!-- <van-icon name="info" /> -->
			<i class="icon zl-icon-info" />
            今年:{{ dayjs(DateStr.firstDayOfYear).format('YYYY/M/D') }}-{{ dayjs(DateStr.now).format('YYYY/M/D') }},
            去年:{{ dayjs(DateStr.firstDayOfLastYear).format('YYYY/M/D') }}-{{
                dayjs(DateStr.dayBeforeOneYear).format('YYYY/M/D') }}
        </view>
    </view>
</template>

<script setup lang="ts">
import api from '@/utils/api';
import dayjs from 'dayjs';
import { computed, onMounted, PropType, reactive, Ref, ref } from 'vue';

type Stat = { counter: number, weight: number, hours: number };
const props = defineProps({
    text: { type: String, default: '获取' },
    range: { type: String as PropType<string>, default: 'year' },
})

const DateStr = {
    // day的
    today: dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    yesterday: dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    theDayBeforeYesterday: dayjs().subtract(2, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),

    // year的
    now: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    dayBeforeOneYear: dayjs().subtract(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
    firstDayOfYear: dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
    firstDayOfLastYear: dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD HH:mm:ss'),

}

const thisYearRes: Ref<Stat> = ref({ weight: 0, counter: 0, hours: 0 });
const lastYearRes: Ref<Stat> = ref({ weight: 0, counter: 0, hours: 0 });

const thisYear = computed(() => {
    const value = thisYearRes.value;
    return {
        counter: value?.counter ?? 0,
        weight: +((value?.weight ?? 0) / 1e3).toFixed(2) | 0,
        hours: +(value?.hours ?? 0).toFixed(2) | 0,
    }
});
const lastYear = computed(() => {
    const value = lastYearRes.value;
    // console.log(value, +((value?.weight ?? 0) / 1e3).toFixed(2) | 0);
    return {
        counter: value?.counter ?? 0,
        weight: +((value?.weight ?? 0) / 1e3).toFixed(2) | 0,
        hours: +(value?.hours ?? 0).toFixed(2) | 0,
    }
});


const rate = computed(() => {
    const newVal = thisYearRes.value, oldVal = lastYearRes.value;
    return {
        counter: oldVal.counter > 0
            ? ((newVal.counter - oldVal.counter) / oldVal.counter * 100).toFixed(1)
            : '--',
        weight: oldVal.weight
            ? ((newVal.weight - oldVal.weight) / oldVal.weight * 100).toFixed(1)
            : '--',
        hour: oldVal.hours
            ? ((newVal.hours - oldVal.hours) / oldVal.hours * 100).toFixed(1)
            : '--',
    }
})

// 先渲染一遍数据，挂载完成再获取资源，避免页面跳变。
onMounted(async () => {
    if (props.range == 'year') {
        thisYearRes.value = await api('/stat/period/', { startDate: DateStr.firstDayOfYear, endDate: DateStr.now }) as Stat;
        lastYearRes.value = await api('/stat/period/', { startDate: DateStr.firstDayOfLastYear, endDate: DateStr.dayBeforeOneYear }) as Stat;
    } else {
        thisYearRes.value = await api('/stat/period/', { startDate: DateStr.yesterday, endDate: DateStr.today }) as Stat;
        lastYearRes.value = await api('/stat/period/', { startDate: DateStr.theDayBeforeYesterday, endDate: DateStr.yesterday }) as Stat;
    }
});

</script>

<style lang="less" scoped>
/* 这里是样式部分，用于定义组件的样式 */
@import "@/base.less";
.wrapper {
    display: flex;
    flex-direction: column;

    .lastyear,
    .thisyear,
    .rate {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: #c2d1e2 1px dashed;
        padding: 2px 0;

        &:last-child {
            border: transparent 1px dashed;
        }

        .title {
            text-align: left;
            color: #ffffff;
            /* 使用白色文字以适应渐变背景 */
            flex: 1;
            align-items: center;
        }

        .counter,
        .weight,
        .hour {
            display: flex;
            justify-content: space-around;
            flex-direction: row;
            width: 28vw;
            text-align: center;

            .value {
                flex: 1;
                display: block;
                text-align: right;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                color: #ffffff;
                /* 使用白色文字以适应渐变背景 */
            }

            .unit {
                font-size: 0.8rem;
                color: #aaa;
                /* 使用白色文字以适应渐变背景 */
                margin: auto 5px;

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }

    .remark {
        margin-top: 10px;
        padding: 5px;
        background-color: rgba(255, 255, 255, 0.8);
        /* 使用半透明白色背景 */
        border-radius: 4px;
        font-size: 0.8rem;
        color: #34465c;
        /* 使用深色文字以适应半透明背景 */
        line-height: 1.2;
        display: flex;
        
    }
}
</style>
