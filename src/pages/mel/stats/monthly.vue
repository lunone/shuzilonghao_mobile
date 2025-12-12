<template>
  <div class="mel-monthly-stats-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <uni-load-more status="loading" :content-text="{ loading: '加载中...' }" />
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <uni-icons type="error" size="48" color="#ff4757" />
      <p class="error-message">{{ error }}</p>
      <button @click="fetchMonthlyStats" class="retry-btn">重试</button>
    </div>
    
    <!-- 统计内容 -->
    <div v-else class="stats-content">
      <!-- 时间选择器 -->
      <div class="time-selector-card">
        <div class="time-selector">
          <button 
            @click="changeYear(-1)" 
            class="year-btn"
          >
            <uni-icons type="left" size="16" />
          </button>
          <div class="year-display">{{ selectedYear }}年</div>
          <button 
            @click="changeYear(1)" 
            class="year-btn"
          >
            <uni-icons type="right" size="16" />
          </button>
        </div>
      </div>
      
      <!-- 总体统计卡片 -->
      <div class="summary-card">
        <h3 class="card-title">{{ selectedYear }}年概览</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-number">{{ monthlyStats.totalCount || 0 }}</div>
            <div class="summary-label">总记录数</div>
          </div>
          <div class="summary-item">
            <div class="summary-number">{{ monthlyStats.monthlyAverage || 0 }}</div>
            <div class="summary-label">月均记录</div>
          </div>
          <div class="summary-item">
            <div class="summary-number">{{ monthlyStats.peakMonth?.count || 0 }}</div>
            <div class="summary-label">峰值记录</div>
          </div>
          <div class="summary-item">
            <div class="summary-number">{{ monthlyStats.lowMonth?.count || 0 }}</div>
            <div class="summary-label">谷值记录</div>
          </div>
        </div>
      </div>
      
      <!-- 月度趋势图表 -->
      <div class="chart-card">
        <h3 class="card-title">月度趋势</h3>
        <div class="chart-container">
          <canvas 
            ref="monthlyChart" 
            canvas-id="monthlyChart" 
            class="chart-canvas"
          ></canvas>
        </div>
      </div>
      
      <!-- 月度详细列表 -->
      <div class="monthly-list-card">
        <h3 class="card-title">月度详情</h3>
        <div class="monthly-list">
          <div 
            v-for="(count, month) in monthlyStats.monthlyDistribution" 
            :key="month"
            class="monthly-item"
            @click="navigateToList({
              startDate: `${selectedYear}-${month.toString().padStart(2, '0')}-01`,
              endDate: `${selectedYear}-${month.toString().padStart(2, '0')}-31`
            })"
          >
            <div class="monthly-info">
              <div class="monthly-name">{{ selectedYear }}年{{ month }}月</div>
              <div class="monthly-count">{{ count }} 条记录</div>
            </div>
            <div class="monthly-percentage">
              {{ getPercentage(count) }}%
            </div>
            <div class="monthly-arrow">
              <uni-icons type="arrowright" size="16" color="#ccc" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 季度对比 -->
      <div class="quarterly-card">
        <h3 class="card-title">季度对比</h3>
        <div class="quarterly-grid">
          <div 
            v-for="(quarter, index) in quarterlyData" 
            :key="index"
            class="quarterly-item"
            @click="navigateToList(quarter.dateRange)"
          >
            <div class="quarterly-header">
              <div class="quarterly-name">Q{{ index + 1 }}</div>
              <div class="quarterly-months">{{ quarter.months }}</div>
            </div>
            <div class="quarterly-count">{{ quarter.count }} 条</div>
            <div class="quarterly-percentage">{{ quarter.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { useMelStore } from '@/store/mel.store';

const melStore = useMelStore();

const loading = ref(false);
const error = ref<string | null>(null);
const monthlyStats = ref<any>({});
const monthlyChart = ref<any>(null);
const selectedYear = ref(new Date().getFullYear());

// 获取月度统计数据
const fetchMonthlyStats = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const stats = await melStore.fetchMonthlyStats();
    monthlyStats.value = stats;
    
    // 等待DOM更新后绘制图表
    await nextTick();
    drawMonthlyChart();
  } catch (err: any) {
    console.error('获取月度统计失败:', err);
    error.value = err.message || '获取月度统计失败';
  } finally {
    loading.value = false;
  }
};

// 切换年份
const changeYear = (direction: number) => {
  selectedYear.value += direction;
  fetchMonthlyStats();
};

// 计算百分比
const getPercentage = (count: number) => {
  const total = monthlyStats.value.totalCount || 1;
  return Math.round((count / total) * 100);
};

