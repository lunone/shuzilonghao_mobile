<template>
  <div class="mel-stats-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">MEL 统计概览</h1>
      <p class="page-subtitle">整体数据统计分析</p>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="melStore.loading.stats" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
      </div>
      <p class="loading-message">加载统计数据中...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="melStore.error" class="error-state">
      <uni-icons type="error" size="48" color="#ff4757" />
      <p class="error-message">{{ melStore.error }}</p>
      <button @click="fetchStats" class="retry-btn">重试</button>
    </div>
    
    <!-- 统计内容 -->
    <div v-else-if="statsData" class="stats-content">
      <!-- 总览卡片 -->
      <div class="overview-cards">
        <div class="stat-card">
          <div class="stat-icon total">
            <uni-icons type="list" size="24" color="#137fec" />
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ statsData.totalCount }}</div>
            <div class="stat-label">总记录数</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon pending">
            <uni-icons type="clock" size="24" color="#f39c12" />
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ getStatusCount('待批准') }}</div>
            <div class="stat-label">待批准</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon progress">
            <uni-icons type="loop" size="24" color="#3498db" />
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ getStatusCount('进行中') }}</div>
            <div class="stat-label">进行中</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon approved">
            <uni-icons type="checkmarkempty" size="24" color="#27ae60" />
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ getStatusCount('已批准') }}</div>
            <div class="stat-label">已批准</div>
          </div>
        </div>
      </div>
      
      <!-- 状态分布 -->
      <div class="chart-section">
        <h3 class="section-title">状态分布</h3>
        <div class="chart-container">
          <div class="status-chart">
            <div 
              v-for="(count, status) in statsData.statusDistribution"
              :key="status"
              class="status-item"
            >
              <div class="status-bar">
                <div 
                  class="status-fill"
                  :style="{ 
                    width: `${(count / statsData.totalCount) * 100}%`,
                    backgroundColor: getStatusColor(status)
                  }"
                ></div>
              </div>
              <div class="status-info">
                <span class="status-name">{{ status }}</span>
                <span class="status-count">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- ATA 章节分布 -->
      <div class="chart-section">
        <h3 class="section-title">ATA 章节分布</h3>
        <div class="chart-container">
          <div class="ata-chart">
            <div 
              v-for="(count, ata) in getTopATA(10)"
              :key="ata"
              class="ata-item"
            >
              <div class="ata-info">
                <span class="ata-code">{{ ata }}</span>
                <span class="ata-count">{{ count }}</span>
              </div>
              <div class="ata-bar">
                <div 
                  class="ata-fill"
                  :style="{ 
                    width: `${(count / getTopATA(10)[Object.keys(getTopATA(10))[0]]) * 100}%`
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 快速操作 -->
      <div class="quick-actions">
        <h3 class="section-title">快速操作</h3>
        <div class="action-grid">
          <button 
            class="action-btn"
            @click="navigateTo('/pages/mel/list/index')"
          >
            <uni-icons type="list" size="20" />
            <span>查看列表</span>
          </button>
          
          <button 
            class="action-btn"
            @click="navigateTo('/pages/mel/stats/status')"
          >
            <uni-icons type="flag" size="20" />
            <span>状态统计</span>
          </button>
          
          <button 
            class="action-btn"
            @click="navigateTo('/pages/mel/stats/ata')"
          >
            <uni-icons type="settings" size="20" />
            <span>ATA 统计</span>
          </button>
          
          <button 
            class="action-btn"
            @click="navigateTo('/pages/mel/stats/monthly')"
          >
            <uni-icons type="calendar" size="20" />
            <span>月度统计</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 空数据状态 -->
    <div v-else class="no-data">
      <uni-icons type="info" size="48" color="#ccc" />
      <p>暂无统计数据</p>
      <button @click="fetchStats" class="refresh-btn">刷新数据</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useMelStore } from '@/store/mel.store';
