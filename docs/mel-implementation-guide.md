# MEL功能实现指南

## 概述

基于后端接口文档 `other/mel.md` 实现的前端MEL功能，提供完整的API层、状态管理和组件重构，支持链式调用查询。

## 项目结构

```
src/
├── types/
│   └── mel.ts              # MEL类型定义
├── api/
│   └── mel.api.ts          # MEL API服务层
├── store/
│   └── mel.store.ts        # MEL状态管理
└── pages/maintenance/mel/
    ├── MelRetentionCard.vue      # 重构后的MEL组件
    └── examples/
        └── MelQueryExamples.vue  # 链式调用示例
```

## 核心特性

### 1. 完整的API层

#### 支持10个后端接口
- `POST /mel/list` - 通用查询接口
- `POST /mel/stats` - 获取统计信息  
- `POST /mel/detail` - 获取单个记录详情
- `POST /mel/by/aircraft` - 根据飞机号查询
- `POST /mel/by/user` - 根据用户查询
- `POST /mel/by/date-range` - 根据日期范围查询
- `POST /mel/by/ata` - 根据ATA章节查询
- `POST /mel/stats/status` - 状态分布统计
- `POST /mel/stats/ata` - ATA章节分布统计
- `POST /mel/stats/monthly` - 月度统计

#### 链式调用查询构建器
```typescript
// 基础链式调用
const result = await createMelQuery()
  .withAircraft('B-1234')
  .withDateRange('2025-01-01', '2025-01-31')
  .withStatus('已批准')
  .withPage(1)
  .withSize(20)
  .list();

// 专用查询
const aircraftResult = await createMelQuery()
  .withAircraft('B-1234')
  .byAircraft();

const statsResult = await createMelQuery()
  .withAircraft('B-1234')
  .statusStats();
```

### 2. 状态管理 (Pinia Store)

#### 核心状态
```typescript
// 数据状态
melList: VMel[]           // MEL数据列表
melDetail: VMel | null    // MEL详情
statsData: MelStatsResponse | null  // 统计数据

// 查询状态
loading: {               // 各种加载状态
  list: boolean
  detail: boolean
  stats: boolean
  aircraft: boolean
  user: boolean
  dateRange: boolean
  ata: boolean
}

// 分页信息
pagination: {
  currentPage: number
  pageSize: number
  total: number
  totalPages: number
}

// 错误状态
error: string | null
```

#### Store方法
```typescript
// 基础查询
await melStore.queryByAircraft('B-1234');
await melStore.queryByDateRange('2025-01-01', '2025-01-31');
await melStore.fetchDefaultData(); // 最近一个月数据

// 统计查询
await melStore.fetchStatusStats();
await melStore.fetchATAStats();
await melStore.fetchMonthlyStats();

// 复合查询（并行获取数据和统计）
await melStore.fetchWithStats(
  createMelQuery()
    .withAircraft('B-1234')
    .withDateRange('2025-01-01', '2025-01-31')
);
```

### 3. 重构后的组件

#### MelRetentionCard.vue
- 支持多种查询方式（飞机、日期、用户、ATA等）
- 完整的加载状态和错误处理
- 分页支持和数据刷新
- 响应式设计和触摸友好

#### 组件使用
```vue
<!-- 基础使用 -->
<MelRetentionCard />

<!-- 传参使用 -->
<MelRetentionCard 
  :acReg="'B-1234'"
  :startDate="'2025-01-01'"
  :endDate="'2025-01-31'"
  :showStats="true"
  ref="melCardRef"
/>

<script setup>
const melCardRef = ref();

// 调用组件方法
melCardRef.value?.refresh();
melCardRef.value?.fetchAdvancedQuery();
</script>
```

## 性能优化

### 1. 查询优化

#### 避免重复查询
```typescript
// 检查是否已有数据或正在加载
if (!melStore.hasData || melStore.isLoadingAny) {
  return; // 避免重复请求
}
```

#### 使用分页
```typescript
// 设置合适的分页大小
await createMelQuery()
  .withAircraft('B-1234')
  .withPage(1)
  .withSize(50) // 根据需要调整
  .list();
```

#### 并行查询
```typescript
// 同时查询多个统计数据
const [statusStats, ataStats, monthlyStats] = await Promise.all([
  createMelQuery().withAircraft('B-1234').statusStats(),
  createMelQuery().withAircraft('B-1234').ataStats(),
  createMelQuery().withAircraft('B-1234').monthlyStats()
]);
```

