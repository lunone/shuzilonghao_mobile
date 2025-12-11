# MEL 模块路由配置

## 概述

基于 MEL 模块架构，设计完整的路由配置，包括页面路由、导航守卫、参数传递和权限控制。

## 路由结构

### 1. 路由层次结构

```
/mel/
├── index.vue                    # MEL 模块主页
├── list/                       # 查询相关页面
│   ├── index.vue               # MEL 列表查询页
│   └── search.vue              # 高级搜索页面
├── detail/                     # 详情相关页面
│   └── index.vue               # MEL 详情页
├── stats/                      # 统计分析页面
│   ├── index.vue               # 统计概览页面
│   ├── status.vue              # 状态统计页面
│   ├── ata.vue                 # ATA 章节统计页面
│   └── monthly.vue             # 月度统计页面
├── aircraft/                   # 飞机相关页面
│   ├── index.vue               # 飞机 MEL 列表页面
│   └── detail.vue             # 飞机 MEL 详情页面
└── management/                 # 管理功能页面
    ├── index.vue               # 管理主页
    ├── create.vue              # 创建 MEL 页面
    ├── approve.vue             # 审批页面
    ├── repair.vue              # 维修管理页面
    ├── close.vue               # 关闭管理页面
    └── renew.vue               # 续保管理页面
```

### 2. 路由配置文件

#### 2.1 pages.json 配置

```json
{
  "pages": [
    // 现有页面...
    
    // MEL 模块页面
    {
      "path": "pages/mel/index",
      "style": {
        "navigationBarTitleText": "MEL管理",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white"
      }
    },
    {
      "path": "pages/mel/list/index",
      "style": {
        "navigationBarTitleText": "MEL列表",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true,
        "onReachBottomDistance": 50
      }
    },
    {
      "path": "pages/mel/list/search",
      "style": {
        "navigationBarTitleText": "高级搜索",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white"
      }
    },
    {
      "path": "pages/mel/detail/index",
      "style": {
        "navigationBarTitleText": "MEL详情",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/stats/index",
      "style": {
        "navigationBarTitleText": "MEL统计",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/stats/status",
      "style": {
        "navigationBarTitleText": "状态统计",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/stats/ata",
      "style": {
        "navigationBarTitleText": "ATA统计",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/stats/monthly",
      "style": {
        "navigationBarTitleText": "月度统计",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/aircraft/index",
      "style": {
        "navigationBarTitleText": "飞机MEL",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/aircraft/detail",
      "style": {
        "navigationBarTitleText": "飞机MEL详情",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/management/index",
      "style": {
        "navigationBarTitleText": "MEL管理",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/management/create",
      "style": {
        "navigationBarTitleText": "创建MEL",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white"
      }
    },
    {
      "path": "pages/mel/management/approve",
      "style": {
        "navigationBarTitleText": "MEL审批",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/management/repair",
      "style": {
        "navigationBarTitleText": "MEL维修",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/management/close",
      "style": {
        "navigationBarTitleText": "MEL关闭",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/mel/management/renew",
      "style": {
        "navigationBarTitleText": "MEL续保",
        "navigationBarBackgroundColor": "#137fec",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    }
  ],
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

#### 2.2 路由参数配置

```typescript
// 路由参数类型定义
interface MelRouteParams {
  // 详情页面参数
  id: string;                    // MEL记录ID
  source?: string;               // 数据来源
  
  // 列表页面参数
  acReg?: string;                // 飞机注册号
  status?: string;               // 状态筛选
  type?: string;                 // 类型筛选
  ata?: string;                 // ATA章节筛选
  startDate?: string;            // 开始日期
  endDate?: string;              // 结束日期
  
  // 统计页面参数
  dateType?: string;             // 日期类型
  period?: string;               // 统计周期
  
  // 飞机页面参数
  aircraftId?: string;           // 飞机ID
  
  // 管理页面参数
  action?: string;               // 操作类型
  batch?: string;                // 批量操作标识
}

