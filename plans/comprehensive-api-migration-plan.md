# 前端RESTful API综合迁移计划

## 概述

本文档详细说明了前端如何适配后端RESTful API的变更。后端已从POST请求改为RESTful风格，同时API路径也进行了规范化。

## 核心变更

### 1. HTTP方法变更
| 操作类型 | 旧方法 | 新方法 |
|----------|--------|--------|
| 查询 | POST | GET |
| 创建 | POST | POST |
| 更新 | POST | PUT |
| 删除 | POST | DELETE |

### 2. URL路径变更
- 单数 → 复数：`/aircraft` → `/aircrafts`
- 移除冗余词汇：`/list`, `/detail`, `/create`, `/update`, `/delete`
- 使用连字符：`/flightHours` → `/flight-hours`
- 规范子资源：`/by/aircraft` → `/aircraft/:acReg`

### 3. 传参方式变更
- POST Body → GET Query参数
- POST Body中的ID → 路径参数

---

## 第一阶段：修改 request.ts

### 1.1 更新 RequestParams 类型

```typescript
export type RequestParams<T = any> = {
    url: string;
    data?: any;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';  // 新增
    showLoading?: boolean;
    loadingText?: string;
    hideErrorToast?: boolean;
    defaultValue?: T;
    auth?: boolean;
    noRetryOnFail?: boolean;
};
```

### 1.2 修改 request 函数

```typescript
export const request = async <T = any>(
    params: RequestParams<T>
): Promise<T | undefined> => {
    const {
        url,
        data,
        method = 'POST',  // 默认保持POST，向后兼容
        showLoading = false,
        loadingText = '加载中...',
        hideErrorToast = false,
        defaultValue,
        auth,
        noRetryOnFail,
    } = params;

    const hasDefaultValue = defaultValue !== undefined;

    showLoading && loadingManager.show(loadingText);

    try {
        const config: any = { url, method, data, auth, noRetryOnFail };

        // GET请求时，将data转为params
        if (method === 'GET' && data) {
            config.params = data;
            delete config.data;
        }

        const response = await instance(config);

        // 检查业务逻辑错误
        if (response.data.code) {
            const errorMessage = response.data.message || '业务处理失败';
            if (!hideErrorToast) {
                uni.showToast({ title: errorMessage, icon: 'none', duration: 3000 });
            }
            throw new Error(errorMessage);
        }
        return response?.data?.data;

    } catch (error: any) {
        // ... 错误处理逻辑保持不变
    } finally {
        if (showLoading) {
            loadingManager.hide();
        }
    }
};
```

---

## 第二阶段：修改API文件

### 2.1 aircraft.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `getAircrafts()` | `/aircraft/list` | `/shuzi/aircrafts` | GET | Query参数 |
| `getMels()` | `/me/mel` | `/shuzi/maintenance/mel` | GET | Query参数 |
| `getAircraftDetail()` | `/aircraft/detail` | `/shuzi/aircrafts/:acReg` | GET | 路径参数 |
| `getAircraftUtilization()` | `/stat/utilization` | `/shuzi/stats/utilization` | GET | Query参数 |

#### 修改示例

```typescript
// 获取飞机列表
export const getAircrafts = (): Promise<AircraftItem[]> => {
    return request({
        url: '/aircrafts',
        method: 'GET'
    }).then(data => {
        return Array.isArray(data) ? data : data?.data || [];
    });
};

// 获取MEL事件
export const getMels = (data: MelQueryDTO): Promise<MelItem[]> => {
    return request({
        url: '/maintenance/mel',
        method: 'GET',
        data
    });
};

// 获取飞机详细信息 - 使用路径参数
export const getAircraftDetail = async (acReg: string): Promise<AircraftItem> => {
    return request({
        url: `/shuzi/aircrafts/${acReg}`,
        method: 'GET'
    });
};

// 获取飞机利用率数据
export const getAircraftUtilization = async (data: { acReg?: string; startDate: string; endDate: string; type?: string }): Promise<AircraftUtilization> => {
    return request({
        url: '/stats/utilization',
        method: 'GET',
        data
    });
};
```

### 2.2 airport.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `getAirports()` | `/airport/code4` | `/shuzi/airports/code4` | GET | 无参数 |

