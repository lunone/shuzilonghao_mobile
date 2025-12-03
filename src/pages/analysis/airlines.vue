<template>
    <div class="page-container">
        <div class="header">
            <zl-date-range-picker v-model="dateRange" />
        </div>
        <!-- <div class="divider"></div> -->
        <div class="container">
            <div class="filters">
                <button v-for="city in cityList" :key="city" 
                    @click="!loading && (selectedCity = city)"
                    :disabled="loading"
                    :class="{ active: selectedCity === city, disabled: loading }">
                    {{ getAirportName(city) }}
                </button>
            </div>

            <div class="tabs">
                <button @click="activeTab = 'arrival'" :class="{ active: activeTab === 'arrival' }">进港</button>
                <button @click="activeTab = 'departure'" :class="{ active: activeTab === 'departure' }">出港</button>
            </div>

            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else class="airlines-list">
                <div v-for="flight in displayedFlights" :key="flight.route" class="airline-card">
                    <div class="route-info">
                        <h4 class="route-title">{{flight.route.split('-').map(c => getAirportName(c)).join(' → ')}}
                        </h4>
                        <p>货量: {{ flight.total.cargo.toLocaleString() }} 千克</p>
                        <p>重量: {{ flight.total.weight.toLocaleString() }} 吨</p>
                        <p>航班: {{ flight.total.counter }}</p>
                    </div>
                    <div class="route-chart">
                        <div class="chart-placeholder">
                            <!-- Simplified chart representation -->
                            <svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
                                <path :d="generateSparkline(flight.total.trend)"
                                    :stroke="getTrendColor(flight.total.percentage)" stroke-width="2" fill="none" />
                            </svg>
                        </div>
                        <span class="chart-percentage" :style="{ color: getTrendColor(flight.total.percentage) }">
                            {{ flight.total.percentage > 0 ? '+' : '' }}{{ flight.total.percentage }}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, Ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import zlDateRangePicker from '@/components/zl/dateRangePicker.vue';
import { getStatByAirline } from '@/api/statistics.api';
import { useAirportStore } from '@/store/airport.store';

const airportStore = useAirportStore();
const { getCity: getAirportName } = airportStore;

onMounted(() => {
    airportStore.fetchAirports();
});

const loading = ref(false);
const error = ref('');
const dateRange = ref([
    dayjs().add(-11, 'day').toDate(),
    dayjs().add(-1, 'day').endOf('day').toDate()
]) as Ref<[Date, Date]>;

const allStats: Ref<any[]> = ref([]);
const selectedCity = ref('CGO');
const activeTab = ref<'departure' | 'arrival'>('departure');
const cityList = computed(() => {
    const cities = new Set<string>();
    allStats.value.forEach(city => cities.add(city.name));
    const cityArray = Array.from(cities);
    // 确保郑州显示在第一个
    const cgoIndex = cityArray.indexOf('CGO');
    if (cgoIndex > 0) {
        cityArray.splice(cgoIndex, 1);
        cityArray.unshift('CGO');
    }
    return cityArray;
});

const displayedFlights = computed(() => {
    let flights: any[] = [];
    const citiesToDisplay = allStats.value.filter(c => c.name === selectedCity.value);

    citiesToDisplay.forEach(city => {
        flights = flights.concat(city[activeTab.value]);
    });

    // Simple sort to make it look a bit more organized
    return flights.sort((a, b) => b.total.counter - a.total.counter);
});

