<template>
    <div class="wrapper">
        <!-- 日数据 -->
        <div v-for="(item, index) in daySections" :key="'day-' + index" class="section"
            :class="['lastyear', 'thisyear', 'rate'][index]">
            <div class="title">{{ dayTitles[index] }}</div>
            <template v-for="(unit, key) in fields" :key="key">
                <div class="item">
                    <span class="value">{{ item[key] }}</span>
                    <span class="unit">{{ index == 2 ? '%' : unit }}</span>
                </div>
            </template>
        </div>

        <!-- 年数据 -->
        <div v-for="(item, index) in yearSections" :key="'year-' + index" class="section"
            :class="['lastyear', 'thisyear', 'rate'][index]">
            <div class="title">{{ yearTitles[index] }}</div>
            <template v-for="(unit, key) in fields" :key="key">
                <div class="item">
                    <span class="value">{{ item[key] }}</span>
                    <span class="unit">{{ index == 2 ? '%' : unit }}</span>
                </div>
            </template>
        </div>

        <!-- 年数据时间范围说明 -->
        <div class="remark">
            <i class="icon zl-icon-info" />
            {{ timeRangeText }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { getIndexSummary, IndexSummaryResponse } from '@/api/statistics.api';
import dayjs from 'dayjs';
import { computed, onMounted, Ref, ref } from 'vue';
import { numberByWan } from '@/utils/tools';

// 模块级别的缓存数据，所有组件实例共享
let cachedData: Ref<IndexSummaryResponse | null> | null = null;
let isLoading = false;

// 如果缓存不存在，创建新的
if (!cachedData) {
    cachedData = ref<IndexSummaryResponse | null>(null);
}

const summaryData = cachedData;

const dayTitles = ['前日', '昨日', '变化'];
const yearTitles = ['去年', '今年', '变化'];
const fields = { counter: '班', netWeightCargo: '吨', hour: '小时' };

// 将变化率小数转换为百分比字符串
const formatRate = (rate: number | null): string => {
    if (rate === null) return '--';
    return (rate * 100).toFixed(1);
};

// 格式化日期
const formatDate = (dateStr: string): string => {
    return dayjs(dateStr).format('YYYY/M/D');
};

// 日数据：前天、昨天、日变化率
const daySections = computed(() => {
    if (!summaryData.value) {
        // 数据未加载时返回占位数据，防止页面抖动
        return [
            { counter: '--', netWeightCargo: '--', hour: '--' },
            { counter: '--', netWeightCargo: '--', hour: '--' },
            { counter: '--', netWeightCargo: '--', hour: '--' }
        ];
    }

    const { counter, netWeightCargo, hour } = summaryData.value;

    return [
        {
            counter: numberByWan(counter.theDayBeforeYesterday),
            netWeightCargo: numberByWan(Math.floor(netWeightCargo.theDayBeforeYesterday / 1000)),
            hour: numberByWan(Math.floor(hour.theDayBeforeYesterday)),
        },
        {
            counter: numberByWan(counter.yesterday),
            netWeightCargo: numberByWan(Math.floor(netWeightCargo.yesterday / 1000)),
            hour: numberByWan(Math.floor(hour.yesterday)),
        },
        {
            counter: formatRate(counter.dayRate),
            netWeightCargo: formatRate(netWeightCargo.dayRate),
            hour: formatRate(hour.dayRate),
        }
    ];
});

// 时间范围说明文本
const timeRangeText = computed(() => {
    if (!summaryData.value || !summaryData.value.time) {
        // 数据未加载时返回占位文本，防止页面抖动
        return '今年:----/--/--至----/--/--,去年:----/--/--至----/--/--';
    }
    const { time } = summaryData.value;
    return `今年:${formatDate(time.thisYear[0])}-${formatDate(time.yesterday[1])},去年:${formatDate(time.lastYear[0])}-${formatDate(time.theDayBeforeYesterday[1])}`;
});

// 年数据：去年、今年、年变化率
const yearSections = computed(() => {
    if (!summaryData.value) {
        // 数据未加载时返回占位数据，防止页面抖动
        return [
            { counter: '--', netWeightCargo: '--', hour: '--' },
            { counter: '--', netWeightCargo: '--', hour: '--' },
            { counter: '--', netWeightCargo: '--', hour: '--' }
        ];
    }

    const { counter, netWeightCargo, hour } = summaryData.value;

    return [
        {
            counter: numberByWan(counter.lastYear),
            netWeightCargo: numberByWan(Math.floor(netWeightCargo.lastYear / 1000)),
            hour: numberByWan(Math.floor(hour.lastYear)),
        },
        {
            counter: numberByWan(counter.thisYear),
            netWeightCargo: numberByWan(Math.floor(netWeightCargo.thisYear / 1000)),
            hour: numberByWan(Math.floor(hour.thisYear)),
        },
        {
            counter: formatRate(counter.yearRate),
            netWeightCargo: formatRate(netWeightCargo.yearRate),
            hour: formatRate(hour.yearRate),
        }
    ];
});

async function loadData() {
    // 如果正在加载或已经有数据，则不重复请求
    if (isLoading || summaryData.value) return;

    isLoading = true;
    try {
        const now = dayjs().toISOString();
        summaryData.value = await getIndexSummary(now);
    } catch (err) {
        console.warn('错误', err);
    } finally {
        isLoading = false;
    }
}

onMounted(loadData);
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