```typescript
export const getAirports = async (): Promise<AirportCode4Response> => {
    return request({
        url: '/airports/code4',
        method: 'GET'
    });
};
```

### 2.3 duty.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `getDutyAll()` | `/duty/all` | `/duties/all` | GET | Query参数 |
| `getDutyGroups()` | `/duty/group/list` | `/system/duty-groups` | GET | Query参数 |
| `getDutyNotes()` | `/duty/note/list` | `/duties/notes` | GET | Query参数 |
| `getUserPermittedDutyGroups()` | `/duty/groups` | `/duties/groups/all` | GET | 无参数 |
| `createDutyNote()` | `/duty/note/create` | `/duties/notes` | POST | Body参数 |
| `deleteDutyNote()` | `/duty/note/delete` | `/duties/notes/:id` | DELETE | 路径参数 |

```typescript
export const getDutyAll = (data: { startDate: string; endDate: string }): Promise<DutyAllResponse> => {
    return request({
        url: '/duties/all',
        method: 'GET',
        data,
        defaultValue: {}
    });
};

export const getDutyGroups = (data: { pageSize: number }): Promise<DutyGroup[]> => {
    return request({
        url: '/system/duty-groups',
        method: 'GET',
        data,
        defaultValue: []
    });
};

export const getDutyNotes = (data: { startDate: string; endDate: string; groupId: number }): Promise<DutyNote[]> => {
    return request({
        url: '/duties/notes',
        method: 'GET',
        data,
        defaultValue: []
    });
};

export const getUserPermittedDutyGroups = (): Promise<UserDutyGroup[]> => {
    return request({
        url: '/duties/groups/all',
        method: 'GET',
        defaultValue: []
    });
};

export const createDutyNote = (data: CreateDutyNotePayload): Promise<DutyNote> => {
    return request({
        url: '/duties/notes',
        method: 'POST',
        data
    });
};

export const deleteDutyNote = (id: number): Promise<boolean> => {
    return request({
        url: `/duties/notes/${id}`,
        method: 'DELETE',
        defaultValue: false
    });
};
```

### 2.4 flight.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `getFlightsByDate()` | `/flight/date` | `/shuzi/flights/:dateKey` | GET | 路径+Query参数 |
| `getFlightsByATD()` | `/flight/atd` | `/shuzi/flights/atd` | GET | Query参数 |
| `getFlightPlan()` | `/flight/plan` | `/shuzi/flights/plan` | GET | Query参数 |
| `getRecentFlights()` | `/flight/recent-flights` | `/shuzi/flights/recent` | GET | Query参数 |
| `getFlightDetail()` | `/flight/detail` | `/shuzi/flights/:flightId` | GET | 路径参数 |

```typescript
export const getFlightsByDate = async (data: DateRangeQueryDTO & { userId?: string, idType?: string, dateKey?: string }): Promise<FlightItem[]> => {
    const { dateKey = 'date', ...params } = data;
    return request({
        url: `/shuzi/flights/${dateKey}`,
        method: 'GET',
        data: params
    });
};

export const getFlightsByATD = async (data: DateRangeQueryDTO): Promise<FlightItem[]> => {
    return request({
        url: '/flights/atd',
        method: 'GET',
        data
    });
};

export const getFlightPlan = async (data: DateRangeQueryDTO): Promise<FlightPlanStats> => {
    return request({
        url: '/flights/plan',
        method: 'GET',
        data
    });
};

export const getRecentFlights = async (data: { acReg: string; startDate: string; endDate: string }): Promise<FlightItem[]> => {
    return request({
        url: '/flights/recent',
        method: 'GET',
        data
    });
};

export const getFlightDetail = async (flightId: number): Promise<FlightItem> => {
    return request({
        url: `/shuzi/flights/${flightId}`,
        method: 'GET'
    });
};
```

