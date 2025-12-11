# MEL 模块整合计划

## 概述

基于已设计的 MEL 模块架构，制定详细的整合计划，将现有的 MEL 功能迁移到新的模块结构中，确保功能完整性和数据一致性。

## 现有功能分析

### 1. 现有文件清单

```
现有 MEL 相关文件：
├── src/api/mel.api.ts           # API 服务层
├── src/store/mel.store.ts       # 状态管理
├── src/types/mel.ts            # 类型定义
├── src/pages/maintenance/mel/melList.vue    # MEL 列表页面
├── src/pages/maintenance/mel/melDetail.vue  # MEL 详情页面
├── src/pages/maintenance/mel/card.vue        # MEL 卡片组件
└── src/pages/maintenance/maintenance.vue      # 维修主页
```

### 2. 现有功能评估

#### 2.1 API 服务层
- **优点**：完整的 API 封装，支持链式调用
- **缺点**：部分接口未充分利用
- **整合策略**：保留现有实现，补充缺失功能

#### 2.2 状态管理
- **优点**：使用 Pinia，结构清晰
- **缺点**：缺少部分管理功能的状态
- **整合策略**：扩展状态管理，增加管理相关状态

#### 2.3 类型定义
- **优点**：完整的类型定义，支持主基地和外站数据
- **缺点**：部分类型可以进一步优化
- **整合策略**：保留现有类型，补充管理相关类型

#### 2.4 页面组件
- **优点**：基础功能完整
- **缺点**：缺少高级功能，用户体验有待提升
- **整合策略**：重构现有页面，增加新功能

## 整合计划

### 阶段一：准备工作

#### 1.1 创建新目录结构
```bash
# 创建新的 MEL 模块目录
mkdir -p src/pages/mel/{list,detail,stats,aircraft,management}
mkdir -p src/components/mel/{common,list,detail,stats,management,aircraft}
mkdir -p src/utils/mel
```

#### 1.2 备份现有文件
```bash
# 创建备份目录
mkdir -p backup/mel

# 备份现有文件
cp src/api/mel.api.ts backup/mel/
cp src/store/mel.store.ts backup/mel/
cp src/types/mel.ts backup/mel/
cp -r src/pages/maintenance/mel backup/mel/
```

#### 1.3 更新路由配置
```json
// 在 pages.json 中添加新的路由配置
{
  "subPackages": [
    {
      "root": "pages/mel",
      "pages": [
        "index",
        "list/index",
        "list/search",
        "detail/index",
        "stats/index",
        "stats/status",
        "stats/ata",
        "stats/monthly",
        "aircraft/index",
        "aircraft/detail",
        "management/index",
        "management/create",
        "management/approve",
        "management/repair",
        "management/close",
        "management/renew"
      ]
    }
  ]
}
```

### 阶段二：API 层整合

#### 2.1 扩展 API 服务
```typescript
// 扩展 src/api/mel.api.ts
export class MelAPIService {
  // 保留现有方法...
  
  // 新增管理相关 API
  static async createMel(data: MelCreateForm): Promise<MelCreateResponse> {
    return request({
      url: '/mel/create',
      data,
      showLoading: true
    });
  }
  
  static async updateMel(id: number, data: MelUpdateForm): Promise<MelUpdateResponse> {
    return request({
      url: '/mel/update',
      data: { id, ...data },
      showLoading: true
    });
  }
  
  static async approveMel(id: number, data: MelApproveForm): Promise<MelApproveResponse> {
    return request({
      url: '/mel/approve',
      data: { id, ...data },
      showLoading: true
    });
  }
  
  static async rejectMel(id: number, data: MelRejectForm): Promise<MelRejectResponse> {
    return request({
      url: '/mel/reject',
      data: { id, ...data },
      showLoading: true
    });
  }
  
  static async closeMel(id: number, data: MelCloseForm): Promise<MelCloseResponse> {
    return request({
      url: '/mel/close',
      data: { id, ...data },
      showLoading: true
    });
  }
  
  static async renewMel(id: number, data: MelRenewForm): Promise<MelRenewResponse> {
    return request({
      url: '/mel/renew',
      data: { id, ...data },
      showLoading: true
    });
  }
  
  // 新增批量操作 API
  static async batchApprove(ids: number[], data: MelBatchApproveForm): Promise<MelBatchApproveResponse> {
    return request({
      url: '/mel/batch/approve',
      data: { ids, ...data },
      showLoading: true
    });
  }
  
  static async batchReject(ids: number[], data: MelBatchRejectForm): Promise<MelBatchRejectResponse> {
    return request({
      url: '/mel/batch/reject',
      data: { ids, ...data },
      showLoading: true
    });
  }
  
  // 新增权限相关 API
  static async getUserPermissions(): Promise<MelPermissionsResponse> {
    return request({
      url: '/mel/permissions',
      showLoading: false
    });
  }
  
  static async getManagementStats(): Promise<MelManagementStatsResponse> {
    return request({
      url: '/mel/management/stats',
      showLoading: true
    });
  }
}
```

