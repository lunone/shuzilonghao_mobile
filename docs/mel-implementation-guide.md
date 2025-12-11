# MEL 模块实现指南

## 概述

本指南提供了 MEL 模块的完整实现方案，包括开发环境准备、代码实现、测试策略和部署流程。基于前面设计的架构、页面、组件和整合计划，提供详细的实施步骤。

## 开发环境准备

### 1. 技术栈要求

#### 1.1 基础技术栈
- **前端框架**：Vue 3 + TypeScript
- **状态管理**：Pinia
- **UI 框架**：uni-ui + 自定义组件
- **构建工具**：Vite
- **代码规范**：ESLint + Prettier
- **测试框架**：Jest + Vue Test Utils

#### 1.2 开发工具
- **IDE**：VS Code
- **版本控制**：Git
- **包管理**：npm
- **调试工具**：Chrome DevTools
- **API 测试**：Postman

#### 1.3 环境配置
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### 2. 项目结构设置

#### 2.1 创建目录结构
```bash
# 创建 MEL 模块目录
mkdir -p src/pages/mel/{list,detail,stats,aircraft,management}
mkdir -p src/components/mel/{common,list,detail,stats,management,aircraft}
mkdir -p src/utils/mel
mkdir -p src/types/mel
mkdir -p src/api/mel
mkdir -p src/store/mel
```

#### 2.2 配置文件更新
```json
// vite.config.ts
export default defineConfig({
  // ... 现有配置
  resolve: {
    alias: {
      '@mel': path.resolve(__dirname, 'src/mel'),
      '@melComponents': path.resolve(__dirname, 'src/components/mel'),
      '@melUtils': path.resolve(__dirname, 'src/utils/mel'),
      '@melTypes': path.resolve(__dirname, 'src/types/mel'),
      '@melApi': path.resolve(__dirname, 'src/api/mel'),
      '@melStore': path.resolve(__dirname, 'src/store/mel')
    }
  }
});
```

## 核心功能实现

### 1. API 服务层实现

#### 1.1 基础 API 服务
```typescript
// src/api/mel/base.ts
import { request } from '@/utils/request';

export class MelBaseAPI {
  protected static async request<T = any>(
    url: string,
    data?: any,
    options?: {
      showLoading?: boolean;
      loadingText?: string;
      errorMessage?: string;
    }
  ): Promise<T> {
    const {
      showLoading = false,
      loadingText = '加载中...',
      errorMessage
    } = options || {};

    try {
      if (showLoading) {
        uni.showLoading({
          title: loadingText,
          mask: true
        });
      }

      const result = await request({
        url,
        data,
        showLoading: false // 已手动处理
      });

      return result;
    } catch (error: any) {
      const message = errorMessage || error.message || '请求失败';
      uni.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      });
      throw error;
    } finally {
      if (showLoading) {
        uni.hideLoading();
      }
    }
  }

  protected static buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  }

  protected static handleApiError(error: any, defaultMessage: string): never {
    const message = error?.message || error?.data?.message || defaultMessage;
    throw new Error(message);
  }
}
```

#### 1.2 具体 API 实现
```typescript
// src/api/mel/management.ts
import { MelBaseAPI } from './base';
import type { 
  MelCreateForm, 
  MelUpdateForm, 
  MelApproveForm,
  MelRejectForm,
  MelCloseForm,
  MelRenewForm,
  MelCreateResponse,
  MelUpdateResponse,
  MelApproveResponse,
  MelRejectResponse,
  MelCloseResponse,
  MelRenewResponse
} from '@melTypes';

export class MelManagementAPI extends MelBaseAPI {
  // 创建 MEL
  static async createMel(data: MelCreateForm): Promise<MelCreateResponse> {
    return this.request<MelCreateResponse>('/mel/create', data, {
      showLoading: true,
      loadingText: '创建中...',
      errorMessage: '创建 MEL 失败'
    });
  }

  // 更新 MEL
  static async updateMel(id: number, data: MelUpdateForm): Promise<MelUpdateResponse> {
    return this.request<MelUpdateResponse>('/mel/update', { id, ...data }, {
      showLoading: true,
      loadingText: '更新中...',
      errorMessage: '更新 MEL 失败'
    });
  }

  // 审批 MEL
  static async approveMel(id: number, data: MelApproveForm): Promise<MelApproveResponse> {
    return this.request<MelApproveResponse>('/mel/approve', { id, ...data }, {
      showLoading: true,
      loadingText: '审批中...',
      errorMessage: '审批 MEL 失败'
    });
  }

  // 拒绝 MEL
  static async rejectMel(id: number, data: MelRejectForm): Promise<MelRejectResponse> {
    return this.request<MelRejectResponse>('/mel/reject', { id, ...data }, {
      showLoading: true,
      loadingText: '处理中...',
      errorMessage: '拒绝 MEL 失败'
    });
  }

  // 关闭 MEL
  static async closeMel(id: number, data: MelCloseForm): Promise<MelCloseResponse> {
    return this.request<MelCloseResponse>('/mel/close', { id, ...data }, {
      showLoading: true,
      loadingText: '关闭中...',
      errorMessage: '关闭 MEL 失败'
    });
  }

  // 续保 MEL
  static async renewMel(id: number, data: MelRenewForm): Promise<MelRenewResponse> {
    return this.request<MelRenewResponse>('/mel/renew', { id, ...data }, {
      showLoading: true,
      loadingText: '续保中...',
      errorMessage: '续保 MEL 失败'
    });
  }

  // 批量审批
  static async batchApprove(ids: number[], data: MelApproveForm): Promise<any> {
    return this.request('/mel/batch/approve', { ids, ...data }, {
      showLoading: true,
      loadingText: '批量审批中...',
      errorMessage: '批量审批失败'
    });
  }

  // 批量拒绝
  static async batchReject(ids: number[], data: MelRejectForm): Promise<any> {
    return this.request('/mel/batch/reject', { ids, ...data }, {
      showLoading: true,
      loadingText: '批量处理中...',
      errorMessage: '批量处理失败'
    });
  }
}
```

