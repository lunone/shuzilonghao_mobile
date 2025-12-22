<template>
  <div class="mel-retention-card">
    <h3 class="section-title">MEL保留单列表</h3>
    
    <!-- 加载状态 -->
    <div v-if="melStore.isLoadingAny" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
      </div>
      <p class="loading-message">{{ loadingText }}</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="melStore.error" class="error-state">
      <uni-icons type="error" size="24" color="#ff4757" />
      <p class="error-message">{{ melStore.error }}</p>
      <button @click="retryFetch" class="retry-btn">重试</button>
    </div>
    
    <!-- MEL数据列表 -->
    <div v-else-if="melStore.hasData" class="mel-list">
      <div
        v-for="mel in melStore.melList"
        :key="mel.id"
        class="mel-item"
        @click="viewMelDetail(mel.id, mel.source)"
      >
        <div class="mel-header">
          <span class="mel-id">{{ mel.melNo }}</span>
          <span class="mel-category">{{ mel.type }}</span>
        </div>
        <div class="mel-dates">
          <span class="date-item">
            <uni-icons type="calendar" size="14" />
            {{ formatDate(mel.applyDate) }}
          </span>
          <span class="status" :class="getStatusClass(mel.status)">{{ mel.status }}</span>
        </div>
        <div class="mel-flags">
          <span class="deferral-class">{{ mel.deffer }} 类</span>
          <span class="ata-code" v-if="mel.ata1">ATA {{ mel.ata1 }}-{{ mel.ata2 || '00' }}</span>
        </div>
        <div class="mel-content">{{ mel.des }}</div>
        <div class="mel-meta">
          <span class="aircraft-info">
            <uni-icons type="info" size="12" />
            {{ mel.acReg }} ({{ mel.acType }})
          </span>
          <span class="creator-info">
            录入: {{ mel.inputter }}
          </span>
          <small class="time-info">
            {{ formatDateTime(mel.inputterDate) }}
          </small>
        </div>
      </div>
      
      <!-- 分页信息 -->
      <div v-if="melStore.pagination.totalPages > 1" class="pagination-info">
        <text>第 {{ melStore.pagination.currentPage }} 页，共 {{ melStore.pagination.totalPages }} 页</text>
        <text>{{ melStore.pagination.total }} 条记录</text>
      </div>
    </div>
    
    <!-- 空数据状态 -->
    <div v-else class="no-data">
      <uni-icons type="info" size="48" color="#ccc" />
      <p>暂无MEL保留单数据</p>
      <button @click="fetchDefaultData" class="refresh-btn">刷新数据</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useMelStore } from '@/store/mel.store';
import type { VMel } from '@/types/mel';
import { createMelQuery } from '@/api/mel.api';
import dayjs from 'dayjs';

const props = defineProps<{
  acReg?: string;           // 飞机注册号
  startDate?: string;       // 开始日期
  endDate?: string;         // 结束日期
  dateType?: string;        // 日期类型
  showStats?: boolean;      // 是否显示统计
}>();

const melStore = useMelStore();

// 加载状态文本
const loadingText = computed(() => {
  const loading = melStore.loading;
  if (loading.aircraft) return '查询飞机MEL数据中...';
  if (loading.user) return '查询用户MEL数据中...';
  if (loading.dateRange) return '查询日期范围MEL数据中...';
  if (loading.ata) return '查询ATA章节MEL数据中...';
  if (loading.stats) return '获取统计数据中...';
  return '加载中...';
});

// 获取加载状态
const getLoadingStatus = () => {
  return melStore.isLoadingAny ? 'loading' : 'more';
};

// 格式化日期
const formatDate = (date?: string) => {
  if (!date) return '未设置';
  return dayjs(date).format('YYYY-MM-DD');
};

// 格式化日期时间
const formatDateTime = (date?: string) => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

// 获取状态样式类
const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '已批准': 'status-approved',
    '待批准': 'status-pending', 
    '已拒绝': 'status-rejected',
    '进行中': 'status-progress'
  };
  return statusMap[status] || 'status-default';
};

// 查询方法 - 修复后的逻辑
const fetchDefaultData = async () => {
  try {
    console.log('MEL组件查询参数:', {
      acReg: props.acReg,
      startDate: props.startDate,
      endDate: props.endDate,
      dateType: props.dateType
    });

    if (props.acReg && props.startDate && props.endDate) {
      // 场景1: 有飞机号和日期范围 → 使用通用查询（包含飞机号）
      console.log('使用通用查询（飞机号+日期范围）');
      await melStore.queryWithBuilder(
        createMelQuery()
          .withAircraft(props.acReg)
          .withDateRange(props.startDate, props.endDate, props.dateType)
      );
    } else if (props.acReg) {
      // 场景2: 只有飞机号 → 按飞机查询
      console.log('按飞机查询');
      await melStore.queryByAircraft(props.acReg);
    } else if (props.startDate && props.endDate) {
      // 场景3: 只有日期范围 → 按日期范围查询
      console.log('按日期范围查询');
      await melStore.queryByDateRange(props.startDate, props.endDate, props.dateType);
    } else {
      // 场景4: 无参数 → 默认查询（最近一个月）
      console.log('默认查询');
      await melStore.fetchDefaultData();
    }
    
    // 如果需要显示统计信息
    if (props.showStats) {
      await melStore.fetchStatusStats();
    }
  } catch (error) {
    console.error('获取MEL数据失败:', error);
  }
};

