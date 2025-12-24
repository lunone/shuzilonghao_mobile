<template>
  <div class="aircraft-utilization-wrapper">
    <!-- 机队模式 -->
    <template v-if="viewMode === 'fleet'">
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
          :title="`整体(${totalAircraftCount}架)利用率`"
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
            :clickable="true"
            @click="goToAircraftType(typeData.acType)"
          />
        </div>
        
        <!-- 空状态 -->
        <div v-if="!isLoading && aircraftTypeUtilization.length === 0" class="empty-container">
          <p class="empty-text">暂无数据</p>
        </div>
      </div>
    </template>

    <!-- 机型模式 -->
    <template v-else>
      <!-- 机型平均利用率 -->
      <div class="avg-utilization-card">
        <div class="card-header">
          <h3 class="section-title">{{ selectedAcType }} 平均利用率</h3>
        </div>
        <div class="utilization-display">
          <div class="utilization-value">
            <span class="value">{{ aircraftTypeAvgUtilization.toFixed(1) }}</span>
            <span class="unit">小时/天</span>
          </div>
          <div class="utilization-desc">30天平均日利用率</div>
        </div>
      </div>

      <!-- 机型利用率走势图 -->
      <div class="chart-section">
        <AircraftUtilizationCard
          :title="`${selectedAcType} 利用率`"
          avg-label="30天平均"
          :chart-height="120"
          :utilization-data="aircraftTypeUtilizationData"
        />
      </div>

      <!-- 该机型下所有飞机利用率 -->
      <div class="aircraft-list-section">
        <div class="section-header">
          <h3 class="section-title">{{ selectedAcType }} 机型下所有飞机利用率</h3>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-container">
          <p class="loading-text">加载中...</p>
        </div>
        
        <!-- 飞机利用率图表列表 -->
        <div v-else class="aircraft-list">
          <AircraftUtilizationCard
            v-for="aircraft in aircraftUtilizationList"
            :key="aircraft.acReg"
            :title="aircraft.acReg"
            avg-label="30天平均"
            :chart-height="100"
            :utilization-data="aircraft.utilizationData"
          />
        </div>
        
        <!-- 空状态 -->
        <div v-if="!isLoading && aircraftUtilizationList.length === 0" class="empty-container">
          <p class="empty-text">暂无数据</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAircraftStore } from '@/store/aircraft.store';
import { getAircraftUtilization, type AircraftUtilization } from '@/api/aircraft.api';
import AircraftUtilizationCard from '@/components/AircraftUtilizationCard.vue';

// Store
const aircraftStore = useAircraftStore();

// 显示模式：fleet（机队模式）或 aircraftType（机型模式）
const viewMode = ref<'fleet' | 'aircraftType'>('fleet');
const selectedAcType = ref('');

// 响应式数据
const isLoading = ref(true);
const fleetUtilizationData = ref<AircraftUtilization | null>(null);
const aircraftTypeUtilization = ref<Array<{
  acType: string;
  aircraftCount: number;
  avgUtilization: number;
  utilizationData: AircraftUtilization;
}>>([]);

// 机型模式下的数据
const aircraftTypeUtilizationData = ref<AircraftUtilization | null>(null);
const aircraftUtilizationList = ref<Array<{
  acReg: string;
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

// 计算机型平均利用率（机型模式）
const aircraftTypeAvgUtilization = computed(() => {
  if (!aircraftTypeUtilizationData.value || !aircraftTypeUtilizationData.value.summary) {
    return 0;
  }
  return aircraftTypeUtilizationData.value.summary.avgDailyUtilization;
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

// 获取指定机型下的飞机列表
const getAircraftsByType = (acType: string) => {
  const aircrafts = aircraftStore.arr || [];
  return aircrafts.filter(aircraft =>
    aircraft.acType === acType &&
    !aircraft.endDate &&
    aircraft.regId && aircraft.regId.length <= 5
  );
};

// 获取机型利用率数据
const fetchAircraftTypeData = async (acType: string) => {
  try {
    const utilization = await getAircraftUtilization({
      type: acType,
      startDate: getDateString(-30),
      endDate: getDateString(-1)
    });
    aircraftTypeUtilizationData.value = utilization;
  } catch (error) {
    console.error(`获取机型 ${acType} 利用率失败:`, error);
  }
};

// 获取机型下所有飞机的利用率数据
const fetchAircraftUtilizationByType = async (acType: string) => {
  const aircrafts = getAircraftsByType(acType);
  if (aircrafts.length === 0) {
    aircraftUtilizationList.value = [];
    return;
  }
  
  const promises = aircrafts.map(async (aircraft) => {
    try {
      const utilization = await getAircraftUtilization({
        acReg: aircraft.acReg,
        startDate: getDateString(-30),
        endDate: getDateString(-1)
      });
      return {
        acReg: aircraft.acReg,
        utilizationData: utilization
      };
    } catch (error) {
      console.error(`获取飞机 ${aircraft.acReg} 利用率失败:`, error);
      return {
        acReg: aircraft.acReg,
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
  
  const results = await Promise.all(promises);
  aircraftUtilizationList.value = results.sort((a, b) =>
    b.utilizationData.summary.avgDailyUtilization - a.utilizationData.summary.avgDailyUtilization
  );
};

// 跳转到机型模式
const goToAircraftType = (acType: string) => {
  uni.navigateTo({
    url: `/pages/analysis/aircraftUtilization?mode=aircraftType&acType=${acType}`
  });
};

// 解析 URL 参数
onLoad((options: any) => {
  if (options.mode === 'aircraftType' && options.acType) {
    viewMode.value = 'aircraftType';
    selectedAcType.value = options.acType;
  } else {
    viewMode.value = 'fleet';
    selectedAcType.value = '';
  }
});

// 初始化数据
onMounted(async () => {
  isLoading.value = true;
  
  try {
    
    // 先获取飞机数据
    await aircraftStore.fetchAircrafts();
    
    if (viewMode.value === 'fleet') {
      // 机队模式：获取机队和机型利用率数据
      await Promise.all([
        fetchFleetUtilization(),
        fetchAircraftTypeUtilization()
      ]);
    } else {
      // 机型模式：获取机型和飞机利用率数据
      await Promise.all([
        fetchAircraftTypeData(selectedAcType.value),
        fetchAircraftUtilizationByType(selectedAcType.value)
      ]);
    }
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
  .section-header {
    margin-bottom: 12px;
    padding: 0 4px;

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

// 飞机列表区域
.aircraft-list-section {
  .section-header {
    margin-bottom: 12px;
    padding: 0 4px;

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

  .aircraft-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>