### 2. 状态管理实现

#### 2.1 基础状态管理
```typescript
// src/store/mel/base.ts
import { defineStore } from 'pinia';

export const createMelBaseStore = (id: string) => {
  return defineStore(id, () => {
    // 基础状态
    const loading = ref({
      list: false,
      detail: false,
      create: false,
      update: false,
      approve: false,
      reject: false,
      close: false,
      renew: false,
      stats: false,
      upload: false
    });

    const error = ref<string | null>(null);

    // 分页状态
    const pagination = ref({
      currentPage: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0
    });

    // 筛选状态
    const filters = ref({
      status: '',
      type: '',
      acReg: '',
      ata: '',
      dateRange: {
        start: '',
        end: '',
        type: 'inputterDate'
      }
    });

    // 排序状态
    const sort = ref({
      field: 'inputterDate',
      order: 'desc' as 'asc' | 'desc'
    });

    // 视图状态
    const view = ref({
      mode: 'list' as 'list' | 'card',
      layout: 'vertical' as 'vertical' | 'horizontal'
    });

    // 基础方法
    const setLoading = (key: keyof typeof loading.value, value: boolean) => {
      loading.value[key] = value;
    };

    const setError = (message: string | null) => {
      error.value = message;
    };

    const clearError = () => {
      error.value = null;
    };

    const updatePagination = (pageResponse: any) => {
      pagination.value = {
        currentPage: pageResponse.page || 1,
        pageSize: pageResponse.size || 20,
        total: pageResponse.total || 0,
        totalPages: pageResponse.totalPages || 0
      };
    };

    const updateFilters = (newFilters: Partial<typeof filters.value>) => {
      filters.value = { ...filters.value, ...newFilters };
    };

    const updateSort = (field: string, order: 'asc' | 'desc') => {
      sort.value = { field, order };
    };

    const updateView = (newView: Partial<typeof view.value>) => {
      view.value = { ...view.value, ...newView };
    };

    const resetFilters = () => {
      filters.value = {
        status: '',
        type: '',
        acReg: '',
        ata: '',
        dateRange: {
          start: '',
          end: '',
          type: 'inputterDate'
        }
      };
    };

    return {
      // 状态
      loading: readonly(loading),
      error: readonly(error),
      pagination: readonly(pagination),
      filters: readonly(filters),
      sort: readonly(sort),
      view: readonly(view),

      // 方法
      setLoading,
      setError,
      clearError,
      updatePagination,
      updateFilters,
      updateSort,
      updateView,
      resetFilters
    };
  });
};
```

