<template>
    <div class="wrapper">
        <div class="lastyear">
            <div class="title"> {{ props.range == 'year' ? '去年' : '前日' }} </div>
            <div class="counter">
                <span class="value"><zl-number :value="lastYear.counter" /></span>
                <span class="unit">班</span>
            </div>
            <div class="weight">
                <span class="value"><zl-number :value="lastYear.weight" /></span>
                <span class="unit">吨</span>
            </div>
            <div class="hour">
                <span class="value"><zl-number :value="lastYear.hours" /></span>
                <span class="unit">小时</span>
            </div>
        </div>
        <div class="thisyear">
            <span class="title"> {{ props.range == 'year' ? '今年' : '昨日' }} </span>
            <div class="counter">
                <span class="value"><zl-number :value="thisYear.counter" /></span>
                <span class="unit">班</span>
            </div>
            <div class="weight">
                <span class="value"><zl-number :value="thisYear.weight" /></span>
                <span class="unit">吨</span>
            </div>
            <div class="hour">
                <div class="value"><zl-number :value="thisYear.hours" /></div>
                <div class="unit">小时</div>
            </div>
        </div>
        <div class="rate">
            <span class="title">变化 </span>
            <div class="counter">
                <span class="value">{{ rate.counter }}</span>
                <span class="unit">%</span>
            </div>
            <div class="weight">
                <span class="value">{{ rate.weight }}</span>
                <span class="unit">%</span>
            </div>
            <div class="hour">
                <span class="value">{{ rate.hour }}</span>
                <span class="unit">%</span>
            </div>

        </div>
        <div class="remark" v-if="props.range == 'year'">
            <!-- <van-icon name="info" /> -->
            <i class="icon zl-icon-info" />
            今年:{{ dayjs(dates.firstDayOfYear).format('YYYY/M/D') }}-{{ dayjs(dates.now).format('YYYY/M/D') }},
            去年:{{ dayjs(dates.firstDayOfLastYear).format('YYYY/M/D') }}-{{
                dayjs(dates.dayBeforeOneYear).format('YYYY/M/D') }}
        </div>
    </div>
</template>

<script setup lang="ts">
import api from '@/utils/api';
import dayjs from 'dayjs';
import { computed, onMounted, PropType, reactive, Ref, ref } from 'vue';
import CONFIG from '@/config';
type Stat = { counter: number, weight: number, hours: number };
const props = defineProps({
    text: { type: String, default: '获取' },
    range: { type: String as PropType<string>, default: 'year' },
})

const dates = {
    // day的
    today: dayjs().startOf('day').toDate(),
    yesterday: dayjs().subtract(1, 'day').startOf('day').toDate(),
    theDayBeforeYesterday: dayjs().subtract(2, 'day').startOf('day').toDate(),

    // year的
    now: dayjs().toDate(),
    dayBeforeOneYear: dayjs().subtract(1, 'year').toDate(),
    firstDayOfYear: dayjs().startOf('year').toDate(),
    firstDayOfLastYear: dayjs().subtract(1, 'year').startOf('year').toDate(),

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
        thisYearRes.value = await api(CONFIG.url.statPeriod, { startDate: dates.firstDayOfYear, endDate: dates.now }) as Stat;
        lastYearRes.value = await api(CONFIG.url.statPeriod, { startDate: dates.firstDayOfLastYear, endDate: dates.dayBeforeOneYear }) as Stat;
    } else {
        thisYearRes.value = await api(CONFIG.url.statPeriod, { startDate: dates.yesterday, endDate: dates.today }) as Stat;
        lastYearRes.value = await api(CONFIG.url.statPeriod, { startDate: dates.theDayBeforeYesterday, endDate: dates.yesterday }) as Stat;
    }
});

</script>

<style lang="less" scoped>
/* 这里是样式部分，用于定义组件的样式 */
@import "@/css/base.less";

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
            color: #fcb6b6;
            /* 使用白色文字以适应渐变背景 */
            flex: 1;
            align-items: center;
            font-size: .9rem;
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
