<template>
    <div class="page-container">
        <div v-if="!loading && !error">
            <!-- 航线标题 -->
            <h1 class="route-title">{{ routeTitle }}</h1>

            <!-- 飞机汇总总量 -->
            <div class="card">
                <div class="card-title">飞机汇总总量</div>
                <div class="summary-metrics">
                    <SummaryItem label="货量" :stats="totalStats.netWeightCargo" unit="吨" />
                    <SummaryItem label="小时" :stats="totalStats.hour" unit="小时" />
                    <SummaryItem label="航班" :stats="{ total: totalStats.counter }" unit="班" :is-counter="true" />
                </div>
            </div>

            <!-- 各机号详情 -->
            <div class="card">
                <div class="card-title">各机号详情</div>
                <div class="aircraft-list">
                    <div v-for="craft in aircrafts" :key="craft.acReg" class="aircraft-item">
                        <div class="aircraft-reg">{{ craft.acReg }}</div>
                        <div class="aircraft-stats">
                            <span>{{ craft.stats.netWeightCargo.total.toFixed(1) }} 吨</span>
                            <span>{{ craft.stats.hour.total.toFixed(1) }} 小时</span>
                            <span>{{ craft.stats.counter }} 班</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-if="error" class="error">{{ error }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAirportStore } from '@/store/airport.store';
import SummaryItem from './components/SummaryItem.vue';

const airportStore = useAirportStore();
const { getCity: getAirportName } = airportStore;

const routeTitle = ref('');
const totalStats = ref<any>({});
const aircrafts = ref<any[]>([]);
const loading = ref(true);
const error = ref('');

onLoad((options: any) => {
    if (options && options.data) {
        try {
            const flightData = JSON.parse(decodeURIComponent(options.data));
            const [departure, arrival] = flightData.route.split('-');
            routeTitle.value = `${getAirportName(departure)} → ${getAirportName(arrival)}`;
            
            totalStats.value = flightData.total;
            aircrafts.value = flightData.aircrafts
                .sort((a:any, b:any) => b.stats.netWeightCargo.total - a.stats.netWeightCargo.total);
            
            uni.setNavigationBarTitle({ title: routeTitle.value });
        } catch (e) {
            console.error("Data parsing error:", e);
            error.value = "无法解析航线数据";
        }
    } else {
        error.value = "未提供航线数据";
    }
    loading.value = false;
});

if (Object.keys(airportStore.code4).length === 0) {
    airportStore.fetchAirports();
}
</script>

<style lang="less" scoped>
.page-container {
    background-color: #f0f2f5;
    min-height: 100vh;
    padding: 16px;
    box-sizing: border-box;
}

.route-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
}

.card {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}

.card-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
}

.summary-metrics {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.aircraft-list {
    .aircraft-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
            border-bottom: none;
        }

        .aircraft-reg {
            font-size: 15px;
            font-weight: 500;
            color: #1890ff;
        }

        .aircraft-stats {
            display: flex;
            gap: 16px;
            font-size: 14px;
            color: #555;
            
            span {
                min-width: 80px;
                text-align: right;
            }
        }
    }
}

.loading, .error {
    text-align: center;
    color: #999;
    padding-top: 40px;
}
</style>