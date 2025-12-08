<template>
  <view v-if="visible" class="flight-detail-overlay" @click="closeDetail">
    <view class="flight-detail-panel" @click.stop>
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>

      <view v-else-if="flightDetail" class="detail-content">
        <view class="detail-section">
          <text class="section-title">时间信息</text>
          <view class="detail-row">
            <text class="detail-label">计划起飞:</text>
            <text class="detail-value">{{ formatTime(flightDetail.std) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">预计起飞:</text>
            <text class="detail-value">{{ flightDetail.etd ? formatTime(flightDetail.etd) : '--' }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">实际起飞:</text>
            <text class="detail-value">{{ flightDetail.atd ? formatTime(flightDetail.atd) : '--' }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">计划到达:</text>
            <text class="detail-value">{{ formatTime(flightDetail.sta) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">预计到达:</text>
            <text class="detail-value">{{ flightDetail.eta ? formatTime(flightDetail.eta) : '--' }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">实际到达:</text>
            <text class="detail-value">{{ flightDetail.ata ? formatTime(flightDetail.ata) : '--' }}</text>
          </view>
        </view>

        <view class="detail-section">
          <text class="section-title">其他信息</text>
          <view class="detail-row">
            <text class="detail-label">航班性质:</text>
            <text class="detail-value">{{ flightDetail.flightKind || '正班' }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">到达机位:</text>
            <text class="detail-value">{{ flightDetail.bay }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">载重信息:</text>
            <text class="detail-value">{{ flightDetail.netWeightCargo }}kg</text>
          </view>
        </view>
      </view>

      <view v-else class="error">
        <text>获取航班详情失败</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getFlightDetail } from '@/api/flight.api'
import type { FlightItem } from '@/api/flight.api'

// Props
interface Props {
  visible: boolean
  flightId?: number
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  flightId: undefined
})

// Emits
const emit = defineEmits<{
  close: []
}>()

// 响应式数据
const loading = ref(false)
const flightDetail = ref<FlightItem | null>(null)

// 从服务器获取数据
const fetchFlightDetail = async (id: number) => {
  if (!id) {
    flightDetail.value = null;
    return;
  }

  loading.value = true
  try {
    // 调用真实API - API: POST /api/flight/detail
    const data = await getFlightDetail({ flightId: id });
    flightDetail.value = data;
  } catch (error) {
    console.error('获取航班详情失败:', error)
    flightDetail.value = null
  } finally {
    loading.value = false
  }
}

// 监听flightId变化
watch(() => props.flightId, (newId) => {
  if (newId && props.visible) {
    fetchFlightDetail(newId)
  }
})

// 监听visible变化
watch(() => props.visible, (visible) => {
  if (visible && props.flightId) {
    fetchFlightDetail(props.flightId)
  } else if (!visible) {
    flightDetail.value = null
  }
})

// 初始化
onMounted(() => {
  if (props.visible && props.flightId) {
    fetchFlightDetail(props.flightId)
  }
})

// 方法
const closeDetail = () => {
  emit('close')
}

const formatTime = (time: string) => {
  return time || '--'
}
</script>

<style lang="less" scoped>
.flight-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flight-detail-panel {
  background: white;
  border-radius: 8px;
  width: 90vw;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .loading, .error {
    padding: 40px 20px;
    text-align: center;
    color: #666;
  }

  .detail-content {
    padding: 20px;

    .detail-section {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

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
        align-items: center;

        &:last-child {
          margin-bottom: 0;
        }

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
