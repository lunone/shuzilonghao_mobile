<template>
    <view class="flight-monitor">
        <!-- 日期切换 -->
        <view class="date-switcher">
            <text class="date-option">昨天</text>
            <text class="date-option active">今天 ({{ dayjs().format('MM-DD') }})</text>
            <text class="date-option">明天</text>
        </view>

        <!-- 头部统计和筛选 -->
        <view v-if="showStats || showFilters" class="header-section">
            <view v-if="showStats" class="stats-row">
                <view class="stat-item">
                    <text class="stat-label">全部:</text>
                    <text class="stat-value">{{ stats.total }}</text>
                </view>
                <view class="stat-item">
                    <text class="stat-label">计划:</text>
                    <text class="stat-value">{{ stats.planned }}</text>
                </view>
                <view class="stat-item">
                    <text class="stat-label">起飞:</text>
                    <text class="stat-value">{{ stats.departed }}</text>
                </view>
                <view class="stat-item">
                    <text class="stat-label">到达:</text>
                    <text class="stat-value">{{ stats.arrived }}</text>
                </view>
                <view class="stat-item abnormal">
                    <text class="stat-label">不正常:</text>
                    <text class="stat-value">{{ stats.abnormal }}</text>
                </view>
            </view>

            <view v-if="showFilters" class="filter-dropdown">
                <button class="filter-trigger" @click="toggleFilterMenu">
                    <text class="filter-icon">🔽</text>
                </button>

                <view v-if="showFilterMenu" class="filter-menu">
                    <view class="filter-section">
                        <text class="filter-title">类型</text>
                        <view class="filter-options">
                            <button v-for="type in flightTypes" :key="type.value"
                                :class="['filter-option', { active: activeFilters.type === type.value }]"
                                @click="setFilter('type', type.value)">
                                {{ type.label }}
                            </button>
                        </view>
                    </view>

                    <view class="filter-section">
                        <text class="filter-title">状态</text>
                        <view class="filter-options">
                            <button v-for="status in flightStatuses" :key="status.value"
                                :class="['filter-option', { active: activeFilters.status === status.value }]"
                                @click="setFilter('status', status.value)">
                                {{ status.label }}
                            </button>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 航班列表 -->
        <scroll-view v-if="showList" class="flight-list" scroll-y="true">
            <flight-card v-for="flight in filteredFlights" :key="flight.id" :flight="flight"
                @click="selectFlight(flight)" />
        </scroll-view>

        <!-- 航班详情组件 -->
        <flight-detail :visible="detailVisible" :flight-id="selectedFlightId" @close="closeDetail" />
    </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FlightItem } from '@/api/flight.api'
import FlightDetail from '@/pages/flight/flightDetail.vue'
import FlightCard from '@/pages/flight/flightCard.vue'
import { getFlightsByDate } from '@/api/flight.api'
import dayjs from 'dayjs'
import { useAirportStore } from '@/store/airport.store'

// Props
interface Props {
    showStats?: boolean
    showFilters?: boolean
    showList?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showStats: true,
    showFilters: true,
    showList: true
})

// 使用airportStore
const airportStore = useAirportStore()

// 响应式数据
const flights = ref<FlightItem[]>([])
const selectedFlight = ref<FlightItem | null>(null)
const activeFilters = ref({
    type: 'all', // all, domestic, international
    status: 'all' // all, normal, abnormal
})
const showFilterMenu = ref(false)
const detailVisible = ref(false)
const selectedFlightId = ref<number | undefined>(undefined)

// 筛选选项
const flightTypes = [
    { label: '全部', value: 'all' },
    { label: '国内', value: 'domestic' },
    { label: '国际', value: 'international' }
]

const flightStatuses = [
    { label: '全部', value: 'all' },
    { label: '正常', value: 'normal' },
    { label: '不正常', value: 'abnormal' }
]

// 计算属性
const stats = computed(() => {
    const total = flights.value.length
    const planned = flights.value.filter(f => f.isRelease).length
    const departed = flights.value.filter(f => f.atd).length
    const arrived = flights.value.filter(f => f.ata).length
    const abnormal = flights.value.filter(f => f.isDelay || f.isCancle || f.isAltn).length

    return { total, planned, departed, arrived, abnormal }
})