import { createMelQuery } from '@/api/mel.api';

const melStore = useMelStore();

// 统计数据
const statsData = computed(() => melStore.statsData);

// 获取状态数量
const getStatusCount = (status: string) => {
  return statsData.value?.statusDistribution?.[status] || 0;
};

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    '已批准': '#27ae60',
    '待批准': '#f39c12',
    '已拒绝': '#e74c3c',
    '进行中': '#3498db',
    '已关闭': '#95a5a6'
  };
  return colorMap[status] || '#666';
};

// 获取前 N 个 ATA 章节
const getTopATA = (limit: number) => {
  if (!statsData.value?.ataDistribution) return {};
  
  const entries = Object.entries(statsData.value.ataDistribution);
  const sorted = entries.sort(([, a], [, b]) => b - a);
  const top = sorted.slice(0, limit);
  
  return Object.fromEntries(top);
};

// 获取统计数据
const fetchStats = async () => {
  try {
    const query = createMelQuery();
    await melStore.fetchStats(query);
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};

// 页面导航
const navigateTo = (url: string) => {
  uni.navigateTo({
    url,
    fail: (err) => {
      console.error('导航失败:', err);
      uni.showToast({
        title: '页面暂未开放',
        icon: 'none'
      });
    }
  });
};

// 生命周期
onMounted(() => {
  fetchStats();
});
</script>

<style lang="less" scoped>
.mel-stats-page {
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
  
  .loading-state, .error-state, .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
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
      font-size: 16px;
    }
    
    .retry-btn, .refresh-btn {
      background: #137fec;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      margin-top: 16px;
      font-size: 14px;
    }
  }
  
  .stats-content {
    .overview-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 24px;
      
      .stat-card {
        background: white;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &.total {
            background: #e6f7ff;
          }
          
          &.pending {
            background: #fff7e6;
          }
          
          &.progress {
            background: #e6f7ff;
          }
          
          &.approved {
            background: #f6ffed;
          }
        }
        
        .stat-info {
          flex: 1;
          
          .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            line-height: 1;
          }
          
          .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
          }
        }
      }
    }
    
    .chart-section {
      background: white;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      
      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 16px;
      }
      
      .chart-container {
        .status-chart {
          .status-item {
            margin-bottom: 12px;
            
            .status-bar {
              height: 8px;
              background: #f0f0f0;
              border-radius: 4px;
              margin-bottom: 6px;
              overflow: hidden;
              
              .status-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.3s ease;
              }
            }
            
            .status-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              
              .status-name {
                font-size: 12px;
                color: #666;
              }
              
              .status-count {
                font-size: 12px;
                font-weight: 500;
                color: #333;
              }
            }
          }
        }
        
        .ata-chart {
          .ata-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            
            .ata-info {
              width: 80px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              
              .ata-code {
                font-size: 12px;
                color: #666;
                font-family: 'Courier New', monospace;
              }
              
              .ata-count {
                font-size: 12px;
                font-weight: 500;
                color: #333;
              }
            }
            
            .ata-bar {
              flex: 1;
              height: 8px;
              background: #f0f0f0;
              border-radius: 4px;
              margin-left: 12px;
              overflow: hidden;
              
              .ata-fill {
                height: 100%;
                background: #137fec;
                border-radius: 4px;
                transition: width 0.3s ease;
              }
            }
          }
        }
      }
    }
    
    .quick-actions {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      
      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 16px;
      }
      
      .action-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        
        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 16px;
          font-size: 12px;
          color: #6c757d;
          transition: all 0.3s ease;
          
          &:active {
            background: #e9ecef;
            transform: scale(0.98);
          }
        }
      }
    }
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

// 响应式适配
@media (max-width: 480px) {
  .mel-stats-page {
    padding: 12px;
    
    .stats-content {
      .overview-cards {
        grid-template-columns: 1fr;
      }
      
      .quick-actions {
        .action-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>