#### 2.2 具体状态管理
```typescript
// src/store/mel/management.ts
import { createMelBaseStore } from './base';
import type { 
  MelCreateForm,
  MelUpdateForm,
  MelApproveForm,
  MelRejectForm,
  MelCloseForm,
  MelRenewForm,
  MelPermissionsResponse,
  MelManagementStatsResponse
} from '@melTypes';
import { MelManagementAPI } from '@melApi';

export const useMelManagementStore = defineStore('melManagement', () => {
  // 继承基础状态
  const baseStore = createMelBaseStore('melManagement');

  // 管理特有状态
  const permissions = ref<MelPermissionsResponse | null>(null);
  const managementStats = ref<MelManagementStatsResponse | null>(null);
  const selectedItems = ref<number[]>([]);
  const formData = ref<{
    create: MelCreateForm | null;
    edit: MelUpdateForm | null;
    approve: MelApproveForm | null;
    reject: MelRejectForm | null;
    close: MelCloseForm | null;
    renew: MelRenewForm | null;
  }>({
    create: null,
    edit: null,
    approve: null,
    reject: null,
    close: null,
    renew: null
  });

  // 管理特有方法
  const fetchPermissions = async () => {
    try {
      const response = await MelManagementAPI.getPermissions();
      permissions.value = response;
    } catch (error: any) {
      baseStore.setError(error.message || '获取权限失败');
    }
  };

  const fetchManagementStats = async () => {
    baseStore.setLoading('stats', true);
    baseStore.clearError();

    try {
      const response = await MelManagementAPI.getManagementStats();
      managementStats.value = response;
    } catch (error: any) {
      baseStore.setError(error.message || '获取管理统计失败');
    } finally {
      baseStore.setLoading('stats', false);
    }
  };

  const createMel = async (data: MelCreateForm) => {
    baseStore.setLoading('create', true);
    baseStore.clearError();

    try {
      const response = await MelManagementAPI.createMel(data);
      
      if (response.success) {
        uni.showToast({
          title: '创建成功',
          icon: 'success'
        });
        
        // 清空表单
        formData.value.create = null;
        
        // 跳转到详情页
        uni.navigateTo({
          url: `/pages/mel/detail/index?id=${response.data.id}&source=${response.data.source}`
        });
      } else {
        baseStore.setError(response.message);
      }
    } catch (error: any) {
      baseStore.setError(error.message || '创建失败');
    } finally {
      baseStore.setLoading('create', false);
    }
  };

  const updateMel = async (id: number, data: MelUpdateForm) => {
    baseStore.setLoading('update', true);
    baseStore.clearError();

    try {
      const response = await MelManagementAPI.updateMel(id, data);
      
      if (response.success) {
        uni.showToast({
          title: '更新成功',
          icon: 'success'
        });
        
        // 清空表单
        formData.value.edit = null;
        
        // 跳转到详情页
        uni.navigateTo({
          url: `/pages/mel/detail/index?id=${response.data.id}&source=${response.data.source}`
        });
      } else {
        baseStore.setError(response.message);
      }
    } catch (error: any) {
      baseStore.setError(error.message || '更新失败');
    } finally {
      baseStore.setLoading('update', false);
    }
  };

  const approveMel = async (id: number, data: MelApproveForm) => {
    baseStore.setLoading('approve', true);
    baseStore.clearError();

    try {
      const response = await MelManagementAPI.approveMel(id, data);
      
      if (response.success) {
        uni.showToast({
          title: '审批成功',
          icon: 'success'
        });
        
        // 清空表单
        formData.value.approve = null;
        
        // 刷新列表
        await baseStore.fetchData();
      } else {
        baseStore.setError(response.message);
      }
    } catch (error: any) {
      baseStore.setError(error.message || '审批失败');
    } finally {
      baseStore.setLoading('approve', false);
    }
  };

  const rejectMel = async (id: number, data: MelRejectForm) => {
    baseStore.setLoading('reject', true);
    baseStore.clearError();

    try {
      const response = await MelManagementAPI.rejectMel(id, data);
      
      if (response.success) {
        uni.showToast({
          title: '拒绝成功',
          icon: 'success'
        });
        
        // 清空表单
        formData.value.reject = null;
        
        // 刷新列表
        await baseStore.fetchData();
      } else {
        baseStore.setError(response.message);
      }
    } catch (error: any) {
      baseStore.setError(error.message || '拒绝失败');
    } finally {
      baseStore.setLoading('reject', false);
    }
  };

  const closeMel = async (id: number, data: MelCloseForm) => {
    baseStore.setLoading('close', true);
    baseStore.clearError();

    try {
      const response = await MelManagementAPI.closeMel(id, data);
      
      if (response.success) {
        uni.showToast({
          title: '关闭成功',
          icon: 'success'
        });
        
        // 清空表单
        formData.value.close = null;
        
        // 刷新列表
        await baseStore.fetchData();
      } else {
        baseStore.setError(response.message);
      }
    } catch (error: any) {
      baseStore.setError(error.message || '关闭失败');
    } finally {
      baseStore.setLoading('close', false);
    }
  };

  const renewMel = async (id: number, data: MelRenewForm) => {
    baseStore.setLoading('renew', true);
    baseStore.clearError();

    try {
      const response = await MelManagementAPI.renewMel(id, data);
      
      if (response.success) {
        uni.showToast({
          title: '续保成功',
          icon: 'success'
        });
        
        // 清空表单
        formData.value.renew = null;
        
        // 刷新列表
        await baseStore.fetchData();
      } else {
        baseStore.setError(response.message);
      }
    } catch (error: any) {
      baseStore.setError(error.message || '续保失败');
    } finally {
      baseStore.setLoading('renew', false);
    }
  };

  const batchApprove = async (ids: number[], data: MelApproveForm) => {
    baseStore.setLoading('approve', true);
    baseStore.clearError();

    try {
      const response = await MelManagementAPI.batchApprove(ids, data);
      
      if (response.success) {
        uni.showToast({
          title: `批量审批成功，共处理 ${ids.length} 条记录`,
          icon: 'success'
        });
        
        // 清空选择
        selectedItems.value = [];
        
        // 清空表单
        formData.value.approve = null;
        
        // 刷新列表
        await baseStore.fetchData();
      } else {
        baseStore.setError(response.message);
      }
    } catch (error: any) {
      baseStore.setError(error.message || '批量审批失败');
    } finally {
      baseStore.setLoading('approve', false);
    }
  };

  const batchReject = async (ids: number[], data: MelRejectForm) => {
    baseStore.setLoading('reject', true);
    baseStore.clearError();

    try {
      const response = await MelManagementAPI.batchReject(ids, data);
      
      if (response.success) {
        uni.showToast({
          title: `批量拒绝成功，共处理 ${ids.length} 条记录`,
          icon: 'success'
        });
        
        // 清空选择
        selectedItems.value = [];
        
        // 清空表单
        formData.value.reject = null;
        
        // 刷新列表
        await baseStore.fetchData();
      } else {
        baseStore.setError(response.message);
      }
    } catch (error: any) {
      baseStore.setError(error.message || '批量拒绝失败');
    } finally {
      baseStore.setLoading('reject', false);
    }
  };

  const toggleItemSelection = (id: number) => {
    const index = selectedItems.value.indexOf(id);
    
    if (index > -1) {
      selectedItems.value.splice(index, 1);
    } else {
      selectedItems.value.push(id);
    }
  };

  const selectAllItems = () => {
    selectedItems.value = baseStore.melList.map(item => item.id);
  };

  const clearItemSelection = () => {
    selectedItems.value = [];
  };

  const setFormData = (type: keyof typeof formData.value, data: any) => {
    formData.value[type] = data;
  };

  const clearFormData = (type: keyof typeof formData.value) => {
    formData.value[type] = null;
  };

  return {
    // 继承基础状态和方法
    ...baseStore,

    // 管理特有状态
    permissions: readonly(permissions),
    managementStats: readonly(managementStats),
    selectedItems: readonly(selectedItems),
    formData: readonly(formData),

    // 管理特有方法
    fetchPermissions,
    fetchManagementStats,
    createMel,
    updateMel,
    approveMel,
    rejectMel,
    closeMel,
    renewMel,
    batchApprove,
    batchReject,
    toggleItemSelection,
    selectAllItems,
    clearItemSelection,
    setFormData,
    clearFormData
  };
});
```

### 3. 组件实现