### 2.5 mel.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `getMelList()` | `/mel/list` | `/mels` | GET | Query参数 |
| `getMelStats()` | `/mel/stats` | `/mels/stats` | GET | Query参数 |
| `getMelDetail()` | `/mel/detail` | `/mels/:id` | GET | 路径+Query参数 |
| `getMelByAircraft()` | `/mel/by/aircraft` | `/mels/aircraft/:acReg` | GET | 路径+Query参数 |
| `getMelByUser()` | `/mel/by/user` | `/mels/user/:userId` | GET | 路径+Query参数 |
| `getMelByDateRange()` | `/mel/by/date-range` | `/mels/date-range` | GET | Query参数 |
| `getMelByATA()` | `/mel/by/ata` | `/mels/ata` | GET | Query参数 |
| `getStatusStats()` | `/mel/stats/status` | `/mels/stats/status` | GET | Query参数 |
| `getATAStats()` | `/mel/stats/ata` | `/mels/stats/ata` | GET | Query参数 |
| `getMonthlyStats()` | `/mel/stats/monthly` | `/mels/stats/monthly` | GET | Query参数 |

```typescript
export class MelAPIService {
    static async getMelList(params: MelQueryDto): Promise<MelPageResponse> {
        return request({
            url: '/mels',
            method: 'GET',
            data: params,
            showLoading: true
        });
    }

    static async getMelStats(params: MelQueryDto): Promise<MelStatsResponse> {
        return request({
            url: '/mels/stats',
            method: 'GET',
            data: params,
            showLoading: true
        });
    }

    static async getMelDetail(params: MelDetailDto): Promise<MelDetailResponse> {
        const { id, source } = params;
        return request({
            url: `/mels/${id}`,
            method: 'GET',
            data: source ? { source } : undefined,
            showLoading: true
        });
    }

    static async getMelByAircraft(params: MelByAircraftDto): Promise<MelPageResponse> {
        const { acReg, page, size } = params;
        return request({
            url: `/mels/aircraft/${acReg}`,
            method: 'GET',
            data: { page, size },
            showLoading: true
        });
    }

    static async getMelByUser(params: MelByUserDto): Promise<MelPageResponse> {
        const { userId, userIdType, page, size } = params;
        return request({
            url: `/mels/user/${userId}`,
            method: 'GET',
            data: { userIdType, page, size },
            showLoading: true
        });
    }

    static async getMelByDateRange(params: MelByDateRangeDto): Promise<MelPageResponse> {
        return request({
            url: '/mels/date-range',
            method: 'GET',
            data: params,
            showLoading: true
        });
    }

    static async getMelByATA(params: MelByATADto): Promise<MelPageResponse> {
        return request({
            url: '/mels/ata',
            method: 'GET',
            data: params,
            showLoading: true
        });
    }

    static async getStatusStats(params: MelQueryDto): Promise<MelStatsResponse> {
        return request({
            url: '/mels/stats/status',
            method: 'GET',
            data: params,
            showLoading: true
        });
    }

    static async getATAStats(params: MelQueryDto): Promise<MelStatsResponse> {
        return request({
            url: '/mels/stats/ata',
            method: 'GET',
            data: params,
            showLoading: true
        });
    }

    static async getMonthlyStats(params: MelQueryDto): Promise<MelStatsResponse> {
        return request({
            url: '/mels/stats/monthly',
            method: 'GET',
            data: params,
            showLoading: true
        });
    }
}
```

### 2.6 permission.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `createPermission()` | `/system/permission/create` | `/system/permissions` | POST | Body参数 |
| `updatePermission()` | `/system/permission/update` | `/system/permissions/:id` | PUT | Body参数 |
| `deletePermission()` | `/system/permission/delete` | `/system/permissions/:id` | DELETE | 路径参数 |
| `getPermissionList()` | `/system/permission/list` | `/system/permissions` | GET | Query参数 |
| `getPermissionTree()` | `/system/permission/tree` | `/system/permissions/tree` | GET | 无参数 |
| `createPermissionAction()` | `/system/permission-action/create` | `/system/permissions` | POST | Body参数 |
| `updatePermissionAction()` | `/system/permission-action/update` | `/system/permissions/:id` | PUT | Body参数 |
| `deletePermissionAction()` | `/system/permission-action/delete` | `/system/permissions/:id` | DELETE | 路径参数 |
| `getPermissionActionDetail()` | `/system/permission-action/detail` | `/system/permissions/:id` | GET | 路径参数 |
| `getPermissionActionList()` | `/system/permission-action/list` | `/system/permissions` | GET | Query参数 |