// 路由查询参数
interface MelRouteQuery {
  // 分页参数
  page?: number;                 // 页码
  size?: number;                 // 每页数量
  
  // 排序参数
  sort?: string;                 // 排序字段
  order?: 'asc' | 'desc';       // 排序方向
  
  // 筛选参数
  filter?: string;               // 筛选条件
  keyword?: string;              // 搜索关键词
  
  // 返回参数
  from?: string;                 // 来源页面
  redirect?: string;             // 重定向页面
}
```

## 路由导航

### 1. 导航工具类

```typescript
// MEL 路由导航工具类
class MelRouter {
  private static readonly BASE_PATH = '/pages/mel';
  
  // 导航到 MEL 主页
  static toIndex(): void {
    uni.navigateTo({
      url: `${this.BASE_PATH}/index`
    });
  }
  
  // 导航到 MEL 列表
  static toList(params?: Partial<MelRouteParams>, query?: MelRouteQuery): void {
    const queryString = this.buildQueryString(query);
    const paramsString = this.buildParamsString(params);
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/list/index${paramsString}${queryString}`
    });
  }
  
  // 导航到高级搜索
  static toSearch(): void {
    uni.navigateTo({
      url: `${this.BASE_PATH}/list/search`
    });
  }
  
  // 导航到 MEL 详情
  static toDetail(id: string, source?: string, query?: MelRouteQuery): void {
    const queryString = this.buildQueryString({ ...query, id, source });
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/detail/index${queryString}`
    });
  }
  
  // 导航到统计概览
  static toStats(query?: MelRouteQuery): void {
    const queryString = this.buildQueryString(query);
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/stats/index${queryString}`
    });
  }
  
  // 导航到状态统计
  static toStatusStats(query?: MelRouteQuery): void {
    const queryString = this.buildQueryString(query);
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/stats/status${queryString}`
    });
  }
  
  // 导航到 ATA 统计
  static toAtaStats(query?: MelRouteQuery): void {
    const queryString = this.buildQueryString(query);
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/stats/ata${queryString}`
    });
  }
  
  // 导航到月度统计
  static toMonthlyStats(query?: MelRouteQuery): void {
    const queryString = this.buildQueryString(query);
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/stats/monthly${queryString}`
    });
  }
  
  // 导航到飞机 MEL 列表
  static toAircraftList(aircraftId: string, query?: MelRouteQuery): void {
    const queryString = this.buildQueryString({ ...query, aircraftId });
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/aircraft/index${queryString}`
    });
  }
  
  // 导航到飞机 MEL 详情
  static toAircraftDetail(aircraftId: string, query?: MelRouteQuery): void {
    const queryString = this.buildQueryString({ ...query, aircraftId });
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/aircraft/detail${queryString}`
    });
  }
  
  // 导航到管理主页
  static toManagement(): void {
    uni.navigateTo({
      url: `${this.BASE_PATH}/management/index`
    });
  }
  
  // 导航到创建 MEL
  static toCreate(query?: MelRouteQuery): void {
    const queryString = this.buildQueryString(query);
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/management/create${queryString}`
    });
  }
  
  // 导航到审批页面
  static toApprove(query?: MelRouteQuery): void {
    const queryString = this.buildQueryString(query);
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/management/approve${queryString}`
    });
  }
  
  // 导航到维修管理
  static toRepair(query?: MelRouteQuery): void {
    const queryString = this.buildQueryString(query);
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/management/repair${queryString}`
    });
  }
  
  // 导航到关闭管理
  static toClose(query?: MelRouteQuery): void {
    const queryString = this.buildQueryString(query);
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/management/close${queryString}`
    });
  }
  
  // 导航到续保管理
  static toRenew(query?: MelRouteQuery): void {
    const queryString = this.buildQueryString(query);
    
    uni.navigateTo({
      url: `${this.BASE_PATH}/management/renew${queryString}`
    });
  }
  
  // 构建查询字符串
  private static buildQueryString(query?: MelRouteQuery): string {
    if (!query || Object.keys(query).length === 0) {
      return '';
    }
    
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }
  
  // 构建参数字符串
  private static buildParamsString(params?: Partial<MelRouteParams>): string {
    if (!params || Object.keys(params).length === 0) {
      return '';
    }
    
    const paramPairs = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);
    
    return paramPairs.length > 0 ? `/${paramPairs.join('/')}` : '';
  }
  
  // 返回上一页
  static navigateBack(delta = 1): void {
    uni.navigateBack({
      delta
    });
  }
  
  // 重定向到指定页面
  static redirect(url: string): void {
    uni.redirectTo({
      url
    });
  }
  
  // 切换到指定页面
  static switchTab(url: string): void {
    uni.switchTab({
      url
    });
  }
}
```

### 2. 路由守卫

```typescript
// 路由守卫管理
class MelRouteGuard {
  private static permissionManager = new MelPermissionManager();
  
