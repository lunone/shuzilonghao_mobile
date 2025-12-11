# MEL 模块架构设计

## 概述

基于 `other/mel.md` 文档和已实现的功能，设计一个完整的 MEL（最低设备清单）模块，提供全面的 MEL 数据查询、统计和管理功能。

## 已实现功能分析

### 当前已实现的页面
1. **MEL 列表页面** (`/pages/maintenance/mel/melList.vue`)
   - 支持多种查询条件（飞机号、日期范围等）
   - 分页显示 MEL 数据
   - 支持跳转到详情页面

2. **MEL 详情页面** (`/pages/maintenance/mel/melDetail.vue`)
   - 显示完整的 MEL 记录信息
   - 区分主基地和外站数据
   - 支持多种字段展示

3. **MEL 卡片组件** (`/pages/maintenance/mel/card.vue`)
   - 简化的 MEL 数据展示
   - 用于嵌入其他页面

### 当前已实现的后端接口
- `/mel/list` - 通用查询接口
- `/mel/detail` - 获取单个 MEL 记录详情
- `/mel/by/aircraft` - 根据飞机号查询
- `/mel/stats` - 获取统计信息
- `/mel/stats/status` - 获取状态分布统计
- `/mel/stats/ata` - 获取 ATA 章节分布统计
- `/mel/stats/monthly` - 获取月度统计

### 当前已实现的技术基础
- API 服务层 (`src/api/mel.api.ts`)
- 状态管理 (`src/store/mel.store.ts`)
- 类型定义 (`src/types/mel.ts`)
- 链式查询构建器

## MEL 模块架构设计

### 1. 模块结构

```
src/pages/mel/
├── index.vue                    # MEL 模块主页/导航页
├── list/                        # 查询相关页面
│   ├── index.vue               # MEL 列表查询页（重构现有 melList.vue）
│   ├── search.vue              # 高级搜索页面
│   └── components/
│       ├── MelItem.vue         # MEL 列表项组件
│       ├── MelFilter.vue       # 筛选组件
│       └── MelSearchBar.vue    # 搜索栏组件
├── detail/                      # 详情相关页面
│   ├── index.vue               # MEL 详情页（重构现有 melDetail.vue）
│   └── components/
│       ├── MelBasicInfo.vue    # 基础信息组件
│       ├── MelDeferralInfo.vue # 保留信息组件
│       └── MelRepairInfo.vue   # 维修信息组件
├── stats/                       # 统计分析页面
│   ├── index.vue               # 统计概览页面
│   ├── status.vue              # 状态统计页面
│   ├── ata.vue                 # ATA 章节统计页面
│   ├── monthly.vue             # 月度统计页面
│   └── components/
│       ├── StatsCard.vue       # 统计卡片组件
│       └── ChartContainer.vue  # 图表容器组件
├── aircraft/                    # 飞机相关页面
│   ├── index.vue               # 飞机 MEL 列表页面
│   └── detail.vue             # 飞机 MEL 详情页面
└── components/                  # 通用组件
    ├── MelStatusBadge.vue      # 状态标签组件
    ├── MelATATag.vue           # ATA 章节标签组件
    └── MelDatePicker.vue       # 日期选择器组件
```

### 2. 页面功能规划

#### 2.1 MEL 模块主页 (`/pages/mel/index.vue`)
- **功能**：MEL 模块的导航和概览页面
- **内容**：
  - 快速搜索框
  - 常用查询入口（按飞机、按日期、按状态等）
  - 统计数据概览卡片
  - 最近 MEL 记录列表
  - 功能模块导航入口

#### 2.2 MEL 列表查询页 (`/pages/mel/list/index.vue`)
- **功能**：重构现有的 MEL 列表页面，增强查询和筛选功能
- **内容**：
  - 高级搜索表单（支持多条件组合查询）
  - 筛选器（状态、类型、ATA 章节等）
  - 排序选项
  - 分页加载
  - 列表视图切换（列表/卡片视图）
  - 批量操作功能

#### 2.3 高级搜索页面 (`/pages/mel/list/search.vue`)
- **功能**：提供更复杂的搜索条件组合
- **内容**：
  - 完整的搜索表单
  - 保存搜索条件
  - 搜索历史记录
  - 快速筛选标签

#### 2.4 MEL 详情页 (`/pages/mel/detail/index.vue`)
- **功能**：重构现有的 MEL 详情页面，优化展示效果
- **内容**：
  - 分模块展示详情信息
  - 相关 MEL 记录推荐
  - 操作历史记录
  - 打印/分享功能

#### 2.5 统计概览页面 (`/pages/mel/stats/index.vue`)
- **功能**：MEL 数据的统计概览
- **内容**：
  - 总体统计卡片
  - 趋势图表
  - 快速统计链接
  - 数据导出功能

#### 2.6 状态统计页面 (`/pages/mel/stats/status.vue`)
- **功能**：MEL 状态分布的详细统计
- **内容**：
  - 状态分布饼图
  - 状态趋势图
  - 状态筛选列表
  - 状态变更时间线

#### 2.7 ATA 章节统计页面 (`/pages/mel/stats/ata.vue`)
- **功能**：ATA 章节分布的详细统计
- **内容**：
  - ATA 章节分布图
  - 高频 ATA 章节排行
  - ATA 章节趋势分析
  - ATA 章节筛选列表

#### 2.8 月度统计页面 (`/pages/mel/stats/monthly.vue`)
- **功能**：MEL 数据的月度趋势分析
- **内容**：
  - 月度趋势图表
  - 同比/环比分析
  - 月度报表导出
  - 月度数据对比

