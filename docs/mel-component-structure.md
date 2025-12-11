# MEL 模块组件结构

## 概述

基于 MEL 模块架构，设计完整的组件结构，包括通用组件、业务组件和页面组件，确保代码复用和维护性。

## 组件层次结构

### 1. 目录结构

```
src/components/mel/
├── common/                      # 通用组件
│   ├── MelStatusBadge.vue      # 状态标签组件
│   ├── MelATATag.vue           # ATA 章节标签组件
│   ├── MelDatePicker.vue       # 日期选择器组件
│   ├── MelATASelector.vue      # ATA 章节选择器
│   ├── MelSearchBar.vue       # 搜索栏组件
│   ├── MelFilter.vue          # 筛选器组件
│   ├── MelPagination.vue      # 分页组件
│   ├── MelLoading.vue         # 加载组件
│   └── MelEmpty.vue           # 空状态组件
├── list/                        # 列表相关组件
│   ├── MelItem.vue           # MEL 列表项组件
│   ├── MelList.vue           # MEL 列表组件
│   ├── MelCard.vue           # MEL 卡片组件
│   ├── MelSortSelector.vue   # 排序选择器组件
│   └── MelViewToggle.vue     # 视图切换组件
├── detail/                      # 详情相关组件
│   ├── MelBasicInfo.vue      # 基础信息组件
│   ├── MelDescription.vue    # 故障描述组件
│   ├── MelDeferralInfo.vue   # 保留信息组件
│   ├── MelRepairDeadline.vue # 修复期限组件
│   ├── MelRepairMeasures.vue # 维修措施组件
│   ├── MelOperationalRestrictions.vue # 运行限制组件
│   ├── MelPersonnelInfo.vue  # 人员信息组件
│   ├── MelCloseInfo.vue      # 关闭信息组件
│   ├── MelRenewalInfo.vue   # 续保信息组件
│   ├── MelOutstationInfo.vue # 外站信息组件
│   ├── MelNotes.vue          # 备注信息组件
│   ├── MelRelatedRecords.vue # 相关记录组件
│   └── MelOperationHistory.vue # 操作历史组件
├── stats/                       # 统计相关组件
│   ├── StatsCard.vue         # 统计卡片组件
│   ├── ChartContainer.vue    # 图表容器组件
│   ├── MelDateRangePicker.vue # 日期范围选择器
│   ├── MelYearMonthPicker.vue # 年月选择器
│   ├── MelMonthPicker.vue    # 月份选择器
│   └── MelTrendChart.vue    # 趋势图表组件
├── management/                 # 管理相关组件
│   ├── MelFormValidator.vue # 表单验证组件
│   ├── MelProgressTracker.vue # 进度跟踪组件
│   ├── MelApprovalWorkflow.vue # 审批工作流组件
│   ├── MelCreateForm.vue    # 创建表单组件
│   ├── MelApproveForm.vue   # 审批表单组件
│   ├── MelRepairForm.vue    # 维修表单组件
│   ├── MelCloseForm.vue     # 关闭表单组件
│   └── MelRenewForm.vue     # 续保表单组件
└── aircraft/                   # 飞机相关组件
    ├── MelAircraftSelector.vue # 飞机选择器组件
    ├── MelAircraftInfo.vue   # 飞机信息组件
    └── MelAircraftStats.vue # 飞机统计组件
```

## 通用组件设计

### 1. MelStatusBadge 组件

#### 1.1 功能
- 显示 MEL 状态标签
- 支持不同状态的样式
- 支持自定义颜色和图标

#### 1.2 组件代码
```vue
<template>
  <span class="mel-status-badge" :class="statusClass">
    <uni-icons v-if="showIcon" :type="statusIcon" size="12" />
    <span class="status-text">{{ displayText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  status: string;              // 状态值
  showIcon?: boolean;          // 是否显示图标
  customText?: string;         // 自定义文本
  size?: 'small' | 'medium' | 'large'; // 尺寸
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
  size: 'medium'
});

// 状态配置
const statusConfig = {
  '已批准': {
    class: 'status-approved',
    icon: 'checkmarkempty',
    color: '#27ae60'
  },
  '待批准': {
    class: 'status-pending',
    icon: 'clock',
    color: '#f39c12'
  },
  '已拒绝': {
    class: 'status-rejected',
    icon: 'closeempty',
    color: '#e74c3c'
  },
  '进行中': {
    class: 'status-progress',
    icon: 'loop',
    color: '#3498db'
  },
  '已关闭': {
    class: 'status-closed',
    icon: 'flag',
    color: '#95a5a6'
  }
};

// 计算属性
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
  
  .status-text {
    line-height: 1;
  }
}
</style>
```

