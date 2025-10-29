# 功能模块重构规划

## 模块分组结构

基于现有的页面路由和功能特点，将功能页面按以下分组：

### 1. 运营分析组
- **运行分析** (`pages/analysis/analysis`) - 整体运营分析
- **历史情况** (`pages/analysis/year`) - 历史数据分析
- **航线分析** (`pages/analysis/airlines`) - 航线数据分析
- **运行概览** (`pages/analysis/overview`) - 数据概览
- **机队分析** (`pages/airplane/airplane`) - 机队运营分析

图标: `analysis`

### 2. 安全管理组
- **安全数据** (`pages/sms/sms`) - 安全事件管理
- **故障管理** (`pages/maintenance/maintenance`) - 设备维护
- **排班管理** (`pages/living/dutyAct`) - 排班安排

图标: `forbidden`, `maintenance`, `duty`

### 3. 飞行员管理组
- **飞行员** (`pages/pilot/pilot`) - 飞行员信息管理
- **飞行排名** (`pages/pilot/rank`) - 飞行员排名
- **疲劳分析** (`pages/pilot/fatigue`) - 疲劳度分析
- **技术分析** (`pages/pilot/technical`) - 技术能力分析
- **人员画像** (`pages/pilot/portrait`) - 人员档案
- **技术分析** (`pages/pilot/analysis`) - 技术数据

图标: `pilot`, `rank`, `health`, `learn`, `person`, `analysis`

### 4. 人力资源组
- **人力资源** (`pages/hr/hr`) - 人员管理
- **人员统计** (`pages/staff/stat`) - 统计报表

图标: `user`, `info`

### 5. 销售管理组
- **销售管理** (`pages/sale/sale`) - 销售业务
- **收入分析** (`pages/sale/income`) - 收入分析

图标: `sale`

### 6. 航班管理组
- **航班管理** (`pages/flight/flight`) - 航班信息
- **航班卡片** (`pages/flight/flightCard`) - 航班详情卡片
- **航班计划** (`pages/flight/plan`) - 航班计划
- **今日航班** (`pages/flight/today`) - 今日航班
- **航班详情** (`pages/flight/flightDetail`) - 航班详情

图标: `aircraft`

### 7. 权限管理组
- **供应商界面** (`pages/role/agent`) - 供应商管理
- **权限管理** (`pages/role/manage`) - 权限配置

图标: `location`, `meeting`

## 权限映射设计

每个功能模块需要对应的权限代码，格式：
```typescript
interface ModuleItem {
  path: string;
  text: string;
  icon: string;
  permission: string;
  hide?: boolean;
}
```

## 数据结构

```typescript
// 模块配置对象
const moduleConfig = {
  "运营分析": [
    {
      path: "pages/analysis/analysis",
      text: "运行分析",
      icon: "analysis",
      permission: "analysis:view",
      hide: false
    },
    {
      path: "pages/analysis/year", 
      text: "历史情况",
      icon: "analysis",
      permission: "analysis:year",
      hide: false
    },
    // ... 其他模块
  ],
  "安全管理": [
    {
      path: "pages/sms/sms",
      text: "安全数据", 
      icon: "forbidden",
      permission: "safety:view",
      hide: false
    },
    // ... 其他模块
  ]
  // ... 其他分组
}
```

## 实现步骤

1. ✅ 分析并定义功能模块分组结构
2. 🔄 创建权限配置映射
3. ⏳ 实现权限筛选逻辑  
4. ⏳ 设计响应式布局样式
5. ⏳ 开发Vue组件模板
6. ⏳ 实现页面交互和导航逻辑
7. ⏳ 测试权限控制功能
## 权限配置映射详解

基于你的权限系统设计，每个模块对应具体的权限代码：

```typescript
// 权限配置映射
const MODULE_PERMISSIONS = {
  // 运营分析组
  analysis: {
    groupName: "运营分析",
    modules: [
      { path: "pages/analysis/analysis", text: "运行分析", icon: "analysis", permission: "analysis:view" },
      { path: "pages/analysis/year", text: "历史情况", icon: "analysis", permission: "analysis:year" },
      { path: "pages/analysis/airlines", text: "航线分析", icon: "airline", permission: "analysis:airline" },
      { path: "pages/analysis/overview", text: "运行概览", icon: "info", permission: "analysis:overview" },
      { path: "pages/airplane/airplane", text: "机队分析", icon: "aircraft", permission: "airplane:analysis" }
    ]
  },
  
  // 安全管理组
  safety: {
    groupName: "安全管理",
    modules: [
      { path: "pages/sms/sms", text: "安全数据", icon: "forbidden", permission: "safety:data" },
      { path: "pages/maintenance/maintenance", text: "故障管理", icon: "maintenance", permission: "maintenance:view" },
      { path: "pages/living/dutyAct", text: "排班管理", icon: "duty", permission: "schedule:view" }
    ]
  },
  
  // 飞行员管理组
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
  
  // 人力资源组
  hr: {
    groupName: "人力资源",
    modules: [
      { path: "pages/hr/hr", text: "人力资源", icon: "user", permission: "hr:view" },
      { path: "pages/staff/stat", text: "人员统计", icon: "info", permission: "hr:stat" }
    ]
  },
  
  // 销售管理组
  sale: {
    groupName: "销售管理", 
    modules: [
      { path: "pages/sale/sale", text: "销售管理", icon: "sale", permission: "sale:view" },
      { path: "pages/sale/income", text: "收入分析", icon: "money", permission: "sale:income" }
    ]
  },
  
  // 航班管理组
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
  
  // 权限管理组
  role: {
    groupName: "权限管理",
    modules: [
      { path: "pages/role/agent", text: "供应商界面", icon: "location", permission: "role:agent" },
      { path: "pages/role/manage", text: "权限管理", icon: "meeting", permission: "role:manage" }
    ]
  }
}
```
## 实现方案