#### 3.1 通用组件实现
```vue
<!-- src/components/mel/common/MelStatusBadge.vue -->
<template>
  <span class="mel-status-badge" :class="statusClass">
    <uni-icons v-if="showIcon" :type="statusIcon" size="12" />
    <span class="status-text">{{ displayText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  status: string;
  showIcon?: boolean;
  customText?: string;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
  size: 'medium'
});

// 状态配置
const statusConfig = {
  '已批准': { class: 'status-approved', icon: 'checkmarkempty', color: '#27ae60' },
  '待批准': { class: 'status-pending', icon: 'clock', color: '#f39c12' },
  '已拒绝': { class: 'status-rejected', icon: 'closeempty', color: '#e74c3c' },
  '进行中': { class: 'status-progress', icon: 'loop', color: '#3498db' },
  '已关闭': { class: 'status-closed', icon: 'flag', color: '#95a5a6' }
};

const statusClass = computed(() => {
  const config = statusConfig[props.status as keyof typeof statusConfig];
  return [
    'status-badge',
    config?.class || 'status-default',
    `size-${props.size}`
  ];
});

const statusIcon = computed(() => {
  const config = statusConfig[props.status as keyof typeof statusConfig];
  return config?.icon || 'info';
});

const displayText = computed(() => {
  return props.customText || props.status;
});
</script>

<style lang="less" scoped>
.mel-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  
  &.status-approved {
    background: #d4edda;
    color: #27ae60;
  }
  
  &.status-pending {
    background: #fff3cd;
    color: #f39c12;
  }
  
  &.status-rejected {
    background: #f8d7da;
    color: #e74c3c;
  }
  
  &.status-progress {
    background: #d1ecf1;
    color: #3498db;
  }
  
  &.status-closed {
    background: #f8f9fa;
    color: #95a5a6;
  }
  
  &.status-default {
    background: #f0f0f0;
    color: #666;
  }
  
  &.size-small {
    padding: 1px 6px;
    font-size: 10px;
  }
  
  &.size-large {
    padding: 4px 12px;
    font-size: 14px;
  }
}
</style>
```

