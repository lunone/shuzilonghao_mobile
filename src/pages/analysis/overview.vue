<template>
    <div class="wrapper">
        <div class="summary">
            <div class="section">
                <div class="title">
                    总吨数
                </div>
                <div class="value">
                    {{ summary.totalWeight }}
                </div>
                <div class="unit">吨</div>
            </div>
            <div class="section">
                <div class="title">
                    总小时
                </div>
                <div class="value">
                    {{ summary.totalHours }}
                </div>
                <div class="unit">吨</div>
            </div>
            <div class="section">
                <div class="title">
                    总航班
                </div>
                <div class="value">
                    {{ summary.counter }}
                </div>
                <div class="unit">班</div>
            </div>
        </div>
        <div class="chart">
            <bar :data="data" :date-range="dateRange" class="bar" />
            <pie :data="data" :date-range="dateRange" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import api from '@/utils/api';
// import BarChartVue from '@/components/chart/BarChart.vue';
// import weightPieVue from './chart/weightPie.vue';
import { reactive, Ref, ref, computed, watch } from 'vue';
import _ from 'lodash';
import dayjs from 'dayjs';
// import { toFixed } from '@/utils/tool';
import { FlightItem } from '@/interface';
import { useStore } from '@/store';
import bar from './chart/overviewBar.vue';
import pie from './chart/weightPie.vue';
// 定义props来接收外部传入的startDate和endDate属性
const props = defineProps<{ data: FlightItem[], dateRange: [Date, Date] }>();

const store = useStore();
const pieData: Ref<any[]> = ref([]);

const pieShow = ref(true);

const dateFormatStr = 'YYYY-MM-DD';

const flightsGroupByDate: Ref<Record<string, any[]>> = ref({});
const summary = computed(() => {
    const totalWeight = props.data?.reduce((acc, flight) => acc + flight.netWeightCargo!, 0) || 0;
    const totalHours = props.data?.reduce((acc, flight) => acc + dayjs(flight.ata).diff(dayjs(flight.atd), 'minute'), 0) || 0;
    return {
        totalWeight: (totalWeight / 1e3).toFixed(2),
        totalHours: (totalHours / 60).toFixed(2),
        counter: props.data?.length || 0,
        utilization: (totalHours / (props.dateRange[1].getTime() - props.dateRange[0].getTime()) * 24 * 365 * 100).toFixed(2),
    }
});


let pieDate = ref('');
const dayChange = (args?: any) => {
    const { name: date } = args || {};
    if (pieDate !== date) {
        pieDate.value = date;
        pieData.value = flightsGroupByDate.value[date]
    }
}

</script>

<style lang="less" scoped>
.bar-chart {
    width: 100%;
    height: 20vh;
}

.summary {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .section {
        display: flex;
        align-items: center;

        .title {
            font-size: 12px;
        }

        .value {}

        .unit {
            font-size: 12px;
            color: #999;
        }
    }
}

.chart {
    .bar {
        width: 200px;
        height: 300px;
    }
}
</style>