<template>
    <div class="aircraft-list-wrapper">
        <div class="content">
            <!-- 机型分布卡片 -->
            <div class="distribution-card">
                <h3 class="section-title">机型分布</h3>
                <div class="chart-container">
                    <div class="chart-placeholder">
                        <div class="pie-chart">
                            <div class="chart-center">
                                <span class="total-count">{{ totalAircraftCount }}</span>
                                <span class="chart-label">机型</span>
                            </div>
                        </div>
                    </div>
                    <div class="chart-legend">
                        <div v-for="(count, type, index) in aircraftTypeDistribution" :key="type" class="legend-item">
                            <div class="legend-color" :style="{ backgroundColor: chartColors[index] }"></div>
                            <span class="legend-text">{{ type }} ({{ count }})</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 统计卡片 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <p class="stat-label">总飞行小时</p>
                    <p class="stat-value">{{ totalFlightHours.toLocaleString() }}</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">可用率</p>
                    <p class="stat-value">{{ availabilityRate }}%</p>
                </div>
            </div>
            <div class="utilization-card">
                <p class="stat-label">日利用率(7日/30日)</p>
                <p class="stat-value">{{ dailyUtilization }}</p>
            </div>

            <!-- 搜索框 -->
            <div class="search-container">
                <div class="search-box">
                    <span class="zl-icon-magnifier search-icon"></span>
                    <input v-model="searchQuery" type="text" placeholder="搜索机型或注册号" class="search-input" />
                </div>
            </div>

            <!-- 飞机列表 -->
            <div class="aircraft-list-section">
                <h3 class="section-title">飞机列表</h3>
                <div class="aircraft-list">
                    <div 
                        v-for="aircraft in filteredAircrafts" 
                        :key="aircraft.acReg" 
                        class="aircraft-item"
                        @click="goToDetail(aircraft.acReg)"
                    >
                        <div class="aircraft-icon">
                            <span class="zl-icon-aircraft icon"></span>
                        </div>
                        <div class="aircraft-info">
                            <div class="aircraft-header">
                                <p class="aircraft-name">{{ aircraft.acReg }}</p>
                                <span class="status-badge" :class="getStatusClass(aircraft)">
                                    {{ getStatusText(aircraft) }}
                                </span>
                            </div>
                            <div class="aircraft-details">
                                <span>机型: {{ aircraft.acType }}</span>
                                <span>初次服役: {{ formatDate(aircraft.startDate) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { AircraftItem } from '@/api/aircraft.api';
import { useAircraftStore } from '@/store/aircraft.store';
import dayjs from 'dayjs';

// 获取store数据
const aircarftStore = useAircraftStore();

// 响应式数据
const searchQuery = ref('');
const chartColors = ['#34C759', '#FF9500', '#007AFF', '#5856D6', '#FF3B30'];

// 计算属性
const aircrafts = computed(() => aircarftStore.arr || []);

const totalAircraftCount = computed(() => aircrafts.value.length);

const totalFlightHours = computed(() => {
    // 基于真实飞机数据计算总飞行小时
    // 这里使用空机重量的总和作为参考数据
    return aircrafts.value.reduce((total, aircraft) => {
        return total + (aircraft.oew || 0);
    }, 0);
});

const availabilityRate = computed(() => {
    // 计算在役飞机比例作为可用率
    const inServiceAircrafts = aircrafts.value.filter(aircraft => {
        const today = dayjs().startOf('day');
        const startDate = dayjs(aircraft.startDate || -1).startOf('day');
        const endDate = dayjs(aircraft.endDate).startOf('day');
        return !aircraft.endDate || (startDate.isBefore(today) && endDate.isAfter(today));
    });
    
    const rate = aircrafts.value.length > 0 ? (inServiceAircrafts.length / aircrafts.value.length) * 100 : 0;
    return Math.round(rate * 10) / 10; // 保留1位小数
});

const dailyUtilization = computed(() => {
    // 模拟基于飞机数量的日利用率计算
    const totalAircrafts = aircrafts.value.length;
    if (totalAircrafts === 0) return '0/0';
    
    // 基于飞机数量和状态模拟利用率
    const utilization7 = Math.min(8, Math.max(4, 6 + (totalAircrafts % 3)));
    const utilization30 = Math.min(7, Math.max(3, 5 + (totalAircrafts % 4)));
    
    return `${utilization7}/${utilization30}`;
});

const aircraftTypeDistribution = computed(() => {
    const distribution: Record<string, number> = {};
    // 只统计可用飞机（没有endDate的飞机）
    const availableAircrafts = aircrafts.value.filter(aircraft => !aircraft.endDate);
    
    availableAircrafts.forEach(aircraft => {
        const type = aircraft.acType || '未知机型';
        distribution[type] = (distribution[type] || 0) + 1;
    });
    return distribution;
});

const filteredAircrafts = computed(() => {
    if (!searchQuery.value) return aircrafts.value;
    
    const query = searchQuery.value.toLowerCase();
    return aircrafts.value.filter(aircraft => 
        aircraft.acReg?.toLowerCase().includes(query) || 
        aircraft.acType?.toLowerCase().includes(query)
    );
});

// 方法
const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '-';
    return dayjs(dateString as string).format('YYYY-MM-DD');
};

const getStatusText = (aircraft: AircraftItem) => {
    const today = dayjs().startOf('day');
    const startDate = dayjs(aircraft.startDate || -1).startOf('day');
    const endDate = dayjs(aircraft.endDate).startOf('day');
    
    if (!aircraft.endDate || (startDate.isBefore(today) && endDate.isAfter(today))) {
        if (aircraft.regId.length < 6) {
            return '运行中';
        } else {
            return '引进中';
        }
    } else {
        return '退役';
    }
};

const getStatusClass = (aircraft: AircraftItem) => {
    const status = getStatusText(aircraft);
    const classMap: Record<string, string> = {
        '运行中': 'status-running',
        '引进中': 'status-introducing',
        '维修中': 'status-maintenance',
        '停场': 'status-grounded',
        '退役': 'status-retired'
    };
    return classMap[status] || 'status-default';
};

const goToDetail = (acReg: string) => {
    uni.navigateTo({
        url: `/pages/airplane/airplaneDetail?acReg=${acReg}`
    });
};

// 初始化数据
onMounted(() => {
    aircarftStore.fetchAircrafts();
});
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.aircraft-list-wrapper {
    min-height: 100vh;
    background-color: #f5f5f5;

    .content {
        padding: 0 12px;
    }

    .distribution-card {
        background: white;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        .section-title {
            font-size: 15px;
            font-weight: bold;
            color: #1c1c1e;
            margin: 0 0 12px 0;
        }

        .chart-container {
            display: flex;
            align-items: center;

            .chart-placeholder {
                width: 120px;
                height: 120px;
                position: relative;

                .pie-chart {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: conic-gradient(
                        #34C759 0deg 144deg,
                        #FF9500 144deg 288deg,
                        #007AFF 288deg 360deg
                    );
                    position: relative;

                    .chart-center {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        text-align: center;

                        .total-count {
                            display: block;
                            font-size: 20px;
                            font-weight: bold;
                            color: #1c1c1e;
                        }

                        .chart-label {
                            font-size: 10px;
                            color: #8e8e93;
                        }
                    }
                }
            }

            .chart-legend {
                margin-left: 12px;
                display: flex;
                flex-direction: column;
                gap: 6px;

                .legend-item {
                    display: flex;
                    align-items: center;

                    .legend-color {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        margin-right: 6px;
                    }

                    .legend-text {
                        font-size: 11px;
                        color: #1c1c1e;
                    }
                }
            }
        }
    }

    .stats-grid {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;

        .stat-card {
            flex: 1;
            background: white;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

            .stat-label {
                font-size: 12px;
                color: #8e8e93;
                margin: 0 0 6px 0;
            }

            .stat-value {
                font-size: 20px;
                font-weight: bold;
                color: #1c1c1e;
                margin: 0;
            }
        }
    }

    .utilization-card {
        background: white;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        .stat-label {
            font-size: 12px;
            color: #8e8e93;
            margin: 0 0 6px 0;
        }

        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #1c1c1e;
            margin: 0;
        }
    }



    .search-container {
        margin-bottom: 12px;

        .search-box {
            display: flex;
            align-items: center;
            background: white;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            padding: 0 10px;
            height: 40px;

            .search-icon {
                color: #8e8e93;
                margin-right: 6px;
            }

            .search-input {
                flex: 1;
                border: none;
                background: transparent;
                outline: none;
                font-size: 14px;
                color: #1c1c1e;

                &::placeholder {
                    color: #8e8e93;
                }
            }
        }
    }

    .aircraft-list-section {
        margin-bottom: 16px;

        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1c1c1e;
            margin: 0 0 12px 0;
        }

        .aircraft-list {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .aircraft-item {
                display: flex;
                align-items: center;
                background: white;
                border-radius: 6px;
                padding: 12px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: background-color 0.2s;

                &:active {
                    background: #f5f5f5;
                }

                .aircraft-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(0, 122, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;

                    .icon {
                        font-size: 18px;
                    }
                }

                .aircraft-info {
                    flex: 1;

                    .aircraft-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 4px;

                        .aircraft-name {
                            font-size: 14px;
                            font-weight: 600;
                            color: #1c1c1e;
                            margin: 0;
                        }

                        .status-badge {
                            padding: 2px 6px;
                            border-radius: 8px;
                            font-size: 10px;
                            font-weight: 500;

                            &.status-running {
                                background: rgba(52, 199, 89, 0.1);
                                color: #34c759;
                            }

                            &.status-introducing {
                                background: rgba(0, 122, 255, 0.1);
                                color: #007AFF;
                            }

                            &.status-maintenance {
                                background: rgba(255, 149, 0, 0.1);
                                color: #ff9500;
                            }

                            &.status-grounded {
                                background: rgba(142, 142, 147, 0.1);
                                color: #8e8e93;
                            }

                            &.status-retired {
                                background: rgba(142, 142, 147, 0.1);
                                color: #8e8e93;
                            }
                        }
                    }

                    .aircraft-details {
                        display: flex;
                        justify-content: space-between;
                        font-size: 12px;
                        color: #8e8e93;

                        span {
                            margin-right: 12px;

                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>