#### 2.9 飞机 MEL 列表页面 (`/pages/mel/aircraft/index.vue`)
- **功能**：特定飞机的 MEL 记录列表
- **内容**：
  - 飞机选择器
  - 飞机基本信息
  - MEL 记录列表
  - 飞机 MEL 统计

#### 2.10 飞机 MEL 详情页面 (`/pages/mel/aircraft/detail.vue`)
- **功能**：特定飞机的 MEL 详细信息
- **内容**：
  - 飞机详细信息
  - MEL 历史记录
  - MEL 趋势分析
  - 维修建议

### 3. 组件设计

#### 3.1 通用组件
- **MelStatusBadge**：状态标签组件，支持不同状态的样式
- **MelATATag**：ATA 章节标签组件，支持点击筛选
- **MelDatePicker**：日期选择器组件，支持快速选择常用日期范围

#### 3.2 列表组件
- **MelItem**：MEL 列表项组件，支持多种展示模式
- **MelFilter**：筛选器组件，支持多种筛选条件
- **MelSearchBar**：搜索栏组件，支持快速搜索和历史记录

#### 3.3 详情组件
- **MelBasicInfo**：基础信息展示组件
- **MelDeferralInfo**：保留信息展示组件
- **MelRepairInfo**：维修信息展示组件

#### 3.4 统计组件
- **StatsCard**：统计卡片组件，支持多种数据展示
- **ChartContainer**：图表容器组件，支持多种图表类型

### 4. 路由配置

```json
{
  "path": "pages/mel/index",
  "style": {
    "navigationBarTitleText": "MEL管理"
  }
},
{
  "path": "pages/mel/list/index",
  "style": {
    "navigationBarTitleText": "MEL列表"
  }
},
{
  "path": "pages/mel/list/search",
  "style": {
    "navigationBarTitleText": "高级搜索"
  }
},
{
  "path": "pages/mel/detail/index",
  "style": {
    "navigationBarTitleText": "MEL详情"
  }
},
{
  "path": "pages/mel/stats/index",
  "style": {
    "navigationBarTitleText": "MEL统计"
  }
},
{
  "path": "pages/mel/stats/status",
  "style": {
    "navigationBarTitleText": "状态统计"
  }
},
{
  "path": "pages/mel/stats/ata",
  "style": {
    "navigationBarTitleText": "ATA统计"
  }
},
{
  "path": "pages/mel/stats/monthly",
  "style": {
    "navigationBarTitleText": "月度统计"
  }
},
{
  "path": "pages/mel/aircraft/index",
  "style": {
    "navigationBarTitleText": "飞机MEL"
  }
},
{
  "path": "pages/mel/aircraft/detail",
  "style": {
    "navigationBarTitleText": "飞机MEL详情"
  }
}
```

### 5. 导航设计

#### 5.1 主导航结构
```
MEL管理
├── MEL列表
│   ├── 快速查询
│   ├── 高级搜索
│   └── 筛选器
├── 统计分析
│   ├── 统计概览
│   ├── 状态统计
│   ├── ATA统计
│   └── 月度统计
├── 飞机MEL
│   ├── 飞机选择
│   ├── MEL列表
│   └── MEL详情
└── MEL详情
    ├── 基础信息
    ├── 保留信息
    ├── 维修信息
    └── 操作记录
```

#### 5.2 页面间导航关系
- MEL 模块主页 → 各功能页面
- MEL 列表 → MEL 详情
- 统计概览 → 各专项统计页面
- 飞机 MEL 列表 → 飞机 MEL 详情
- 所有页面 → 高级搜索

### 6. 数据流设计

#### 6.1 API 调用优化
- 利用现有的链式查询构建器
- 增加缓存机制，减少重复请求
- 实现数据预加载，提升用户体验

#### 6.2 状态管理优化
- 扩展现有的 MelStore，增加更多状态管理
- 实现查询条件缓存，支持页面间状态共享
- 添加数据更新机制，支持实时数据刷新

### 7. 用户体验优化

#### 7.1 响应式设计
- 适配不同屏幕尺寸
- 优化移动端操作体验
- 支持手势操作

#### 7.2 性能优化
- 实现虚拟滚动，处理大量数据
- 图片懒加载，减少初始加载时间
- 组件按需加载，减少首屏加载时间

#### 7.3 交互优化
- 添加加载状态和错误处理
- 实现下拉刷新和上拉加载
- 支持离线浏览和数据缓存

## 实施计划

### 阶段一：基础架构搭建
1. 创建 MEL 模块目录结构
2. 配置路由和导航
3. 创建基础组件
4. 重构现有页面到新架构

### 阶段二：核心功能实现
1. 实现 MEL 列表查询功能
2. 实现 MEL 详情展示功能
3. 实现统计分析功能
4. 实现飞机 MEL 功能

### 阶段三：高级功能和优化
1. 实现高级搜索功能
2. 优化用户体验
3. 性能优化
4. 测试和调试

### 阶段四：集成和部署
1. 与现有系统集成
2. 数据迁移和兼容性处理
3. 用户培训和文档编写
4. 部署和上线

## 总结

这个 MEL 模块架构设计基于现有的技术基础，充分利用了已实现的 API、状态管理和类型定义。通过模块化的设计，提供了全面的 MEL 数据查询、统计和管理功能，同时保持了良好的可扩展性和维护性。

该架构不仅满足了当前的功能需求，还为未来的功能扩展预留了空间，如 MEL 预警、维修建议、智能分析等高级功能。