#### 3.2 业务组件实现
```vue
<!-- src/components/mel/management/MelCreateForm.vue -->
<template>
  <div class="mel-create-form">
    <uni-forms ref="formRef" :model="formData" :rules="formRules">
      <!-- 数据来源选择 -->
      <uni-section title="数据来源" type="line">
        <radio-group @change="handleSourceChange">
          <label class="radio-item">
            <radio value="base" :checked="dataSource === 'base'" />
            <span>主基地数据</span>
          </label>
          <label class="radio-item">
            <radio value="outstation" :checked="dataSource === 'outstation'" />
            <span>外站数据</span>
          </label>
        </radio-group>
      </uni-section>
      
      <!-- 基础信息 -->
      <uni-section title="基础信息" type="line">
        <uni-forms-item label="飞机注册号" name="acReg" required>
          <uni-data-select 
            v-model="formData.acReg"
            :localdata="aircraftOptions"
            @change="handleAircraftChange"
          />
        </uni-forms-item>
        
        <uni-forms-item label="机型" name="acType">
          <uni-easyinput v-model="formData.acType" disabled />
        </uni-forms-item>
        
        <uni-forms-item label="ATA章节" name="ata" required>
          <MelATATag v-model="formData.ata" />
        </uni-forms-item>
        
        <uni-forms-item label="故障描述" name="description" required>
          <uni-easyinput 
            v-model="formData.description"
            type="textarea"
            placeholder="请输入故障描述"
            maxlength="500"
          />
        </uni-forms-item>
        
        <uni-forms-item label="English Description" name="englishDescription">
          <uni-easyinput 
            v-model="formData.englishDescription"
            type="textarea"
            placeholder="Please enter fault description in English"
            maxlength="500"
          />
        </uni-forms-item>
      </uni-section>
      
      <!-- 主基地特有信息 -->
      <template v-if="dataSource === 'base'">
        <uni-section title="保留信息" type="line">
          <uni-forms-item label="保留类型" name="defferType" required>
            <uni-data-select 
              v-model="formData.defferType"
              :localdata="defferTypeOptions"
            />
          </uni-forms-item>
          
          <uni-forms-item label="保留依据" name="defferBasis" required>
            <uni-easyinput 
              v-model="formData.defferBasis"
              type="textarea"
              placeholder="请输入保留依据"
            />
          </uni-forms-item>
          
          <uni-forms-item label="保留原因" name="defferReason" required>
            <uni-easyinput 
              v-model="formData.defferReason"
              type="textarea"
              placeholder="请输入保留原因"
            />
          </uni-forms-item>
          
          <uni-forms-item label="保留日期" name="defferDate" required>
            <uni-datetime-picker 
              v-model="formData.defferDate"
              type="date"
            />
          </uni-forms-item>
        </uni-section>
      </template>
      
      <!-- 外站特有信息 -->
      <template v-else-if="dataSource === 'outstation'">
        <uni-section title="外站信息" type="line">
          <uni-forms-item label="航站" name="flightSite" required>
            <uni-data-select 
              v-model="formData.flightSite"
              :localdata="flightSiteOptions"
            />
          </uni-forms-item>
          
          <uni-forms-item label="座位号" name="seatNo">
            <uni-easyinput 
              v-model="formData.seatNo"
              placeholder="请输入座位号"
            />
          </uni-forms-item>
          
          <uni-forms-item label="是否有运行限制" name="hasLimit">
            <switch v-model="formData.hasLimit" />
          </uni-forms-item>
          
          <uni-forms-item label="纠正措施" name="correctiveAction">
            <uni-easyinput 
              v-model="formData.correctiveAction"
              type="textarea"
              placeholder="请输入纠正措施"
            />
          </uni-forms-item>
        </uni-section>
      </template>
      
      <!-- 修复期限 -->
      <uni-section title="修复期限" type="line">
        <uni-forms-item label="修复期限(日历日)" name="repairDays">
          <uni-easyinput 
            v-model="formData.repairDays"
            type="number"
            placeholder="请输入天数"
          />
        </uni-forms-item>
        
        <uni-forms-item label="修复期限(FH)" name="repairFH">
          <uni-easyinput 
            v-model="formData.repairFH"
            type="number"
            placeholder="请输入飞行小时"
          />
        </uni-forms-item>
        
        <uni-forms-item label="修复期限(FC)" name="repairFC">
          <uni-easyinput 
            v-model="formData.repairFC"
            type="number"
            placeholder="请输入飞行循环"
          />
        </uni-forms-item>
        
        <uni-forms-item label="修复期限(飞行日)" name="repairFlightDays">
          <uni-easyinput 
            v-model="formData.repairFlightDays"
            type="number"
            placeholder="请输入飞行日"
          />
        </uni-forms-item>
      </uni-section>
    </uni-forms>
    
    <!-- 操作按钮 -->
    <div class="form-actions">
      <button @click="saveDraft">保存草稿</button>
      <button @click="previewMel">预览</button>
      <button type="primary" @click="submitMel">提交</button>
      <button @click="cancelCreate">取消</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMelManagementStore } from '@melStore';
import type { MelCreateForm } from '@melTypes';

const melManagementStore = useMelManagementStore();

// 表单数据
const formData = ref<MelCreateForm>({
  acReg: '',
  acType: '',
  ata: '',
  description: '',
  englishDescription: '',
  defferType: '',
  defferBasis: '',
  defferReason: '',
  defferDate: '',
  repairDays: 0,
  repairFH: 0,
  repairFC: 0,
  repairFlightDays: 0,
  source: 'base',
  flightSite: '',
  seatNo: '',
  hasLimit: false,
  correctiveAction: ''
});

const dataSource = ref('base');

// 表单引用
const formRef = ref();

// 选项数据
const aircraftOptions = ref([]);
const defferTypeOptions = ref([
  { value: 'A', text: 'A类' },
  { value: 'B', text: 'B类' },
  { value: 'C', text: 'C类' }
]);
const flightSiteOptions = ref([]);

// 表单验证规则
const formRules = computed(() => ({
  acReg: {
    rules: [{ required: true, errorMessage: '请选择飞机注册号' }]
  },
  ata: {
    rules: [{ required: true, errorMessage: '请选择ATA章节' }]
  },
  description: {
    rules: [{ required: true, errorMessage: '请输入故障描述' }]
  },
  defferType: {
    rules: dataSource.value === 'base' ? [{ required: true, errorMessage: '请选择保留类型' }] : []
  },
  defferBasis: {
    rules: dataSource.value === 'base' ? [{ required: true, errorMessage: '请输入保留依据' }] : []
  },
  defferReason: {
    rules: dataSource.value === 'base' ? [{ required: true, errorMessage: '请输入保留原因' }] : []
  },
  defferDate: {
    rules: dataSource.value === 'base' ? [{ required: true, errorMessage: '请选择保留日期' }] : []
  },
  flightSite: {
    rules: dataSource.value === 'outstation' ? [{ required: true, errorMessage: '请选择航站' }] : []
  }
}));

// 方法
const handleSourceChange = (value: string) => {
  dataSource.value = value;
  formData.value.source = value;
};

const handleAircraftChange = (value: string) => {
  // 根据飞机号自动填充机型
  const aircraft = aircraftOptions.value.find(item => item.value === value);
  if (aircraft) {
    formData.value.acType = aircraft.acType;
  }
};

const saveDraft = () => {
  // 保存草稿逻辑
  uni.setStorageSync('mel_draft', JSON.stringify(formData.value));
  uni.showToast({
    title: '草稿已保存',
    icon: 'success'
  });
};

const previewMel = () => {
  // 预览逻辑
  uni.navigateTo({
    url: '/pages/mel/preview',
    success: () => {
      uni.setStorageSync('mel_preview_data', JSON.stringify(formData.value));
    }
  });
};

const submitMel = async () => {
  try {
    // 表单验证
    await formRef.value.validate();
    
    // 提交表单
    await melManagementStore.createMel(formData.value);
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};

const cancelCreate = () => {
  uni.navigateBack();
};

// 生命周期
onMounted(async () => {
  // 加载选项数据
  try {
    // 加载飞机选项
    const aircraftResponse = await fetch('/api/aircraft/options');
    aircraftOptions.value = aircraftResponse.data;
    
    // 加载航站选项
    const flightSiteResponse = await fetch('/api/flightSite/options');
    flightSiteOptions.value = flightSiteResponse.data;
  } catch (error) {
    console.error('加载选项数据失败:', error);
  }
  
  // 恢复草稿
  const draft = uni.getStorageSync('mel_draft');
  if (draft) {
    try {
      const draftData = JSON.parse(draft);
      Object.assign(formData.value, draftData);
      dataSource.value = draftData.source;
    } catch (error) {
      console.error('恢复草稿失败:', error);
    }
  }
});
</script>

<style lang="less" scoped>
.mel-create-form {
  padding: 16px;
  background: #f5f5f5;
  min-height: 100vh;
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e9ecef;
    
    button {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      
      &[type="primary"] {
        background: #137fec;
        color: white;
        border: none;
      }
      
      &:not([type="primary"]) {
        background: #f8f9fa;
        color: #6c757d;
        border: 1px solid #dee2e6;
      }
    }
  }
  
  .radio-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
}
</style>
```

### 4. 页面实现