#### 2.2 扩展类型定义
```typescript
// 扩展 src/types/mel.ts

// 管理相关类型
export interface MelCreateForm {
  acReg: string;
  acType: string;
  ata1: string;
  ata2?: string;
  description: string;
  englishDescription?: string;
  defferType?: string;
  defferBasis?: string;
  defferReason?: string;
  defferDate?: string;
  repairDays?: number;
  repairFH?: number;
  repairFC?: number;
  repairFlightDays?: number;
  source: 'base' | 'outstation';
  flightSite?: string;
  seatNo?: string;
  hasLimit?: boolean;
  correctiveAction?: string;
}

export interface MelUpdateForm extends Partial<MelCreateForm> {
  id: number;
}

export interface MelApproveForm {
  approveComment: string;
  approveDate: string;
}

export interface MelRejectForm {
  rejectReason: string;
  rejectDate: string;
}

export interface MelCloseForm {
  closeDate: string;
  closePerson: string;
  closeDescription: string;
  closeCondition: string;
}

export interface MelRenewForm {
  renewalDate: string;
  renewalReason: string;
  renewalPeriod: {
    days?: number;
    fh?: number;
    fc?: number;
  };
}

export interface MelBatchApproveForm {
  approveComment: string;
  approveDate: string;
}

export interface MelBatchRejectForm {
  rejectReason: string;
  rejectDate: string;
}

// 响应类型
export interface MelCreateResponse {
  success: boolean;
  data: VMel;
  message: string;
}

export interface MelUpdateResponse {
  success: boolean;
  data: VMel;
  message: string;
}

export interface MelApproveResponse {
  success: boolean;
  data: VMel;
  message: string;
}

export interface MelRejectResponse {
  success: boolean;
  data: VMel;
  message: string;
}

export interface MelCloseResponse {
  success: boolean;
  data: VMel;
  message: string;
}

export interface MelRenewResponse {
  success: boolean;
  data: VMel;
  message: string;
}

export interface MelBatchApproveResponse {
  success: boolean;
  data: VMel[];
  message: string;
}

export interface MelBatchRejectResponse {
  success: boolean;
  data: VMel[];
  message: string;
}

export interface MelPermissionsResponse {
  canCreate: boolean;
  canApprove: boolean;
  canRepair: boolean;
  canClose: boolean;
  canRenew: boolean;
  canView: boolean;
  canEdit: boolean;
}

export interface MelManagementStatsResponse {
  toApprove: number;
  toRepair: number;
  toClose: number;
  overdue: number;
  total: number;
}
```

### 阶段三：状态管理整合

