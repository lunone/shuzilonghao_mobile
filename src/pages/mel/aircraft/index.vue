<template>
  <div class="mel-aircraft-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">按飞机查询</h1>
      <p class="page-subtitle">根据飞机注册号查询 MEL 记录</p>
    </div>
    
    <!-- 飞机选择 -->
    <div class="aircraft-selector">
      <div class="selector-header">
        <h3 class="selector-title">选择飞机</h3>
        <button 
          v-if="selectedAircraft"
          class="clear-btn"
          @click="clearSelection"
        >
          清除选择
        </button>
      </div>
      
      <div class="search-box">
        <uni-icons type="search" size="16" color="#999" />
        <input 
          v-model="searchQuery"
          class="search-input"
          placeholder="搜索飞机注册号..."
          @input="filterAircraft"
        />
      </div>
      
      <div class="aircraft-list">
        <div 
          v-for="aircraft in filteredAircraft"
          :key="aircraft.value"
          class="aircraft-item"
          :class="{ selected: selectedAircraft === aircraft.value }"
          @click="selectAircraft(aircraft)"
        >
          <div class="aircraft-info">
            <span class="aircraft-reg">{{ aircraft.text }}</span>
            <span class="aircraft-type">{{ aircraft.type }}</span>
          </div>
          <uni-icons 
            v-if="selectedAircraft === aircraft.value"
            type="checkmarkempty" 
            size="16" 
            color="#27ae60" 
          />
        </div>
      </div>
    </div>
    
    <!-- 查询结果 -->
    <div v-if="selectedAircraft" class="query-results">
      <div class="results-header">
        <h3 class="results-title">查询结果</h3>
        <div class="results-info">
          <span class="total-count">共 {{ melStore.pagination.total }} 条记录</span>
          <button 
            class="refresh-btn"
            @click="refreshQuery"
            :disabled="melStore.loading.aircraft"
          >
            <uni-icons type="refresh" size="14" />
            刷新
          </button>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="melStore.loading.aircraft" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-dot"></div>
          <div class="spinner-dot"></div>
          <div class="spinner-dot"></div>
        </div>
        <p class="loading-message">查询中...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="melStore.error" class="error-state">
        <uni-icons type="error" size="24" color="#ff4757" />
        <p class="error-message">{{ melStore.error }}</p>
        <button @click="refreshQuery" class="retry-btn">重试</button>
      </div>
      
      <!-- MEL 列表 -->
      <div v-else-if="melStore.hasData" class="mel-list">
        <div
          v-for="item in melStore.melList"
          :key="item.id"
          class="mel-item"
          @click="viewDetail(item)"
        >
          <div class="item-header">
            <div class="item-title">
              <span class="mel-no">{{ item.melNo }}</span>
              <MelStatusBadge :status="item.status" size="small" />
            </div>
            <span class="item-date">{{ formatDate(item.inputterDate) }}</span>
          </div>
          
          <div class="item-content">
            <p class="description">{{ item.des }}</p>
            <div class="item-meta">
              <span class="ata-info">
                <uni-icons type="settings" size="12" />
                ATA {{ item.ata1 }}{{ item.ata2 ? '-' + item.ata2 : '' }}
              </span>
              <span class="creator-info">
                录入: {{ item.inputter }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空数据状态 -->
      <div v-else class="no-data">
        <uni-icons type="info" size="48" color="#ccc" />
        <p>该飞机暂无 MEL 记录</p>
      </div>
      
      <!-- 分页控件 -->
      <div v-if="melStore.pagination.totalPages > 1" class="pagination-section">
        <div class="pagination-controls">
          <button 
            class="page-btn"
            :disabled="melStore.pagination.currentPage <= 1"
            @click="goToPage(melStore.pagination.currentPage - 1)"
          >
            上一页
          </button>
          <span class="page-info">{{ melStore.pagination.currentPage }} / {{ melStore.pagination.totalPages }}</span>
          <button 
            class="page-btn"
            :disabled="melStore.pagination.currentPage >= melStore.pagination.totalPages"
            @click="goToPage(melStore.pagination.currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useMelStore } from '@/store/mel.store';
import MelStatusBadge from '@/components/mel/common/MelStatusBadge.vue';
import dayjs from 'dayjs';

const melStore = useMelStore();

// 响应式数据
const searchQuery = ref('');
const selectedAircraft = ref('');

// 飞机选项数据
const aircraftOptions = ref([
  { value: 'B-1234', text: 'B-1234', type: 'A320' },
  { value: 'B-5678', text: 'B-5678', type: 'A330' },
  { value: 'B-9012', text: 'B-9012', type: 'B737' },
  { value: 'B-3456', text: 'B-3456', type: 'A350' },
  { value: 'B-7890', text: 'B-7890', type: 'B777' }
]);

// 过滤后的飞机列表
const filteredAircraft = computed(() => {
  if (!searchQuery.value) {
    return aircraftOptions.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return aircraftOptions.value.filter(aircraft => 
    aircraft.text.toLowerCase().includes(query) ||
    aircraft.type.toLowerCase().includes(query)
  );
});

// 方法
const filterAircraft = () => {
  // 搜索逻辑已在 computed 中处理
};

const selectAircraft = (aircraft: any) => {
  selectedAircraft.value = aircraft.value;
  queryByAircraft();
};

const clearSelection = () => {
  selectedAircraft.value = '';
  melStore.clearData();
};

const queryByAircraft = async (page = 1) => {
  if (!selectedAircraft.value) return;
  
  try {
    await melStore.queryByAircraft(selectedAircraft.value, page, 20);
  } catch (error) {
    console.error('查询飞机 MEL 失败:', error);
  }
};

const refreshQuery = () => {
  queryByAircraft(melStore.pagination.currentPage);
};

const viewDetail = (item: any) => {
  uni.navigateTo({
    url: `/pages/mel/detail/index?id=${item.id}&source=${item.source}`
  });
};

const formatDate = (date?: string) => {
  if (!date) return '';
  return dayjs(date).format('MM-DD HH:mm');
};

const goToPage = (page: number) => {
  if (page < 1 || page > melStore.pagination.totalPages) return;
  queryByAircraft(page);
};

// 监听器
watch(selectedAircraft, (newValue) => {
  if (newValue) {
    queryByAircraft();
  }
});

// 生命周期
onMounted(() => {
  // 可以在这里加载飞机选项数据
});
</script>

<style lang="less" scoped>
.mel-aircraft-page {
  padding: 16px;
  background: #f5f5f5;
  min-height: 100vh;
  
  .page-header {
    text-align: center;
    margin-bottom: 24px;
    
    .page-title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }
    
    .page-subtitle {
      font-size: 14px;
      color: #666;
    }
  }
  
  .aircraft-selector {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    
    .selector-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .selector-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      
      .clear-btn {
        background: none;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        color: #666;
      }
    }
    
    .search-box {
      display: flex;
      align-items: center;
      background: #f8f9fa;
      border-radius: 20px;
      padding: 8px 16px;
      margin-bottom: 16px;
      
      .search-input {
        flex: 1;
        border: none;
        background: transparent;
        outline: none;
        font-size: 14px;
        margin: 0 8px;
      }
    }
    
    .aircraft-list {
      .aircraft-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          background: #f8f9fa;
        }
        
        &.selected {
          background: #e6f7ff;
          border: 1px solid #137fec;
        }
        
        .aircraft-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          
          .aircraft-reg {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
          
          .aircraft-type {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
  
  .query-results {
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .results-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      
      .results-info {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .total-count {
          font-size: 12px;
          color: #666;
        }
        
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 12px;
          color: #666;
          
          &:disabled {
            opacity: 0.5;
          }
        }
      }
    }
    
    .loading-state, .error-state, .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
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
      
      .retry-btn {
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
        background: white;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          
          .item-title {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .mel-no {
              font-weight: bold;
              color: #333;
              font-size: 14px;
            }
          }
          
          .item-date {
            font-size: 12px;
            color: #999;
          }
        }
        
        .item-content {
          .description {
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
            line-height: 1.4;
          }
          
          .item-meta {
            display: flex;
            gap: 16px;
            
            .ata-info, .creator-info {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: #666;
            }
          }
        }
      }
    }
    
    .pagination-section {
      margin-top: 16px;
      
      .pagination-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        
        .page-btn {
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 12px;
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
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
        
        .page-info {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mel-aircraft-page {
    padding: 12px;
    
    .aircraft-selector {
      padding: 12px;
    }
  }
}
</style>