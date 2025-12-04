<template>
    <div class="page-container">
        <div class="header">
            <zl-date-range-picker v-model="dateRange" />
        </div>
        <!-- <div class="divider"></div> -->
        <div class="container">
            <div class="filters">
                <button v-for="city in cityList" :key="city" @click="!loading && (selectedCity = city)"
                    :disabled="loading" :class="{ active: selectedCity === city, disabled: loading }">
                    {{ getAirportName(city) }}
                </button>
            </div>

            <div class="tabs">
                <wd-button size="small" :type="activeTab === 'arrival' ? 'primary' : 'default'" @click="activeTab = 'arrival'">进港</wd-button>
                <wd-button size="small" :type="activeTab === 'departure' ? 'primary' : 'default'" @click="activeTab = 'departure'">出港</wd-button>
            </div>

            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else class="airlines-list">

                <StationStatsCard v-for="flight in displayedFlights" :key="flight.route"
                    :title="flight.route.split('-').map(c => getAirportName(c)).join(' → ')"
                    :data="formatFlightData(flight)" />

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
import StationStatsCard from './components/StationStatsCard.vue';

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

            // 使用真实的后端数据
            const total = (flightData as any).total;


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
const formatFlightData = (flight: any) => {
    return [
        { label: '货量', value: `${flight.total.netWeightCargo.total.toFixed(1)} 吨`, icon: 'gift-filled' },
        { label: '小时', value: `${flight.total.hour.total.toFixed(1)} 小时`, icon: 'refreshempty' },
        { label: '航班', value: flight.total.counter, icon: 'paperplane-filled' },
    ];
};
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.page-container {
    background-color: #f8f8f8;
    min-height: 100vh;
}

.header {
    // background-color: #2952a4;
    padding: 15px;
    // border-bottom-left-radius: 20px;
    // border-bottom-right-radius: 20px;

    ::v-deep .zl-date-range-picker {
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 20px;

        .date-range-text {
            color: white;
            font-size: 14px;
        }

        .calendar-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            // background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
        }
    }
}

// .divider {
//     height: 10px;
//     background-color: #f8f8f8;
// }

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
        padding: 0px 10px;
        border: 1px solid #dcdcdc;
        background-color: #fff;
        border-radius: 8px; // Adjust border radius
        cursor: pointer;
        font-size: 14px;
        color: #333;
        flex-shrink: 0; // Prevent button from shrinking
        transition: all 0.3s ease;

        &:hover {
            opacity: 0.8;
        }

        &.active {
            background-color: #4a90e2;
            color: white;
            border-color: #4a90e2;
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
    gap: 10px;
    margin-bottom: 15px;

    ::v-deep .wd-button {
        flex: 1;
    }
}
</style>