### 2. 组件优化

#### 响应式数据缓存
```typescript
// 使用computed缓存计算结果
const convertedMelList = computed(() => {
  return melStore.melList.map(mel => ({
    id: mel.id,
    acReg: mel.acReg,
    melCode: mel.melNo,
    // ... 其他字段映射
  }));
});
```

#### 防抖查询
```typescript
// 避免频繁的查询请求
const debouncedFetch = useDebounceFn(() => {
  fetchDefaultData();
}, 300);
```

### 3. 内存优化

#### 及时清理
```typescript
// 在组件卸载时清理数据
onUnmounted(() => {
  melStore.clearData();
  melStore.clearError();
});
```

## 错误处理

### 1. API错误处理
```typescript
try {
  const result = await createMelQuery()
    .withAircraft('B-1234')
    .list();
} catch (error: any) {
  if (error.message.includes('必填项')) {
    // 参数错误
    console.log('请检查必填参数');
  } else if (error.message.includes('网络')) {
    // 网络错误
    console.log('网络连接失败，请重试');
  }
}
```

### 2. Store错误处理
```typescript
// 监听Store错误
watch(() => melStore.error, (newError) => {
  if (newError) {
    uni.showToast({
      title: newError,
      icon: 'none'
    });
  }
});
```

## 使用示例

### 1. 基础查询
```typescript
import { useMelStore } from '@/store/mel.store';
import { createMelQuery } from '@/api/mel.api';

const melStore = useMelStore();

// 方法1：使用Store
await melStore.queryByAircraft('B-1234');

// 方法2：使用链式调用
const result = await createMelQuery()
  .withAircraft('B-1234')
  .withStatus('已批准')
  .list();
```

### 2. 复杂查询
```typescript
// 组合多个条件
const result = await createMelQuery()
  .withAircraft('B-1234')
  .withDateRange('2025-01-01', '2025-01-31')
  .withATA('27', '00')
  .withDeferralType('A')
  .withStatus('已批准')
  .list();
```

### 3. 统计查询
```typescript
// 获取统计数据
const stats = await createMelQuery()
  .withAircraft('B-1234')
  .withDateRange('2025-01-01', '2025-01-31')
  .statusStats();

console.log('状态分布:', stats.statusDistribution);
```

### 4. 并行查询
```typescript
// 同时获取数据和统计
const melStore = useMelStore();
await melStore.fetchWithStats(
  createMelQuery()
    .withAircraft('B-1234')
    .withDateRange('2025-01-01', '2025-01-31')
);

console.log('数据:', melStore.melList);
console.log('统计:', melStore.statsData);
```

## 最佳实践

### 1. 代码组织
- 使用TypeScript严格类型检查
- 合理的错误处理和用户提示
- 组件化和模块化设计

### 2. 用户体验
- 加载状态指示
- 错误信息友好提示
- 响应式设计适配

### 3. 性能考虑
- 合理使用分页
- 避免重复查询
- 及时清理资源

### 4. 维护性
- 统一的接口规范
- 清晰的代码注释
- 完善的类型定义

## 兼容性

### 与现有代码兼容
- 保持 `getMels` 函数向后兼容
- `MelItem` 接口保持兼容
- 组件属性向后兼容

### 渐进式迁移
- 可以逐步替换现有MEL功能
- 新旧API可以并存使用
- 支持功能逐步升级

## 扩展性

### 新增查询类型
可以轻松扩展新的查询方式：
```typescript
// 在MelQueryBuilder中添加新方法
withPriority(priority: string): MelQueryBuilder {
  this.params.priority = priority;
  return this;
}
```

### 新增统计类型
可以添加新的统计接口：
```typescript
// 在MelAPIService中添加新统计方法
static async getPriorityStats(params: MelQueryDto): Promise<MelStatsResponse> {
  return request({
    url: '/mel/stats/priority',
    data: params
  });
}
```

## 总结

本实现提供了：

1. **完整的API层**: 基于后端文档的10个接口
2. **链式调用**: 流畅的查询构建体验  
3. **状态管理**: Pinia统一状态管理
4. **组件重构**: 优化的用户界面和交互
5. **性能优化**: 多方面的性能考虑
6. **错误处理**: 完善的错误处理机制
7. **向后兼容**: 保持与现有代码的兼容性
8. **扩展性**: 易于扩展和维护

通过这套实现，前端MEL功能得到了全面的升级，提供了更好的开发体验和用户体验。