```typescript
export const createPermission = async (data: Partial<Permission>): Promise<Permission> => {
    return request({
        url: '/system/permissions',
        method: 'POST',
        data
    });
};

export const updatePermission = async (data: { id: number; data: Partial<Permission> }): Promise<Permission> => {
    return request({
        url: `/system/permissions/${data.id}`,
        method: 'PUT',
        data: data.data
    });
};

export const deletePermission = async (id: number): Promise<void> => {
    return request({
        url: `/system/permissions/${id}`,
        method: 'DELETE'
    });
};

export const getPermissionList = async (data?: any): Promise<{ list: Permission[]; total: number }> => {
    return request({
        url: '/system/permissions',
        method: 'GET',
        data
    });
};

export const getPermissionTree = async (): Promise<any[]> => {
    return request({
        url: '/system/permissions/tree',
        method: 'GET'
    });
};

export const createPermissionAction = async (data: any): Promise<any> => {
    return request({
        url: '/system/permissions',
        method: 'POST',
        data
    });
};

export const updatePermissionAction = async (data: any): Promise<any> => {
    return request({
        url: `/system/permissions/${data.id}`,
        method: 'PUT',
        data: data.data
    });
};

export const deletePermissionAction = async (id: number): Promise<any> => {
    return request({
        url: `/system/permissions/${id}`,
        method: 'DELETE'
    });
};

export const getPermissionActionDetail = async (id: number): Promise<any> => {
    return request({
        url: `/system/permissions/${id}`,
        method: 'GET'
    });
};

export const getPermissionActionList = async (data?: any): Promise<any[]> => {
    return request({
        url: '/system/permissions',
        method: 'GET',
        data
    });
};
```

### 2.7 pilot.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `getPilots()` | `/pilot/list` | `/shuzi/pilots` | GET | Query参数 |
| `getPilotProfile()` | `/pilot/profile` | `/shuzi/pilots/profile` | GET | Query参数 |
| `getPilotDuty()` | `/pilot/duty` | `/shuzi/pilots/duty` | GET | Query参数 |
| `getPilotAbsence()` | `/pilot/absence` | `/shuzi/pilots/absence` | GET | Query参数 |
| `getPilotTraining()` | `/pilot/training` | `/shuzi/pilots/training` | GET | Query参数 |
| `getPilotCrewMate()` | `/pilot/crew/mate` | `/shuzi/pilots/crew/mates` | GET | Query参数 |
| `getStatCrewFh()` | `/pilot/crew/fh` | `/shuzi/pilots/crew/flight-hours` | GET | Query参数 |
| `getCrewMate()` | `/pilot/crew/mate` | `/shuzi/pilots/crew/mates` | GET | Query参数 |
| `getPilotFatigue()` | `/stat/crew/fatigue` | `/shuzi/pilots/crew/fatigue` | GET | Query参数 |

```typescript
export const getPilots = async (data?: PilotListQueryDTO): Promise<PilotListResponse> => {
    return request({
        url: '/pilots',
        method: 'GET',
        data
    });
};

export const getPilotProfile = async (data: PilotProfileQueryDTO): Promise<PilotProfile> => {
    return request({
        url: '/pilots/profile',
        method: 'GET',
        data
    });
};

export const getPilotDuty = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<PilotDutyResponse> => {
    return request({
        url: '/pilots/duty',
        method: 'GET',
        data
    });
};

export const getPilotAbsence = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<any[]> => {
    return request({
        url: '/pilots/absence',
        method: 'GET',
        data
    });
};

export const getPilotTraining = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<any[]> => {
    return request({
        url: '/pilots/training',
        method: 'GET',
        data
    });
};

export const getPilotCrewMate = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<CrewCrewMateStats[]> => {
    return request({
        url: '/pilots/crew/mates',
        method: 'GET',
        data
    });
};

export const getStatCrewFh = (data: DateRangeQueryDTO): Promise<CrewHourStats[]> => {
    return request({
        url: '/pilots/crew/flight-hours',
        method: 'GET',
        data
    });
};

export const getCrewMate = (data: CrewMateStats): Promise<CrewCrewMateStats[]> => {
    return request({
        url: '/pilots/crew/mates',
        method: 'GET',
        data
    });
};

export const getPilotFatigue = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<PilotFatigueResponse> => {
    return request({
        url: '/pilots/crew/fatigue',
        method: 'GET',
        data
    });
};
```

