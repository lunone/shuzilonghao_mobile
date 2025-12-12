<template>
  <div class="mel-list-page">
    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="search-bar">
        <uni-icons type="search" size="16" color="#999" />
        <input 
          v-model="searchQuery"
          class="search-input"
          placeholder="搜索 MEL 编号、飞机号、描述..."
          @confirm="handleSearch"
        />
        <button 
          v-if="searchQuery"
          class="clear-btn"
          @click="clearSearch"
        >
          <uni-icons type="clear" size="14" color="#999" />
        </button>
      </div>
      <button class="advanced-search-btn" @click="showAdvancedSearch">
        <uni-icons type="settings" size="14" />
        高级搜索
      </button>
    </div>
    
    <!-- 快速筛选标签 -->
    <div class="filter-section">
      <div class="filter-tabs">
        <div 
          v-for="filter in quickFilters"
          :key="filter.key"
          class="filter-tab"
          :class="{ active: activeFilter === filter.key }"
          @click="setActiveFilter(filter.key)"
        >
          {{ filter.label }}
        </div>
      </div>
      
      <!-- 状态筛选 -->
      <div class="status-filters">
        <div 
          v-for="status in statusFilters"
          :key="status.value"
          class="status-filter"
          :class="{ active: selectedStatus === status.value }"
          @click="setStatusFilter(status.value)"
        >
          <span class="status-dot" :style="{ backgroundColor: status.color }"></span>
          {{ status.label }}
        </div>
      </div>
    </div>
    
    <!-- 排序和视图切换 -->
    <div class="control-section">
      <div class="sort-controls">
        <select :value="sortBy" @change="handleSortChange">
          <option value="inputterDate">按录入时间</option>
          <option value="applyDate">按申请时间</option>
          <option value="acReg">按飞机号</option>
          <option value="melNo">按 MEL 编号</option>
        </select>
        <button
          class="sort-order-btn"
          @click="toggleSortOrder"
        >
          <uni-icons :type="sortOrder === 'desc' ? 'arrowdown' : 'arrowup'" size="12" />
        </button>
      </div>
      
      <div class="view-controls">
        <button 
          class="view-btn"
          :class="{ active: viewMode === 'list' }"
          @click="setViewMode('list')"
        >
          <uni-icons type="list" size="14" />
        </button>
        <button 
          class="view-btn"
          :class="{ active: viewMode === 'card' }"
          @click="setViewMode('card')"
        >
          <uni-icons type="grid" size="14" />
        </button>
      </div>
    </div>
    
    <!-- MEL 列表内容 -->
    <div class="list-content">
      <!-- 加载状态 -->
      <div v-if="melStore.isLoadingAny" class="loading-state">
        <uni-load-more :status="getLoadingStatus()" :content-text="loadingText" />
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="melStore.error" class="error-state">
        <uni-icons type="error" size="24" color="#ff4757" />
        <p class="error-message">{{ melStore.error }}</p>
        <button @click="retryFetch" class="retry-btn">重试</button>
      </div>
      
      <!-- MEL 数据列表 -->
      <div v-else-if="melStore.hasData" class="mel-list">
        <!-- 列表视图 -->
        <template v-if="viewMode === 'list'">
          <div
            v-for="item in melStore.melList"
            :key="item.id"
            class="mel-item"
            @click="viewDetail(item)"
          >
            <div class="item-header">
              <div class="item-title">
                <span class="mel-no">{{ item.melNo }}</span>
                <span class="mel-type">{{ item.type }}</span>
              </div>
              <MelStatusBadge :status="item.status" />
            </div>
            
            <div class="item-content">
              <p class="description">{{ item.des }}</p>
              <div class="item-meta">
                <span class="aircraft-info">
                  <uni-icons type="aircraft" size="12" />
                  {{ item.acReg }} ({{ item.acType }})
                </span>
                <span class="ata-info">
                  <uni-icons type="settings" size="12" />
                  ATA {{ item.ata1 }}{{ item.ata2 ? '-' + item.ata2 : '' }}
                </span>
              </div>
              <div class="item-footer">
                <span class="date-info">
                  <uni-icons type="calendar" size="12" />
                  {{ formatDate(item.inputterDate) }}
                </span>
                <span class="creator-info">
                  录入: {{ item.inputter }}
                </span>
              </div>
            </div>
          </div>
        </template>
        
        <!-- 卡片视图 -->
        <template v-else>
          <div class="card-grid">
            <div
              v-for="item in melStore.melList"
              :key="item.id"
              class="mel-card"
              @click="viewDetail(item)"
            >
              <div class="card-header">
                <span class="card-mel-no">{{ item.melNo }}</span>
                <MelStatusBadge :status="item.status" size="small" />
              </div>
              
              <div class="card-content">
                <p class="card-description">{{ item.des }}</p>
                
                <div class="card-meta">
                  <div class="meta-item">
                    <uni-icons type="aircraft" size="12" />
                    <span>{{ item.acReg }}</span>
                  </div>
                  <div class="meta-item">
                    <uni-icons type="settings" size="12" />
                    <span>ATA {{ item.ata1 }}</span>
                  </div>
                  <div class="meta-item">
                    <uni-icons type="calendar" size="12" />
                    <span>{{ formatDate(item.inputterDate) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      
      <!-- 空数据状态 -->
      <div v-else class="no-data">
        <uni-icons type="info" size="48" color="#ccc" />
        <p>暂无 MEL 数据</p>
        <button @click="retryFetch" class="refresh-btn">刷新数据</button>
      </div>
    </div>
    
    <!-- 分页控件 -->
    <div v-if="melStore.pagination.totalPages > 1" class="pagination-section">
      <div class="pagination-info">
        <span>第 {{ melStore.pagination.currentPage }} 页</span>
        <span>共 {{ melStore.pagination.total }} 条</span>
      </div>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useMelStore } from '@/store/mel.store';
import { createMelQuery } from '@/api/mel.api';
import MelStatusBadge from '../../../components/mel/common/MelStatusBadge.vue';
import dayjs from 'dayjs';

const melStore = useMelStore();

// 响应式数据
const searchQuery = ref('');
const activeFilter = ref('all');
const selectedStatus = ref('');
const sortBy = ref('inputterDate');
const sortOrder = ref<'asc' | 'desc'>('desc');
const viewMode = ref<'list' | 'card'>('list');

// 快速筛选选项
const quickFilters = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'approved', label: '已批准' },
  { key: 'inProgress', label: '进行中' }
];

