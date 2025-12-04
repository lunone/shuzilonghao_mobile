<template>
    <div class="analysis-wrapper">
        <year-vue class="year" />
        <div class="card-header">
            <span class="title">热点城市</span>
            <span class="more-btn" @click="goToAirlines">分析</span>
        </div>
        <div class="card-stack">
            <StationStatsCard 
                v-for="city in cities" 
                :key="city.code" 
                class="star"
                :title="getCityTitle(city.code)"
                :timeLabel="timeLabel"
                :data="getCityData(city.code)" />
        </div>
        <!-- <div class="content">
            <zl-shortcut :links="links" class="links" />
        </div> -->
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue';
import yearVue from './year.vue';
import { useAirportStore } from '@/store/airport.store';
import dayjs from 'dayjs';
import { getStatByStation } from '@/api/statistics.api';
import StationStatsCard from './components/StationStatsCard.vue';

const airportStore = useAirportStore();
const { getCity: getAirportName } = airportStore;

const cities = ref([
    { name: '郑州', code: 'ZHCC' },
    { name: '西安', code: 'ZLXY' },
]);

const cityStats = ref<{ [key: string]: any }>({});
const timeLabel = ref('- 今年');

// 初始化时加载机场数据
airportStore.fetchAirports();

const getCityTitle = (cityCode: string) => {
    return `${getAirportName(cityCode)} (${cityCode})`;
};

const getCityData = (cityCode: string) => {
    const stats = cityStats.value[cityCode];
    if (!stats) return [];
    
    return [
        { label: '航班', value: `${stats.flightCount || 0} 班`, icon: 'paperplane-filled' },
        { label: '货量', value: `${((stats.netWeightCargo || 0) / 1000).toFixed(2)} 吨`, icon: 'gift-filled' },
        { label: '小时', value: `${(stats.totalHours || 0).toFixed(2)} 小时`, icon: 'refreshempty' },
    ];
};

// 加载城市数据
const loadCityData = async (cityCode: string) => {
    try {
        const res = await getStatByStation({ 
            station: cityCode, 
            startDate: dayjs().startOf('year').toDate(), 
            endDate: dayjs().toDate() 
        });
        
        // @ts-ignore
        const data = res.data || res;
        
        if (data && typeof data === 'object') {
            cityStats.value[cityCode] = {
                station: cityCode,
                flightCount: data.counter || 0,
                netWeightCargo: data.netWeightCargo || 0,
                totalHours: data.hour || 0,
                averageDelay: 0
            };
        } else {
            cityStats.value[cityCode] = {
                station: cityCode,
                flightCount: 0,
                netWeightCargo: 0,
                totalHours: 0,
                averageDelay: 0
            };
        }
    } catch (err) {
        console.error(`加载站点 ${cityCode} 统计数据失败`, err);
        cityStats.value[cityCode] = {
            station: cityCode,
            flightCount: 0,
            netWeightCargo: 0,
            totalHours: 0,
            averageDelay: 0
        };
    }
};

// 组件挂载时加载所有城市数据
cities.value.forEach(city => {
    loadCityData(city.code);
});

const links = ref([[
    { size: 6, link: '/pages/analysis/overview', class: 'health', text: '趋势分析', error: '' },
    { size: 6, link: '/pages/analysis/airlines', class: 'location', text: '航线分析', error: '' },
]]);

function goToAirlines() {
    uni.navigateTo({
        url: '/pages/analysis/airlines'
    });
}
</script>
<style lang="less" scoped>
@import "@/css/base.less";

.analysis-wrapper {
    .column;
    background-color: #f8f8f8;
    justify-content: flex-start;
    width: 100%;

    .year {
        width: 100%;
        padding: 10px;
        box-sizing: border-box
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        width: 100%;
        box-sizing: border-box;

        .title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }

        .more-btn {
            font-size: 12px;
            color: #333;
            background-color: #e8e8e8;
            padding: 4px 10px;
            border-radius: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .more-btn::after {
            content: '>';
            margin-left: 4px;
            font-family: monospace;
        }
    }

    .card-stack {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 10px; // 卡片之间的间距
        padding: 0 10px 10px;
    }

    .star {
        width: 100%;
        box-sizing: border-box;
    }

    .content {
        .column;
        width: 100%;
        border-top-left-radius: 14px;
        border-top-right-radius: 14px;
        box-sizing: border-box;
        background-color: #fff;

        .links {
            width: 100%;
            box-sizing: border-box;
            padding: 10px 4px;
        }
    }
}
</style>