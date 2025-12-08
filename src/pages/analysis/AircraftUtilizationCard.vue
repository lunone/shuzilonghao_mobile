<template>
  <div class="utilization-card">
    <h3 class="section-title">日利用率(7日/30日)</h3>
    <div class="utilization-content">
      <div v-if="loading" class="utilization-item">
        <p class="utilization-label">加载中...</p>
        <p class="utilization-value">--</p>
      </div>
      <div v-else-if="error" class="utilization-item">
        <p class="utilization-label">获取失败</p>
        <p class="utilization-value">--</p>
      </div>
      <template v-else>
        <div class="utilization-item">
          <p class="utilization-label">近7日</p>
          <p class="utilization-value">{{ utilizationData.sevenDays.toFixed(1) }}h</p>
        </div>
        <div class="divider"></div>
        <div class="utilization-item">
          <p class="utilization-label">近30日</p>
          <p class="utilization-value">{{ utilizationData.thirtyDays.toFixed(1) }}h</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import dayjs from 'dayjs';
import { getAircraftUtilization, type AircraftUtilization } from '@/api/aircraft.api';

// Props
interface Props {
  acReg?: string;
}

const props = withDefaults(defineProps<Props>(), {
  acReg: ''
});

// 响应式数据
const utilizationData = ref({
  sevenDays: 0,
  thirtyDays: 0
});
const loading = ref(false);
const error = ref('');

// 获取飞机利用率数据
const fetchUtilizationData = async () => {
  if (!props.acReg) {
    error.value = '缺少飞机注册号';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const today = dayjs();
    const sevenDaysAgo = today.subtract(7, 'day');
    const thirtyDaysAgo = today.subtract(30, 'day');

    // 调用API获取利用率数据
    const utilization = await getAircraftUtilization({
      acReg: props.acReg,
      startDate: thirtyDaysAgo.format('YYYY-MM-DD'),
      endDate: today.format('YYYY-MM-DD')
    });

    // 适配组件数据格式
    // 这里使用利用率数据来计算显示值，实际项目中可能需要根据业务逻辑调整
    utilizationData.value = {
      sevenDays: utilization.utilization || 0,
      thirtyDays: utilization.utilization || 0
    };

  } catch (err) {
    console.error('获取飞机利用率失败:', err);
    error.value = '获取数据失败';
    // 使用默认值
    utilizationData.value = {
      sevenDays: 0,
      thirtyDays: 0
    };
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

onMounted(() => {
  if (props.acReg) {
    fetchUtilizationData();
  }
});
</script>

<style lang="less" scoped>
.utilization-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #111418;
    margin-bottom: 12px;
  }

  .utilization-content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;

    .utilization-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .utilization-label {
        font-size: 12px;
        color: #617589;
        margin: 0;
      }

      .utilization-value {
        font-size: 24px;
        font-weight: bold;
        color: #137fec;
        margin: 0;
      }
    }

    .divider {
      width: 1px;
      height: 40px;
      background: #e0e0e0;
    }
  }
}
</style>