// 状态筛选选项
const statusFilters = [
  { value: '', label: '全部', color: '#666' },
  { value: '待批准', label: '待批准', color: '#f39c12' },
  { value: '已批准', label: '已批准', color: '#27ae60' },
  { value: '已拒绝', label: '已拒绝', color: '#e74c3c' },
  { value: '进行中', label: '进行中', color: '#3498db' }
];

// 计算属性
const loadingText = computed(() => {
  const loading = melStore.loading;
  if (loading.list) return '查询 MEL 数据中...';
  if (loading.aircraft) return '查询飞机 MEL 数据中...';
  if (loading.user) return '查询用户 MEL 数据中...';
  if (loading.dateRange) return '查询日期范围 MEL 数据中...';
  if (loading.ata) return '查询 ATA 章节 MEL 数据中...';
  return '加载中...';
});

const getLoadingStatus = () => {
  return melStore.isLoadingAny ? 'loading' : 'more';
};

// 方法
const handleSearch = () => {
  performSearch();
};

const clearSearch = () => {
  searchQuery.value = '';
  performSearch();
};

const showAdvancedSearch = () => {
  uni.navigateTo({
    url: '/pages/mel/list/search'
  });
};

const setActiveFilter = (filterKey: string) => {
  activeFilter.value = filterKey;
  
  // 根据筛选类型设置状态
  switch (filterKey) {
    case 'pending':
      selectedStatus.value = '待批准';
      break;
    case 'approved':
      selectedStatus.value = '已批准';
      break;
    case 'inProgress':
      selectedStatus.value = '进行中';
      break;
    default:
      selectedStatus.value = '';
  }
  
  performSearch();
};

const setStatusFilter = (status: string) => {
  selectedStatus.value = status;
  activeFilter.value = 'all';
  performSearch();
};

const handleSortChange = () => {
  performSearch();
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
  performSearch();
};

