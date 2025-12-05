<template>
    <div class="aircraft-detail-page">
        <!-- 顶部飞机基本信息 -->
        <div class="aircraft-header">
            <div class="header-info">
                <h2 class="aircraft-id">{{ aircraft?.acReg || '飞机代码' }}</h2>
                <p class="aircraft-type">{{ aircraft?.acType || '飞机类型' }}</p>
            </div>
            <div class="header-stats">
                <div class="stat-item">
                    <span class="stat-label">在役状态</span>
                    <span class="stat-value">{{ getAircraftStatus(aircraft) }}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">初次服役</span>
                    <span class="stat-value">{{ formatDate(aircraft?.startDate) }}</span>
                </div>
            </div>
        </div>

        <!-- 飞机运营数据分组 -->
        <div class="data-section">
            <h3 class="section-group-title">运营数据</h3>
            <AircraftUtilizationCard :acReg="aircraft?.acReg" />
        </div>

        <!-- 航班执飞记录分组 -->
        <div class="data-section">
            <h3 class="section-group-title">航班记录</h3>
            <RecentFlightsCard :acReg="aircraft?.acReg" />
        </div>

        <!-- 维护保留单分组 -->
        <div class="data-section">
            <h3 class="section-group-title">维护信息</h3>
            <MelRetentionCard :acReg="aircraft?.acReg" />
        </div>

        <!-- 飞机详细信息 -->
        <div class="data-section">
            <h3 class="section-group-title">详细信息</h3>
            <DetailAircraft :aircraft="aircraft" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { AircraftItem } from '@/api/aircraft.api';
import { useAircraftStore } from '@/store/aircraft.store';
import DetailAircraft from './detail.vue';
import AircraftUtilizationCard from './components/AircraftUtilizationCard.vue';
import RecentFlightsCard from './components/RecentFlightsCard.vue';
import MelRetentionCard from './components/MelRetentionCard.vue';
import dayjs from 'dayjs';

// 获取页面参数
const aircraft = ref<AircraftItem | null>(null);
const aircarftStore = useAircraftStore();

// 从页面参数获取飞机信息
onLoad((options) => {
    const acReg = options.acReg as string;
    if (acReg) {
        // 从store中查找飞机信息
        aircraft.value = aircarftStore.arr.find(item => item.acReg === acReg) || null;
    }
});

// 格式化日期
const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '-';
    return dayjs(dateString as string).format('YYYY-MM-DD');
};

// 获取飞机状态
const getAircraftStatus = (aircraft: AircraftItem | null) => {
    if (!aircraft) return '-';

    const today = dayjs().startOf('day');
    const startDate = dayjs(aircraft.startDate || -1).startOf('day');
    const endDate = dayjs(aircraft.endDate).startOf('day');

    if (!aircraft.endDate || (startDate.isBefore(today) && endDate.isAfter(today))) {
        if (aircraft.regId.length < 6) {
            return '在役';
        } else {
            return '引进中';
        }
    } else {
        return '退役';
    }
};
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.aircraft-detail-page {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 0 16px;

    .aircraft-header {
        background: linear-gradient(135deg, @color-airplane, @color-airplane-button-select);
        color: white;
        padding: 20px;
        border-radius: 0 0 16px 16px;
        margin: 0 -16px 16px -16px;

        .header-info {
            margin-bottom: 16px;

            .aircraft-id {
                font-size: 1.5rem;
                font-weight: bold;
                margin: 0;
            }

            .aircraft-type {
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
    }
}
</style>