  // 全局前置守卫
  static async beforeEach(to: any, from: any, next: any): Promise<void> {
    // 检查页面权限
    const hasPermission = await this.checkPagePermission(to);
    
    if (!hasPermission) {
      uni.showToast({
        title: '您没有访问该页面的权限',
        icon: 'none'
      });
      
      // 重定向到有权限的页面
      const redirectTo = await this.getRedirectPage();
      MelRouter.redirect(redirectTo);
      return;
    }
    
    // 检查参数有效性
    const validParams = this.validateParams(to);
    
    if (!validParams) {
      uni.showToast({
        title: '参数无效',
        icon: 'none'
      });
      
      MelRouter.navigateBack();
      return;
    }
    
    // 记录页面访问日志
    this.logPageAccess(to, from);
    
    next();
  }
  
  // 全局后置守卫
  static afterEach(to: any, from: any): void {
    // 页面访问统计
    this.recordPageView(to);
    
    // 清理页面缓存
    this.cleanupPageCache(from);
  }
  
  // 检查页面权限
  private static async checkPagePermission(route: any): Promise<boolean> {
    const pagePath = route.path;
    const userId = this.getCurrentUserId();
    
    // 定义页面权限映射
    const pagePermissions: Record<string, string[]> = {
      '/pages/mel/management/index': ['mel:view', 'mel:manage'],
      '/pages/mel/management/create': ['mel:create'],
      '/pages/mel/management/approve': ['mel:approve'],
      '/pages/mel/management/repair': ['mel:repair'],
      '/pages/mel/management/close': ['mel:close'],
      '/pages/mel/management/renew': ['mel:renew']
    };
    
    const requiredPermissions = pagePermissions[pagePath];
    
    if (!requiredPermissions) {
      // 公开页面，无需权限
      return true;
    }
    
    // 检查用户是否有所需权限
    return requiredPermissions.some(permission => 
      this.permissionManager.hasPermission(userId, permission)
    );
  }
  
  // 获取重定向页面
  private static async getRedirectPage(): Promise<string> {
    const userId = this.getCurrentUserId();
    
    // 根据用户权限返回合适的页面
    if (this.permissionManager.hasPermission(userId, 'mel:manage')) {
      return '/pages/mel/management/index';
    } else if (this.permissionManager.hasPermission(userId, 'mel:view')) {
      return '/pages/mel/index';
    } else {
      return '/pages/index/index';
    }
  }
  
  // 验证参数
  private static validateParams(route: any): boolean {
    const { params, query } = route;
    
    // 验证 ID 参数
    if (params.id && !/^\d+$/.test(params.id)) {
      return false;
    }
    
    // 验证日期参数
    if (query.startDate && !this.isValidDate(query.startDate)) {
      return false;
    }
    
    if (query.endDate && !this.isValidDate(query.endDate)) {
      return false;
    }
    
    // 验证分页参数
    if (query.page && (!/^\d+$/.test(query.page) || parseInt(query.page) < 1)) {
      return false;
    }
    
    if (query.size && (!/^\d+$/.test(query.size) || parseInt(query.size) < 1 || parseInt(query.size) > 100)) {
      return false;
    }
    
    return true;
  }
  
