<template>
    <div class="aircraft-detail-page">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
            <p class="loading-text">加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error-container">
            <p class="error-text">{{ error }}</p>
        </div>

        <!-- 主要内容 -->
        <div v-else-if="aircraft" class="aircraft-content">
            <!-- 顶部飞机基本信息 -->
            <div class="aircraft-header">
                <div class="header-info">
                    <h2 class="aircraft-id">{{ aircraft.acReg || '飞机代码' }}</h2>
                    <p class="aircraft-type">{{ aircraft.acType || '飞机类型' }}</p>
                </div>
                <div class="header-stats">
                    <div class="stat-item">
                        <span class="stat-label">在役状态</span>
                        <span class="stat-value">{{ getAircraftStatus(aircraft) }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">初次服役</span>
                        <span class="stat-value">{{ formatDate(aircraft.startDate) }}</span>
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
                <!-- 修复：添加日期参数以获取更准确的MEL数据 -->
                <Mel :acReg="aircraft?.acReg" :startDate="defaultStartDate" :endDate="defaultEndDate"
                    :dateType="'inputterDate'" />
            </div>

            <!-- 飞机详细信息 -->
            <div class="data-section">
                <h3 class="section-group-title">详细信息</h3>
                <!-- 基本尺寸信息 -->
                <div class="detail">
                    <div class="detail-group">
                        <h4 class="group-title">基本尺寸</h4>
                        <div class="items">
                            <div class="item" v-for="item in basicDimensions" :key="item.key">
                                <span class="key">{{ item.name }}</span>
                                <span class="value">
                                    {{ aircraft ? calac(item.func, aircraft[item.key]) : '-' }}
                                    {{ item.unit || '' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 发动机信息 -->
                    <div class="detail-group">
                        <h4 class="group-title">发动机信息</h4>
                        <div class="items">
                            <div class="item" v-for="item in engineInfo" :key="item.key">
                                <span class="key">{{ item.name }}</span>
                                <span class="value">
                                    {{ aircraft ? calac(item.func, aircraft[item.key]) : '-' }}
                                    {{ item.unit || '' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 重量数据 -->
                    <div class="detail-group">
                        <h4 class="group-title">重量数据</h4>
                        <div class="items">
                            <div class="item" v-for="item in weightData" :key="item.key">
                                <span class="key">{{ item.name }}</span>
                                <span class="value">
                                    {{ aircraft ? calac(item.func, aircraft[item.key]) : '-' }}
                                    {{ item.unit || '' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 运营参数 -->
                    <div class="detail-group">
                        <h4 class="group-title">运营参数</h4>
                        <div class="items">
                            <div class="item" v-for="item in operationParams" :key="item.key">
                                <span class="key">{{ item.name }}</span>
                                <span class="value">
                                    {{ aircraft ? calac(item.func, aircraft[item.key]) : '-' }}
                                    {{ item.unit || '' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 设备能力 -->
                    <div class="detail-group">
                        <h4 class="group-title">设备能力</h4>
                        <div class="items">
                            <div class="item" v-for="item in equipmentCapability" :key="item.key">
                                <span class="key">{{ item.name }}</span>
                                <span class="value">
                                    {{ aircraft ? calac(item.func, aircraft[item.key]) : '-' }}
                                    {{ item.unit || '' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 运营标志 -->
                    <div class="detail-group">
                        <h4 class="group-title">运营标志</h4>
                        <div class="items">
                            <div class="item" v-for="item in operationFlags" :key="item.key">
                                <span class="key">{{ item.name }}</span>
                                <span class="value">
                                    {{ aircraft ? calac(item.func, aircraft[item.key]) : '-' }}
                                    {{ item.unit || '' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 无数据状态 -->
        <div v-else class="no-data-container">
            <p class="no-data-text">未找到飞机信息</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, computed } from 'vue';
import { AircraftItem } from '@/api/aircraft.api';
import { useAircraftStore } from '@/store/aircraft.store';
import { getAircraftDetail } from '@/api/aircraft.api';

import AircraftUtilizationCard from '@/pages/analysis/AircraftUtilizationCard.vue';
import RecentFlightsCard from '@/pages/flight/RecentFlightsCard.vue';
import Mel from '@/pages/maintenance/mel/melList.vue';
import dayjs from 'dayjs';

// 获取页面参数
const aircraft = ref<AircraftItem | null>(null);
const aircarftStore = useAircraftStore();
const loading = ref(true);
const error = ref('');

// 计算默认日期范围（最近一个月）
const defaultStartDate = computed(() => {
    return dayjs().subtract(30, 'day').format('YYYY-MM-DD');
});

const defaultEndDate = computed(() => {
    return dayjs().format('YYYY-MM-DD');
});

// 获取飞机详细信息
const fetchAircraftDetail = async (acReg: string) => {
    loading.value = true;
    error.value = '';

    try {
        // 首先尝试从store中获取基础信息
        let aircraftData = aircarftStore.arr.find(item => item.acReg === acReg) || null;

        // 如果store中没有或信息不完整，则从API获取详细信息
        if (!aircraftData || !aircraftData.totalLength) {
            aircraftData = await getAircraftDetail({ acReg });
        }

        aircraft.value = aircraftData;

    } catch (err) {
        console.error('获取飞机详细信息失败:', err);
        error.value = '获取飞机信息失败';

        // 如果API调用失败，尝试使用store中的基础数据
        const basicData = aircarftStore.arr.find(item => item.acReg === acReg);
        if (basicData) {
            aircraft.value = basicData;
            error.value = '';
        }
    } finally {
        loading.value = false;
    }
};

// 从页面参数获取飞机信息
onLoad((options) => {
    const acReg = options.acReg as string;
    if (acReg) {
        fetchAircraftDetail(acReg);
    } else {
        loading.value = false;
        error.value = '缺少飞机注册号';
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
    const endDate = aircraft.endDate ? dayjs(aircraft.endDate).startOf('day') : null;

    if (!aircraft.endDate || (startDate.isBefore(today) && endDate?.isAfter(today))) {
        if (aircraft.regId && aircraft.regId.length < 6) {
            return '在役';
        } else {
            return '引进中';
        }
    } else {
        return '退役';
    }
};

function calac(func, val) {
    if (val === null || val === undefined) {
        return '-';
    }
    if (typeof func === 'function') {
        try {
            return func(val)
        } catch (error) {
            return 'error';
        }
    }
    return val;
}

// 基本尺寸信息
const basicDimensions: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'totalLength', name: '长度', unit: '米' },
    { key: 'totalHeight', name: '高度', unit: '米' },
    { key: 'wingSpan', name: '翼展', func: (v: number) => v.toFixed(1), unit: '米' },
    { key: 'winglet', name: '翼尖小翼' },
];

// 发动机信息
const engineInfo: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'engineModel', name: '发动机' },
    { key: 'engPower', name: '推力', unit: '千瓦' },
    { key: 'toga', name: '起飞全发TOGA推力', unit: '千瓦' },
    { key: 'togaInvalid', name: '起飞一发失效TOGA推力', unit: '千瓦' },
];

// 重量数据
const weightData: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'oew', name: '空机重', unit: '公斤' },
    { key: 'bew', name: '基本空机重量', unit: '公斤' },
    { key: 'maxDepartWeight', name: '最大起飞重量', unit: '公斤' },
    { key: 'maxLandfallWeight', name: '最大着陆重量', unit: '公斤' },
    { key: 'maxNoOilWeight', name: '最大无油重量', unit: '公斤' },
    { key: 'maxTakeOffWeight', name: '最大起飞重量', unit: '公斤' },
    { key: 'maxLandWeight', name: '最大着陆重量', unit: '公斤' },
    { key: 'maxZerofuelWeight', name: '最大无油重量', unit: '公斤' },
];

// 运营参数
const operationParams: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'availableSeatNum', name: '可用座位数' },
    { key: 'maxPayload', name: '最大载荷', unit: '公斤' },
    { key: 'availableLoad', name: '可用载荷', unit: '公斤' },
    { key: 'maxTaxiWt', name: '最大滑行重量', unit: '公斤' },
    { key: 'limitTkofWt', name: '最大起飞限制重量', unit: '公斤' },
    { key: 'limitLndWt', name: '最大着陆限制重量', unit: '公斤' },
];

// 设备能力
const equipmentCapability: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'iscat2', name: '是否CAT II' },
    { key: 'rvsmYn', name: 'RVSM 标志' },
    { key: 'rnpApchYn', name: 'RNP APCH 标志' },
    { key: 'rnpArYn', name: 'RNP AR 标志' },
    { key: 'oxygenTime', name: '供氧时长', unit: '分钟' },
    { key: 'plateauYn', name: '高原标志' },
    { key: 'cat2Yn', name: 'CAT2 标志' },
    { key: 'overwaterFlag', name: '跨水标识' },
    { key: 'extOverwaterFlag', name: '扩展跨水标志' },
    { key: 'hightPalteauFlag', name: '高高原标志' },
    { key: 'etops', name: 'ETOPS 分钟数', unit: '分钟' },
    { key: 'isHf', name: '是否有HF' },
    { key: 'isSatelliteTelephone', name: '便捷式或固定式卫星电话' },
];

// 运营标志
const operationFlags: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'validFlag', name: '有效标志' },
    { key: 'startDate', name: '初次服役' },
    { key: 'pOrC', name: '客货标志' },
    { key: 'carrier', name: '承运人' },
    { key: 'layout', name: '布局' },
    { key: 'class', name: '飞机分类' },
    { key: 'restGrade', name: '该飞机休息设施等级' },
    { key: 'oewIdx', name: '空机重量指数' },
    { key: 'oewGc', name: '空机重量 GC' },
    { key: 'callFreq', name: '呼叫频率', unit: '赫兹' },
    { key: 'modS', name: 'MOD S' },
    { key: 'telNo', name: '电话号码' },
    { key: 'fltStartDate', name: '飞行开始日期' },
    { key: 'fltEndDate', name: '飞行结束日期' },
    { key: 'rmk', name: 'RMK项' },
    { key: 'regId', name: '飞机ID' },
];
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.aircraft-detail-page {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 0 8px;

    .loading-container,
    .error-container,
    .no-data-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        text-align: center;

        .loading-text,
        .error-text,
        .no-data-text {
            font-size: 16px;
            color: #666;
        }

        .error-text {
            color: #dc3545;
        }
    }

    .aircraft-header {
        background: linear-gradient(135deg, @color-airplane, @color-airplane-button-select);
        // color: white;
        padding: 20px;
        border-radius: 16px;
        margin: 0px;

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

    .detail {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        .detail-group {
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
                border-bottom: none;
            }

            .group-title {
                font-size: 16px;
                font-weight: bold;
                color: #111418;
                padding: 16px 16px 8px;
                margin: 0;
                background-color: #f8f9fa;
            }

            .items {
                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    border-bottom: 1px solid #f9f9f9;

                    &:last-child {
                        border-bottom: none;
                    }

                    &.even {
                        background-color: #f5f5f5;
                    }

                    .key {
                        font-weight: 500;
                        color: #333;
                        font-size: 14px;
                    }

                    .value {
                        color: #555;
                        font-size: 14px;
                        text-align: right;
                        flex: 1;
                        margin-left: 16px;
                    }
                }
            }
        }
    }
}
</style>