### 2.8 resource.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `createResource()` | `/system/resource/create` | `/system/permissions` | POST | Body参数 |
| `updateResource()` | `/system/resource/update` | `/system/permissions/:id` | PUT | Body参数 |
| `deleteResource()` | `/system/resource/delete` | `/system/permissions/:id` | DELETE | 路径参数 |
| `getResourceDetail()` | `/system/resource/detail` | `/system/permissions/:id` | GET | 路径参数 |
| `getResourceList()` | `/system/resource/list` | `/system/permissions` | GET | Query参数 |
| `getResourceTree()` | `/system/resource/tree` | `/system/permissions/tree` | GET | 无参数 |
| `batchCreateResource()` | `/system/resource/batchCreate` | `/system/permissions/batch` | POST | Body参数 |
| `batchUpdateResource()` | `/system/resource/batchUpdate` | `/system/permissions/batch` | PUT | Body参数 |
| `batchDeleteResource()` | `/system/resource/batchDelete` | `/system/permissions/batch` | DELETE | Body参数 |
| `assignResourcePermissions()` | `/system/resource/assignPermissions` | `/system/roles/:roleId/permissions` | PUT | Body参数 |
| `getResourcePermissions()` | `/system/resource/resourcePermissions` | `/system/roles/:roleId/permissions` | GET | 路径参数 |
| `getResourcePermissionIds()` | `/system/resource/resourcePermissionIds` | `/system/roles/:roleId/permissions` | GET | 路径参数 |
| `getPermissionResources()` | `/system/permission/resources` | `/system/roles/:roleId/users` | GET | 路径参数 |

```typescript
export const createResource = async (data: Partial<Resource>): Promise<Resource> => {
    return request({
        url: '/system/permissions',
        method: 'POST',
        data
    });
};

export const updateResource = async (data: { id: number; data: Partial<Resource> }): Promise<any> => {
    return request({
        url: `/system/permissions/${data.id}`,
        method: 'PUT',
        data: data.data
    });
};

export const deleteResource = async (id: number): Promise<void> => {
    return request({
        url: `/system/permissions/${id}`,
        method: 'DELETE'
    });
};

export const getResourceDetail = async (id: number): Promise<Resource> => {
    return request({
        url: `/system/permissions/${id}`,
        method: 'GET'
    });
};

export const getResourceList = async (data?: any): Promise<Resource[]> => {
    return request({
        url: '/system/permissions',
        method: 'GET',
        data
    });
};

export const getResourceTree = async (): Promise<any[]> => {
    return request({
        url: '/system/permissions/tree',
        method: 'GET'
    });
};

export const batchCreateResource = async (data: Partial<Resource>[]): Promise<Resource[]> => {
    return request({
        url: '/system/permissions/batch',
        method: 'POST',
        data
    });
};

export const batchUpdateResource = async (data: { id: number; data: Partial<Resource> }[]): Promise<Resource[]> => {
    return request({
        url: '/system/permissions/batch',
        method: 'PUT',
        data
    });
};

export const batchDeleteResource = async (ids: number[]): Promise<void> => {
    return request({
        url: '/system/permissions/batch',
        method: 'DELETE',
        data: ids
    });
};

export const assignResourcePermissions = async (data: { roleId: number; permissionIds: number[] }): Promise<void> => {
    return request({
        url: `/system/roles/${data.roleId}/permissions`,
        method: 'PUT',
        data: { permissionIds: data.permissionIds }
    });
};

export const getResourcePermissions = async (roleId: number): Promise<any[]> => {
    return request({
        url: `/system/roles/${roleId}/permissions`,
        method: 'GET'
    });
};

export const getResourcePermissionIds = async (roleId: number): Promise<number[]> => {
    return request({
        url: `/system/roles/${roleId}/permissions`,
        method: 'GET'
    });
};

export const getPermissionResources = async (roleId: number): Promise<Resource[]> => {
    return request({
        url: `/system/roles/${roleId}/users`,
        method: 'GET'
    });
};
```