// 链式调用示例：高级查询
const fetchAdvancedQuery = async () => {
  try {
    // 使用链式调用构建复杂查询
    const result = await createMelQuery()
      .withAircraft(props.acReg || 'B-1234')
      .withDateRange(
        props.startDate || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        props.endDate || dayjs().format('YYYY-MM-DD'),
        props.dateType || 'inputterDate'
      )
      .withStatus('已批准')
      .withPage(1)
      .withSize(20)
      .list();
    
    console.log('链式调用查询结果:', result);
  } catch (error) {
    console.error('链式调用查询失败:', error);
  }
};

// 查看MEL详情
const viewMelDetail = async (id: number, source: string) => {
  console.log('点击MEL项，ID:', id, 'Source:', source);
  
  try {
    // 跳转到详情页面
    const url = `/pages/maintenance/mel/melDetail?id=${id}&source=${source || ''}`;
    console.log('跳转URL:', url);
    
    uni.navigateTo({
      url: url
    });
  } catch (error) {
    console.error('跳转到MEL详情页面失败:', error);
    uni.showToast({
      title: '跳转失败',
      icon: 'none'
    });
  }
};

// 重试获取数据
const retryFetch = () => {
  fetchDefaultData();
};

// 监听acReg变化
watch(() => props.acReg, (newAcReg) => {
  if (newAcReg) {
    fetchDefaultData();
  }
});

// 监听日期参数变化
watch(() => [props.startDate, props.endDate], () => {
  if (props.startDate && props.endDate) {
    fetchDefaultData();
  }
});

// 组件挂载时获取数据
onMounted(() => {
  fetchDefaultData();
  // 如果需要演示链式调用，可以取消下面的注释
  // fetchAdvancedQuery();
});

// 导出方法供父组件使用
defineExpose({
  fetchDefaultData,
  fetchAdvancedQuery,
  refresh: retryFetch
});
</script>

<style lang="less" scoped>
.mel-retention-card {
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
    border-bottom: 1px solid #f0f0f0;
  }

  .loading-state, .error-state, .no-data {
    padding: 40px 20px;
    text-align: center;
    
    .loading-spinner {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
      justify-content: center;
      
      .spinner-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #777;
        animation: loading-bounce 1.4s infinite ease-in-out both;
        
        &:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        &:nth-child(2) {
          animation-delay: -0.16s;
        }
      }
    }
    
    .loading-message {
      font-size: 14px;
      color: #777;
      margin: 0;
    }
    
    .error-message {
      color: #ff4757;
      margin: 12px 0;
    }
    
    .retry-btn, .refresh-btn {
      background: #137fec;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      margin-top: 12px;
    }
  }

  .mel-list {
    .mel-item {
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background-color: #f8f9fa;
      }

      .mel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .mel-id {
          font-weight: bold;
          color: #111418;
          font-size: 14px;
        }

        .mel-category {
          color: #666;
          font-size: 12px;
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 4px;
        }
      }

      .mel-dates {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .date-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #777;
        }

        .status {
          font-size: 12px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 4px;
          
          &.status-approved {
            color: #27ae60;
            background: #d4edda;
          }
          
          &.status-pending {
            color: #f39c12;
            background: #fff3cd;
          }
          
          &.status-rejected {
            color: #e74c3c;
            background: #f8d7da;
          }
          
          &.status-progress {
            color: #3498db;
            background: #d1ecf1;
          }
          
          &.status-default {
            color: #666;
            background: #f0f0f0;
          }
        }
      }

      .mel-flags {
        display: flex;
        gap: 12px;
        margin-bottom: 8px;

        .deferral-class {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .ata-code {
          font-size: 12px;
          color: #137fec;
          font-weight: 500;
        }
      }

      .mel-content {
        font-size: 13px;
        color: #333;
        margin-bottom: 8px;
        line-height: 1.4;
      }

      .mel-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;

        .aircraft-info, .creator-info {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #999;
        }

        .time-info {
          font-size: 11px;
          color: #999;
          margin-left: auto;
        }
      }
      
      @keyframes loading-bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
    }

    .pagination-info {
      padding: 12px 16px;
      background: #f8f9fa;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e9ecef;
    }
  }
}
</style>