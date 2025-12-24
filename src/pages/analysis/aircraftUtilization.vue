<template>
  <div class="aircraft-utilization-wrapper">
    <!-- 整体飞机平均利用率 -->
    <div class="avg-utilization-card">
      <div class="card-header">
        <h3 class="section-title">机队平均利用率</h3>
      </div>
      <div class="utilization-display">
        <div class="utilization-value">
          <span class="value">{{ fleetAvgUtilization.toFixed(1) }}</span>
          <span class="unit">小时/天</span>
        </div>
        <div class="utilization-desc">30天平均日利用率</div>
      </div>
    </div>

    <!-- 飞机利用率走势图 -->
    <div class="chart-section">
      <AircraftUtilizationCard
        :title="`机队利用率走势 (${totalAircraftCount}架)`"
        avg-label="30天平均"
        :fleet-mode="true"
        :chart-height="120"
        :utilization-data="fleetUtilizationData"
      />
    </div>

    <!-- 分机型利用率 -->
    <div class="aircraft-type-section">
      <div class="section-header">
        <h3 class="section-title">分机型利用率</h3>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <p class="loading-text">加载中...</p>
      </div>
      
      <!-- 机型利用率图表列表 -->
      <div v-else class="aircraft-type-list">
        <AircraftUtilizationCard
          v-for="typeData in aircraftTypeUtilization"
          :key="typeData.acType"
          :title="`${typeData.acType} (${typeData.aircraftCount}架)`"
          avg-label="30天平均"
          :chart-height="100"
          :utilization-data="typeData.utilizationData"
        />
      </div>
      
      <!-- 空状态 -->
      <div v-if="!isLoading && aircraftTypeUtilization.length === 0" class="empty-container">
        <p class="empty-text">暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAircraftStore } from '@/store/aircraft.store';
import { getAircraftUtilization, type AircraftUtilization } from '@/api/aircraft.api';
import AircraftUtilizationCard from '@/components/AircraftUtilizationCard.vue';

// Store
const aircraftStore = useAircraftStore();

// 响应式数据
const isLoading = ref(true);
const fleetUtilizationData = ref<AircraftUtilization | null>(null);
const aircraftTypeUtilization = ref<Array<{
  acType: string;
  aircraftCount: number;
  avgUtilization: number;
  utilizationData: AircraftUtilization;
}>>([]);

// 计算机队平均利用率
const fleetAvgUtilization = computed(() => {
  if (!fleetUtilizationData.value || !fleetUtilizationData.value.summary) {
    return 0;
  }
  return fleetUtilizationData.value.summary.avgDailyUtilization;
});

// 计算飞机总数
const totalAircraftCount = computed(() => {
  const validTypes = getValidAircraftTypes();
  return validTypes.reduce((sum, type) => sum + type.aircraftCount, 0);
});

// 获取有效机型列表（过滤掉有endDate和regId长度大于4的飞机）
const getValidAircraftTypes = () => {
  const aircrafts = aircraftStore.arr || [];
  const validAircrafts = aircrafts.filter(aircraft => {
    // 过滤掉有endDate的飞机
    if (aircraft.endDate) return false;
    // 过滤掉regId长度大于4的飞机
    if (aircraft.regId && aircraft.regId.length > 5) return false;
    return true;
  });
  
  // 提取所有机型并统计数量
  const typeMap: Record<string, number> = {};
  validAircrafts.forEach(aircraft => {
    const acType = aircraft.acType || '未知机型';
    typeMap[acType] = (typeMap[acType] || 0) + 1;
  });
  
  return Object.entries(typeMap).map(([acType, aircraftCount]) => ({
    acType,
    aircraftCount
  }));
};

// 获取机队整体利用率数据
const fetchFleetUtilization = async () => {
  try {
    const utilization = await getAircraftUtilization({
      type: 'ALL',
      startDate: getDateString(-30), // 30天前
      endDate: getDateString(-1) // 昨天
    });
    fleetUtilizationData.value = utilization;
  } catch (error) {
    console.error('获取机队利用率失败:', error);
  }
};

// 获取各机型利用率数据
const fetchAircraftTypeUtilization = async () => {
  const validTypes = getValidAircraftTypes();
  if (validTypes.length === 0) {
    aircraftTypeUtilization.value = [];
    return;
  }
  
  const typeUtilizationPromises = validTypes.map(async ({ acType, aircraftCount }) => {
    try {
      const utilization = await getAircraftUtilization({
        type: acType,
        startDate: getDateString(-30), // 30天前
        endDate: getDateString(-1) // 昨天
      });
      
      return {
        acType,
        aircraftCount,
        avgUtilization: utilization.summary.avgDailyUtilization,
        utilizationData: utilization
      };
    } catch (error) {
      console.error(`获取机型 ${acType} 利用率失败:`, error);
      return {
        acType,
        aircraftCount,
        avgUtilization: 0,
        utilizationData: {
          summary: {
            startDate: getDateString(-30),
            endDate: getDateString(-1),
            totalFlightMinutes: 0,
            totalFlightHours: 0,
            totalFleetDays: 0,
            avgDailyUtilization: 0
          },
          details: []
        }
      };
    }
  });
  
  const results = await Promise.all(typeUtilizationPromises);
  aircraftTypeUtilization.value = results.sort((a, b) => b.avgUtilization - a.avgUtilization);
};

// 获取日期字符串（天数偏移）
const getDateString = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// 初始化数据
onMounted(async () => {
  isLoading.value = true;
  
  try {
    // 先获取飞机数据
    await aircraftStore.fetchAircrafts();
    
    // 并行获取机队和机型利用率数据
    await Promise.all([
      fetchFleetUtilization(),
      fetchAircraftTypeUtilization()
    ]);
  } catch (error) {
    console.error('初始化数据失败:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="less" scoped>
.aircraft-utilization-wrapper {
  padding: 12px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

// 整体平均利用率卡片
.avg-utilization-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .card-header {
    margin-bottom: 16px;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #111418;
      margin: 0;
    }
  }

  .utilization-display {
    text-align: center;

    .utilization-value {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 4px;

      .value {
        font-size: 36px;
        font-weight: bold;
        color: #137fec;
      }

      .unit {
        font-size: 14px;
        color: #617589;
      }
    }

    .utilization-desc {
      font-size: 12px;
      color: #617589;
      margin-top: 4px;
    }
  }
}

// 图表区域
.chart-section {
  margin-bottom: 12px;
}

// 分机型利用率区域
.aircraft-type-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .section-header {
    margin-bottom: 16px;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #111418;
      margin: 0;
    }
  }

  .loading-container,
  .empty-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;

    .loading-text,
    .empty-text {
      font-size: 14px;
      color: #617589;
      margin: 0;
    }
  }

  .aircraft-type-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>