### 2.9 role.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `createRole()` | `/system/role/create` | `/system/roles` | POST | Body参数 |
| `updateRole()` | `/system/role/update` | `/system/roles/:id` | PUT | Body参数 |
| `deleteRole()` | `/system/role/delete` | `/system/roles/:id` | DELETE | 路径参数 |
| `getRoleList()` | `/system/role/list` | `/system/roles` | GET | Query参数 |
| `assignPermissions()` | `/system/role/assign-permissions` | `/system/roles/:roleId/permissions` | PUT | Body参数 |
| `getRolePermissions()` | `/system/role/permissions` | `/system/roles/:roleId/permissions` | GET | 路径参数 |

```typescript
export const createRole = async (data: Partial<Role>): Promise<Role> => {
    return request({
        url: '/system/roles',
        method: 'POST',
        data
    });
};

export const updateRole = async (data: { id: number; data: Partial<Role> }): Promise<any> => {
    return request({
        url: `/system/roles/${data.id}`,
        method: 'PUT',
        data: data.data
    });
};

export const deleteRole = async (id: number): Promise<void> => {
    return request({
        url: `/system/roles/${id}`,
        method: 'DELETE'
    });
};

export const getRoleList = async (data?: any): Promise<{ list: Role[]; total: number }> => {
    return request({
        url: '/system/roles',
        method: 'GET',
        data
    });
};

export const assignPermissions = async (data: { roleId: number; permissionIds: number[] }): Promise<void> => {
    return request({
        url: `/system/roles/${data.roleId}/permissions`,
        method: 'PUT',
        data: { permissionIds: data.permissionIds }
    });
};

export const getRolePermissions = async (roleId: number): Promise<Permission[]> => {
    return request({
        url: `/system/roles/${roleId}/permissions`,
        method: 'GET'
    });
};
```

### 2.10 sms.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `getSmsStat()` | `/sms/stat` | `/shuzi/sms/stats` | GET | Query参数 |
| `getSmsEvents()` | `/sms/event/list` | `/shuzi/sms/events` | GET | Query参数 |
| `getSmsVoluntarys()` | `/sms/voluntary/list` | `/shuzi/sms/voluntary` | GET | Query参数 |

```typescript
export const getSmsStat = async (data: DateRangeQueryDTO): Promise<SmsStatResponse> => {
    return request({
        url: '/sms/stats',
        method: 'GET',
        data
    });
};

export const getSmsEvents = async (data: DateRangeQueryDTO): Promise<SmsEventItem[]> => {
    return request({
        url: '/sms/events',
        method: 'GET',
        data
    });
};

export const getSmsVoluntarys = async (data: DateRangeQueryDTO): Promise<SmsVoluntaryItem[]> => {
    return request({
        url: '/sms/voluntary',
        method: 'GET',
        data
    });
};
```

### 2.11 staff.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `getStaff()` | `/staff/list` | `/system/staffs` | GET | Query参数 |
| `getDepartments()` | `/department/list` | `/system/departments` | GET | 无参数 |
| `getDutyToday()` | `/duty/today` | `/duties/data` | GET | Query参数 |

```typescript
export const getStaff = (data?: StaffListQueryDTO): Promise<StaffProfile[]> => {
    return request({
        url: '/system/staffs',
        method: 'GET',
        data,
        defaultValue: []
    });
};

export const getDepartments = (): Promise<DepartmenItem[]> => {
    return request({
        url: '/system/departments',
        method: 'GET',
        defaultValue: []
    });
};

export const getDutyToday = (): Promise<DutyTodayResponse[]> => {
    return request({
        url: '/duties/data',
        method: 'GET',
        data: { startDate: 'today', endDate: 'today' },
        defaultValue: []
    });
};
```

### 2.12 statistics.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `getStatPeriod()` | `/stat/period` | `/shuzi/stats/summary` | GET | Query参数 |
| `getStatMonth()` | `/stat/month` | `/shuzi/stats/monthly` | GET | Query参数 |
| `getStatByAirline()` | `/stat/by/airline` | `/shuzi/stats/airline` | GET | Query参数 |
| `getStatByAircraft()` | `/stat/by/aircraft` | `/shuzi/stats/airline` | GET | Query参数 |
| `getStatByStation()` | `/stat/by/station` | `/shuzi/stats/station` | GET | Query参数 |
| `getRouteStatistics()` | `/stat/by/route` | `/shuzi/stats/route` | GET | Query参数 |

