<template>
  <div
    class="utilization-card"
    :class="{ 'compact-mode': compactMode, 'clickable': clickable }"
    @click="handleClick"
  >
    <div class="card-header">
      <h3 class="section-title">{{ title }}</h3>
      <div v-if="!loading && !error && utilizationData.summary" class="avg-utilization">
        <span class="avg-label">{{ avgLabel }}</span>
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
          :height="chartHeight"
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
  title?: string;
  avgLabel?: string;
  days?: number; // 显示最近几天的数据
  chartHeight?: number;
  compactMode?: boolean; // 紧凑模式，用于列表页面
  startDate?: string; // 自定义开始日期
  endDate?: string; // 自定义结束日期
  fleetMode?: boolean; // 机队模式，查询整个机队的利用率
  utilizationData?: AircraftUtilization | null; // 外部传入的利用率数据
  clickable?: boolean; // 是否可点击
}

const props = withDefaults(defineProps<Props>(), {
  acReg: '',
  title: '利用率',
  avgLabel: '30天平均',
  days: 7,
  chartHeight: 100,
  compactMode: false,
  startDate: '',
  endDate: '',
  fleetMode: false,
  utilizationData: null,
  clickable: false
});

// 定义事件
const emit = defineEmits<{
  dataLoaded: [data: AircraftUtilization];
  click: [];
}>();

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

  // 获取指定天数的数据
  const daysData = utilizationData.value.details.slice(-props.days);
  
  // 格式化日期显示 (MM-DD)
  const categories = daysData.map(item => dayjs(item.date).format('MM-DD'));
  
  // 获取利用率数据
  const series = [{
    name: '日利用率',
    data: daysData.map(item => item.utilization.toFixed(1))
  }];

  return {
    type: 'line',
    color: ['#137fec'],
    padding: props.compactMode ? [10, 5, 0, 10] : [15, 10, 0, 15],
    legend: {
      show: false
    },
    xAxis: {
      disableGrid: true,
      itemCount: props.days,
      scrollShow: false,
      fontSize: props.compactMode ? 8 : 10,
      fontColor: '#617589'
    },
    yAxis: {
      disabled: true,
      data: [{
        min: 0,
        max: Math.max(...daysData.map(item => item.utilization)) * 1.2 || 10
      }]
    },
    extra: {
      line: {
        type: 'curve',
        width: props.compactMode ? 1 : 2,
        activeType: 'hollow'
      }
    },
    categories,
    series
  };
});

// 获取飞机利用率数据
const fetchUtilizationData = async () => {
  // 如果有外部传入的数据，直接使用
  if (props.utilizationData) {
    utilizationData.value = props.utilizationData;
    return;
  }
  
  if (!props.acReg && !props.fleetMode) {
    error.value = '缺少飞机注册号';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    let startDate, endDate;
    
    if (props.startDate && props.endDate) {
      // 使用自定义日期范围
      startDate = dayjs(props.startDate);
      endDate = dayjs(props.endDate);
    } else {
      // 默认使用昨天和30天前的日期范围
      const yesterday = dayjs().subtract(1, 'day');
      const thirtyOneDaysAgo = yesterday.subtract(30, 'day');
      startDate = thirtyOneDaysAgo;
      endDate = yesterday;
    }

    // 调用API获取利用率数据
    const utilization = await getAircraftUtilization({
      acReg: props.fleetMode ? undefined : props.acReg,
      type: props.fleetMode ? 'ALL' : undefined,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD')
    });

    utilizationData.value = utilization;
    
    // 如果是机队模式，触发数据加载完成事件
    if (props.fleetMode) {
      emit('dataLoaded', utilization);
    }

  } catch (err) {
    console.error('获取飞机利用率失败:', err);
    error.value = '获取数据失败';
  } finally {
    loading.value = false;
  }
};

// 监听外部传入的数据变化
watch(() => props.utilizationData, (newData) => {
  if (newData) {
    utilizationData.value = newData;
  }
}, { immediate: true });

// 监听acReg变化，重新获取数据
watch(() => props.acReg, (newAcReg) => {
  if (newAcReg || props.fleetMode) {
    fetchUtilizationData();
  }
});

// 监听fleetMode变化，重新获取数据
watch(() => props.fleetMode, () => {
  if (props.fleetMode || props.acReg) {
    fetchUtilizationData();
  }
});

// 监听日期范围变化，重新获取数据
watch(() => [props.startDate, props.endDate], () => {
  if (props.acReg || props.fleetMode) {
    fetchUtilizationData();
  }
});

// 处理点击事件
const handleClick = () => {
  if (props.clickable) {
    emit('click');
  }
};
</script>

<style lang="less" scoped>
.utilization-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &.clickable {
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
      background-color: #f5f5f5;
      transform: scale(0.98);
    }
  }

  &.compact-mode {
    padding: 12px;
    margin: 0 0 8px 0;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

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

// 紧凑模式下的样式调整
.utilization-card.compact-mode {
  .card-header {
    margin-bottom: 12px;

    .section-title {
      font-size: 14px;
    }

    .avg-utilization {
      .avg-label {
        font-size: 10px;
      }

      .avg-value {
        font-size: 14px;
      }
    }
  }

  .chart-container {
    height: 80px;
  }
}
</style>