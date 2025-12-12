<template>
  <div class="mel-status-stats-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <uni-load-more status="loading" :content-text="{ loading: '加载中...' }" />
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <uni-icons type="error" size="48" color="#ff4757" />
      <p class="error-message">{{ error }}</p>
      <button @click="fetchStatusStats" class="retry-btn">重试</button>
    </div>
    
    <!-- 统计内容 -->
    <div v-else class="stats-content">
      <!-- 总体统计卡片 -->
      <div class="summary-card">
        <h3 class="card-title">状态分布概览</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-number">{{ statusStats.totalCount || 0 }}</div>
            <div class="summary-label">总记录数</div>
          </div>
          <div class="summary-item">
            <div class="summary-number">{{ Object.keys(statusStats.statusDistribution || {}).length }}</div>
            <div class="summary-label">状态类型</div>
          </div>
        </div>
      </div>
      
      <!-- 状态分布图表 -->
      <div class="chart-card">
        <h3 class="card-title">状态分布</h3>
        <div class="chart-container">
          <canvas 
            ref="statusChart" 
            canvas-id="statusChart" 
            class="chart-canvas"
          ></canvas>
        </div>
      </div>
      
      <!-- 状态详细列表 -->
      <div class="status-list-card">
        <h3 class="card-title">状态详情</h3>
        <div class="status-list">
          <div 
            v-for="(count, status) in statusStats.statusDistribution" 
            :key="status"
            class="status-item"
            @click="navigateToList({ status })"
          >
            <div class="status-info">
              <div class="status-name">{{ status }}</div>
              <div class="status-count">{{ count }} 条记录</div>
            </div>
            <div class="status-percentage">
              {{ getPercentage(count) }}%
            </div>
            <div class="status-arrow">
              <uni-icons type="arrowright" size="16" color="#ccc" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 数据来源分布 -->
      <div class="source-stats-card">
        <h3 class="card-title">数据来源分布</h3>
        <div class="source-grid">
          <div 
            class="source-item"
            @click="navigateToList({ source: 'base' })"
          >
            <div class="source-icon base">
              <uni-icons type="home" size="20" color="white" />
            </div>
            <div class="source-info">
              <div class="source-name">主基地数据</div>
              <div class="source-count">{{ statusStats.sourceDistribution?.base || 0 }} 条</div>
            </div>
          </div>
          
          <div 
            class="source-item"
            @click="navigateToList({ source: 'outstation' })"
          >
            <div class="source-icon outstation">
              <uni-icons type="location" size="20" color="white" />
            </div>
            <div class="source-info">
              <div class="source-name">外站数据</div>
              <div class="source-count">{{ statusStats.sourceDistribution?.outstation || 0 }} 条</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useMelStore } from '@/store/mel.store';

const melStore = useMelStore();

const loading = ref(false);
const error = ref<string | null>(null);
const statusStats = ref<any>({});
const statusChart = ref<any>(null);

// 获取状态统计数据
const fetchStatusStats = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const stats = await melStore.fetchStatusStats();
    statusStats.value = stats;
    
    // 等待DOM更新后绘制图表
    await nextTick();
    drawStatusChart();
  } catch (err: any) {
    console.error('获取状态统计失败:', err);
    error.value = err.message || '获取状态统计失败';
  } finally {
    loading.value = false;
  }
};

// 计算百分比
const getPercentage = (count: number) => {
  const total = statusStats.value.totalCount || 1;
  return Math.round((count / total) * 100);
};

// 绘制状态分布图表
const drawStatusChart = () => {
  if (!statusStats.value.statusDistribution) return;
  
  const ctx = uni.createCanvasContext('statusChart');
  
  const data = Object.entries(statusStats.value.statusDistribution);
  const colors = ['#137fec', '#52c41a', '#fa8c16', '#f5222d', '#722ed1', '#13c2c2'];
  
  // 计算总和
  const total = data.reduce((sum, [, count]) => sum + (count as number), 0);
  
  // 绘制饼图
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  let currentAngle = -Math.PI / 2;
  
  data.forEach(([status, count], index) => {
    const percentage = (count as number) / total;
    const endAngle = currentAngle + (percentage * 2 * Math.PI);
    
    // 绘制扇形
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
    ctx.closePath();
    ctx.setFillStyle(colors[index % colors.length]);
    ctx.fill();
    
    // 绘制标签
    const labelAngle = currentAngle + (percentage * Math.PI);
    const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
    const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
    
    ctx.setFontSize(12);
    ctx.setFillStyle('#333');
    ctx.fillText(`${status}`, labelX - 20, labelY);
    ctx.fillText(`${count}条`, labelX - 15, labelY + 15);
    
    currentAngle = endAngle;
  });
  
  ctx.draw();
};

// 跳转到列表页面
const navigateToList = (params: any) => {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
    
  uni.navigateTo({
    url: `/pages/mel/list/index?${queryString}`,
    fail: (err) => {
      console.error('跳转失败:', err);
      uni.showToast({
        title: '跳转失败',
        icon: 'none'
      });
    }
  });
};

// 页面加载时获取数据
onMounted(() => {
  fetchStatusStats();
});
</script>

<style lang="less" scoped>
.mel-status-stats-page {
  padding: 16px;
  background: #f5f5f5;
  min-height: 100vh;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  .error-message {
    color: #ff4757;
    margin: 12px 0;
    font-size: 16px;
  }
  
  .retry-btn {
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
  .summary-card, .chart-card, .status-list-card, .source-stats-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    
    .card-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;
    }
  }
  
  .summary-card {
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      
      .summary-item {
        text-align: center;
        
        .summary-number {
          font-size: 28px;
          font-weight: bold;
          color: #137fec;
          margin-bottom: 4px;
        }
        
        .summary-label {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
  
  .chart-card {
    .chart-container {
      display: flex;
      justify-content: center;
      padding: 20px 0;
      
      .chart-canvas {
        width: 300px;
        height: 300px;
      }
    }
  }
  
  .status-list-card {
    .status-list {
      .status-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background-color 0.3s ease;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:active {
          background-color: #f8f9fa;
        }
        
        .status-info {
          flex: 1;
          
          .status-name {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
          }
          
          .status-count {
            font-size: 14px;
            color: #666;
          }
        }
        
        .status-percentage {
          font-size: 18px;
          font-weight: bold;
          color: #137fec;
          margin-right: 12px;
        }
        
        .status-arrow {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  
  .source-stats-card {
    .source-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      
      .source-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 6px;
        background: #f8f9fa;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.98);
          background-color: #e9ecef;
        }
        
        .source-icon {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          
          &.base {
            background: #27ae60;
          }
          
          &.outstation {
            background: #3498db;
          }
        }
        
        .source-info {
          flex: 1;
          
          .source-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 2px;
          }
          
          .source-count {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mel-status-stats-page {
    padding: 12px;
    
    .stats-content {
      .summary-card {
        .summary-grid {
          grid-template-columns: 1fr;
          gap: 12px;
        }
      }
      
      .chart-card {
        .chart-container {
          .chart-canvas {
            width: 250px;
            height: 250px;
          }
        }
      }
      
      .source-stats-card {
        .source-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>