  // 检查日期是否有效
  private static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
  
  // 获取当前用户ID
  private static getCurrentUserId(): string {
    // 从用户存储中获取当前用户ID
    return uni.getStorageSync('userId') || '';
  }
  
  // 记录页面访问日志
  private static logPageAccess(to: any, from: any): void {
    const accessLog = {
      to: to.path,
      from: from.path,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId()
    };
    
    // 发送访问日志到服务器
    this.sendAccessLog(accessLog);
  }
  
  // 记录页面访问统计
  private static recordPageView(route: any): void {
    const pageView = {
      path: route.path,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId()
    };
    
    // 发送页面访问统计到服务器
    this.sendPageView(pageView);
  }
  
  // 清理页面缓存
  private static cleanupPageCache(route: any): void {
    // 清理不需要的页面缓存
    const cacheKey = `page_cache_${route.path}`;
    uni.removeStorageSync(cacheKey);
  }
  
  // 发送访问日志
  private static sendAccessLog(log: any): void {
    // 实际应用中应该发送到服务器
    console.log('Access Log:', log);
  }
  
  // 发送页面访问统计
  private static sendPageView(view: any): void {
    // 实际应用中应该发送到服务器
    console.log('Page View:', view);
  }
}
```

## 路由状态管理

### 1. 路由状态存储

```typescript
// 路由状态管理
interface MelRouteState {
  // 当前路由信息
  currentRoute: {
    path: string;
    params: MelRouteParams;
    query: MelRouteQuery;
    timestamp: number;
  };
  
  // 路由历史
  routeHistory: Array<{
    path: string;
    params: MelRouteParams;
    query: MelRouteQuery;
    timestamp: number;
  }>;
  
  // 路由缓存
  routeCache: Map<string, {
    data: any;
    timestamp: number;
    expireTime: number;
  }>;
  
  // 路由参数
  routeParams: {
    [key: string]: MelRouteParams;
  };
  
  // 路由查询参数
  routeQuery: {
    [key: string]: MelRouteQuery;
  };
}

// 路由状态管理类
class MelRouteStateManager {
  private static readonly STORAGE_KEY = 'mel_route_state';
  private static readonly MAX_HISTORY_SIZE = 20;
  private static readonly CACHE_EXPIRE_TIME = 5 * 60 * 1000; // 5分钟
  
  // 获取路由状态
  static getState(): MelRouteState {
    const stateData = uni.getStorageSync(this.STORAGE_KEY);
    
    if (!stateData) {
      return this.getInitialState();
    }
    
    try {
      const state = JSON.parse(stateData);
      
      // 清理过期的缓存
      this.cleanExpiredCache(state.routeCache);
      
      return state;
    } catch (error) {
      console.error('Failed to parse route state:', error);
      return this.getInitialState();
    }
  }
  
  // 设置路由状态
  static setState(state: Partial<MelRouteState>): void {
    const currentState = this.getState();
    const newState = { ...currentState, ...state };
    
    uni.setStorageSync(this.STORAGE_KEY, JSON.stringify(newState));
  }
  
  // 更新当前路由
  static updateCurrentRoute(route: any): void {
    const currentRoute = {
      path: route.path,
      params: route.params || {},
      query: route.query || {},
      timestamp: Date.now()
    };
    
    // 添加到历史记录
    this.addToHistory(currentRoute);
    
    // 更新当前路由
    this.setState({
      currentRoute
    });
  }
  
  // 添加到历史记录
  static addToHistory(route: any): void {
    const state = this.getState();
    const historyItem = {
      path: route.path,
      params: route.params || {},
      query: route.query || {},
      timestamp: Date.now()
    };
    
    // 检查是否与上一条记录相同
    const lastHistory = state.routeHistory[state.routeHistory.length - 1];
    if (lastHistory && lastHistory.path === route.path) {
      return;
    }
    
    // 添加到历史记录
    state.routeHistory.push(historyItem);
    
    // 限制历史记录大小
    if (state.routeHistory.length > this.MAX_HISTORY_SIZE) {
      state.routeHistory.shift();
    }
    
    this.setState({
      routeHistory: state.routeHistory
    });
  }
  