### 2. MelATATag 组件

#### 2.1 功能
- 显示 ATA 章节标签
- 支持点击事件
- 支持自定义样式

#### 2.2 组件代码
```vue
<template>
  <span 
    class="mel-ata-tag" 
    :class="tagClass"
    @click="handleClick"
  >
    <span class="ata-text">{{ displayText }}</span>
    <uni-icons v-if="showArrow" type="arrowright" size="10" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  ata: string;                 // ATA 章节
  showArrow?: boolean;          // 是否显示箭头
  clickable?: boolean;          // 是否可点击
  size?: 'small' | 'medium' | 'large'; // 尺寸
  type?: 'default' | 'primary' | 'secondary'; // 类型
}

interface Emits {
  (e: 'click', ata: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  showArrow: false,
  clickable: false,
  size: 'medium',
  type: 'default'
});

const emit = defineEmits<Emits>();

// 计算属性
const tagClass = computed(() => [
  'ata-tag',
  `size-${props.size}`,
  `type-${props.type}`,
  { clickable: props.clickable }
]);

const displayText = computed(() => {
  // 格式化 ATA 章节显示
  if (!props.ata) return '';
  
  // 如果已经是完整格式（如 27-00），直接返回
  if (props.ata.includes('-')) {
    return props.ata;
  }
  
  // 如果只有主章节，添加默认子章节
  return `${props.ata}-00`;
});

// 事件处理
const handleClick = () => {
  if (props.clickable) {
    emit('click', props.ata);
  }
};
</script>

<style lang="less" scoped>
.mel-ata-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Courier New', monospace;
  white-space: nowrap;
  
  &.type-default {
    background: #e8f4f8;
    color: #3498db;
    border: 1px solid #bee5eb;
  }
  
  &.type-primary {
    background: #137fec;
    color: white;
    border: 1px solid #0e6bb8;
  }
  
  &.type-secondary {
    background: #f8f9fa;
    color: #6c757d;
    border: 1px solid #dee2e6;
  }
  
  &.size-small {
    padding: 1px 6px;
    font-size: 10px;
  }
  
  &.size-large {
    padding: 4px 12px;
    font-size: 14px;
  }
  
  &.clickable {
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      opacity: 0.8;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  .ata-text {
    line-height: 1;
  }
}
</style>
```

### 3. MelDatePicker 组件

#### 3.1 功能
- 提供日期选择功能
- 支持快速选择常用日期范围
- 支持自定义日期格式

