<template>
    <div class="page-container">
        <div v-if="!loading && !error">
            <!-- 航线标题 -->
            <h1 class="route-title">{{ routeTitle }}</h1>

            <!-- 飞机汇总总量 -->

            <div class="summary-metrics">
                <AircraftStatsItem aircraft-reg="汇总" :stats="totalStats" />
            </div>


            <!-- 各机号详情 -->
            <div class="aircraft-details-section">
                <div class="section-header">
                    <h2 class="section-title">各机号详细统计</h2>
                    <div class="section-divider"></div>
                </div>
                <div class="aircraft-stats-grid">
                    <AircraftStatsItem v-for="craft in aircrafts" :key="craft.acReg" :aircraft-reg="craft.acReg"
                        :stats="craft.stats" />
                </div>
            </div>
        </div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-if="error" class="error">{{ error }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAirportStore } from '@/store/airport.store';
import { useAircraftStore } from '@/store/aircraft.store';
import { getRouteStatistics, type RouteStatisticsQueryDTO } from '@/api/statistics.api';
import SummaryItem from './components/SummaryItem.vue';
import AircraftStatsItem from './components/AircraftStatsItem.vue';
import dayjs from 'dayjs';

const airportStore = useAirportStore();
const aircraftStore = useAircraftStore();
const { getCity: getAirportName } = airportStore;

const routeTitle = ref('');
const currentRoute = ref(''); // 当前航线路径
const totalStats = ref<any>({});
const aircrafts = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const routeData = ref<RouteStatisticsQueryDTO | null>(null);

// 获取航线统计数据
const fetchRouteStatistics = async (routeParams: RouteStatisticsQueryDTO) => {
    loading.value = true;
    error.value = '';

    try {
        const data = await getRouteStatistics(routeParams);

        totalStats.value = data.total;

        // 飞机数据直接平铺在根级别，只取total
        const aircraftArray = Object.entries(data)
            .filter(([key]) => key !== 'total')
            .map(([acReg, stats]) => ({
                acReg,
                acType: (stats as any).acType,
                stats
            }));

        aircrafts.value = aircraftArray
            .sort((a: any, b: any) => b.stats.netWeightCargo.total - a.stats.netWeightCargo.total);

        uni.setNavigationBarTitle({ title: routeTitle.value });

    } catch (err) {
        console.error('获取航线统计数据失败:', err);
        error.value = '获取航线数据失败';
    } finally {
        loading.value = false;
    }
};

onLoad(async (options: any) => {
    // 初始化飞机数据
    await aircraftStore.fetchAircrafts();
    
    // 初始化机场数据
    if (Object.keys(airportStore.code4).length === 0) {
        airportStore.fetchAirports();
    }

    if (options && options.data) {
        try {
            // 解析传入的航线参数
            const flightData = JSON.parse(decodeURIComponent(options.data));

            // 构建API请求参数
            const routeParams: RouteStatisticsQueryDTO = {
                route: flightData.route,
                startDate: flightData.startDate || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
                endDate: flightData.endDate || dayjs().format('YYYY-MM-DD'),
                carrier: flightData.carrier
            };

            currentRoute.value = flightData.route;
            routeData.value = routeParams;

            // 设置页面标题 - 从airport.store获取航站名称
            const [departure, arrival] = flightData.route.split('-');
            routeTitle.value = `${getAirportName(departure)} → ${getAirportName(arrival)}`;
            uni.setNavigationBarTitle({ title: routeTitle.value });

            // 获取真实数据
            await fetchRouteStatistics(routeParams);

        } catch (e) {
            console.error("Data parsing error:", e);
            error.value = "无法解析航线数据";
            loading.value = false;
        }
    } else {
        error.value = "未提供航线数据";
        loading.value = false;
    }
});
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
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.summary-card {
    border-left: 4px solid #52c41a;
}

.card-title {
    position: relative;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;

    .title-text {
        background-color: #fff;
        padding-right: 8px;
        position: relative;
        z-index: 1;
    }

    .title-divider {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-color: #f0f0f0;
    }
}

.summary-metrics {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.aircraft-details-section {
    margin-top: 24px;

    .section-header {
        position: relative;
        margin-bottom: 20px;

        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 0;
            background-color: #f0f2f5;
            padding-right: 12px;
            position: relative;
            z-index: 1;
        }

        .section-divider {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(to right, #1890ff, #722ed1);
            transform: translateY(-50%);
        }
    }

    .aircraft-stats-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
}

.loading,
.error {
    text-align: center;
    color: #999;
    padding-top: 40px;
}
</style>