// 季度数据
const quarterlyData = computed(() => {
  const distribution = monthlyStats.value.monthlyDistribution || {};
  
  const quarters = [
    { months: '1-3月', range: [1, 2, 3] },
    { months: '4-6月', range: [4, 5, 6] },
    { months: '7-9月', range: [7, 8, 9] },
    { months: '10-12月', range: [10, 11, 12] }
  ];
  
  return quarters.map((quarter, index) => {
    const count = quarter.range.reduce((sum, month) => {
      const monthKey = month.toString().padStart(2, '0');
      return sum + (distribution[monthKey] || 0);
    }, 0);
    
    const percentage = monthlyStats.value.totalCount 
      ? Math.round((count / monthlyStats.value.totalCount) * 100)
      : 0;
    
    const startMonth = quarter.range[0].toString().padStart(2, '0');
    const endMonth = quarter.range[2].toString().padStart(2, '0');
    
    return {
      months: quarter.months,
      count,
      percentage,
      dateRange: {
        startDate: `${selectedYear.value}-${startMonth}-01`,
        endDate: `${selectedYear.value}-${endMonth}-31`
      }
    };
  });
});

// 绘制月度趋势图表
const drawMonthlyChart = () => {
  if (!monthlyStats.value.monthlyDistribution) return;
  
  const ctx = uni.createCanvasContext('monthlyChart');
  
  const data = Object.entries(monthlyStats.value.monthlyDistribution);
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  
  // 绘制折线图
  const chartWidth = 300;
  const chartHeight = 200;
  const padding = 40;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;
  
  // 找出最大值
  const maxCount = Math.max(...data.map(([, count]) => count as number));
  
  // 绘制坐标轴
  ctx.setStrokeStyle('#ddd');
  ctx.setLineWidth(1);
  
  // Y轴
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, chartHeight - padding);
  ctx.stroke();
  
  // X轴
  ctx.beginPath();
  ctx.moveTo(padding, chartHeight - padding);
  ctx.lineTo(chartWidth - padding, chartHeight - padding);
  ctx.stroke();
  
  // 绘制数据点和连线
  ctx.setStrokeStyle('#137fec');
  ctx.setLineWidth(2);
  ctx.beginPath();
  
  data.forEach(([, count], index) => {
    const x = padding + (index / 11) * graphWidth;
    const y = chartHeight - padding - ((count as number) / maxCount) * graphHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // 绘制数据点
  data.forEach(([, count], index) => {
    const x = padding + (index / 11) * graphWidth;
    const y = chartHeight - padding - ((count as number) / maxCount) * graphHeight;
    
    ctx.setFillStyle('#137fec');
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // 绘制月份标签
    ctx.setFontSize(10);
    ctx.setFillStyle('#666');
    ctx.fillText(months[index], x - 10, chartHeight - padding + 15);
    
    // 绘制数值标签
    ctx.setFontSize(8);
    ctx.fillText(String(count), x - 8, y - 8);
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
  fetchMonthlyStats();
});
</script>

<style lang="less" scoped>
.mel-monthly-stats-page {
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
  .time-selector-card, .summary-card, .chart-card, .monthly-list-card, .quarterly-card {
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
  
  .time-selector-card {
    .time-selector {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      
      .year-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid #ddd;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:active {
          background: #f8f9fa;
          transform: scale(0.95);
        }
      }
      
      .year-display {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        min-width: 80px;
        text-align: center;
      }
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
          font-size: 24px;
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
        width: 320px;
        height: 220px;
      }
    }
  }
  
  .monthly-list-card {
    .monthly-list {
      .monthly-item {
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
        
        .monthly-info {
          flex: 1;
          
          .monthly-name {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
          }
          
          .monthly-count {
            font-size: 14px;
            color: #666;
          }
        }
        
        .monthly-percentage {
          font-size: 18px;
          font-weight: bold;
          color: #137fec;
          margin-right: 12px;
        }
        
        .monthly-arrow {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  
  .quarterly-card {
    .quarterly-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      
      .quarterly-item {
        padding: 16px;
        border-radius: 6px;
        background: #f8f9fa;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.98);
          background-color: #e9ecef;
        }
        
        .quarterly-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          
          .quarterly-name {
            font-size: 18px;
            font-weight: bold;
            color: #137fec;
          }
          
          .quarterly-months {
            font-size: 12px;
            color: #666;
          }
        }
        
        .quarterly-count {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }
        
        .quarterly-percentage {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mel-monthly-stats-page {
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
            width: 280px;
            height: 200px;
          }
        }
      }
      
      .quarterly-card {
        .quarterly-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>