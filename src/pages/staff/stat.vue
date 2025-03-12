<template>
    <div class="wrapper">
        <div v-for="(item, index) in sections" :key="index" class="section"
            :class="['lastyear', 'thisyear', 'rate'][index]">
            <div class="title">{{ titles[props.range][index] }}</div>
            <template v-for="(unit, key) in fields" :key="key">
                <div class="item">
                    <span class="value">{{ item[key] }}</span>
                    <span class="unit">{{ index == 2 ? '%' : unit }}</span>
                </div>
            </template>
        </div>
        <div class="remark" v-if="props.range == 'year'">
            <i class="icon zl-icon-info" />
            今年:{{ dayjs(dates.firstDayOfYear).format('YYYY/M/D') }}-{{ dayjs(dates.now).format('YYYY/M/D') }},去年:{{
                dayjs(dates.firstDayOfLastYear).format('YYYY/M/D') }}-{{ dayjs(dates.dayBeforeOneYear).format('YYYY/M/D') }}
        </div>
    </div>
</template>
<script setup lang="ts">
import api from '@/utils/api';
import dayjs from 'dayjs';
import { computed, onMounted, PropType, reactive, Ref, ref } from 'vue';
import CONFIG from '@/config';
import { numberByWan } from '@/utils/tools';
// 新增类型定义
type StatField = 'counter' | 'netWeightCargo' | 'hours';
type Stat = Record<StatField, number>;

const props = defineProps({
    range: { type: String as PropType<'year' | 'day'>, default: 'year' },
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

const lastRes: Ref<Stat> = ref({ netWeightCargo: 0, counter: 0, hours: 0 });
const currentRes: Ref<Stat> = ref({ netWeightCargo: 0, counter: 0, hours: 0 });

const titles = { day: ['前日', '昨日', '变化'], year: ['去年', '今年', '变化'] }
// 在 computed 属性后添加：
const fields = { counter: '班', netWeightCargo: '吨', hours: '小时' }

const rate = (last: number, current: number) => last > 0 ? ((current - last) / last * 100).toFixed(1) : '--';
const formater = (src) => ({
    counter: numberByWan(src?.counter ?? 0),
    netWeightCargo: numberByWan(((src?.netWeightCargo ?? 0) / 1e3) | 0),
    hours: numberByWan((src?.hours ?? 0) | 0),
})
const sections = computed<Record<StatField, string | number>[]>(() => [
    formater(lastRes.value),
    formater(currentRes.value),
    Object.keys(fields).reduce((acc, key) => ({
        ...acc,
        [key]: rate(lastRes.value[key] ?? 0, currentRes.value[key] ?? 0)
    }), {} as Record<StatField, string>),
]);

onMounted(() => {
    const lastRange = props.range == 'year' ? { startDate: dates.firstDayOfLastYear, endDate: dates.dayBeforeOneYear } : { startDate: dates.theDayBeforeYesterday, endDate: dates.yesterday };
    const currentRange = props.range == 'year' ? { startDate: dates.firstDayOfYear, endDate: dates.now } : { startDate: dates.yesterday, endDate: dates.today };
    Promise.allSettled([
        api(CONFIG.url.statPeriod, currentRange).then(res => currentRes.value = res as Stat),
        api(CONFIG.url.statPeriod, lastRange).then(res => lastRes.value = res as Stat),
    ])
        // .then((arr) => console.log('获取信息', arr, thisYearRes.value, lastYearRes.value))
        .catch(err => console.warn('错误', err));
});

</script>
<style lang="less" scoped>
@import "@/css/base.less";

.wrapper {
    display: flex;
    flex-direction: column;

    .section {
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

        .item {
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
