<template>
  <div class="mel-ata-stats-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
      </div>
      <p class="loading-message">加载中...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <uni-icons type="error" size="48" color="#ff4757" />
      <p class="error-message">{{ error }}</p>
      <button @click="fetchAtaStats" class="retry-btn">重试</button>
    </div>
    
    <!-- 统计内容 -->
    <div v-else class="stats-content">
      <!-- 总体统计卡片 -->
      <div class="summary-card">
        <h3 class="card-title">ATA章节概览</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-number">{{ ataStats.totalCount || 0 }}</div>
            <div class="summary-label">总记录数</div>
          </div>
          <div class="summary-item">
            <div class="summary-number">{{ Object.keys(ataStats.ataDistribution || {}).length }}</div>
            <div class="summary-label">涉及章节</div>
          </div>
        </div>
      </div>
      
      <!-- ATA章节分布图表 -->
      <div class="chart-card">
        <h3 class="card-title">ATA章节分布</h3>
        <div class="chart-container">
          <canvas 
            ref="ataChart" 
            canvas-id="ataChart" 
            class="chart-canvas"
          ></canvas>
        </div>
      </div>
      
      <!-- ATA章节详细列表 -->
      <div class="ata-list-card">
        <h3 class="card-title">章节详情</h3>
        <div class="ata-list">
          <div 
            v-for="(count, ata) in sortedAtaData" 
            :key="ata"
            class="ata-item"
            @click="navigateToList({ ata1: ata })"
          >
            <div class="ata-info">
              <div class="ata-code">{{ ata }}</div>
              <div class="ata-name">{{ getAtaName(ata) }}</div>
              <div class="ata-count">{{ count }} 条记录</div>
            </div>
            <div class="ata-percentage">
              {{ getPercentage(count) }}%
            </div>
            <div class="ata-arrow">
              <uni-icons type="arrowright" size="16" color="#ccc" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 高频故障系统 -->
      <div class="top-systems-card">
        <h3 class="card-title">高频故障系统 TOP 5</h3>
        <div class="top-systems-list">
          <div 
            v-for="(item, index) in topSystems" 
            :key="item.ata"
            class="system-item"
            @click="navigateToList({ ata1: item.ata })"
          >
            <div class="system-rank">{{ index + 1 }}</div>
            <div class="system-info">
              <div class="system-code">{{ item.ata }}</div>
              <div class="system-name">{{ getAtaName(item.ata) }}</div>
            </div>
            <div class="system-count">{{ item.count }} 条</div>
            <div class="system-arrow">
              <uni-icons type="arrowright" size="16" color="#ccc" />
            </div>
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
const ataStats = ref<any>({});
const ataChart = ref<any>(null);

// ATA章节名称映射
const ataChapterNames: Record<string, string> = {
  '21': '空调系统',
  '22': '自动飞行系统',
  '23': '通信系统',
  '24': '电源系统',
  '25': '内饰设备',
  '26': '防火系统',
  '27': '飞行操纵系统',
  '28': '燃油系统',
  '29': '液压系统',
  '30': '防冰/防雨系统',
  '31': '指示/记录系统',
  '32': '起落架系统',
  '33': '灯光系统',
  '34': '导航系统',
  '35': '氧气系统',
  '36': '气源系统',
  '38': '水/废水系统',
  '49': '辅助动力装置',
  '52': '舱门/窗户',
  '53': '机身系统',
  '57': '机翼系统'
};

// 获取ATA统计数据
const fetchAtaStats = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const stats = await melStore.fetchATAStats();
    ataStats.value = stats;
    
    // 等待DOM更新后绘制图表
    await nextTick();
    drawAtaChart();
  } catch (err: any) {
    console.error('获取ATA统计失败:', err);
    error.value = err.message || '获取ATA统计失败';
  } finally {
    loading.value = false;
  }
};

// 获取ATA章节名称
const getAtaName = (ata: string) => {
  return ataChapterNames[ata] || `ATA ${ata}`;
};