#### 3.1 扩展状态管理
```typescript
// 扩展 src/store/mel.store.ts
export const useMelStore = defineStore('mel', () => {
  // 保留现有状态...
  
  // 新增管理状态
  const managementStats = ref<MelManagementStatsResponse | null>(null);
  const userPermissions = ref<MelPermissionsResponse | null>(null);
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
  
  // 新增管理方法
  const createMel = async (data: MelCreateForm) => {
    loading.value.create = true;
    clearError();
    
    try {
      const response = await MelAPIService.createMel(data);
      
      if (response.success) {
        // 更新列表数据
        await fetchDefaultData();
        
        // 清空表单
        formData.value.create = null;
        
        uni.showToast({
          title: '创建成功',
          icon: 'success'
        });
        
        // 跳转到详情页
        MelRouter.toDetail(response.data.id.toString(), response.data.source);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || '创建失败');
      throw err;
    } finally {
      loading.value.create = false;
    }
  };
  
  const updateMel = async (id: number, data: MelUpdateForm) => {
    loading.value.update = true;
    clearError();
    
    try {
      const response = await MelAPIService.updateMel(id, data);
      
      if (response.success) {
        // 更新列表数据
        await fetchDefaultData();
        
        // 清空表单
        formData.value.edit = null;
        
        uni.showToast({
          title: '更新成功',
          icon: 'success'
        });
        
        // 跳转到详情页
        MelRouter.toDetail(response.data.id.toString(), response.data.source);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || '更新失败');
      throw err;
    } finally {
      loading.value.update = false;
    }
  };
  
  const approveMel = async (id: number, data: MelApproveForm) => {
    loading.value.approve = true;
    clearError();
    
    try {
      const response = await MelAPIService.approveMel(id, data);
      
      if (response.success) {
        // 更新列表数据
        await fetchDefaultData();
        
        // 清空表单
        formData.value.approve = null;
        
        uni.showToast({
          title: '审批成功',
          icon: 'success'
        });
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || '审批失败');
      throw err;
    } finally {
      loading.value.approve = false;
    }
  };
  
  const rejectMel = async (id: number, data: MelRejectForm) => {
    loading.value.reject = true;
    clearError();
    
    try {
      const response = await MelAPIService.rejectMel(id, data);
      
      if (response.success) {
        // 更新列表数据
        await fetchDefaultData();
        
        // 清空表单
        formData.value.reject = null;
        
        uni.showToast({
          title: '拒绝成功',
          icon: 'success'
        });
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || '拒绝失败');
      throw err;
    } finally {
      loading.value.reject = false;
    }
  };
  
  const closeMel = async (id: number, data: MelCloseForm) => {
    loading.value.close = true;
    clearError();
    
    try {
      const response = await MelAPIService.closeMel(id, data);
      
      if (response.success) {
        // 更新列表数据
        await fetchDefaultData();
        
        // 清空表单
        formData.value.close = null;
        
        uni.showToast({
          title: '关闭成功',
          icon: 'success'
        });
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || '关闭失败');
      throw err;
    } finally {
      loading.value.close = false;
    }
  };
  
  const renewMel = async (id: number, data: MelRenewForm) => {
    loading.value.renew = true;
    clearError();
    
    try {
      const response = await MelAPIService.renewMel(id, data);
      
      if (response.success) {
        // 更新列表数据
        await fetchDefaultData();
        
        // 清空表单
        formData.value.renew = null;
        
        uni.showToast({
          title: '续保成功',
          icon: 'success'
        });
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || '续保失败');
      throw err;
    } finally {
      loading.value.renew = false;
    }
  };
  
  const batchApprove = async (ids: number[], data: MelBatchApproveForm) => {
    loading.value.batchApprove = true;
    clearError();
    
    try {
      const response = await MelAPIService.batchApprove(ids, data);
      
      if (response.success) {
        // 更新列表数据
        await fetchDefaultData();
        
        // 清空选择
        selectedItems.value = [];
        
        uni.showToast({
          title: `批量审批成功，共处理 ${ids.length} 条记录`,
          icon: 'success'
        });
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || '批量审批失败');
      throw err;
    } finally {
      loading.value.batchApprove = false;
    }
  };
  
  const batchReject = async (ids: number[], data: MelBatchRejectForm) => {
    loading.value.batchReject = true;
    clearError();
    
    try {
      const response = await MelAPIService.batchReject(ids, data);
      
      if (response.success) {
        // 更新列表数据
        await fetchDefaultData();
        
        // 清空选择
        selectedItems.value = [];
        
        uni.showToast({
          title: `批量拒绝成功，共处理 ${ids.length} 条记录`,
          icon: 'success'
        });
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || '批量拒绝失败');
      throw err;
    } finally {
      loading.value.batchReject = false;
    }
  };
  
  const fetchUserPermissions = async () => {
    try {
      const response = await MelAPIService.getUserPermissions();
      userPermissions.value = response;
    } catch (err: any) {
      console.error('获取用户权限失败:', err);
    }
  };
  
  const fetchManagementStats = async () => {
    loading.value.stats = true;
    clearError();
    
    try {
      const response = await MelAPIService.getManagementStats();
      managementStats.value = response;
    } catch (err: any) {
      setError(err.message || '获取管理统计失败');
      throw err;
    } finally {
      loading.value.stats = false;
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
    selectedItems.value = melList.value.map(item => item.id);
  };
  
  const clearItemSelection = () => {
    selectedItems.value = [];
  };
  
  // 返回所有状态和方法
  return {
    // 现有状态和方法...
    
    // 新增状态
    managementStats: computed(() => managementStats.value),
    userPermissions: computed(() => userPermissions.value),
    selectedItems: computed(() => selectedItems.value),
    formData: computed(() => formData.value),
    
    // 新增方法
    createMel,
    updateMel,
    approveMel,
    rejectMel,
    closeMel,
    renewMel,
    batchApprove,
    batchReject,
    fetchUserPermissions,
    fetchManagementStats,
    toggleItemSelection,
    selectAllItems,
    clearItemSelection
  };
});
```