const fetchData = async (startDate: Date, endDate: Date) => {
    loading.value = true;
    error.value = '';
    try {
        const data = await getStatByAirline({ startDate, endDate });
        const cities: { [key: string]: { name: string, departure: any[], arrival: any[] } } = {};

        for (const key in data) {
            const [departure, arrival] = key.split('-');
            const flightData = data[key];
            const aircrafts = Object.keys(flightData)
                .filter(k => k !== 'total')
                .map(acReg => ({ acReg, stats: flightData[acReg] }));

            // Mock data for trend and percentage as it's not in the API response
            const total = (flightData as any).total;
            total.cargo = Math.round(total.hour.total * 1000);
            total.weight = Math.round(total.hour.total * 10);
            total.percentage = Math.round(Math.random() * 40) - 20;
            total.trend = Array.from({ length: 10 }, () => Math.random());


            const routeInfo = { route: key, aircrafts, total };

            if (!cities[departure]) {
                cities[departure] = { name: departure, departure: [], arrival: [] };
            }
            cities[departure].departure.push(routeInfo);

            if (!cities[arrival]) {
                cities[arrival] = { name: arrival, departure: [], arrival: [] };
            }
            cities[arrival].arrival.push(routeInfo);
        }
        allStats.value = Object.values(cities);
        
        // 只有在初始加载且没有选择城市时才设置默认城市
        if (allStats.value.length > 0 && !selectedCity.value) {
            const hasCgoData = allStats.value.some(city => city.name === 'CGO');
            if (hasCgoData) {
                selectedCity.value = 'CGO';
            } else {
                // 如果没有郑州数据，选择第一个可用的站点
                selectedCity.value = allStats.value[0].name;
            }
        } else if (allStats.value.length > 0) {
            // 检查当前选中的城市是否在数据中，如果不在则重置为默认
            const hasSelectedCity = allStats.value.some(city => city.name === selectedCity.value);
            if (!hasSelectedCity) {
                const hasCgoData = allStats.value.some(city => city.name === 'CGO');
                if (hasCgoData) {
                    selectedCity.value = 'CGO';
                } else {
                    selectedCity.value = allStats.value[0].name;
                }
            }
        }
    } catch (err) {
        console.error(err);
        error.value = '获取信息失败';
    } finally {
        loading.value = false;
    }
};

watch(() => dateRange.value, (newRange) => {
    if (newRange && newRange.length === 2) {
        const [startDate, endDate] = newRange;
        fetchData(startDate, endDate);
    }
}, { immediate: true, deep: true });

const generateSparkline = (trend: number[] = []) => {
    if (!trend || trend.length === 0) {
        return 'M 0 20 L 80 20'; // Flat line if no data
    }
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const spread = max - min || 1;
    const points = trend.map((d, i) => {
        const x = (i / (trend.length - 1)) * 80;
        const y = 40 - ((d - min) / spread) * 38; // 38 to leave some padding
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
    return `M ${points.join(' L ')}`;
};

const getTrendColor = (percentage: number) => {
    if (percentage > 0) return '#4caf50'; // Green for positive
    if (percentage < 0) return '#f44336'; // Red for negative
    return '#9e9e9e'; // Grey for zero
};
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.page-container {
    background-color: #f3f4f6;
    min-height: 100vh;
}

.header {
    // background-color: #2952a4;
    padding: 15px;
    // border-bottom-left-radius: 20px;
    // border-bottom-right-radius: 20px;

    ::v-deep .zl-date-range-picker {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 20px;

        .date-range-text {
            color: white;
            font-size: 14px;
        }

        .calendar-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
        }
    }
}

.divider {
    height: 10px;
    background-color: #f3f4f6;
}

.container {
    padding: 15px;
}

.filters {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    overflow-x: auto;
    white-space: nowrap;
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;

    /* Firefox */
    &::-webkit-scrollbar {
        display: none;
        /* Chrome, Safari, Opera */
    }

    button {
        padding: 4px 12px;
        border: 1px solid #dcdcdc;
        background-color: #fff;
        border-radius: 16px; // Adjust border radius
        cursor: pointer;
        font-size: 14px;
        color: #333;
        flex-shrink: 0; // Prevent button from shrinking
        transition: all 0.3s ease;

        &:hover {
            opacity: 0.8;
        }

        &.active {
            background-color: #2952a4;
            color: white;
            border-color: #2952a4;
        }

        &.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
    }
}

.tabs {
    display: flex;
    margin-bottom: 15px;
    background-color: #e5e7eb;
    border-radius: 8px;
    padding: 2px; // Reduce padding

    button {
        flex: 1;
        padding: 1px; // Reduce vertical padding further
        border: none;
        background-color: transparent;
        cursor: pointer;
        font-size: 16px;
        color: #666;
        border-radius: 6px;
        transition: all 0.3s ease;

        &.active {
            background-color: #fff;
            color: #2952a4;
            font-weight: bold;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); // Subtle shadow
        }
    }
}

.airline-card {
    background-color: #fff;
    border-radius: 12px;
    margin-bottom: 15px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .route-info {
        .route-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        p {
            font-size: 14px;
            color: #666;
            margin: 4px 0;
        }
    }

    .route-chart {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .chart-placeholder {
            width: 80px;
            height: 40px;
        }

        .chart-percentage {
            font-size: 14px;
            font-weight: bold;
            margin-top: 5px;
        }
    }
}
</style>