  // 设置路由缓存
  static setRouteCache(key: string, data: any, expireTime?: number): void {
    const state = this.getState();
    const cacheItem = {
      data,
      timestamp: Date.now(),
      expireTime: expireTime || this.CACHE_EXPIRE_TIME
    };
    
    state.routeCache.set(key, cacheItem);
    
    this.setState({
      routeCache: state.routeCache
    });
  }
  
  // 获取路由缓存
  static getRouteCache(key: string): any | null {
    const state = this.getState();
    const cacheItem = state.routeCache.get(key);
    
    if (!cacheItem) {
      return null;
    }
    
    // 检查是否过期
    if (Date.now() - cacheItem.timestamp > cacheItem.expireTime) {
      state.routeCache.delete(key);
      this.setState({
        routeCache: state.routeCache
      });
      return null;
    }
    
    return cacheItem.data;
  }
  
  // 清理过期缓存
  private static cleanExpiredCache(cache: Map<string, any>): void {
    const now = Date.now();
    
    for (const [key, item] of cache.entries()) {
      if (now - item.timestamp > item.expireTime) {
        cache.delete(key);
      }
    }
  }
  
  // 获取初始状态
  private static getInitialState(): MelRouteState {
    return {
      currentRoute: {
        path: '',
        params: {},
        query: {},
        timestamp: 0
      },
      routeHistory: [],
      routeCache: new Map(),
      routeParams: {},
      routeQuery: {}
    };
  }
}
```

### 2. 路由参数处理

```typescript
// 路由参数处理工具
class MelRouteParamsHandler {
  // 解析路由参数
  static parseParams(url: string): {
    path: string;
    params: MelRouteParams;
    query: MelRouteQuery;
  } {
    const [pathWithoutQuery, queryString] = url.split('?');
    const [path, ...paramSegments] = pathWithoutQuery.split('/').filter(Boolean);
    
    // 解析路径参数
    const params: MelRouteParams = {};
    
    for (let i = 0; i < paramSegments.length; i += 2) {
      const key = paramSegments[i];
      const value = paramSegments[i + 1];
      
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    }
    
    // 解析查询参数
    const query: MelRouteQuery = {};
    
    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      
      for (const [key, value] of urlParams.entries()) {
        // 尝试转换为数字
        const numValue = Number(value);
        query[key] = isNaN(numValue) ? value : numValue;
      }
    }
    
