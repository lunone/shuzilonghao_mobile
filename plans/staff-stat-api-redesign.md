# Stat Index Summary API 设计文档

## 1. 当前实现分析

### 1.1 现有 API 调用

**当前使用的 API**:
- 接口路径: `/stats/summary`
- 请求方法: `GET`
- 请求参数:
```typescript
{
  startDate: Date;  // 开始日期
  endDate: Date;    // 结束日期
}
```

**当前响应数据**:
```typescript
interface PeriodStats {
  counter: number;           // 班次
  hour: number;              // 小时
  netWeightCargo: number;    // 货量（克）
  averageLoadFactor?: number; // 平均载重率
}
```

### 1.2 前端当前逻辑

**时间范围计算**:
```typescript
// day 模式
const lastRange = {
  startDate: dayjs().subtract(2, 'day').startOf('day').toDate(),  // 前天
  endDate: dayjs().subtract(1, 'day').startOf('day').toDate()     // 昨天
};
const currentRange = {
  startDate: dayjs().subtract(1, 'day').startOf('day').toDate(),  // 昨天
  endDate: dayjs().startOf('day').toDate()                       // 今天
};

// year 模式
const lastRange = {
  startDate: dayjs().subtract(1, 'year').startOf('year').toDate(),  // 去年第一天
  endDate: dayjs().subtract(1, 'year').toDate()                     // 去年今天
};
const currentRange = {
  startDate: dayjs().startOf('year').toDate(),  // 今年第一天
  endDate: dayjs().toDate()                      // 今天
};
```

**前端发起的请求**:
```typescript
// 并行发起 2 个请求
const [currentResult, lastResult] = await Promise.allSettled([
  getStatPeriod(currentRange),  // 当前周期
  getStatPeriod(lastRange)      // 前一个周期
]);
```

**前端计算逻辑**:
```typescript
// 变化率计算
const rate = (last: number, current: number) =>
  last > 0 ? ((current - last) / last * 100).toFixed(1) : '--';

// 数据格式化（保留在前端）
const formater = (src: PeriodStats) => ({
  counter: numberByWan(src?.counter ?? 0),
  netWeightCargo: numberByWan(((src?.netWeightCargo ?? 0) / 1e3) | 0),  // 克转吨
  hour: numberByWan((src?.hour ?? 0) | 0),
});
```

### 1.3 存在的问题
- 产生 2 个网络请求，浪费资源
- 时间范围计算在前端
- 变化率计算在前端

## 2. 新 API 设计

### 2.1 请求接口

**接口路径**: `/api/stats/index-summary`

**请求方法**: `GET`

**请求参数**:
```typescript
{
  date: string;  // ISO 8601 格式的日期时间字符串，精确到秒
                 // 例如：2025-12-25T03:44:23.595Z
}
```

**示例请求**:
```
GET /api/stats/index-summary?date=2025-12-25T03:44:23.595Z
```

### 2.2 响应数据结构

```typescript
// 单个指标的完整数据
interface MetricData {
  // 原始数据（后端返回，前端用 numberByWan 格式化）
  theDayBeforeYesterday: number;  // 前天
  yesterday: number;              // 昨天
  lastYear: number;               // 去年
  thisYear: number;               // 今年

  // 变化率（后端计算好，返回小数，前端负责展示转换）
  dayRate: number;    // 日变化率（昨天 vs 前天），如 0.09 表示 9%
  yearRate: number;   // 年变化率（今年 vs 去年），如 0.078 表示 7.8%
}

// 完整响应
interface IndexSummaryResponse {
  counter: MetricData;       // 班次数据
  netWeightCargo: MetricData; // 货量数据（克）
  hour: MetricData;         // 小时数据
}
```

**示例响应**:
```json
{
  "counter": {
    "theDayBeforeYesterday": 12345,
    "yesterday": 13456,
    "lastYear": 456789,
    "thisYear": 498765,
    "dayRate": 0.09,
    "yearRate": 0.092
  },
  "netWeightCargo": {
    "theDayBeforeYesterday": 5678900,
    "yesterday": 6123400,
    "lastYear": 2345678900,
    "thisYear": 2534567800,
    "dayRate": 0.078,
    "yearRate": 0.081
  },
  "hour": {
    "theDayBeforeYesterday": 23456,
    "yesterday": 24567,
    "lastYear": 8765432,
    "thisYear": 9187654,
    "dayRate": 0.047,
    "yearRate": 0.048
  }
}
```

## 3. 后端实现逻辑

### 3.1 时间范围计算

```typescript
import dayjs from 'dayjs';

/**
 * 根据参考日期计算所有需要的时间范围
 * @param referenceDate 参考日期（ISO 8601 格式）
 * @returns 各时间范围的起止日期
 */
function calculateDateRanges(referenceDate: Date) {
  const ref = dayjs(referenceDate);

  return {
    // 前天：前天 00:00:00 到 昨天 00:00:00
    theDayBeforeYesterday: {
      start: ref.subtract(2, 'day').startOf('day').toDate(),
      end: ref.subtract(1, 'day').startOf('day').toDate()
    },
    // 昨天：昨天 00:00:00 到 今天 00:00:00
    yesterday: {
      start: ref.subtract(1, 'day').startOf('day').toDate(),
      end: ref.startOf('day').toDate()
    },
    // 去年：去年第一天 00:00:00 到 去年此时
    lastYear: {
      start: ref.subtract(1, 'year').startOf('year').toDate(),
      end: ref.subtract(1, 'year').toDate()
    },
    // 今年：今年第一天 00:00:00 到 此时
    thisYear: {
      start: ref.startOf('year').toDate(),
      end: ref.toDate()
    }
  };
}
```

### 3.2 数据查询