// 计算百分比
const getPercentage = (count: number) => {
  const total = ataStats.value.totalCount || 1;
  return Math.round((count / total) * 100);
};

// 排序后的ATA数据
const sortedAtaData = computed(() => {
  const distribution = ataStats.value.ataDistribution || {};
  return Object.entries(distribution)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .reduce((acc, [ata, count]) => {
      acc[ata] = count as number;
      return acc;
    }, {} as Record<string, number>);
});

// 高频故障系统TOP5
const topSystems = computed(() => {
  const distribution = ataStats.value.ataDistribution || {};
  return Object.entries(distribution)
    .map(([ata, count]) => ({ ata, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
});

// 绘制ATA章节分布图表
const drawAtaChart = () => {
  if (!ataStats.value.ataDistribution) return;
  
  const ctx = uni.createCanvasContext('ataChart');
  
  const data = Object.entries(ataStats.value.ataDistribution);
  const colors = [
    '#137fec', '#52c41a', '#fa8c16', '#f5222d', '#722ed1', 
    '#13c2c2', '#eb2f96', '#1890ff', '#27ae60', '#3498db',
    '#e74c3c', '#9b59b6', '#1abc9c', '#f39c12', '#d35400'
  ];
  
  // 绘制柱状图
  const chartWidth = 300;
  const chartHeight = 200;
  const barWidth = chartWidth / data.length * 0.6;
  const barGap = chartWidth / data.length * 0.4;
  const maxCount = Math.max(...data.map(([, count]) => count as number));
  
  data.forEach(([ata, count], index) => {
    const barHeight = (count as number) / maxCount * (chartHeight - 40);
    const x = index * (barWidth + barGap) + barGap / 2;
    const y = chartHeight - barHeight - 20;
    
    // 绘制柱形
    ctx.setFillStyle(colors[index % colors.length]);
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // 绘制标签
    ctx.setFontSize(10);
    ctx.setFillStyle('#333');
    ctx.fillText(ata, x + barWidth / 2 - 10, chartHeight - 5);
    
    // 绘制数值
    ctx.setFontSize(8);
    ctx.fillText(String(count), x + barWidth / 2 - 5, y - 5);
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
  fetchAtaStats();
});
</script>

<style lang="less" scoped>
.mel-ata-stats-page {
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
  .summary-card, .chart-card, .ata-list-card, .top-systems-card {
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
        width: 320px;
        height: 220px;
      }
    }
  }
  
  .ata-list-card {
    .ata-list {
      .ata-item {
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
        
        .ata-info {
          flex: 1;
          
          .ata-code {
            font-size: 16px;
            font-weight: bold;
            color: #137fec;
            margin-bottom: 2px;
          }
          
          .ata-name {
            font-size: 14px;
            color: #333;
            margin-bottom: 2px;
          }
          
          .ata-count {
            font-size: 12px;
            color: #666;
          }
        }
        
        .ata-percentage {
          font-size: 18px;
          font-weight: bold;
          color: #137fec;
          margin-right: 12px;
        }
        
        .ata-arrow {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  
  .top-systems-card {
    .top-systems-list {
      .system-item {
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
        
        .system-rank {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #137fec;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          margin-right: 12px;
        }
        
        .system-info {
          flex: 1;
          
          .system-code {
            font-size: 14px;
            font-weight: bold;
            color: #137fec;
            margin-bottom: 2px;
          }
          
          .system-name {
            font-size: 13px;
            color: #333;
          }
        }
        
        .system-count {
          font-size: 14px;
          font-weight: 500;
          color: #666;
          margin-right: 12px;
        }
        
        .system-arrow {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mel-ata-stats-page {
    padding: 12px;
    
    .stats-content {
      .summary-card {
        .summary-grid {
          grid-template-columns: 1fr;
          gap: 12px;
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
      
      .chart-card {
        .chart-container {
          .chart-canvas {
            width: 280px;
            height: 200px;
          }
        }
      }
    }
  }
}
</style>