```typescript
export const getStatPeriod = (data: DateRangeQueryDTO): Promise<PeriodStats> => {
    return request({
        url: '/stats/summary',
        method: 'GET',
        data
    });
};

export const getStatMonth = (data: DateRangeQueryDTO): Promise<MonthlyStats[]> => {
    return request({
        url: '/stats/monthly',
        method: 'GET',
        data
    });
};

export const getStatByAirline = (data: DateRangeQueryDTO): Promise<AirlineStats[]> => {
    return request({
        url: '/stats/airline',
        method: 'GET',
        data
    });
};

export const getStatByAircraft = (data: DateRangeQueryDTO): Promise<any[]> => {
    return request({
        url: '/stats/airline',
        method: 'GET',
        data
    });
};

export const getStatByStation = (data: StationStatsDTO): Promise<StationStats[]> => {
    return request({
        url: '/stats/station',
        method: 'GET',
        data
    });
};

export const getRouteStatistics = async (data: RouteStatisticsQueryDTO): Promise<RouteStatistics> => {
    return request({
        url: '/stats/route',
        method: 'GET',
        data
    });
};
```

### 2.13 user.api.ts

| 函数名 | 旧URL | 新URL | 方法 | 参数处理 |
|--------|-------|-------|------|----------|
| `initUser()` | `/user/init` | `/system/users/init` | GET | 无参数 |
| `login()` | `/login/wx` | `/login/wx` | POST | Body参数 |
| `activate()` | `/login/activate` | `/login/activate` | POST | Body参数 |
| `getUserProfile()` | `/user/profile` | `/system/staffs/:userId/profile` | GET | 路径参数 |
| `getStaffList()` | `/staff/list` | `/system/staffs` | GET | Query参数 |
| `getUserRoles()` | `/user/userRoles` | `/system/users/:userId/roles` | GET | 路径参数 |
| `getUserPermissionCodes()` | `/user/userPermissionCodes` | `/system/permissions/users/:userId/permission-codes` | GET | 路径参数 |
| `checkUserPermission()` | `/user/hasPermission` | `/system/permissions/users/:userId/has-permission/:code` | GET | 路径参数 |
| `checkUserRole()` | `/user/hasRole` | `/system/roles/users/:userId/has-role/:code` | GET | 路径参数 |
| `assignRolesToUser()` | `/user/assignRoles` | `/system/roles/users/:userId/roles` | PUT | Body参数 |
| `getUserPermissions()` | `/user/userPermissions` | `/system/permissions/users/:userId/permissions` | GET | 路径参数 |
| `confirmQrLogin()` | `/login/qr/confirm` | `/login/qr/confirm` | POST | Body参数 |
| `getServerStatus()` | `/login/health` | `/login/health` | GET | 无参数 |