```typescript
/**
 * 查询指定时间范围的统计数据
 * 调用现有的统计查询逻辑
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 统计数据
 */
async function queryStats(startDate: Date, endDate: Date): Promise<PeriodStats> {
  // 调用现有的统计查询逻辑
  // 这里假设有一个 getStatPeriod 函数可以查询统计数据
  return await getStatPeriod({ startDate, endDate });
}
```

### 3.3 变化率计算

```typescript
/**
 * 计算变化率
 * @param previous 前一个周期的值
 * @param current 当前周期的值
 * @returns 变化率小数，如果前值为0则返回 null
 */
function calculateRate(previous: number, current: number): number | null {
  if (previous > 0) {
    return (current - previous) / previous;
  }
  return null;
}
```

### 3.4 完整处理流程

```typescript
/**
 * 获取首页统计摘要
 * @param date ISO 8601 格式的参考日期时间
 * @returns 首页统计响应
 */
async function getIndexSummary(date: string): Promise<IndexSummaryResponse> {
  const referenceDate = dayjs(date).toDate();

  // 1. 计算所有时间范围
  const dateRanges = calculateDateRanges(referenceDate);

  // 2. 并行查询所有时间范围的数据
  const [
    theDayBeforeYesterdayStats,
    yesterdayStats,
    lastYearStats,
    thisYearStats
  ] = await Promise.all([
    queryStats(dateRanges.theDayBeforeYesterday.start, dateRanges.theDayBeforeYesterday.end),
    queryStats(dateRanges.yesterday.start, dateRanges.yesterday.end),
    queryStats(dateRanges.lastYear.start, dateRanges.lastYear.end),
    queryStats(dateRanges.thisYear.start, dateRanges.thisYear.end)
  ]);

  // 3. 构建响应数据
  const response: IndexSummaryResponse = {
    counter: {
      theDayBeforeYesterday: theDayBeforeYesterdayStats.counter,
      yesterday: yesterdayStats.counter,
      lastYear: lastYearStats.counter,
      thisYear: thisYearStats.counter,
      dayRate: calculateRate(theDayBeforeYesterdayStats.counter, yesterdayStats.counter),
      yearRate: calculateRate(lastYearStats.counter, thisYearStats.counter)
    },
    netWeightCargo: {
      theDayBeforeYesterday: theDayBeforeYesterdayStats.netWeightCargo,
      yesterday: yesterdayStats.netWeightCargo,
      lastYear: lastYearStats.netWeightCargo,
      thisYear: thisYearStats.netWeightCargo,
      dayRate: calculateRate(theDayBeforeYesterdayStats.netWeightCargo, yesterdayStats.netWeightCargo),
      yearRate: calculateRate(lastYearStats.netWeightCargo, thisYearStats.netWeightCargo)
    },
    hour: {
      theDayBeforeYesterday: theDayBeforeYesterdayStats.hour,
      yesterday: yesterdayStats.hour,
      lastYear: lastYearStats.hour,
      thisYear: thisYearStats.hour,
      dayRate: calculateRate(theDayBeforeYesterdayStats.hour, yesterdayStats.hour),
      yearRate: calculateRate(lastYearStats.hour, thisYearStats.hour)
    }
  };

  return response;
}
```

## 4. 前端改动

### 4.1 API 接口定义更新

在 `src/api/statistics.api.ts` 中添加：

```typescript
// 单个指标的完整数据
export interface MetricData {
  theDayBeforeYesterday: number;  // 前天
  yesterday: number;              // 昨天
  lastYear: number;               // 去年
  thisYear: number;               // 今年
  dayRate: number | null;    // 日变化率（小数）
  yearRate: number | null;   // 年变化率（小数）
}

// 首页统计响应
export interface IndexSummaryResponse {
  counter: MetricData;
  netWeightCargo: MetricData;
  hour: MetricData;
}

// 获取首页统计摘要
export const getIndexSummary = (date: string): Promise<IndexSummaryResponse> => {
  return get({ url: '/stats/index-summary', data: { date } });
};
```

### 4.2 组件改动

在 `src/pages/staff/stat.vue` 中：

**移除的内容**:
- `dates` 对象（时间范围计算移到后端）
- `lastRes` 和 `currentRes` ref
- `rate` 函数（变化率计算移到后端）
- `loadData` 函数中的复杂逻辑

**保留的内容**:
- `formater` 函数（保留 `numberByWan` 格式化在前端）
- `fields` 对象
- `titles` 对象

**新增的内容**:
- 使用新的 API `getIndexSummary`
- 简化 `sections` computed 属性，根据 `range` 选择对应的数据
- 变化率展示转换：将小数转换为百分比字符串

**变化率展示转换函数**:
```typescript
// 将变化率小数转换为百分比字符串
const formatRate = (rate: number | null): string => {
  if (rate === null) return '--';
  return (rate * 100).toFixed(1);
};
```

## 5. 优势

1. **减少网络请求**：从 2 个请求减少到 1 个
2. **一次获取所有数据**：前端可以根据需要选择显示哪些时间维度的数据
3. **逻辑集中**：时间范围计算和变化率计算在后端统一处理
4. **前端简化**：前端只负责展示和格式化
5. **易于维护**：修改计算逻辑只需改后端
6. **精确到秒**：使用 ISO 8601 格式，查询精确到秒
7. **保留原接口**：不影响现有功能

## 6. 迁移步骤

### 第一步：后端实现
1. 实现新的 API 接口 `/api/stats/index-summary`
2. 实现时间范围计算逻辑（4 个时间范围）
3. 实现变化率计算逻辑（返回小数）
4. 测试接口返回正确数据

### 第二步：前端实现
1. 更新 `src/api/statistics.api.ts` 添加新的接口定义
2. 修改 `src/pages/staff/stat.vue` 使用新 API
3. 测试验证功能正常