### 阶段四：页面组件迁移

#### 4.1 迁移 MEL 列表页面
```typescript
// 从 src/pages/maintenance/mel/melList.vue 迁移到 src/pages/mel/list/index.vue
// 重构为使用新的组件和状态管理

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
import { ref, computed, onMounted } from 'vue';
import { useMelStore } from '@/store/mel.store';
import { MelRouter } from '@/utils/melRouter';
import { MelEventBus, MelEvents } from '@/utils/melEventBus';

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

// 清理
onUnmounted(() => {
  MelEventBus.off(MelEvents.FILTER_CHANGED, performSearch);
  MelEventBus.off(MelEvents.SORT_CHANGED, performSearch);
});
</script>
```

#### 4.2 迁移 MEL 详情页面
```typescript
// 从 src/pages/maintenance/mel/melDetail.vue 迁移到 src/pages/mel/detail/index.vue
// 重构为使用新的组件结构

<template>
  <div class="mel-detail-page">
    <!-- 加载状态 -->
    <div v-if="melStore.loading.detail" class="loading-state">
      <MelLoading />
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="melStore.error" class="error-state">
      <MelEmpty 
        type="error"
        :message="melStore.error"
        @retry="fetchDetail"
      />
    </div>
    
    <!-- MEL详情内容 -->
    <div v-else-if="melStore.melDetail" class="mel-detail-content">
      <!-- 数据来源标识 -->
      <div class="source-indicator" :class="getSourceClass(melStore.melDetail.source)">
        <uni-icons :type="getSourceIcon(melStore.melDetail.source)" size="16" />
        <span>{{ getSourceText(melStore.melDetail.source) }}</span>
      </div>
      
      <!-- 基础信息卡片 -->
      <MelBasicInfo :data="melStore.melDetail.fullEntity" :source="melStore.melDetail.source" />
      
      <!-- 故障描述卡片 -->
      <MelDescription :data="melStore.melDetail.fullEntity" :source="melStore.melDetail.source" />
      
      <!-- 主基地特有信息 -->
      <div v-if="melStore.melDetail.source === 'base'" class="base-specific-info">
        <MelDeferralInfo :data="melStore.melDetail.fullEntity" />
        <MelRepairDeadline :data="melStore.melDetail.fullEntity" />
        <MelRepairMeasures :data="melStore.melDetail.fullEntity" />
        <MelOperationalRestrictions :data="melStore.melDetail.fullEntity" />
        <MelPersonnelInfo :data="melStore.melDetail.fullEntity" />
        <MelCloseInfo v-if="hasCloseInfo" :data="melStore.melDetail.fullEntity" />
        <MelRenewalInfo v-if="hasRenewalInfo" :data="melStore.melDetail.fullEntity" />
      </div>
      
      <!-- 外站特有信息 -->
      <div v-else-if="melStore.melDetail.source === 'outstation'" class="outstation-specific-info">
        <MelOutstationInfo :data="melStore.melDetail.fullEntity" />
        <MelOutstationPersonnel :data="melStore.melDetail.fullEntity" />
      </div>
      
      <!-- 备注信息 -->
      <MelNotes v-if="hasNotes" :data="melStore.melDetail.fullEntity" :source="melStore.melDetail.source" />
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button 
          v-if="canEdit"
          @click="editMel" 
          class="edit-btn"
        >
          编辑
        </button>
        <button @click="printMel" class="print-btn">打印</button>
        <button @click="shareMel" class="share-btn">分享</button>
        <button @click="exportMel" class="export-btn">导出</button>
      </div>
      
      <!-- 相关MEL记录 -->
      <MelRelatedRecords :current-id="melId" :source="melStore.melDetail.source" />
      
      <!-- 操作历史 -->
      <MelOperationHistory :mel-id="melId" />
    </div>
    
    <!-- 空数据状态 -->
    <div v-else class="no-data">
      <MelEmpty 
        type="no-data"
        message="暂无MEL详情数据"
        @retry="fetchDetail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMelStore } from '@/store/mel.store';
import { MelRouter } from '@/utils/melRouter';
import { MelEventBus, MelEvents } from '@/utils/melEventBus';

const melStore = useMelStore();

// 获取页面参数
const melId = ref<number>(0);
const melSource = ref<string>('');

// 计算属性
const canEdit = computed(() => {
  return melStore.userPermissions?.canEdit || false;
});

const hasCloseInfo = computed(() => {
  const entity = melStore.melDetail?.fullEntity as any;
  return entity && (entity.closeDate || entity.CLOSE_DATE);
});

const hasRenewalInfo = computed(() => {
  const entity = melStore.melDetail?.fullEntity as any;
  return entity && (entity.renewalDate || entity.RENEWAL_DATE);
});

const hasNotes = computed(() => {
  const entity = melStore.melDetail?.fullEntity as any;
  return entity && (
    entity.NOTE || entity.NOTES || entity.LS_MEMO || 
    entity.SG_MEMO || entity.TS_MEMO ||
    entity.note || entity.notes || entity.lsMemo || 
    entity.sgMemo || entity.tsMemo
  );
});

// 方法
const fetchDetail = async () => {
  if (!melId.value) {
    return;
  }
  
  try {
    await melStore.fetchDetail(melId.value, melSource.value);
  } catch (error) {
    console.error('获取MEL详情失败:', error);
  }
};

const editMel = () => {
  MelRouter.toCreate({ id: melId.value.toString() });
};

const printMel = () => {
  // 实现打印功能
  window.print();
};

const shareMel = () => {
  // 实现分享功能
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    href: `${window.location.origin}/pages/mel/detail/index?id=${melId.value}`,
    title: `MEL详情 - ${melStore.melDetail?.fullEntity?.BLBS_NO || melStore.melDetail?.fullEntity?.melNo}`,
    summary: melStore.melDetail?.fullEntity?.FAUREP || melStore.melDetail?.fullEntity?.des,
    imageUrl: '',
    success: function () {
      console.log('分享成功');
    },
    fail: function () {
      console.log('分享失败');
    }
  });
};

const exportMel = () => {
  // 实现导出功能
  const data = melStore.melDetail?.fullEntity;
  const jsonString = JSON.stringify(data, null, 2);
  
  uni.downloadFile({
    url: `data:text/json;charset=utf-8,${encodeURIComponent(jsonString)}`,
    fileName: `MEL_${melStore.melDetail?.fullEntity?.BLBS_NO || melStore.melDetail?.fullEntity?.melNo}.json`
  });
};

const getSourceClass = (source: string) => {
  return source === 'base' ? 'source-base' : 'source-outstation';
};

const getSourceIcon = (source: string) => {
  return source === 'base' ? 'home' : 'location';
};

const getSourceText = (source: string) => {
  return source === 'base' ? '主基地数据' : '外站数据';
};

// 生命周期
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  if (currentPage && 'options' in currentPage) {
    const options = (currentPage as any).options;
    melId.value = parseInt(options.id) || 0;
    melSource.value = options.source || '';
  }
  
  // 获取详情数据
  fetchDetail();
  
  // 监听事件
  MelEventBus.on(MelEvents.MEL_DATA_CHANGED, fetchDetail);
});

// 清理
onUnmounted(() => {
  MelEventBus.off(MelEvents.MEL_DATA_CHANGED, fetchDetail);
});
</script>
```

