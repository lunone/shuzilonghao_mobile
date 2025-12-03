<template>
    <div class="region-card" v-if="stat">
        <div class="card-header">
            <span class="region-name">{{ getCity(stat.station) }} ({{ stat.station }})</span>
            <span class="time-label">- 今年</span>
        </div>
        <div class="card-body">
            <div class="metric-item">
                <uni-icons type="paperplane-filled" size="24" color="#333"></uni-icons>
                <div class="metric-text">
                    <span class="label">航班</span>
                    <span class="value">{{ stat.flightCount }} 班</span>
                </div>
                <div class="trend-chart"></div>
            </div>
            <div class="metric-item">
                <uni-icons type="gift-filled" size="24" color="#333"></uni-icons>
                <div class="metric-text">
                    <span class="label">货量</span>
                    <span class="value">{{ ((stat.netWeightCargo || 0) / 1000).toFixed(2) }} 吨</span>
                </div>
                <div class="trend-chart"></div>
            </div>
            <div class="metric-item">
                <uni-icons type="refreshempty" size="24" color="#333"></uni-icons>
                <div class="metric-text">
                    <span class="label">小时</span>
                    <span class="value">{{ (stat.totalHours || 0).toFixed(2) }} 小时</span>
                </div>
                <div class="trend-chart"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAirportStore } from '@/store/airport.store';
import dayjs from 'dayjs';
import { getStatByStation, StationStats } from '@/api/statistics.api';

const { getCity, fetchAirports } = useAirportStore();

const props = defineProps({
    station: { type: String, required: true },
    startDate: { type: Date, default: () => dayjs().startOf('year').toDate() },
    endDate: { type: Date, default: () => dayjs().toDate() },
});

const stat = ref<StationStats | null>(null);

async function loadData() {
    try {
        await fetchAirports();
        const res = await getStatByStation({ station: props.station, startDate: props.startDate, endDate: props.endDate });
        
        // @ts-ignore
        const data = res.data || res; // 兼容 {data: ...} 和直接返回对象两种情况

        if (data && typeof data === 'object') {
            stat.value = {
                station: props.station,
                // @ts-ignore
                flightCount: data.counter || 0,
                // @ts-ignore
                netWeightCargo: data.netWeightCargo || 0,
                // @ts-ignore
                totalHours: data.hour || 0,
                averageDelay: 0
            };
        } else {
            stat.value = {
                station: props.station,
                flightCount: 0,
                netWeightCargo: 0,
                totalHours: 0,
                averageDelay: 0
            };
        }
    } catch (err) {
        console.error(`加载站点 ${props.station} 统计数据失败`, err);
        stat.value = {
            station: props.station,
            flightCount: 0,
            netWeightCargo: 0,
            totalHours: 0,
            averageDelay: 0
        };
    }
}

onMounted(loadData);
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.region-card {
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
}

.card-header {
    display: flex;
    align-items: baseline;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;

    .region-name {
        font-weight: bold;
        font-size: 16px;
        color: #333;
    }

    .time-label {
        font-size: 12px;
        color: #999;
        margin-left: 8px;
    }
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.metric-item {
    display: flex;
    align-items: center;
    gap: 12px;

    .metric-text {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .label {
            font-size: 14px;
            color: #666;
        }

        .value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
    }

    .trend-chart {
        width: 60px;
        height: 20px;
        background-color: #eee; // 趋势图占位符
        border-radius: 4px;
    }
}
</style>