```typescript
export const initUser = (): Promise<UserInitResponse> => {
    return request({
        url: '/system/users/init',
        method: 'GET'
    });
};

export const login = (code: string): Promise<{ token: string }> => {
    return request({
        url: '/login/wx',
        method: 'POST',
        data: { code }
    });
};

export const activate = (data: WxActivateDTO): Promise<{ token: string }> => {
    return request({
        url: '/login/activate',
        method: 'POST',
        data
    });
};

export const getUserProfile = (userId: string): Promise<any> => {
    return request({
        url: `/system/staffs/${userId}/profile`,
        method: 'GET',
        defaultValue: null
    });
};

export const getStaffList = (data?: any): Promise<UserItem[]> => {
    return request({
        url: '/system/staffs',
        method: 'GET',
        data,
        defaultValue: []
    });
};

export const getUserRoles = (userId: string): Promise<string[]> => {
    return request({
        url: `/system/users/${userId}/roles`,
        method: 'GET',
        defaultValue: []
    });
};

export const getUserPermissionCodes = (userId: string): Promise<string[]> => {
    return request({
        url: `/system/permissions/users/${userId}/permission-codes`,
        method: 'GET',
        defaultValue: []
    });
};

export const checkUserPermission = (data: { userId: string; permissionCode: string }): Promise<boolean> => {
    return request({
        url: `/system/permissions/users/${data.userId}/has-permission/${data.permissionCode}`,
        method: 'GET',
        defaultValue: false
    });
};

export const checkUserRole = (data: { userId: string; roleCode: string }): Promise<boolean> => {
    return request({
        url: `/system/roles/users/${data.userId}/has-role/${data.roleCode}`,
        method: 'GET',
        defaultValue: false
    });
};

export const assignRolesToUser = (data: { userId: string; roleIds: number[] }): Promise<void> => {
    return request({
        url: `/system/roles/users/${data.userId}/roles`,
        method: 'PUT',
        data: { roleIds: data.roleIds }
    });
};

export const getUserPermissions = (userId: string): Promise<any[]> => {
    return request({
        url: `/system/permissions/users/${userId}/permissions`,
        method: 'GET',
        defaultValue: []
    });
};

export const confirmQrLogin = (ticketId: string): Promise<any> => {
    return request({
        url: '/login/qr/confirm',
        method: 'POST',
        data: { ticketId }
    });
};

export const getServerStatus = () => {
    return request<{ message: string }>({
        url: '/login/health',
        method: 'GET',
        auth: false,
        hideErrorToast: true,
        noRetryOnFail: true,
        defaultValue: { message: '无法连接到服务器，请检查您的网络连接。' }
    });
};
```

---

## 第三阶段：实施计划

### 3.1 优先级排序

**高优先级（核心功能）**
1. [`request.ts`](src/utils/request.ts:1) - 核心请求函数
2. [`user.api.ts`](src/api/user.api.ts:1) - 用户认证和初始化
3. [`aircraft.api.ts`](src/api/aircraft.api.ts:1) - 飞机相关

**中优先级（业务功能）**
4. [`mel.api.ts`](src/api/mel.api.ts:1) - MEL相关
5. [`flight.api.ts`](src/api/flight.api.ts:1) - 航班相关
6. [`duty.api.ts`](src/api/duty.api.ts:1) - 值班相关
7. [`statistics.api.ts`](src/api/statistics.api.ts:1) - 统计相关
8. [`pilot.api.ts`](src/api/pilot.api.ts:1) - 飞行员相关

**低优先级（管理功能）**
9. [`role.api.ts`](src/api/role.api.ts:1) - 角色相关
10. [`permission.api.ts`](src/api/permission.api.ts:1) - 权限相关
11. [`resource.api.ts`](src/api/resource.api.ts:1) - 资源相关
12. [`airport.api.ts`](src/api/airport.api.ts:1) - 机场相关
13. [`staff.api.ts`](src/api/staff.api.ts:1) - 员工相关
14. [`sms.api.ts`](src/api/sms.api.ts:1) - SMS相关

### 3.2 实施步骤

1. **修改 request.ts**
   - 更新 RequestParams 类型
   - 修改 request 函数支持动态HTTP方法
   - 处理GET请求的参数转换

2. **按优先级修改API文件**
   - 每个文件独立修改
   - 修改后进行测试验证

3. **测试验证**
   - 单元测试各个API调用
   - 集成测试验证前后端对接
   - 回归测试确保功能正常

---

## 注意事项

1. **向后兼容**：默认保持 POST 方法，确保现有代码不受影响
2. **参数处理**：GET 请求需要将 data 转换为 params
3. **路径参数**：需要将ID等参数从data中提取到URL路径中
4. **错误处理**：确保不同HTTP方法的错误处理一致
5. **Token刷新**：401错误处理逻辑需要适配所有HTTP方法
6. **测试覆盖**：确保所有修改的API都有测试覆盖
7. **API前缀**：如果后端启用 `/api/v1` 前缀，需要在配置中添加

---

## 总结

本迁移计划详细说明了前端如何适配后端RESTful API的变更。主要工作包括：

1. 修改 [`request.ts`](src/utils/request.ts:1) 支持动态HTTP方法
2. 修改所有API文件，更新URL路径和HTTP方法
3. 处理参数传递方式的变更（Body → Query/路径参数）

推荐采用渐进式迁移策略，按优先级逐步实施，确保系统稳定性。
