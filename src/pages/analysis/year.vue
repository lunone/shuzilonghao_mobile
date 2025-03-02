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
import CONFIG from '@/config';
import dayjs from 'dayjs';
import api from '@/utils/api';
import { numberByWan } from '@/utils/tools';

type StatItem = {
    counter: number;
    hours: number;
    netWeightCargo: number;
    month?: string;
    values?: StatItem[];
};

const loading = ref(false);
const error = ref('');
const dateRange = ref<[Date, Date]>([dayjs().add(-2, 'year').startOf('year').toDate(), new Date()]);
const selectYear = ref('');
const stats = ref<Record<string, StatItem>>({});
let statsYear = {} as Record<string, StatItem>;

const option = ref<any>();

const yearsRef = ref([]);
const title = computed(() => selectYear.value ? `20${selectYear.value}年` : `三年`)
const tips = computed(() => selectYear.value ? '返回多年统计' : '点击下方柱体显示年份详情')
// 数据获取
async function fetchData(startDate: Date, endDate: Date) {
    loading.value = true;
    try {
        const res = await api(CONFIG.url.statMonth, { startDate, endDate }) as StatItem[];
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
        .groupBy(item => item.month.split('/')[+(year !== 'year')])
        .mapValues(monthGroup => ({
            month: monthGroup[0].month,
            values: monthGroup,
            counter: _.sumBy(monthGroup, 'counter'),
            hours: +_.sumBy(monthGroup, 'hours').toFixed(2),
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
                { text: `航班: ${stats.value[year].counter} 班`, color: '#91CB74' },
                { text: `货运: ${stats.value[year].netWeightCargo} 吨`, color: '#1890FF' },
                { text: `飞行: ${stats.value[year].hours} 小时`, color: '#FAC858' }
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
    const rawHours = years.map(year => newStats[year].hours);

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
        hours: rawHours.map(v => v + BASE_HEIGHT)
    };

    option.value = {
        type: "column",
        categories: years,
        dataLabel: !selectYear.value, // 数据
        series: [
            {
                name: '飞行小时',
                type: 'column',
                color: '#FAC858',
                data: adjustedData.hours,
                textColor: '#37383a',
                formatter: (val) => numberByWan(val - BASE_HEIGHT) // 还原小时数
            }, {
                name: '货运总量(吨)',
                type: 'column',
                color: '#1890FF',
                data: adjustedData.cargo,
                formatter: (val) => numberByWan(((val - BASE_HEIGHT) / CARGO_SCALE).toFixed(1)) // 还原并格式化
            }, {
                name: '航班班次',
                type: 'column',
                color: '#91CB74',
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
                // width: 30,
                categoryGap: 2
            }
        }
    };
}, { immediate: true, deep: true });

</script>
<style lang="less" scoped>
@import '@/css/base.less';

.year-chart {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .title {
        .row;
        margin: 0;
        overflow: hidden;
        background-color: #ccc;
        padding: 5px 10px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;

        .left {}

        .mid {
            color: #aaa;
            font-size: .8rem;
        }

        .right {}
    }
}
</style>