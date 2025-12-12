<template>
  <div class="mel-index-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">MEL 最低设备清单</h1>
      <p class="page-subtitle">Minimum Equipment List</p>
    </div>
    
    <!-- 功能模块网格 -->
    <div class="module-grid">
      <!-- 查询功能 -->
      <div class="module-section">
        <h2 class="section-title">查询功能</h2>
        <div class="function-grid">
          <div 
            class="function-item"
            @click="navigateTo('/pages/mel/list/index')"
          >
            <div class="function-icon">
              <uni-icons type="list" size="24" color="#137fec" />
            </div>
            <div class="function-content">
              <h3 class="function-title">MEL 列表</h3>
              <p class="function-desc">查看所有 MEL 记录</p>
            </div>
          </div>
          
          <div 
            class="function-item"
            @click="navigateTo('/pages/mel/list/search')"
          >
            <div class="function-icon">
              <uni-icons type="search" size="24" color="#52c41a" />
            </div>
            <div class="function-content">
              <h3 class="function-title">高级搜索</h3>
              <p class="function-desc">多条件组合查询</p>
            </div>
          </div>
          
          <div 
            class="function-item"
            @click="navigateTo('/pages/mel/aircraft/index')"
          >
            <div class="function-icon">
              <uni-icons type="aircraft" size="24" color="#fa8c16" />
            </div>
            <div class="function-content">
              <h3 class="function-title">按飞机查询</h3>
              <p class="function-desc">按飞机注册号查询</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 统计分析 -->
      <div class="module-section">
        <h2 class="section-title">统计分析</h2>
        <div class="function-grid">
          <div 
            class="function-item"
            @click="navigateTo('/pages/mel/stats/index')"
          >
            <div class="function-icon">
              <uni-icons type="pie" size="24" color="#722ed1" />
            </div>
            <div class="function-content">
              <h3 class="function-title">统计概览</h3>
              <p class="function-desc">整体数据统计</p>
            </div>
          </div>
          
          <div 
            class="function-item"
            @click="navigateTo('/pages/mel/stats/status')"
          >
            <div class="function-icon">
              <uni-icons type="flag" size="24" color="#eb2f96" />
            </div>
            <div class="function-content">
              <h3 class="function-title">状态统计</h3>
              <p class="function-desc">按状态分类统计</p>
            </div>
          </div>
          
          <div 
            class="function-item"
            @click="navigateTo('/pages/mel/stats/ata')"
          >
            <div class="function-icon">
              <uni-icons type="settings" size="24" color="#13c2c2" />
            </div>
            <div class="function-content">
              <h3 class="function-title">ATA 统计</h3>
              <p class="function-desc">按 ATA 章节分析</p>
            </div>
          </div>
          
          <div 
            class="function-item"
            @click="navigateTo('/pages/mel/stats/monthly')"
          >
            <div class="function-icon">
              <uni-icons type="calendar" size="24" color="#f5222d" />
            </div>
            <div class="function-content">
              <h3 class="function-title">月度统计</h3>
              <p class="function-desc">时间维度分析</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 快速统计 -->
    <div class="quick-stats">
      <h2 class="section-title">快速统计</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ quickStats.total }}</div>
          <div class="stat-label">总记录数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ quickStats.pending }}</div>
          <div class="stat-label">待审批</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ quickStats.inProgress }}</div>
          <div class="stat-label">进行中</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ quickStats.approved }}</div>
          <div class="stat-label">已批准</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMelStore } from '@/store/mel.store';

const melStore = useMelStore();

// 快速统计数据
const quickStats = ref({
  total: 0,
  pending: 0,
  inProgress: 0,
  approved: 0
});

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

// 获取快速统计数据
const fetchQuickStats = async () => {
  try {
    const stats = await melStore.fetchStatusStats();
    quickStats.value = {
      total: stats.totalCount || 0,
      pending: stats.statusDistribution?.['待批准'] || 0,
      inProgress: stats.statusDistribution?.['进行中'] || 0,
      approved: stats.statusDistribution?.['已批准'] || 0
    };
  } catch (error) {
    console.error('获取快速统计失败:', error);
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchQuickStats();
});
</script>

<style lang="less" scoped>
.mel-index-page {
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
      font-style: italic;
    }
  }
  
  .module-section {
    margin-bottom: 24px;
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 12px;
      padding-left: 12px;
      border-left: 4px solid #137fec;
    }
    
    .function-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
      
      .function-item {
        background: white;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.98);
          background-color: #f8f9fa;
        }
        
        .function-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: #f0f8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .function-content {
          flex: 1;
          
          .function-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
          }
          
          .function-desc {
            font-size: 12px;
            color: #666;
            line-height: 1.4;
          }
        }
      }
    }
  }
  
  .quick-stats {
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      
      .stat-item {
        background: white;
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        
        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #137fec;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mel-index-page {
    padding: 12px;
    
    .module-section {
      .function-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .quick-stats {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>