### 3. 权限筛选逻辑

```typescript
// 权限筛选器
const useModuleFilter = () => {
  const userStore = useUserStore();
  
  const filterModulesByPermission = (modules: ModuleItem[]) => {
    return modules.filter(module => {
      if (!module.permission) return true; // 无权限要求的模块直接显示
      return userStore.hasPermission(module.permission);
    });
  };
  
  // 按分组过滤模块
  const filterGroupedModules = () => {
    const grouped: Record<string, ModuleItem[]> = {};
    
    Object.values(MODULE_PERMISSIONS).forEach(group => {
      const filteredModules = filterModulesByPermission(group.modules);
      if (filteredModules.length > 0) {
        grouped[group.groupName] = filteredModules;
      }
    });
    
    return grouped;
  };
  
  return {
    filterModulesByPermission,
    filterGroupedModules
  };
};
```

### 4. 响应式布局设计

```less
.module-container {
  padding: @padding-page;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 140rpx; // 留出tabbar空间
  
  .module-group {
    margin-bottom: 40rpx;
    
    .group-title {
      font-size: 32rpx;
      font-weight: bold;
      color: @color-text;
      margin-bottom: 20rpx;
      padding-left: 20rpx;
      border-left: 4rpx solid @primary-color;
    }
    
    .module-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20rpx;
      padding: 0 10rpx;
      
      .module-item {
        background: #ffffff;
        border-radius: 16rpx;
        padding: 30rpx 20rpx;
        text-align: center;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.95);
          background-color: #f8f9fa;
        }
        
        .module-icon {
          font-size: 48rpx;
          margin-bottom: 16rpx;
          color: @primary-color;
        }
        
        .module-text {
          font-size: 26rpx;
          color: @color-text;
          line-height: 1.4;
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
```
### 5. Vue组件模板实现

```vue
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

// 权限配置数据
const MODULE_PERMISSIONS = {
  analysis: {
    groupName: "运营分析",
    modules: [
      { path: "pages/analysis/analysis", text: "运行分析", icon: "analysis", permission: "analysis:view" },
      { path: "pages/analysis/year", text: "历史情况", icon: "analysis", permission: "analysis:year" },
      { path: "pages/analysis/airlines", text: "航线分析", icon: "airline", permission: "analysis:airline" },
      { path: "pages/analysis/overview", text: "运行概览", icon: "info", permission: "analysis:overview" },
      { path: "pages/airplane/airplane", text: "机队分析", icon: "aircraft", permission: "airplane:analysis" }
    ]
  },
  safety: {
    groupName: "安全管理",
    modules: [
      { path: "pages/sms/sms", text: "安全数据", icon: "forbidden", permission: "safety:data" },
      { path: "pages/maintenance/maintenance", text: "故障管理", icon: "maintenance", permission: "maintenance:view" },
      { path: "pages/living/dutyAct", text: "排班管理", icon: "duty", permission: "schedule:view" }
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
    return userStore.hasPermission(module.permission);
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
```
### 6. 完整样式定义

```less
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
      border-left: 4rpx solid @primary-color;
    }
    
    .module-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20rpx;
      padding: 0 10rpx;
      
      .module-item {
        background: #ffffff;
        border-radius: 16rpx;
        padding: 30rpx 20rpx;
        text-align: center;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.95);
          background-color: #f8f9fa;
        }
        
        .module-icon {
          font-size: 48rpx;
          margin-bottom: 16rpx;
          color: @primary-color;
          
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
          font-size: 26rpx;
          color: @color-text;
          line-height: 1.4;
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
```

### 7. 测试验证方案

#### 权限测试场景
1. **管理员权限测试**
   - 验证所有模块分组和功能都能正常显示
   - 确认导航跳转功能正常

2. **普通用户权限测试**
   - 验证只能看到有权限访问的模块
   - 确认无权限的模块被正确隐藏

3. **游客权限测试**
   - 验证显示空状态提示
   - 确认不出现任何功能模块

#### 功能测试检查清单
- [ ] 页面加载时显示加载状态
- [ ] 权限筛选逻辑正确工作
- [ ] 分组标题正确显示
- [ ] 图标样式正确渲染
- [ ] 点击模块能正确跳转
- [ ] 无权限时显示空状态
- [ ] 响应式布局在不同屏幕尺寸下正常
- [ ] tabbar正常显示和工作

#### 性能测试
- [ ] 页面渲染时间 < 500ms
- [ ] 权限检查逻辑性能良好
- [ ] 内存使用量合理

## 使用指南

1. 将上述Vue组件代码替换现有的 `src/pages/index/module.vue` 文件
2. 调整权限代码以匹配实际的权限系统
3. 根据需要调整图标映射和样式
4. 在不同权限级别的用户账户上测试功能

## 技术要点

- **权限集成**: 使用现有的 `useUserStore` 和权限检查方法
- **图标系统**: 利用现有的 `zl-icon-*` CSS 类
- **响应式设计**: 支持不同屏幕尺寸的设备
- **用户体验**: 加载状态、空状态、点击反馈
- **错误处理**: 导航失败时的友好提示