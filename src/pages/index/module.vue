<template>
  <div class="module-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <PageLoading />
    </div>
    
    <!-- 功能模块列表 -->
    <div v-else-if="Object.keys(groupedModules).length > 0">
      <div 
        v-for="(modules, groupName) in groupedModules" 
        :key="groupName"
        class="module-group"
      >
        <div class="group-title">{{ groupName }}</div>
        <div class="module-grid">
          <div 
            v-for="module in modules" 
            :key="module.path"
            class="module-item"
            @click="navigateTo(module)"
          >
            <div class="module-icon zl-icon" :class="`zl-icon-${module.icon}`"></div>
            <div class="module-text">{{ module.text }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">🔒</div>
      <div class="empty-text">暂无可访问的功能模块</div>
    </div>
  </div>
  
  <!-- 引入 custom-tab-bar 组件 -->
  <CustomTabBar />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/store/user.store'
import CustomTabBar from '@/components/zl/tabbar.vue'
import PageLoading from '@/components/PageLoading.vue'

interface ModuleItem {
  path: string;
  text: string;
  icon: string;
  permission: string;
  hide?: boolean;
}

// 权限配置数据
const MODULE_PERMISSIONS = {
  analysis: {
    groupName: "运营分析",
    modules: [
      { path: "pages/analysis/analysis", text: "运行分析", icon: "analysis", permission: "analysis:view" },
      { path: "pages/analysis/year", text: "历史情况", icon: "analysis", permission: "analysis:year" },
      { path: "pages/analysis/airlines", text: "航线分析", icon: "airline", permission: "analysis:airline" },
      { path: "pages/analysis/overview", text: "运行概览", icon: "info", permission: "analysis:overview" },
      { path: "pages/analysis/aircraftUtilization", text: "飞机利用率", icon: "chart", permission: "analysis:utilization" },
      { path: "pages/airplane/aircraftList", text: "机队分析", icon: "aircraft", permission: "airplane:analysis" }
    ]
  },
  safety: {
    groupName: "安全管理",
    modules: [
      { path: "pages/sms/sms", text: "安全数据", icon: "forbidden", permission: "safety:data" },
      { path: "pages/maintenance/maintenance", text: "故障管理", icon: "maintenance", permission: "maintenance:view" },
      { path: "pages/mel/index", text: "MEL管理", icon: "document", permission: "mel:view" },
    //   { path: "pages/living/dutyAct", text: "排班管理", icon: "duty", permission: "schedule:view" }
    ]
  },
  pilot: {
    groupName: "飞行员管理",
    modules: [
      { path: "pages/pilot/pilot", text: "飞行员", icon: "pilot", permission: "pilot:view" },
      { path: "pages/pilot/rank", text: "飞行排名", icon: "rank", permission: "pilot:rank" },
      { path: "pages/pilot/fatigue", text: "疲劳分析", icon: "health", permission: "pilot:fatigue" },
      { path: "pages/pilot/technical", text: "技术分析", icon: "learn", permission: "pilot:technical" },
      { path: "pages/pilot/portrait", text: "人员画像", icon: "person", permission: "pilot:portrait" },
      { path: "pages/pilot/analysis", text: "技术分析", icon: "analysis", permission: "pilot:analysis" }
    ]
  },
  hr: {
    groupName: "人力资源",
    modules: [
      { path: "pages/hr/hr", text: "人力资源", icon: "user", permission: "hr:view" },
      { path: "pages/staff/stat", text: "人员统计", icon: "info", permission: "hr:stat" }
    ]
  },
  sale: {
    groupName: "销售管理", 
    modules: [
      { path: "pages/sale/sale", text: "销售管理", icon: "sale", permission: "sale:view" },
      { path: "pages/sale/income", text: "收入分析", icon: "info", permission: "sale:income" }
    ]
  },
  flight: {
    groupName: "航班管理",
    modules: [
      { path: "pages/flight/flight", text: "航班管理", icon: "aircraft", permission: "flight:view" },
      { path: "pages/flight/flightCard", text: "航班卡片", icon: "info", permission: "flight:card" },
      { path: "pages/flight/plan", text: "航班计划", icon: "calendar", permission: "flight:plan" },
      { path: "pages/flight/today", text: "今日航班", icon: "info", permission: "flight:today" },
      { path: "pages/flight/flightDetail", text: "航班详情", icon: "info", permission: "flight:detail" }
    ]
  },
  role: {
    groupName: "权限管理",
    modules: [
      { path: "pages/role/agent", text: "供应商界面", icon: "location", permission: "role:agent" },
      { path: "pages/role/manage", text: "权限管理", icon: "meeting", permission: "role:manage" }
    ]
  }
}

// Store 和响应式数据
const userStore = useUserStore()
const isLoading = ref(true)

// 权限筛选逻辑
const filterModulesByPermission = (modules: ModuleItem[]) => {
  return modules.filter(module => {
    if (!module.permission) return true; // 无权限要求的模块直接显示
    return true;//userStore.hasPermission(module.permission);
  });
};

// 按分组过滤模块
const groupedModules = computed(() => {
  const grouped: Record<string, ModuleItem[]> = {};
  
  Object.values(MODULE_PERMISSIONS).forEach(group => {
    const filteredModules = filterModulesByPermission(group.modules);
    if (filteredModules.length > 0) {
      grouped[group.groupName] = filteredModules;
    }
  });
  
  return grouped;
});

// 页面导航
const navigateTo = (module: ModuleItem) => {
  uni.navigateTo({
    url: `/${module.path}`,
    fail: (err) => {
      console.error('导航失败:', err);
      uni.showToast({
        title: '页面暂未开放',
        icon: 'none'
      });
    }
  });
};

// 页面初始化
onMounted(async () => {
  try {
    await userStore.fetchMe();
  } catch (error) {
    console.error('获取用户信息失败:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.module-container {
  padding: @padding-page;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 140rpx; // 留出tabbar空间
  
  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
  }
  
  .module-group {
    margin-bottom: 40rpx;
    
    .group-title {
      font-size: 32rpx;
      font-weight: bold;
      color: @color-text;
      margin-bottom: 20rpx;
      padding-left: 20rpx;
      border-left: 4rpx solid @color-primary;
    }
    
    .module-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16rpx;
      padding: 0 8rpx;
      
      .module-item {
        background: #ffffff;
        border-radius: 12rpx;
        padding: 20rpx 12rpx;
        text-align: center;
        box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.95);
          background-color: #f8f9fa;
        }
        
        .module-icon {
          font-size: 36rpx;
          margin-bottom: 12rpx;
          color: @color-primary;
          
          &.zl-icon-analysis { color: #1890ff; }
          &.zl-icon-forbidden { color: #f5222d; }
          &.zl-icon-maintenance { color: #fa8c16; }
          &.zl-icon-pilot { color: #d13419; }
          &.zl-icon-user { color: #722ed1; }
          &.zl-icon-sale { color: #13c2c2; }
          &.zl-icon-aircraft { color: #52c41a; }
          &.zl-icon-location { color: #eb2f96; }
          &.zl-icon-meeting { color: #2f54eb; }
        }
        
        .module-text {
          font-size: 22rpx;
          color: @color-text;
          line-height: 1.3;
          font-weight: 500;
        }
      }
    }
  }
  
  // 空状态显示
  .empty-state {
    text-align: center;
    padding: 100rpx 0;
    
    .empty-icon {
      font-size: 120rpx;
      color: #ccc;
      margin-bottom: 30rpx;
    }
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}

// 响应式适配
@media (max-width: 320px) {
  .module-container {
    .module-group {
      .module-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16rpx;
        
        .module-item {
          padding: 24rpx 16rpx;
          
          .module-icon {
            font-size: 40rpx;
          }
          
          .module-text {
            font-size: 24rpx;
          }
        }
      }
    }
  }
}
</style>