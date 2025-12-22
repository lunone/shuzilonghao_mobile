<template>
  <div class="recent-flights-card">
    <h3 class="section-title">近7天执飞航班列表</h3>
    <div class="flights-list">
      <div v-if="loading" class="flight-item">
        <p class="loading-text">加载中...</p>
      </div>
      <div v-else-if="error" class="flight-item">
        <p class="error-text">{{ error }}</p>
      </div>
      <div v-else-if="recentFlights.length === 0" class="flight-item">
        <p class="no-data-text">暂无航班数据</p>
      </div>
      <template v-else>
        <div
          v-for="flight in recentFlights"
          :key="flight.id"
          class="flight-item"
          @click="goToFlightDetail(flight)"
        >
          <div class="flight-info">
            <p class="flight-date">{{ formatDate(flight.date) }}</p>
            <p class="flight-route">{{ flight.flightNo }} {{ flight.dep }}-{{ flight.arr }}</p>
          </div>
          <div class="flight-duration">
            <p class="duration-label">载重</p>
            <p class="duration-value">{{ flight.netWeightCargo || 0 }}kg</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import dayjs from 'dayjs';
import { getRecentFlights } from '@/api/flight.api';
import type { FlightItem } from '@/api/flight.api';

// Props
interface Props {
  acReg?: string;
}

const props = withDefaults(defineProps<Props>(), {
  acReg: ''
});

// 响应式数据
const recentFlights = ref<FlightItem[]>([]);
const loading = ref(false);
const error = ref('');

// 格式化日期显示
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    return dayjs(dateString).format('MM月DD日');
  } catch {
    return dateString;
  }
};

// 获取最近执飞航班数据
const fetchRecentFlights = async () => {
  if (!props.acReg) {
    error.value = '缺少飞机注册号';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const today = dayjs();
    const sevenDaysAgo = today.subtract(7, 'day');

    // 调用API获取最近执飞航班
    const flights = await getRecentFlights({
      acReg: props.acReg,
      startDate: sevenDaysAgo.format('YYYY-MM-DD'),
      endDate: today.format('YYYY-MM-DD')
    });

    recentFlights.value = flights || [];

  } catch (err) {
    console.error('获取最近执飞航班失败:', err);
    error.value = '获取数据失败';
    recentFlights.value = [];
  } finally {
    loading.value = false;
  }
};

// 跳转到航班详情页
const goToFlightDetail = (flight: FlightItem) => {
  uni.navigateTo({
    url: `/pages/flight/detail?flightId=${flight.id}`
  });
};

// 监听acReg变化，重新获取数据
watch(() => props.acReg, (newAcReg) => {
  if (newAcReg) {
    fetchRecentFlights();
  }
}, { immediate: true });
</script>

<style lang="less" scoped>
.recent-flights-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #111418;
    padding: 16px 16px 8px;
    margin: 0;
  }

  .flights-list {
    .flight-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background-color: #f5f5f5;
      }

      &:hover {
        background-color: #fafafa;
      }

      .flight-info {
        flex: 1;

        .flight-date {
          font-size: 12px;
          color: #617589;
          margin: 0 0 4px 0;
        }

        .flight-route {
          font-size: 14px;
          font-weight: 500;
          color: #111418;
          margin: 0;
        }
      }

      .flight-duration {
        text-align: right;

        .duration-label {
          font-size: 12px;
          color: #617589;
          margin: 0 0 4px 0;
        }

        .duration-value {
          font-size: 14px;
          font-weight: 500;
          color: #111418;
          margin: 0;
        }
      }
    }
  }
}
</style>