#### 3.2 组件代码
```vue
<template>
  <div class="mel-date-picker">
    <div class="picker-input" @click="showPicker">
      <span v-if="selectedDate" class="date-text">{{ displayText }}</span>
      <span v-else class="placeholder">{{ placeholder }}</span>
      <uni-icons type="calendar" size="16" />
    </div>
    
    <uni-popup ref="popupRef" type="bottom">
      <div class="picker-content">
        <!-- 快速选择 -->
        <div class="quick-select">
          <div 
            v-for="option in quickOptions"
            :key="option.key"
            class="quick-option"
            :class="{ active: isSelectedQuickOption(option) }"
            @click="selectQuickOption(option)"
          >
            {{ option.label }}
          </div>
        </div>
        
        <!-- 日期选择器 -->
        <div class="date-selector">
          <uni-datetime-picker 
            v-model="tempDate"
            type="date"
            @change="handleDateChange"
          />
        </div>
        
        <!-- 操作按钮 -->
        <div class="picker-actions">
          <button @click="cancelPicker">取消</button>
          <button type="primary" @click="confirmPicker">确定</button>
        </div>
      </div>
    </uni-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import dayjs from 'dayjs';

interface Props {
  modelValue?: string;         // 日期值
  placeholder?: string;        // 占位符
  format?: string;            // 日期格式
  disabled?: boolean;          // 是否禁用
  quickOptions?: Array<{      // 快速选项
    key: string;
    label: string;
    value: string;
  }>;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择日期',
  format: 'YYYY-MM-DD',
  disabled: false
});

const emit = defineEmits<Emits>();

// 响应式数据
const popupRef = ref();
const tempDate = ref('');
const selectedDate = ref(props.modelValue || '');

// 默认快速选项
const defaultQuickOptions = [
  { key: 'today', label: '今天', value: dayjs().format(props.format) },
  { key: 'yesterday', label: '昨天', value: dayjs().subtract(1, 'day').format(props.format) },
  { key: 'week', label: '本周', value: dayjs().startOf('week').format(props.format) },
  { key: 'month', label: '本月', value: dayjs().startOf('month').format(props.format) },
  { key: 'quarter', label: '本季度', value: dayjs().startOf('quarter').format(props.format) },
  { key: 'year', label: '今年', value: dayjs().startOf('year').format(props.format) }
];

const quickOptions = computed(() => 
  props.quickOptions || defaultQuickOptions
);

// 计算属性
const displayText = computed(() => {
  if (!selectedDate.value) return '';
  
  const date = dayjs(selectedDate.value);
  if (!date.isValid()) return selectedDate.value;
  
  return date.format(props.format);
});

// 方法
const showPicker = () => {
  if (props.disabled) return;
  
  tempDate.value = selectedDate.value;
  popupRef.value.open();
};

const hidePicker = () => {
  popupRef.value.close();
};

const selectQuickOption = (option: any) => {
  tempDate.value = option.value;
};

const isSelectedQuickOption = (option: any) => {
  return tempDate.value === option.value;
};

const handleDateChange = (value: string) => {
  tempDate.value = value;
};

const confirmPicker = () => {
  selectedDate.value = tempDate.value;
  emit('update:modelValue', tempDate.value);
  emit('change', tempDate.value);
  hidePicker();
};

const cancelPicker = () => {
  tempDate.value = selectedDate.value;
  hidePicker();
};

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  selectedDate.value = newValue || '';
});
</script>

<style lang="less" scoped>
.mel-date-picker {
  .picker-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    
    &:hover {
      border-color: #137fec;
    }
    
    .date-text {
      color: #333;
      font-size: 14px;
    }
    
    .placeholder {
      color: #999;
      font-size: 14px;
    }
  }
  
  .picker-content {
    padding: 16px;
    background: white;
    border-radius: 8px 8px 0 0;
    
    .quick-select {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
      
      .quick-option {
        padding: 6px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        
        &:hover {
          border-color: #137fec;
          color: #137fec;
        }
        
        &.active {
          background: #137fec;
          color: white;
          border-color: #137fec;
        }
      }
    }
    
    .date-selector {
      margin-bottom: 16px;
    }
    
    .picker-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      
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
  }
}
</style>
```

## 业务组件设计

### 1. MelItem 组件

#### 1.1 功能
- 展示单个 MEL 记录
- 支持列表和卡片两种视图
- 支持点击跳转详情