### 阶段五：组件创建

#### 5.1 创建通用组件
```typescript
// 创建 src/components/mel/common/MelStatusBadge.vue
// 创建 src/components/mel/common/MelATATag.vue
// 创建 src/components/mel/common/MelDatePicker.vue
// 创建 src/components/mel/common/MelSearchBar.vue
// 创建 src/components/mel/common/MelFilter.vue
// 创建 src/components/mel/common/MelPagination.vue
// 创建 src/components/mel/common/MelLoading.vue
// 创建 src/components/mel/common/MelEmpty.vue
```

#### 5.2 创建业务组件
```typescript
// 创建 src/components/mel/list/MelItem.vue
// 创建 src/components/mel/list/MelList.vue
// 创建 src/components/mel/list/MelCard.vue
// 创建 src/components/mel/list/MelSortSelector.vue
// 创建 src/components/mel/list/MelViewToggle.vue

// 创建 src/components/mel/detail/MelBasicInfo.vue
// 创建 src/components/mel/detail/MelDescription.vue
// 创建 src/components/mel/detail/MelDeferralInfo.vue
// 创建 src/components/mel/detail/MelRepairDeadline.vue
// 创建 src/components/mel/detail/MelRepairMeasures.vue
// 创建 src/components/mel/detail/MelOperationalRestrictions.vue
// 创建 src/components/mel/detail/MelPersonnelInfo.vue
// 创建 src/components/mel/detail/MelCloseInfo.vue
// 创建 src/components/mel/detail/MelRenewalInfo.vue
// 创建 src/components/mel/detail/MelOutstationInfo.vue
// 创建 src/components/mel/detail/MelOutstationPersonnel.vue
// 创建 src/components/mel/detail/MelNotes.vue
// 创建 src/components/mel/detail/MelRelatedRecords.vue
// 创建 src/components/mel/detail/MelOperationHistory.vue

// 创建 src/components/mel/stats/StatsCard.vue
// 创建 src/components/mel/stats/ChartContainer.vue
// 创建 src/components/mel/stats/MelDateRangePicker.vue
// 创建 src/components/mel/stats/MelYearMonthPicker.vue
// 创建 src/components/mel/stats/MelMonthPicker.vue
// 创建 src/components/mel/stats/MelTrendChart.vue

// 创建 src/components/mel/management/MelFormValidator.vue
// 创建 src/components/mel/management/MelProgressTracker.vue
// 创建 src/components/mel/management/MelApprovalWorkflow.vue
// 创建 src/components/mel/management/MelCreateForm.vue
// 创建 src/components/mel/management/MelApproveForm.vue
// 创建 src/components/mel/management/MelRepairForm.vue
// 创建 src/components/mel/management/MelCloseForm.vue
// 创建 src/components/mel/management/MelRenewForm.vue

// 创建 src/components/mel/aircraft/MelAircraftSelector.vue
// 创建 src/components/mel/aircraft/MelAircraftInfo.vue
// 创建 src/components/mel/aircraft/MelAircraftStats.vue
```

