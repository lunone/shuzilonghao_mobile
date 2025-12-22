<template>
  <div class="utilization-card">
    <div class="card-header">
      <h3 class="section-title">利用率</h3>
      <div v-if="!loading && !error && utilizationData.summary" class="avg-utilization">
        <span class="avg-label">30天平均</span>
        <span class="avg-value">{{ utilizationData.summary.avgDailyUtilization.toFixed(1) }}h</span>
      </div>
    </div>
    
    <div class="chart-container">
      <div v-if="loading" class="loading-container">
        <p class="loading-text">加载中...</p>
      </div>
      <div v-else-if="error" class="error-container">
        <p class="error-text">获取失败</p>
      </div>
      <template v-else>
        <u-charts
          v-if="chartOption && chartOption.categories && chartOption.categories.length > 0"
          :option="chartOption"
          :height="100"
        />
        <div v-else class="no-data-container">
          <p class="no-data-text">暂无数据</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import dayjs from 'dayjs';
import { getAircraftUtilization, type AircraftUtilization, type DailyUtilization } from '@/api/aircraft.api';
import uCharts from '@/components/ucharts/ucharts.vue';

// Props
interface Props {
  acReg?: string;
}

const props = withDefaults(defineProps<Props>(), {
  acReg: ''
});

// 响应式数据
const utilizationData = ref<AircraftUtilization>({
  summary: {
    startDate: '',
    endDate: '',
    totalFlightMinutes: 0,
    totalFlightHours: 0,
    totalFleetDays: 0,
    avgDailyUtilization: 0
  },
  details: []
});
const loading = ref(false);
const error = ref('');

// 计算图表选项
const chartOption = computed(() => {
  if (!utilizationData.value.details || utilizationData.value.details.length === 0) {
    return null;
  }

  // 获取最近7天的数据
  const sevenDaysData = utilizationData.value.details.slice(-7);
  
  // 格式化日期显示 (MM-DD)
  const categories = sevenDaysData.map(item => dayjs(item.date).format('MM-DD'));
  
  // 获取利用率数据
  const series = [{
    name: '日利用率',
    data: sevenDaysData.map(item => item.utilization.toFixed(1))
  }];

  return {
    type: 'line',
    color: ['#137fec'],
    padding: [15, 10, 0, 15],
    legend: {
      show: false
    },
    xAxis: {
      disableGrid: true,
      itemCount: 7,
      scrollShow: false,
      fontSize: 10,
      fontColor: '#617589'
    },
    yAxis: {
      disabled: true,
      data: [{
        min: 0,
        max: Math.max(...sevenDaysData.map(item => item.utilization)) * 1.2 || 10
      }]
    },
    extra: {
      line: {
        type: 'curve',
        width: 2,
        activeType: 'hollow'
      }
    },
    categories,
    series
  };
});

// 获取飞机利用率数据
const fetchUtilizationData = async () => {
  if (!props.acReg) {
    error.value = '缺少飞机注册号';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const yesterday = dayjs().subtract(1, 'day');
    const thirtyOneDaysAgo = yesterday.subtract(30, 'day');

    // 调用API获取利用率数据（不包含今天当天）
    const utilization = await getAircraftUtilization({
      acReg: props.acReg,
      startDate: thirtyOneDaysAgo.format('YYYY-MM-DD'),
      endDate: yesterday.format('YYYY-MM-DD')
    });

    utilizationData.value = utilization;

  } catch (err) {
    console.error('获取飞机利用率失败:', err);
    error.value = '获取数据失败';
  } finally {
    loading.value = false;
  }
};

// 监听acReg变化，重新获取数据
watch(() => props.acReg, (newAcReg) => {
  if (newAcReg) {
    fetchUtilizationData();
  }
}, { immediate: true });
</script>

<style lang="less" scoped>
.utilization-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #111418;
      margin: 0;
    }

    .avg-utilization {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;

      .avg-label {
        font-size: 12px;
        color: #617589;
        margin: 0;
      }

      .avg-value {
        font-size: 18px;
        font-weight: bold;
        color: #137fec;
        margin: 0;
      }
    }
  }

  .chart-container {
    height: 100px;
    position: relative;

    .loading-container,
    .error-container,
    .no-data-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .loading-text,
      .error-text,
      .no-data-text {
        font-size: 14px;
        color: #617589;
        margin: 0;
      }
    }
  }
}
</style>