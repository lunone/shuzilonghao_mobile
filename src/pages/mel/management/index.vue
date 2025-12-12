<template>
  <div class="mel-management-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">MEL 管理中心</h1>
      <p class="page-subtitle">MEL 记录管理操作</p>
    </div>
    
    <!-- 管理统计 -->
    <div class="management-stats">
      <div class="stat-card">
        <div class="stat-icon pending">
          <uni-icons type="clock" size="24" color="#f39c12" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ managementStats?.toApprove || 0 }}</div>
          <div class="stat-label">待审批</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon progress">
          <uni-icons type="loop" size="24" color="#3498db" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ managementStats?.toRepair || 0 }}</div>
          <div class="stat-label">待修复</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon close">
          <uni-icons type="flag" size="24" color="#e74c3c" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ managementStats?.toClose || 0 }}</div>
          <div class="stat-label">待关闭</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon overdue">
          <uni-icons type="warning" size="24" color="#ff4757" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ managementStats?.overdue || 0 }}</div>
          <div class="stat-label">已超期</div>
        </div>
      </div>
    </div>
    
    <!-- 功能模块 -->
    <div class="function-modules">
      <h3 class="section-title">管理功能</h3>
      <div class="module-grid">
        <div 
          class="module-item"
          @click="navigateTo('/pages/mel/management/create')"
        >
          <div class="module-icon">
            <uni-icons type="plus" size="24" color="#52c41a" />
          </div>
          <div class="module-content">
            <h4 class="module-title">创建 MEL</h4>
            <p class="module-desc">新建 MEL 记录</p>
          </div>
        </div>
        
        <div 
          class="module-item"
          @click="navigateTo('/pages/mel/management/approve')"
        >
          <div class="module-icon">
            <uni-icons type="checkmarkempty" size="24" color="#fa8c16" />
          </div>
          <div class="module-content">
            <h4 class="module-title">审批管理</h4>
            <p class="module-desc">审批待处理记录</p>
          </div>
        </div>
        
        <div 
          class="module-item"
          @click="navigateTo('/pages/mel/management/repair')"
        >
          <div class="module-icon">
            <uni-icons type="loop" size="24" color="#1890ff" />
          </div>
          <div class="module-content">
            <h4 class="module-title">修复管理</h4>
            <p class="module-desc">管理修复进度</p>
          </div>
        </div>
        
        <div 
          class="module-item"
          @click="navigateTo('/pages/mel/management/close')"
        >
          <div class="module-icon">
            <uni-icons type="closeempty" size="24" color="#722ed1" />
          </div>
          <div class="module-content">
            <h4 class="module-title">关闭管理</h4>
            <p class="module-desc">关闭已完成记录</p>
          </div>
        </div>
        
        <div 
          class="module-item"
          @click="navigateTo('/pages/mel/management/renew')"
        >
          <div class="module-icon">
            <uni-icons type="refresh" size="24" color="#13c2c2" />
          </div>
          <div class="module-content">
            <h4 class="module-title">续保管理</h4>
            <p class="module-desc">管理续保申请</p>
          </div>
        </div>
        
        <div 
          class="module-item"
          @click="navigateTo('/pages/mel/list/index')"
        >
          <div class="module-icon">
            <uni-icons type="list" size="24" color="#eb2f96" />
          </div>
          <div class="module-content">
            <h4 class="module-title">查看列表</h4>
            <p class="module-desc">浏览所有记录</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 快速操作 -->
    <div class="quick-actions">
      <h3 class="section-title">快速操作</h3>
      <div class="action-buttons">
        <button 
          class="action-btn primary"
          @click="navigateTo('/pages/mel/management/create')"
        >
          <uni-icons type="plus" size="16" />
          创建新 MEL
        </button>
        
        <button 
          class="action-btn"
          @click="navigateTo('/pages/mel/management/approve')"
        >
          <uni-icons type="checkmarkempty" size="16" />
          待审批 ({{ managementStats?.toApprove || 0 }})
        </button>
        
        <button 
          class="action-btn"
          @click="navigateTo('/pages/mel/stats/index')"
        >
          <uni-icons type="pie" size="16" />
          查看统计
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 管理统计数据
const managementStats = ref({
  toApprove: 0,
  toRepair: 0,
  toClose: 0,
  overdue: 0,
  total: 0
});

// 获取管理统计数据
const fetchManagementStats = async () => {
  try {
    // 模拟 API 调用
    // const response = await MelManagementAPI.getManagementStats();
    // managementStats.value = response;
    
    // 模拟数据
    managementStats.value = {
      toApprove: 5,
      toRepair: 12,
      toClose: 8,
      overdue: 2,
      total: 27
    };
  } catch (error) {
    console.error('获取管理统计失败:', error);
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
  fetchManagementStats();
});
</script>

<style lang="less" scoped>
.mel-management-page {
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
  
  .management-stats {
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
        
        &.pending {
          background: #fff7e6;
        }
        
        &.progress {
          background: #e6f7ff;
        }
        
        &.close {
          background: #fff1f0;
        }
        
        &.overdue {
          background: #fff2e8;
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
  
  .function-modules {
    margin-bottom: 24px;
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 4px solid #137fec;
    }
    
    .module-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      
      .module-item {
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
        
        .module-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: #f0f8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .module-content {
          flex: 1;
          
          .module-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
          }
          
          .module-desc {
            font-size: 12px;
            color: #666;
            line-height: 1.4;
          }
        }
      }
    }
  }
  
  .quick-actions {
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 4px solid #137fec;
    }
    
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 16px;
        font-size: 14px;
        color: #6c757d;
        transition: all 0.3s ease;
        
        &.primary {
          background: #137fec;
          color: white;
          border-color: #137fec;
        }
        
        &:active {
          transform: scale(0.98);
          background-color: #f8f9fa;
          
          &.primary {
            background-color: #0e6bb8;
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mel-management-page {
    padding: 12px;
    
    .management-stats {
      grid-template-columns: 1fr;
    }
    
    .function-modules {
      .module-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>