### 阶段六：工具类创建

#### 6.1 创建路由工具
```typescript
// 创建 src/utils/melRouter.ts
// 创建 src/utils/melRouteGuard.ts
// 创建 src/utils/melRouteParams.ts
// 创建 src/utils/melRouteState.ts
```

#### 6.2 创建事件工具
```typescript
// 创建 src/utils/melEventBus.ts
// 创建 src/utils/melEventConstants.ts
```

#### 6.3 创建权限工具
```typescript
// 创建 src/utils/melPermissionManager.ts
// 创建 src/utils/melPermissionConstants.ts
```

### 阶段七：测试和验证

#### 7.1 单元测试
```typescript
// 为所有新创建的组件编写单元测试
// 为 API 服务编写测试
// 为状态管理编写测试
// 为工具类编写测试
```

#### 7.2 集成测试
```typescript
// 为页面编写集成测试
// 为路由编写测试
// 为权限控制编写测试
```

#### 7.3 端到端测试
```typescript
// 编写用户操作流程测试
// 编写数据流测试
// 编写错误处理测试
```

### 阶段八：部署和上线

#### 8.1 数据迁移
```typescript
// 确保现有数据的兼容性
// 处理数据格式转换
// 验证数据完整性
```

#### 8.2 向后兼容
```typescript
// 保持旧路由的兼容性
// 提供数据迁移工具
// 设置过渡期支持
```