#### 1.2 组件代码
```vue
<template>
  <div 
    class="mel-item"
    :class="[`view-${viewMode}`, { selected: isSelected }]"
    @click="handleClick"
  >
    <!-- 列表视图 -->
    <div v-if="viewMode === 'list'" class="list-view">
      <div class="item-header">
        <span class="mel-no">{{ data.melNo }}</span>
        <MelStatusBadge :status="data.status" size="small" />
      </div>
      <div class="item-content">
        <div class="aircraft-info">{{ data.acReg }} ({{ data.acType }})</div>
        <div class="description">{{ data.des }}</div>
      </div>
      <div class="item-footer">
        <MelATATag :ata="`${data.ata1}-${data.ata2}`" size="small" />
        <span class="date-info">{{ formatDate(data.applyDate) }}</span>
      </div>
    </div>
    
    <!-- 卡片视图 -->
    <div v-else class="card-view">
      <div class="card-header">
        <span class="mel-no">{{ data.melNo }}</span>
        <MelStatusBadge :status="data.status" size="small" />
      </div>
      <div class="card-content">
        <div class="description">{{ data.des }}</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">飞机:</span>
            <span class="value">{{ data.acReg }}</span>
          </div>
          <div class="info-item">
            <span class="label">ATA:</span>
            <MelATATag :ata="`${data.ata1}-${data.ata2}`" size="small" />
          </div>
          <div class="info-item">
            <span class="label">日期:</span>
            <span class="value">{{ formatDate(data.applyDate) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { VMel } from '@/types/mel';
import dayjs from 'dayjs';

interface Props {
  data: VMel;                 // MEL 数据
  viewMode?: 'list' | 'card'; // 视图模式
  isSelected?: boolean;        // 是否选中
}

interface Emits {
  (e: 'click', data: VMel): void;
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'list',
  isSelected: false
});

const emit = defineEmits<Emits>();

// 方法
const handleClick = () => {
  emit('click', props.data);
};

const formatDate = (date?: string) => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};
</script>

<style lang="less" scoped>
.mel-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 8px;
  background: white;
  transition: all 0.2s;
  
  &:hover {
    border-color: #137fec;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.selected {
    border-color: #137fec;
    background: #f8f9ff;
  }
  
  &.view-list {
    padding: 12px 16px;
    
    .list-view {
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .mel-no {
          font-weight: bold;
          color: #333;
          font-size: 14px;
        }
      }
      
      .item-content {
        margin-bottom: 8px;
        
        .aircraft-info {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }
        
        .description {
          font-size: 13px;
          color: #333;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      
      .item-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .date-info {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  
  &.view-card {
    padding: 16px;
    
    .card-view {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .mel-no {
          font-weight: bold;
          color: #333;
          font-size: 16px;
        }
      }
      
      .card-content {
        .description {
          font-size: 14px;
          color: #333;
          line-height: 1.4;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          
          .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            
            .label {
              font-size: 12px;
              color: #666;
            }
            
            .value {
              font-size: 13px;
              color: #333;
            }
          }
        }
      }
    }
  }
}
</style>
```

### 2. MelBasicInfo 组件

#### 2.1 功能
- 展示 MEL 基础信息
- 支持主基地和外站数据适配
- 提供字段值获取方法

#### 2.2 组件代码
```vue
<template>
  <div class="mel-basic-info">
    <h3 class="card-title">基础信息</h3>
    <div class="info-grid">
      <div 
        v-for="field in visibleFields"
        :key="field.key"
        class="info-item"
        :class="{ 'full-width': field.fullWidth }"
      >
        <span class="label">{{ field.label }}</span>
        <span class="value">{{ getFieldValue(field.upperField, field.lowerField) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MelFullEntity } from '@/types/mel';

interface Props {
  data: MelFullEntity;         // MEL 数据
  source: string;              // 数据来源
  fields?: Array<{             // 自定义字段配置
    key: string;
    label: string;
    upperField: string;
    lowerField?: string;
    fullWidth?: boolean;
    visible?: boolean;
  }>;
}

const props = withDefaults(defineProps<Props>(), {
  source: 'base'
});

// 默认字段配置
const defaultFields = [
  { key: 'ddfNo', label: 'DD单编号', upperField: 'DDF_NO', lowerField: 'ddfNo' },
  { key: 'melNo', label: 'MEL编号', upperField: 'BLBS_NO', lowerField: 'melNo' },
  { key: 'acReg', label: '飞机注册号', upperField: 'ACNO', lowerField: 'acReg' },
  { key: 'acType', label: '机型', upperField: 'ACTYPE', lowerField: 'actype' },
  { key: 'ata', label: 'ATA章节', upperField: 'ATA1', lowerField: 'ata1' },
  { key: 'status', label: '状态', upperField: 'STATUS', lowerField: 'status' }
];

// 计算属性
const visibleFields = computed(() => {
  const fields = props.fields || defaultFields;
  return fields.filter(field => field.visible !== false);
});

// 方法
const getFieldValue = (upperField: string, lowerField?: string) => {
  const entity = props.data as any;
  
  // 优先返回大写字段名
  if (entity[upperField] !== undefined && entity[upperField] !== null) {
    return entity[upperField];
  }
  
  // 回退到小写字段名
  if (lowerField && entity[lowerField] !== undefined && entity[lowerField] !== null) {
    return entity[lowerField];
  }
  
  return '';
};

// ATA 章节特殊处理
const getATAValue = () => {
  const ata1 = getFieldValue('ATA1', 'ata1');
  const ata2 = getFieldValue('ATA2', 'ata2');
  
  if (ata1 && ata2) {
    return `${ata1}-${ata2}`;
  }
  
  return ata1 || '';
};
</script>

<style lang="less" scoped>
.mel-basic-info {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .card-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      &.full-width {
        grid-column: 1 / -1;
      }
      
      .label {
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }
      
      .value {
        font-size: 14px;
        color: #333;
        word-break: break-all;
      }
    }
  }
}

@media (max-width: 480px) {
  .mel-basic-info {
    .info-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
```

