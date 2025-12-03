<template>
    <div class="year-chart">
        <div class="title" @click="backYear">
            <div class="left">{{ title }}详情</div>
            <div class="mid">{{ tips }}</div>
            <!-- <i class="right zl-icon-left" /> -->
        </div>
        <ucharts :option="option" @select="showTip" :height="200" class="chart" />
    </div>
</template>
<script setup lang="ts">
import ucharts from '@/components/ucharts/ucharts.vue';
import { computed, ref, watch } from 'vue';
import _ from 'lodash';
import { CONFIG } from '@/config';
import dayjs from 'dayjs';

import { numberByWan } from '@/utils/tools';
import { StatSingle } from '@/api/flight.api';
import { getStatMonth } from '@/api/statistics.api';

type StatMulti = StatSingle & {
    month?: string;
    values?: StatSingle[];
};

const loading = ref(false);
const error = ref('');
const dateRange = ref<[Date, Date]>([dayjs().add(-2, 'year').startOf('year').toDate(), new Date()]);
const selectYear = ref('');
const stats = ref<Record<string, StatMulti>>({});
let statsYear = {} as Record<string, StatMulti>;

const option = ref<any>();

const yearsRef = ref([]);
const title = computed(() => selectYear.value ? `${selectYear.value}年` : `多年`)
const tips = computed(() => selectYear.value ? '返回多年统计' : '点击下方柱体显示年份详情')
// 数据获取
async function fetchData(startDate: Date, endDate: Date) {
    loading.value = true;
    try {
        const res = await getStatMonth({ startDate, endDate });
        stats.value = stat(res);
    } catch (err) {
        error.value = '数据加载失败';
        console.error(err);
    } finally {
        loading.value = false;
    }
};

// 按聚合数据
function stat(res, year = 'year') {
    return _.chain(res)// month 格式为 YY/MM
        .groupBy(item => {
            const arr = item.month.split('/');
            return year == 'year' ? `20${arr[0]}` : arr[1]
        })
        .mapValues(monthGroup => ({
            month: monthGroup[0].month,
            values: monthGroup,
            counter: _.sumBy(monthGroup, 'counter'),
            hour: _.sumBy(monthGroup, 'hour'),
            netWeightCargo: +(_.sumBy(monthGroup, 'netWeightCargo') / 1e3).toFixed(2)
        }))
        .value();
}
// 交互事件
const showTip = (chart: any, event: any) => {
    const index = chart.getCurrentDataIndex(event)?.index;
    const year = yearsRef.value[index];
    const month = stats.value[year]?.month;
    const values = stats.value[year]?.values;

    if (!selectYear.value) {
        statsYear = stats.value;
        selectYear.value = year;
        stats.value = stat(values, 'month');
        // console.log(stats);
    } else {
        chart.showToolTip(event, {
            textList: [
                { text: `${month}月`, color: null },
                { text: `航班: ${numberByWan(stats.value[year].counter)} 班`, color: '#91CB74' },
                { text: `货运: ${numberByWan(stats.value[year].netWeightCargo)} 吨`, color: '#1890FF' },
                { text: `飞行: ${numberByWan(stats.value[year].hour)} 小时`, color: '#FAC858' }
            ]
        });
    }
}

// 显示年数据
function backYear() {
    if (selectYear.value) {
        stats.value = statsYear;
        selectYear.value = '';
    }
}
// 监听日期范围变化
watch(dateRange, ([start, end]) => fetchData(start, end), { immediate: true });
// 图表配置
watch(stats, (newStats, oldStats) => {
    const years = Object.keys(newStats).sort();
    if (years.length === 0) return;
    // 原始数据提取
    const rawFlights = years.map(year => newStats[year].counter);
    const rawCargo = years.map(year => newStats[year].netWeightCargo);
    const rawHours = years.map(year => newStats[year].hour);

    yearsRef.value = years;
    // console.log('years', years, rawFlights, rawCargo, rawHours);
    // 数据调整参数
    const FLIGHT_SCALE = 5;    // 航班放大倍数
    const CARGO_SCALE = 0.6;   // 货运量缩小系数
    const BASE_HEIGHT = 100;   // 基准高度

    // 生成调整后数据
    const adjustedData = {
        flights: rawFlights.map(v => v * FLIGHT_SCALE + BASE_HEIGHT),
        cargo: rawCargo.map(v => v * CARGO_SCALE + BASE_HEIGHT),
        hour: rawHours.map(v => v + BASE_HEIGHT)
    };

    option.value = {
        type: "column",
        categories: years,
        dataLabel: !selectYear.value, // 数据
        series: [
            {
                name: '飞行小时',
                type: 'column',
                color: '#8dabc7',
                data: adjustedData.hour,
                textColor: '#37383a',
                formatter: (val) => numberByWan((val - BASE_HEIGHT).toFixed(1)) // 还原小时数
            }, {
                name: '货运总量(吨)',
                type: 'column',
                color: '#6a9a8a',
                data: adjustedData.cargo,
                formatter: (val) => numberByWan(((val - BASE_HEIGHT) / CARGO_SCALE).toFixed(1)) // 还原并格式化
            }, {
                name: '航班班次',
                type: 'column',
                color: '#d9a08b',
                // label: { show: false },
                data: adjustedData.flights,
                formatter: (val) => numberByWan((val - BASE_HEIGHT) / FLIGHT_SCALE) // 还原真实值
            }
        ],
        padding: [0, 10, 0, 10],
        legend: {
            show: true,
            position: 'top',
            float: 'center'
        },
        xAxis: {
            disableGrid: true,
            boundaryGap: 'center',
            formatter: (val: string) => val
        },
        yAxis: {
            disabled: true,
            data: [{
                min: 0,
                max: Math.max(...Object.values(adjustedData).flat()) * 1.2,
                formatter: (val) => val - BASE_HEIGHT // Y轴显示原始值
            }],
        },
        extra: {
            column: {
                categoryGap: 2
            }
        }
    };
}, { immediate: true, deep: true });

</script>
<style lang="less" scoped>
@import '@/css/base.less';

.year-chart {
    width: 100%;
    height: 100%;
    background: #f7f8fa;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-sizing: border-box;

    .title {
        display: flex;
        align-items: baseline;
        border-bottom: 1px solid #eee;
        padding-bottom: 8px;

        .left {
            font-weight: bold;
            font-size: 16px;
            color: #333;
        }

        .mid {
            font-size: 12px;
            color: #999;
            margin-left: 8px;
        }

        .right {}
    }
}
</style>