#### 8.3 监控和日志
```typescript
// 添加性能监控
// 添加错误监控
// 添加用户行为分析
```

## 风险评估和缓解

### 1. 技术风险

#### 1.1 数据兼容性风险
- **风险**：新模块可能与现有数据格式不兼容
- **缓解措施**：充分测试，提供数据转换工具

#### 1.2 性能风险
- **风险**：新模块可能影响应用性能
- **缓解措施**：性能优化，懒加载，虚拟滚动

#### 1.3 用户体验风险
- **风险**：用户可能不适应新的界面
- **缓解措施**：保持界面一致性，提供用户指南

### 2. 业务风险

#### 2.1 功能缺失风险
- **风险**：迁移过程中可能遗漏某些功能
- **缓解措施**：详细的功能对比清单，充分测试

#### 2.2 数据丢失风险
- **风险**：数据迁移过程中可能丢失数据
- **缓解措施**：完整备份，分步迁移，验证数据

### 3. 时间风险

#### 3.1 开发时间风险
- **风险**：开发时间可能超出预期
- **缓解措施**：分阶段开发，优先核心功能

#### 3.2 上线时间风险
- **风险**：上线时间可能影响业务
- **缓解措施**：选择合适的时间窗口，准备回滚方案

## 成功标准

### 1. 功能完整性
- [ ] 所有现有功能正常工作
- [ ] 新增功能按设计实现
- [ ] 数据流转正确
- [ ] 权限控制有效

### 2. 性能指标
- [ ] 页面加载时间 < 2秒
- [ ] 列表滚动流畅
- [ ] 内存使用合理
- [ ] 网络请求优化

### 3. 用户体验
- [ ] 界面美观易用
- [ ] 操作流程顺畅
- [ ] 错误提示友好
- [ ] 响应式设计良好

### 4. 代码质量
- [ ] 代码结构清晰
- [ ] 组件复用率高
- [ ] 测试覆盖率 > 80%
- [ ] 文档完整

## 总结

MEL 模块整合计划提供了详细的迁移路径，确保现有功能平稳过渡到新架构：

1. **分阶段实施**：降低风险，确保稳定性
2. **充分测试**：保证功能完整性和性能
3. **向后兼容**：确保平滑过渡
4. **风险控制**：识别和缓解潜在问题

通过这个整合计划，可以成功将现有的 MEL 功能迁移到新的模块架构中，提供更好的用户体验和代码维护性。