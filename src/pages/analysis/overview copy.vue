<template>
    <div class="wrapper">
        <div class="summary">
            <div class="title">总计:</div>
            <div class="sections">
                <div class="section">
                    <div class="value">{{ summary.totalWeight }}</div>
                    <div class="unit">吨</div>
                </div>
                <div class="section">
                    <div class="value">{{ summary.totalHours }}</div>
                    <div class="unit">小时</div>
                </div>
                <div class="section">
                    <div class="value">{{ summary.counter }}</div>
                    <div class="unit">班</div>
                </div>
            </div>
        </div>
        <div class="chart">
            <bar :data="data" :date-range="dateRange" class="bar" />
            <pie :data="data" :date-range="dateRange" class="pie" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Ref, ref, computed } from 'vue';

import dayjs from 'dayjs';
import { FlightItem } from '@/interface/flight.interface';
import bar from './overview/bar.vue';
import pie from './overview/pie.vue';
// 定义props来接收外部传入的startDate和endDate属性
const props = defineProps<{ data: FlightItem[], dateRange: [string, string] }>();

const pieData: Ref<any[]> = ref([]);

const dateFormatStr = 'YYYY-MM-DD';

const flightsGroupByDate: Ref<Record<string, any[]>> = ref({});
const summary = computed(() => {
    let totalWeight = 0, totalHours = 0;
    for (let flight of props.data) {
        totalWeight += flight.netWeightCargo;
        if (!flight.atd || !flight.ata) {
            console.log('flight))))))))))',flight)

        }
        totalHours += dayjs(flight.ata).diff(dayjs(flight.atd), 'minute');
    }
    // console.log(totalWeight, totalHours);
    // const totalWeight = props.data?.reduce((acc, flight) => acc + flight.netWeightCargo!, 0) || 0;
    // const totalHours = props.data?.reduce((acc, flight) => acc + dayjs(flight.ata).diff(dayjs(flight.atd), 'minute'), 0) || 0;
    return {
        totalWeight: (totalWeight / 1e3).toFixed(2),
        totalHours: (totalHours / 60).toFixed(2),
        counter: props.data?.length || 0,
        // utilization: (totalHours / (dayjs(props.dateRange[1]).diff(props.dateRange[0],'minute') * 24 * 365 * 100).toFixed(2),
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
.summary {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;

    .title {
        font-size: 10px;
        color: #aaa;
        // width: 100%;
        text-align: left;
        padding: 8px;
    }

    .sections {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        flex: 1;

        .section {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2px;
            border: 1px solid #fff;
            border-radius: 4px;
            background-color: #f9f9f9;
            // margin: 0 5px;
            width: 25vw;

            .value {
                font-size: 14px;
                /* 字体大小变小 */
                color: #007bff;
                font-weight: bold;
                // margin-bottom: 5px;
            }

            .unit {
                font-size: 12px;
                color: #666;
            }
        }
    }
}

.chart {
    margin: 4px;
    padding: 10px;

    .bar {
        // width: 200px;
        // height: 300px;
    }
}
</style>