## 组件通信

### 1. 事件总线

```typescript
// MEL 事件总线
class MelEventBus {
  private static instance: MelEventBus;
  private events: Map<string, Function[]> = new Map();
  
  static getInstance(): MelEventBus {
    if (!MelEventBus.instance) {
      MelEventBus.instance = new MelEventBus();
    }
    return MelEventBus.instance;
  }
  
  // 注册事件监听器
  on(event: string, callback: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }
  
  // 移除事件监听器
  off(event: string, callback?: Function): void {
    if (!this.events.has(event)) {
      return;
    }
    
    if (callback) {
      const callbacks = this.events.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.events.delete(event);
    }
  }
  
  // 触发事件
  emit(event: string, ...args: any[]): void {
    if (!this.events.has(event)) {
      return;
    }
    
    this.events.get(event)!.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }
  
  // 清除所有事件监听器
  clear(): void {
    this.events.clear();
  }
}

// 导出事件常量
export const MelEvents = {
  // MEL 数据相关事件
  MEL_DATA_CHANGED: 'mel:data:changed',
  MEL_DATA_LOADED: 'mel:data:loaded',
  MEL_DATA_ERROR: 'mel:data:error',
  
  // 筛选相关事件
  FILTER_CHANGED: 'mel:filter:changed',
  FILTER_RESET: 'mel:filter:reset',
  
  // 视图相关事件
  VIEW_MODE_CHANGED: 'mel:view:changed',
  SORT_CHANGED: 'mel:sort:changed',
  
  // 管理相关事件
  MEL_CREATED: 'mel:created',
  MEL_UPDATED: 'mel:updated',
  MEL_DELETED: 'mel:deleted',
  MEL_APPROVED: 'mel:approved',
  MEL_REJECTED: 'mel:rejected',
  
  // 导航相关事件
  NAVIGATE_TO_DETAIL: 'mel:navigate:detail',
  NAVIGATE_TO_EDIT: 'mel:navigate:edit',
  NAVIGATE_BACK: 'mel:navigate:back'
};
```

### 2. 状态共享

```typescript
// MEL 组件状态共享
class MelComponentState {
  private static state: Map<string, any> = new Map();
  
  // 设置状态
  static setState(key: string, value: any): void {
    this.state.set(key, value);
    this.notifyStateChange(key, value);
  }
  
  // 获取状态
  static getState(key: string): any {
    return this.state.get(key);
  }
  
  // 获取所有状态
  static getAllState(): Map<string, any> {
    return new Map(this.state);
  }
  
  // 删除状态
  static removeState(key: string): void {
    this.state.delete(key);
    this.notifyStateChange(key, undefined);
  }
  
  // 清除所有状态
  static clearState(): void {
    this.state.clear();
    this.notifyStateChange('*', undefined);
  }
  
  // 通知状态变化
  private static notifyStateChange(key: string, value: any): void {
    const eventBus = MelEventBus.getInstance();
    eventBus.emit('component:state:changed', { key, value });
  }
  
  // 监听状态变化
  static onStateChange(callback: (key: string, value: any) => void): void {
    const eventBus = MelEventBus.getInstance();
    eventBus.on('component:state:changed', callback);
  }
  
  // 移除状态变化监听
  static offStateChange(callback: (key: string, value: any) => void): void {
    const eventBus = MelEventBus.getInstance();
    eventBus.off('component:state:changed', callback);
  }
}
```

## 组件优化

### 1. 性能优化

