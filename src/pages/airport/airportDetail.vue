<template>
    <div class="airport-detail-page">
        <!-- 顶部机场基本信息 -->
        <div class="airport-header">
            <div class="header-info">
                <h2 class="airport-name">{{ airport?.name || '机场名称' }}</h2>
                <p class="airport-city">{{ airport?.city || '城市' }}</p>
            </div>
            <div class="header-stats">
                <div class="stat-item">
                    <span class="stat-label">机场代码</span>
                    <span class="stat-value">{{ airport?.code4 || '-' }}</span>
                </div>
                <div class="stat-item" v-if="airport?.code3">
                    <span class="stat-label">三字代码</span>
                    <span class="stat-value">{{ airport.code3 }}</span>
                </div>
            </div>
        </div>

        <!-- 机场位置信息 -->
        <div class="data-section">
            <h3 class="section-group-title">位置信息</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">省份</span>
                    <span class="info-value">{{ airport?.province || '-' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">国家</span>
                    <span class="info-value">{{ airport?.country || '-' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">纬度</span>
                    <span class="info-value">{{ formatCoordinate(airport?.latitude) }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">经度</span>
                    <span class="info-value">{{ formatCoordinate(airport?.longitude) }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">海拔高度</span>
                    <span class="info-value">{{ airport?.elevation ? `${airport.elevation}m` : '-' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">时区</span>
                    <span class="info-value">{{ airport?.timezone || '-' }}</span>
                </div>
            </div>
        </div>

        <!-- 机场设施信息 -->
        <div class="data-section">
            <h3 class="section-group-title">设施信息</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">跑道长度</span>
                    <span class="info-value">{{ airport?.runwayLength ? `${airport.runwayLength}m` : '-' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">IATA代码</span>
                    <span class="info-value">{{ airport?.iata || '-' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">ICAO代码</span>
                    <span class="info-value">{{ airport?.icao || '-' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">运营状态</span>
                    <span class="info-value">{{ getAirportStatus(airport) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { AirportItem } from '@/api/airport.api';
import { useAirportStore } from '@/store/airport.store';

// 获取页面参数
const airport = ref<AirportItem | null>(null);
const airportStore = useAirportStore();

// 从页面参数获取机场信息
onLoad((options) => {
    const code = options.code as string;
    if (code) {
        // 从store中查找机场信息
        airport.value = airportStore.code4[code] || airportStore.code3[code] || null;
        // 如果store中还没有数据，先获取数据
        if (!airport.value) {
            airportStore.fetchAirports().then(() => {
                airport.value = airportStore.code4[code] || airportStore.code3[code] || null;
            });
        }
    }
});

// 格式化坐标
const formatCoordinate = (coord: number | undefined) => {
    if (!coord) return '-';
    return coord.toFixed(6);
};

// 获取机场状态
const getAirportStatus = (airport: AirportItem | null) => {
    if (!airport) return '-';
    return airport.isActive ? '运营中' : '停运';
};
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.airport-detail-page {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 0 16px;

    .airport-header {
        background: linear-gradient(135deg, #4CAF50, #81C784);
        color: white;
        padding: 20px;
        border-radius: 0 0 16px 16px;
        margin: 0 -16px 16px -16px;

        .header-info {
            margin-bottom: 16px;

            .airport-name {
                font-size: 1.5rem;
                font-weight: bold;
                margin: 0;
            }

            .airport-city {
                margin: 4px 0 0 0;
                opacity: 0.9;
                font-size: 1rem;
            }
        }

        .header-stats {
            display: flex;
            gap: 24px;

            .stat-item {
                display: flex;
                flex-direction: column;

                .stat-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                    margin-bottom: 4px;
                }

                .stat-value {
                    font-size: 1rem;
                    font-weight: 500;
                }
            }
        }
    }

    .data-section {
        margin-bottom: 24px;

        .section-group-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 0 0 12px 0;
            padding: 0 4px;
        }

        .info-grid {
            background: white;
            border-radius: 12px;
            padding: 16px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;

            .info-item {
                display: flex;
                flex-direction: column;

                .info-label {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 4px;
                }

                .info-value {
                    font-size: 1rem;
                    color: #333;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>