#### 4.1 列表页面实现
```vue
<!-- src/pages/mel/list/index.vue -->
<template>
  <div class="mel-list-page">
    <!-- 搜索栏 -->
    <MelSearchBar 
      v-model="searchQuery"
      @search="handleSearch"
      @focus="showAdvancedSearch"
    />
    
    <!-- 快速筛选标签 -->
    <MelFilter 
      v-model="filters"
      :options="filterOptions"
      @change="handleFilterChange"
    />
    
    <!-- 排序和视图切换 -->
    <div class="list-controls">
      <MelSortSelector v-model="sortBy" @change="handleSortChange" />
      <MelViewToggle v-model="viewMode" />
    </div>
    
    <!-- MEL 列表内容 -->
    <div class="list-content">
      <MelItem 
        v-for="item in melStore.melList"
        :key="item.id"
        :data="item"
        :view-mode="viewMode"
        :is-selected="isSelected(item.id)"
        @click="handleItemClick"
        @select="handleItemSelect"
      />
    </div>
    
    <!-- 分页控件 -->
    <MelPagination 
      v-model="currentPage"
      :total="melStore.pagination.total"
      :page-size="melStore.pagination.pageSize"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMelStore } from '@melStore';
import { MelRouter } from '@melUtils';
import { MelEventBus, MelEvents } from '@melUtils';

const melStore = useMelStore();

// 响应式数据
const searchQuery = ref('');
const filters = ref({});
const sortBy = ref('');
const viewMode = ref<'list' | 'card'>('list');
const currentPage = ref(1);

// 计算属性
const filterOptions = computed(() => ({
  status: [
    { label: '已批准', value: '已批准' },
    { label: '待批准', value: '待批准' },
    { label: '已拒绝', value: '已拒绝' },
    { label: '进行中', value: '进行中' }
  ],
  type: [
    { label: 'MEL', value: 'MEL' },
    { label: 'CDL', value: 'CDL' }
  ],
  deffer: [
    { label: 'A类', value: 'A' },
    { label: 'B类', value: 'B' },
    { label: 'C类', value: 'C' }
  ]
}));

// 方法
const handleSearch = (query: string) => {
  searchQuery.value = query;
  performSearch();
};

const handleFilterChange = (newFilters: any) => {
  filters.value = newFilters;
  performSearch();
};

const handleSortChange = (newSortBy: string) => {
  sortBy.value = newSortBy;
  performSearch();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  performSearch();
};

const handleItemClick = (item: any) => {
  MelRouter.toDetail(item.id.toString(), item.source);
};

const handleItemSelect = (id: number) => {
  melStore.toggleItemSelection(id);
};

const isSelected = (id: number) => {
  return melStore.selectedItems.includes(id);
};

const showAdvancedSearch = () => {
  MelRouter.toSearch();
};

const performSearch = async () => {
  try {
    await melStore.queryWithBuilder(
      createMelQuery()
        .withAircraft(filters.value.acReg || '')
        .withStatus(filters.value.status || '')
        .withType(filters.value.type || '')
        .withDeferralType(filters.value.deffer || '')
        .withPage(currentPage.value)
        .withSize(20)
    );
  } catch (error) {
    console.error('搜索失败:', error);
  }
};

// 生命周期
onMounted(() => {
  // 获取初始数据
  performSearch();
  
  // 监听事件
  MelEventBus.on(MelEvents.FILTER_CHANGED, performSearch);
  MelEventBus.on(MelEvents.SORT_CHANGED, performSearch);
});

onUnmounted(() => {
  MelEventBus.off(MelEvents.FILTER_CHANGED, performSearch);
  MelEventBus.off(MelEvents.SORT_CHANGED, performSearch);
});
</script>

<style lang="less" scoped>
.mel-list-page {
  background: #f5f5f5;
  min-height: 100vh;
  
  .list-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: white;
    margin-bottom: 8px;
  }
  
  .list-content {
    padding: 0 16px;
  }
}
</style>
```

## 测试实现

### 1. 单元测试

#### 1.1 组件测试
```typescript
// tests/components/MelStatusBadge.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import MelStatusBadge from '@/components/mel/common/MelStatusBadge.vue';

describe('MelStatusBadge', () => {
  it('should render status correctly', () => {
    const wrapper = mount(MelStatusBadge, {
      props: {
        status: '已批准'
      }
    });
    
    expect(wrapper.find('.status-text').text()).toBe('已批准');
    expect(wrapper.find('.mel-status-badge').classes()).toContain('status-approved');
  });
  
  it('should emit click event when clickable', async () => {
    const wrapper = mount(MelStatusBadge, {
      props: {
        status: '已批准',
        clickable: true
      }
    });
    
    await wrapper.trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')[0]).toEqual(['已批准']);
  });
  
  it('should show custom text when provided', () => {
    const wrapper = mount(MelStatusBadge, {
      props: {
        status: '已批准',
        customText: '自定义文本'
      }
    });
    
    expect(wrapper.find('.status-text').text()).toBe('自定义文本');
  });
});
```

#### 1.2 API 测试
```typescript
// tests/api/MelManagementAPI.test.ts
import { describe, it, expect, vi } from 'vitest';
import { MelManagementAPI } from '@/api/mel/management';

// Mock request function
vi.mock('@/utils/request', () => ({
  request: vi.fn()
}));

describe('MelManagementAPI', () => {
  it('should create MEL successfully', async () => {
    const mockResponse = {
      success: true,
      data: { id: 1, status: '待批准' },
      message: '创建成功'
    };
    
    const { request } = await import('@/utils/request');
    (request as any).mockResolvedValue(mockResponse);
    
    const result = await MelManagementAPI.createMel({
      acReg: 'B-1234',
      description: '测试故障'
    } as any);
    
    expect(request).toHaveBeenCalledWith({
      url: '/mel/create',
      data: {
        acReg: 'B-1234',
        description: '测试故障'
      },
      showLoading: true,
      loadingText: '创建中...',
      errorMessage: '创建 MEL 失败'
    });
    
    expect(result).toEqual(mockResponse);
  });
  
  it('should handle API error correctly', async () => {
    const mockError = new Error('网络错误');
    
    const { request } = await import('@/utils/request');
    (request as any).mockRejectedValue(mockError);
    
    await expect(MelManagementAPI.createMel({
      acReg: 'B-1234',
      description: '测试故障'
    } as any)).rejects.toThrow('网络错误');
  });
});
```