```typescript
// 组件性能优化工具
class MelComponentOptimizer {
  // 虚拟滚动配置
  static virtualScrollConfig = {
    itemHeight: 80,          // 每项高度
    bufferSize: 5,           // 缓冲区大小
    threshold: 100           // 启用虚拟滚动的阈值
  };
  
  // 防抖配置
  static debounceConfig = {
    search: 300,            // 搜索防抖延迟
    filter: 200,            // 筛选防抖延迟
    resize: 100             // 窗口大小变化防抖延迟
  };
  
  // 节流配置
  static throttleConfig = {
    scroll: 16,             // 滚动节流间隔
    resize: 100,            // 窗口大小变化节流间隔
    click: 100              // 点击节流间隔
  };
  
  // 懒加载配置
  static lazyLoadConfig = {
    threshold: 100,          // 触发懒加载的阈值
    rootMargin: '50px',      // 根边距
    loading: 'lazy'          // 加载策略
  };
  
  // 创建防抖函数
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }
  
  // 创建节流函数
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCallTime = 0;
    
    return (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallTime >= delay) {
        lastCallTime = now;
        func(...args);
      }
    };
  }
  
  // 创建懒加载观察器
  static createLazyLoadObserver(
    callback: (entries: IntersectionObserverEntry[]) => void
  ): IntersectionObserver {
    return new IntersectionObserver(callback, {
      threshold: 0,
      rootMargin: this.lazyLoadConfig.rootMargin
    });
  }
}
```

### 2. 内存优化

```typescript
// 组件内存优化工具
class MelMemoryOptimizer {
  // 组件缓存
  private static componentCache = new Map<string, any>();
  
  // 缓存组件实例
  static cacheComponent(key: string, component: any): void {
    // 限制缓存大小
    if (this.componentCache.size >= 50) {
      const firstKey = this.componentCache.keys().next().value;
      this.componentCache.delete(firstKey);
    }
    
    this.componentCache.set(key, component);
  }
  
  // 获取缓存的组件实例
  static getCachedComponent(key: string): any {
    return this.componentCache.get(key);
  }
  
  // 清理组件缓存
  static clearComponentCache(): void {
    this.componentCache.clear();
  }
  
  // 图片懒加载
  static lazyLoadImage(src: string, callback: (image: HTMLImageElement) => void): void {
    const img = new Image();
    
    img.onload = () => {
      callback(img);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
    };
    
    img.src = src;
  }
  
  // 批量处理
  static batchProcess<T, R>(
    items: T[],
    processor: (item: T) => R,
    batchSize: number = 10,
    delay: number = 0
  ): Promise<R[]> {
    return new Promise((resolve) => {
      const results: R[] = [];
      let index = 0;
      
      const processBatch = () => {
        const batch = items.slice(index, index + batchSize);
        
        if (batch.length === 0) {
          resolve(results);
          return;
        }
        
        const batchResults = batch.map(processor);
        results.push(...batchResults);
        
        index += batchSize;
        
        if (delay > 0) {
          setTimeout(processBatch, delay);
        } else {
          processBatch();
        }
      };
      
      processBatch();
    });
  }
}
```

## 测试策略

### 1. 组件单元测试

```typescript
// 组件测试示例
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
});
```

### 2. 组件集成测试

```typescript
// 组件集成测试示例
describe('MelItem', () => {
  it('should display MEL data correctly', () => {
    const mockData = generateMockMelData();
    const wrapper = mount(MelItem, {
      props: {
        data: mockData,
        viewMode: 'list'
      }
    });
    
    expect(wrapper.find('.mel-no').text()).toBe(mockData.melNo);
    expect(wrapper.find('.aircraft-info').text()).toContain(mockData.acReg);
  });
  
  it('should emit click event when clicked', async () => {
    const mockData = generateMockMelData();
    const wrapper = mount(MelItem, {
      props: {
        data: mockData
      }
    });
    
    await wrapper.trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')[0]).toEqual([mockData]);
  });
});
```

## 总结

MEL 模块组件结构设计提供了完整的组件体系，包括：

1. **通用组件**：可复用的基础组件
2. **业务组件**：特定功能的业务组件
3. **组件通信**：事件总线和状态共享
4. **性能优化**：虚拟滚动、防抖节流等优化策略
5. **测试策略**：单元测试和集成测试

这些组件设计确保了代码的复用性、维护性和性能，为 MEL 模块提供了坚实的组件基础。