const filteredFlights = computed(() => {
    return flights.value.filter(flight => {
        // 类型筛选
        if (activeFilters.value.type === 'domestic' && flight.abroad) return false
        if (activeFilters.value.type === 'international' && !flight.abroad) return false

        // 状态筛选
        if (activeFilters.value.status === 'normal' && (flight.isDelay || flight.isCancle || flight.isAltn)) return false
        if (activeFilters.value.status === 'abnormal' && !(flight.isDelay || flight.isCancle || flight.isAltn)) return false

        return true
    })
})

// 方法
const setFilter = (type: 'type' | 'status', value: string) => {
    activeFilters.value[type] = value
    showFilterMenu.value = false // 选择后关闭菜单
}

const toggleFilterMenu = () => {
    showFilterMenu.value = !showFilterMenu.value
}

const selectFlight = (flight: FlightItem) => {
    selectedFlight.value = flight
    selectedFlightId.value = flight.id
    detailVisible.value = true
}

const closeDetail = () => {
    selectedFlight.value = null
    selectedFlightId.value = undefined
    detailVisible.value = false
}

onMounted(async () => {
    flights.value = await getFlightsByDate({ startDate: dayjs().startOf('day').toDate(), endDate: dayjs().endOf('day').toDate() }) as FlightItem[];
    airportStore.fetchAirports();
});
</script>

<style lang="less" scoped>
.flight-monitor {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.date-switcher {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;

    .date-option {
        padding: 4px 12px;
        color: #666;
        font-size: 14px;

        &.active {
            font-weight: bold;
            color: #333;
        }
    }
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    background: white;

    .stats-row {
        display: flex;
        gap: 10px;
        flex: 1;
        flex-wrap: wrap;

        .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;

            .stat-label {
                font-size: 12px;
                color: #666;
            }

            .stat-value {
                font-size: 14px;
                font-weight: bold;
                color: #333;

                &.abnormal {
                    color: #dc3545;
                }
            }
        }
    }

    .filter-dropdown {
        position: relative;

        .filter-trigger {
            background: #f8f9fa;
            border: 1px solid #ddd;
            padding: 6px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;

            .filter-icon {
                font-size: 12px;
                line-height: 1;
            }
        }

        .filter-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 6px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            z-index: 100;
            min-width: 120px;
            margin-top: 4px;

            .filter-section {
                padding: 8px;
                border-bottom: 1px solid #eee;

                &:last-child {
                    border-bottom: none;
                }

                .filter-title {
                    font-size: 12px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 6px;
                }

                .filter-options {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;

                    .filter-option {
                        padding: 5px 8px;
                        border: 1px solid #ddd;
                        background: white;
                        border-radius: 4px;
                        font-size: 11px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.2s;

                        &.active {
                            background: #007bff;
                            color: white;
                            border-color: #007bff;
                        }

                        &:hover {
                            background: #f8f9fa;
                        }
                    }
                }
            }
        }
    }
}

.stats-header {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;

    .stat-card {
        flex: 1;
        min-width: 120px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;

        &.abnormal {
            background: #fff3cd;
            border: 1px solid #ffc107;
        }

        .stat-label {
            display: block;
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }

        .stat-value {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
    }
}

.filters {
    background: white;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .filter-group {
        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0;
        }

        .filter-label {
            font-size: 14px;
            font-weight: bold;
            margin-right: 10px;
            color: #333;
        }

        .filter-btn {
            margin-right: 10px;
            padding: 6px 12px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            font-size: 12px;

            &.active {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }
        }
    }
}

.flight-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px;
    background-color: #f7f7f7;
}

.detail-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    overflow-y: auto;

    .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;

        .detail-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        }
    }

    .detail-content {
        padding: 20px;

        .detail-section {
            margin-bottom: 20px;

            .section-title {
                font-size: 16px;
                font-weight: bold;
                color: #333;
                margin-bottom: 10px;
                display: block;
            }

            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;

                .detail-label {
                    font-size: 14px;
                    color: #666;
                    flex: 1;
                }

                .detail-value {
                    font-size: 14px;
                    color: #333;
                    flex: 2;
                    text-align: right;

                    &.abnormal {
                        color: #dc3545;
                        font-weight: bold;
                    }

                    &.warning {
                        color: #ffc107;
                        font-weight: bold;
                    }
                }
            }
        }
    }
}
</style>