#### 1.3 状态管理测试
```typescript
// tests/store/useMelManagementStore.test.ts
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMelManagementStore } from '@/store/mel/management';

// Mock API
vi.mock('@/api/mel/management', () => ({
  MelManagementAPI: {
    createMel: vi.fn(),
    updateMel: vi.fn(),
    approveMel: vi.fn(),
    rejectMel: vi.fn(),
    closeMel: vi.fn(),
    renewMel: vi.fn(),
    batchApprove: vi.fn(),
    batchReject: vi.fn(),
    getPermissions: vi.fn(),
    getManagementStats: vi.fn()
  }
}));

describe('useMelManagementStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  
  it('should create MEL successfully', async () => {
    const store = useMelManagementStore();
    const mockResponse = {
      success: true,
      data: { id: 1, status: '待批准' },
      message: '创建成功'
    };
    
    const { MelManagementAPI } = await import('@/api/mel/management');
    (MelManagementAPI.createMel as any).mockResolvedValue(mockResponse);
    
    await store.createMel({
      acReg: 'B-1234',
      description: '测试故障'
    } as any);
    
    expect(MelManagementAPI.createMel).toHaveBeenCalledWith({
      acReg: 'B-1234',
      description: '测试故障'
    });
    
    expect(store.formData.create).toBeNull();
  });
  
  it('should handle create MEL error', async () => {
    const store = useMelManagementStore();
    const mockError = new Error('创建失败');
    
    const { MelManagementAPI } = await import('@/api/mel/management');
    (MelManagementAPI.createMel as any).mockRejectedValue(mockError);
    
    await store.createMel({
      acReg: 'B-1234',
      description: '测试故障'
    } as any);
    
    expect(store.error).toBe('创建失败');
    expect(store.loading.create).toBe(false);
  });
});
```

### 2. 集成测试

#### 2.1 页面集成测试
```typescript
// tests/pages/MelListPage.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import MelListPage from '@/pages/mel/list/index.vue';

// Mock store
vi.mock('@/store/mel', () => ({
  useMelStore: () => ({
    melList: [
      { id: 1, melNo: 'MEL001', acReg: 'B-1234', status: '已批准' },
      { id: 2, melNo: 'MEL002', acReg: 'B-5678', status: '待批准' }
    ],
    pagination: { currentPage: 1, pageSize: 20, total: 2, totalPages: 1 },
    loading: { list: false },
    error: null,
    queryWithBuilder: vi.fn(),
    toggleItemSelection: vi.fn()
  })
}));

// Mock router
vi.mock('@/utils/melRouter', () => ({
  MelRouter: {
    toDetail: vi.fn(),
    toSearch: vi.fn()
  }
}));

describe('MelListPage', () => {
  it('should render MEL list correctly', () => {
    const wrapper = mount(MelListPage);
    
    expect(wrapper.find('.mel-list-page')).exists();
    expect(wrapper.findAllComponents({ name: 'MelItem' })).toHaveLength(2);
  });
  
  it('should handle search correctly', async () => {
    const wrapper = mount(MelListPage);
    const { useMelStore } = await import('@/store/mel');
    const mockStore = useMelStore();
    
    await wrapper.setData({ searchQuery: 'MEL001' });
    await wrapper.vm.$nextTick();
    
    expect(mockStore.queryWithBuilder).toHaveBeenCalled();
  });
  
  it('should navigate to detail when item clicked', async () => {
    const wrapper = mount(MelListPage);
    const { MelRouter } = await import('@/utils/melRouter');
    
    await wrapper.findComponent({ name: 'MelItem' }).vm.$emit('click', {
      id: 1,
      source: 'base'
    });
    
    expect(MelRouter.toDetail).toHaveBeenCalledWith('1', 'base');
  });
});
```

### 3. 端到端测试

#### 3.1 用户流程测试
```typescript
// tests/e2e/mel-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('MEL Management', () => {
  test('should create MEL successfully', async ({ page }) => {
    await page.goto('/pages/mel/management/create');
    
    // 填写表单
    await page.fill('[data-testid="acReg"]', 'B-1234');
    await page.fill('[data-testid="description"]', '测试故障描述');
    await page.selectOption('[data-testid="defferType"]', 'A');
    
    // 提交表单
    await page.click('[data-testid="submit-btn"]');
    
    // 验证结果
    await expect(page.locator('.uni-toast')).toContainText('创建成功');
    
    // 验证跳转
    await expect(page).toHaveURL(/\/pages\/mel\/detail\/index\?id=\d+/);
  });
  
  test('should approve MEL successfully', async ({ page }) => {
    await page.goto('/pages/mel/management/approve');
    
    // 选择记录
    await page.check('[data-testid="select-1"]');
    
    // 填写审批意见
    await page.fill('[data-testid="approve-comment"]', '审批通过');
    
    // 提交审批
    await page.click('[data-testid="approve-btn"]');
    
    // 验证结果
    await expect(page.locator('.uni-toast')).toContainText('审批成功');
  });
  
  test('should handle batch operations', async ({ page }) => {
    await page.goto('/pages/mel/management/approve');
    
    // 全选记录
    await page.click('[data-testid="select-all"]');
    
    // 批量审批
    await page.fill('[data-testid="batch-comment"]', '批量审批通过');
    await page.click('[data-testid="batch-approve-btn"]');
    
    // 验证结果
    await expect(page.locator('.uni-toast')).toContainText('批量审批成功');
  });
});
```