    return {
      path: `/${path}`,
      params,
      query
    };
  }
  
  // 构建路由URL
  static buildUrl(path: string, params?: MelRouteParams, query?: MelRouteQuery): string {
    let url = path;
    
    // 添加路径参数
    if (params) {
      const paramPairs = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}/${encodeURIComponent(String(value))}`);
      
      if (paramPairs.length > 0) {
        url += `/${paramPairs.join('/')}`;
      }
    }
    
    // 添加查询参数
    if (query) {
      const queryParams = Object.entries(query)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
    }
    
    return url;
  }
  
  // 获取页面参数
  static getPageParams(): MelRouteParams {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (!currentPage || !('options' in currentPage)) {
      return {};
    }
    
    const options = (currentPage as any).options;
    const params: MelRouteParams = {};
    
    // 解析路径参数
    Object.keys(options).forEach(key => {
      if (key !== 'query') {
        params[key] = options[key];
      }
    });
    
    return params;
  }
  
  // 获取页面查询参数
  static getPageQuery(): MelRouteQuery {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (!currentPage || !('options' in currentPage)) {
      return {};
    }
    
    const options = (currentPage as any).options;
    return options.query || {};
  }
  
  // 合并参数
  static mergeParams(baseParams: MelRouteParams, newParams: Partial<MelRouteParams>): MelRouteParams {
    return { ...baseParams, ...newParams };
  }
  
  // 合并查询参数
  static mergeQuery(baseQuery: MelRouteQuery, newQuery: Partial<MelRouteQuery>): MelRouteQuery {
    return { ...baseQuery, ...newQuery };
  }
}
```

## 路由优化

### 1. 预加载策略

```typescript
// 路由预加载管理
class MelRoutePreloader {
  private static preloadQueue: Array<{
    url: string;
    priority: number;
    timestamp: number;
  }> = [];
  
  private static isPreloading = false;
  
  // 添加预加载任务
  static addPreloadTask(url: string, priority = 0): void {
    this.preloadQueue.push({
      url,
      priority,
      timestamp: Date.now()
    });
    
    // 按优先级排序
    this.preloadQueue.sort((a, b) => b.priority - a.priority);
    
    // 开始预加载
    this.startPreload();
  }
  
  // 开始预加载
  private static async startPreload(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }
    
    this.isPreloading = true;
    
    while (this.preloadQueue.length > 0) {
      const task = this.preloadQueue.shift();
      
      if (task) {
        await this.preloadPage(task.url);
      }
    }
    
    this.isPreloading = false;
  }
  
  // 预加载页面
  private static async preloadPage(url: string): Promise<void> {
    try {
      // 检查是否已缓存
      const cached = MelRouteStateManager.getRouteCache(url);
      
      if (cached) {
        return;
      }
      
      // 预加载数据
      const { params, query } = MelRouteParamsHandler.parseParams(url);
      
      // 根据页面类型预加载不同数据
      if (url.includes('/list/')) {
        await this.preloadListData(params, query);
      } else if (url.includes('/detail/')) {
        await this.preloadDetailData(params);
      } else if (url.includes('/stats/')) {
        await this.preloadStatsData(params, query);
      }
      
    } catch (error) {
      console.error('Preload failed:', url, error);
    }
  }
  
  // 预加载列表数据
  private static async preloadListData(params: MelRouteParams, query: MelRouteQuery): Promise<void> {
    const melStore = useMelStore();
    
    // 预加载第一页数据
    await melStore.queryWithBuilder(
      createMelQuery()
        .withPage(1)
        .withSize(20)
        .withAircraft(params.acReg || '')
        .withStatus(params.status || '')
    );
  }
  
  // 预加载详情数据
  private static async preloadDetailData(params: MelRouteParams): Promise<void> {
    if (!params.id) {
      return;
    }
    
    const melStore = useMelStore();
    
    // 预加载详情数据
    await melStore.fetchDetail(parseInt(params.id), params.source);
  }
  
  // 预加载统计数据
  private static async preloadStatsData(params: MelRouteParams, query: MelRouteQuery): Promise<void> {
    const melStore = useMelStore();
    
    // 预加载统计数据
    await melStore.fetchStatusStats();
    await melStore.fetchATAStats();
    await melStore.fetchMonthlyStats();
  }
}
```

### 2. 路由缓存策略

```typescript
// 路由缓存管理
class MelRouteCache {
  private static cacheConfig = {
    // 列表页面缓存
    list: {
      enabled: true,
      expireTime: 2 * 60 * 1000, // 2分钟
      maxSize: 10
    },
    // 详情页面缓存
    detail: {
      enabled: true,
      expireTime: 10 * 60 * 1000, // 10分钟
      maxSize: 50
    },
    // 统计页面缓存
    stats: {
      enabled: true,
      expireTime: 5 * 60 * 1000, // 5分钟
      maxSize: 20
    }
  };
  
  // 获取缓存配置
  static getCacheConfig(pageType: string): any {
    return this.cacheConfig[pageType] || {
      enabled: false,
      expireTime: 0,
      maxSize: 0
    };
  }
  
  // 生成缓存键
  static generateCacheKey(url: string, params?: any, query?: any): string {
    const keyData = {
      url,
      params: params || {},
      query: query || {}
    };
    
    return btoa(JSON.stringify(keyData));
  }
  
  // 设置缓存
  static setCache(pageType: string, key: string, data: any): void {
    const config = this.getCacheConfig(pageType);
    
    if (!config.enabled) {
      return;
    }
    
    const cacheItem = {
      data,
      timestamp: Date.now(),
      expireTime: config.expireTime
    };
    
    uni.setStorageSync(`mel_cache_${key}`, JSON.stringify(cacheItem));
  }
  
  // 获取缓存
  static getCache(pageType: string, key: string): any | null {
    const config = this.getCacheConfig(pageType);
    
    if (!config.enabled) {
      return null;
    }
    
    const cacheData = uni.getStorageSync(`mel_cache_${key}`);
    
    if (!cacheData) {
      return null;
    }
    
    try {
      const cacheItem = JSON.parse(cacheData);
      
      // 检查是否过期
      if (Date.now() - cacheItem.timestamp > cacheItem.expireTime) {
        uni.removeStorageSync(`mel_cache_${key}`);
        return null;
      }
      
      return cacheItem.data;
    } catch (error) {
      console.error('Failed to parse cache:', error);
      return null;
    }
  }
  
  // 清理缓存
  static clearCache(pageType?: string): void {
    if (pageType) {
      // 清理特定类型的缓存
      const keys = uni.getStorageInfoSync().keys;
      
      keys.forEach(key => {
        if (key.startsWith(`mel_cache_`)) {
          uni.removeStorageSync(key);
        }
      });
    } else {
      // 清理所有缓存
      const keys = uni.getStorageInfoSync().keys;
      
      keys.forEach(key => {
        if (key.startsWith('mel_cache_')) {
          uni.removeStorageSync(key);
        }
      });
    }
  }
}
```

## 测试策略

### 1. 路由测试

```typescript
// 路由测试示例
describe('MelRouter', () => {
  beforeEach(() => {
    // 清理路由状态
    MelRouteStateManager.setState(MelRouteStateManager.getInitialState());
  });
  
  it('should build correct URL for detail page', () => {
    const url = MelRouter.buildUrl('/pages/mel/detail/index', { id: '123', source: 'base' });
    
    expect(url).toBe('/pages/mel/detail/index/id/123/source/base');
  });
  
  it('should parse route parameters correctly', () => {
    const url = '/pages/mel/detail/index/id/123/source/base?status=approved&page=1';
    const { path, params, query } = MelRouteParamsHandler.parseParams(url);
    
    expect(path).toBe('/pages/mel/detail/index');
    expect(params.id).toBe('123');
    expect(params.source).toBe('base');
    expect(query.status).toBe('approved');
    expect(query.page).toBe(1);
  });
});
```

### 2. 路由守卫测试

```typescript
// 路由守卫测试示例
describe('MelRouteGuard', () => {
  beforeEach(() => {
    // 模拟用户权限
    jest.spyOn(MelRouteGuard as any, 'getCurrentUserId').mockReturnValue('test-user');
  });
  
  it('should allow access to public pages', async () => {
    const route = { path: '/pages/mel/index' };
    const hasPermission = await MelRouteGuard.checkPagePermission(route);
    
    expect(hasPermission).toBe(true);
  });
  
  it('should deny access to management pages without permission', async () => {
    const route = { path: '/pages/mel/management/create' };
    jest.spyOn(MelRouteGuard.permissionManager, 'hasPermission').mockReturnValue(false);
    
    const hasPermission = await MelRouteGuard.checkPagePermission(route);
    
    expect(hasPermission).toBe(false);
  });
});
```

## 总结

MEL 模块路由配置提供了完整的路由管理功能，包括：

1. **路由结构设计**：清晰的层次结构和命名规范
2. **路由导航工具**：便捷的导航方法和参数处理
3. **路由守卫**：权限控制和参数验证
4. **路由状态管理**：状态持久化和缓存管理
5. **路由优化**：预加载和缓存策略

这些配置确保了 MEL 模块的路由系统既功能完整又性能优良。