const setViewMode = (mode: 'list' | 'card') => {
  viewMode.value = mode;
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
  performSearch(page);
};

const retryFetch = () => {
  performSearch();
};

const performSearch = async (page = 1) => {
  try {
    let query = createMelQuery()
      .withPage(page)
      .withSize(20);
    
    // 添加搜索条件
    if (searchQuery.value) {
      query = query.withMEL(searchQuery.value);
    }
    
    // 添加状态筛选
    if (selectedStatus.value) {
      query = query.withStatus(selectedStatus.value);
    }
    
    // 添加排序
    query = query.withPage(page);
    
    // 执行查询
    await melStore.queryWithBuilder(query);
  } catch (error) {
    console.error('搜索失败:', error);
  }
};

// 监听器
watch([searchQuery, selectedStatus, sortBy, sortOrder], () => {
  performSearch(1);
});

// 生命周期
onMounted(() => {
  performSearch();
});
</script>

<style lang="less" scoped>
.mel-list-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px;
  
  .search-section {
    background: white;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    
    .search-bar {
      display: flex;
      align-items: center;
      background: #f8f9fa;
      border-radius: 20px;
      padding: 8px 16px;
      margin-bottom: 8px;
      
      .search-input {
        flex: 1;
        border: none;
        background: transparent;
        outline: none;
        font-size: 14px;
        margin: 0 8px;
      }
      
      .clear-btn {
        background: none;
        border: none;
        padding: 2px;
      }
    }
    
    .advanced-search-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 12px;
      color: #666;
    }
  }
  
  .filter-section {
    background: white;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    
    .filter-tabs {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      
      .filter-tab {
        padding: 6px 0;
        font-size: 14px;
        color: #666;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        
        &.active {
          color: #137fec;
          border-bottom-color: #137fec;
        }
      }
    }
    
    .status-filters {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      
      .status-filter {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        background: #f8f9fa;
        color: #666;
        cursor: pointer;
        
        &.active {
          background: #e6f7ff;
          color: #137fec;
        }
        
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      }
    }
  }
  
  .control-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: white;
    border-bottom: 1px solid #f0f0f0;
    
    .sort-controls {
      display: flex;
      align-items: center;
      gap: 4px;
      
      select {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
      }
      
      .sort-order-btn {
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 4px;
      }
    }
    
    .view-controls {
      display: flex;
      gap: 4px;
      
      .view-btn {
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 6px;
        
        &.active {
          background: #137fec;
          color: white;
          border-color: #137fec;
        }
      }
    }
  }
  
  .list-content {
    padding: 8px 16px;
    
    .loading-state, .error-state, .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
      
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
            }
            
            .mel-type {
              font-size: 12px;
              color: #666;
              background: #f0f0f0;
              padding: 2px 6px;
              border-radius: 4px;
            }
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
            margin-bottom: 8px;
            
            .aircraft-info, .ata-info {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: #666;
            }
          }
          
          .item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .date-info, .creator-info {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 11px;
              color: #999;
            }
          }
        }
      }
    }
    
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
      
      .mel-card {
        background: white;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          
          .card-mel-no {
            font-weight: bold;
            color: #333;
            font-size: 14px;
          }
        }
        
        .card-content {
          .card-description {
            font-size: 13px;
            color: #333;
            margin-bottom: 12px;
            line-height: 1.4;
          }
          
          .card-meta {
            display: flex;
            flex-direction: column;
            gap: 6px;
            
            .meta-item {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 11px;
              color: #666;
            }
          }
        }
      }
    }
  }
  
  .pagination-section {
    background: white;
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;
    
    .pagination-info {
      display: flex;
      justify-content: center;
      gap: 16px;
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }
    
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
      
      .page-info {
        font-size: 12px;
        color: #666;
      }
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mel-list-page {
    .filter-section {
      .filter-tabs {
        gap: 12px;
        
        .filter-tab {
          font-size: 13px;
        }
      }
      
      .status-filters {
        gap: 8px;
        
        .status-filter {
          font-size: 11px;
          padding: 3px 6px;
        }
      }
    }
    
    .list-content {
      padding: 8px 12px;
      
      .card-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>