## 部署流程

### 1. 构建配置

#### 1.1 环境配置
```typescript
// build/config/prod.ts
export default {
  // API 基础路径
  API_BASE_URL: 'https://api.example.com',
  
  // 构建配置
  BUILD_CONFIG: {
    // 是否压缩代码
    minify: true,
    // 是否生成 source map
    sourceMap: false,
    // 是否去除 console
    dropConsole: true,
    // 是否去除 debugger
    dropDebugger: true
  },
  
  // 功能开关
  FEATURE_FLAGS: {
    // 是否启用新功能
    enableNewFeatures: true,
    // 是否启用调试模式
    enableDebugMode: false
  }
};
```

#### 1.2 构建脚本
```json
// package.json
{
  "scripts": {
    "build:mel": "vite build --config build/config/prod.ts",
    "build:mel:dev": "vite build --config build/config/dev.ts",
    "build:mel:test": "vite build --config build/config/test.ts",
    "test:mel": "vitest run --config vitest.config.mel.ts",
    "test:mel:ui": "vitest --config vitest.config.mel.ts --ui",
    "test:mel:coverage": "vitest --config vitest.config.mel.ts --coverage",
    "lint:mel": "eslint src/mel --ext .vue,.ts,.js",
    "lint:mel:fix": "eslint src/mel --ext .vue,.ts,.js --fix"
  }
}
```

### 2. 部署步骤

#### 2.1 预部署检查
```bash
# 1. 代码质量检查
npm run lint:mel

# 2. 单元测试
npm run test:mel

# 3. 集成测试
npm run test:mel:e2e

# 4. 构建检查
npm run build:mel:dev

# 5. 性能检查
npm run build:analyze
```

#### 2.2 生产部署
```bash
# 1. 构建生产版本
npm run build:mel

# 2. 上传构建产物
# - 上传到服务器
# - 或上传到 CDN

# 3. 更新路由配置
# - 更新 pages.json
# - 或更新服务器路由配置

# 4. 清理缓存
# - 清理浏览器缓存
# - 清理服务器缓存
# - 清理 CDN 缓存
```

### 3. 监控和维护

#### 3.1 错误监控
```typescript
// src/utils/mel/errorMonitor.ts
export class MelErrorMonitor {
  static init() {
    // 全局错误捕获
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    // Vue 错误捕获
    app.config.errorHandler = this.handleVueError;
  }
  
  static handleGlobalError(event: ErrorEvent) => {
    this.reportError({
      type: 'global',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  }
  
  static handleUnhandledRejection(event: PromiseRejectionEvent) {
    this.reportError({
      type: 'unhandledRejection',
      message: event.reason,
      stack: event.reason?.stack
    });
  }
  
  static handleVueError(error: any, instance: any, info: string) {
    this.reportError({
      type: 'vue',
      message: error.message,
      stack: error.stack,
      info
    });
  }
  
  static reportError(errorInfo: any) {
    // 发送错误信息到监控服务器
    fetch('/api/error/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...errorInfo,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(err => {
      console.error('Failed to report error:', err);
    });
  }
}
```

#### 3.2 性能监控
```typescript
// src/utils/mel/performanceMonitor.ts
export class MelPerformanceMonitor {
  static init() {
    // 页面加载性能
    window.addEventListener('load', this.measurePageLoad);
    
    // API 请求性能
    this.interceptFetch();
    
    // 组件渲染性能
    this.measureComponentRender();
  }
  
  static measurePageLoad() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      // DNS 查询时间
      dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      // TCP 连接时间
      tcpConnect: navigation.connectEnd - navigation.connectStart,
      // 请求响应时间
      serverResponse: navigation.responseEnd - navigation.requestStart,
      // DOM 解析时间
      domParse: navigation.domContentLoadedEventEnd - navigation.responseEnd,
      // 页面加载完成时间
      pageLoad: navigation.loadEventEnd - navigation.navigationStart
    };
    
    this.reportMetrics('page_load', metrics);
  }
  
  static interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        
        this.reportMetrics('api_request', {
          url: args[0],
          duration: endTime - startTime,
          status: response.status,
          method: args[1]?.method || 'GET'
        });
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        
        this.reportMetrics('api_error', {
          url: args[0],
          duration: endTime - startTime,
          error: error.message
        });
        
        throw error;
      }
    };
  }
  
  static measureComponentRender() {
    // 使用 Vue 的性能 API
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            this.reportMetrics('component_render', {
              name: entry.name,
              duration: entry.duration
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['measure'] });
    }
  }
  
  static reportMetrics(type: string, metrics: any) {
    // 发送性能指标到监控服务器
    fetch('/api/performance/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        metrics,
        timestamp: new Date().toISOString(),
        url: window.location.href
      })
    }).catch(err => {
      console.error('Failed to report metrics:', err);
    });
  }
}
```

## 总结

MEL 模块实现指南提供了完整的开发、测试和部署流程：

1. **开发环境准备**：确保开发环境配置正确
2. **核心功能实现**：提供 API、状态管理、组件和页面的实现示例
3. **测试策略**：包括单元测试、集成测试和端到端测试
4. **部署流程**：确保代码质量和部署稳定性
5. **监控维护**：提供错误监控和性能监控方案

通过这个指南，开发团队可以高效地实现 MEL 模块，确保代码质量和用户体验。