# RESTful API 迁移计划

## 问题分析

### 当前状态
前端 [`request.ts`](src/utils/request.ts:1) 的默认配置是：
```typescript
const option: AxiosRequestConfig = {
    baseURL: CONFIG.url.api,
    method: 'POST',  // 默认使用 POST 方法
    timeout: CONFIG.url.timeout,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    // ...
}
```

### 问题
所有API调用都使用POST方法，但后端已经改为RESTful风格，需要支持GET、POST、PUT、DELETE等HTTP方法。

## API 调用分类分析

### 1. 查询类操作 (应使用 GET)

#### [`aircraft.api.ts`](src/api/aircraft.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getAircrafts()` | `/aircraft/list` | GET `/aircraft/list` |
| `getMels()` | `/me/mel` | GET `/me/mel` |
| `getAircraftDetail()` | `/aircraft/detail` | GET `/aircraft/detail` |
| `getAircraftUtilization()` | `/stat/utilization` | GET `/stat/utilization` |

#### [`mel.api.ts`](src/api/mel.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getMelList()` | `/mel/list` | GET `/mel/list` |
| `getMelStats()` | `/mel/stats` | GET `/mel/stats` |
| `getMelDetail()` | `/mel/detail` | GET `/mel/detail` |
| `getMelByAircraft()` | `/mel/by/aircraft` | GET `/mel/by/aircraft` |
| `getMelByUser()` | `/mel/by/user` | GET `/mel/by/user` |
| `getMelByDateRange()` | `/mel/by/date-range` | GET `/mel/by/date-range` |
| `getMelByATA()` | `/mel/by/ata` | GET `/mel/by/ata` |
| `getStatusStats()` | `/mel/stats/status` | GET `/mel/stats/status` |
| `getATAStats()` | `/mel/stats/ata` | GET `/mel/stats/ata` |
| `getMonthlyStats()` | `/mel/stats/monthly` | GET `/mel/stats/monthly` |

#### [`user.api.ts`](src/api/user.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `initUser()` | `/user/init` | GET `/user/init` |
| `getUserProfile()` | `/user/profile` | GET `/user/profile` |
| `getStaffList()` | `/staff/list` | GET `/staff/list` |
| `getUserRoles()` | `/user/userRoles` | GET `/user/userRoles` |
| `getUserPermissionCodes()` | `/user/userPermissionCodes` | GET `/user/userPermissionCodes` |
| `checkUserPermission()` | `/user/hasPermission` | GET `/user/hasPermission` |
| `checkUserRole()` | `/user/hasRole` | GET `/user/hasRole` |
| `getUserPermissions()` | `/user/userPermissions` | GET `/user/userPermissions` |
| `getServerStatus()` | `/login/health` | GET `/login/health` |

#### [`flight.api.ts`](src/api/flight.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getFlightsByDate()` | `/flight/date` | GET `/flight/date` |
| `getFlightsByATD()` | `/flight/atd` | GET `/flight/atd` |
| `getFlightPlan()` | `/flight/plan` | GET `/flight/plan` |
| `getRecentFlights()` | `/flight/recent-flights` | GET `/flight/recent-flights` |
| `getFlightDetail()` | `/flight/detail` | GET `/flight/detail` |

#### [`duty.api.ts`](src/api/duty.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getDutyAll()` | `/duty/all` | GET `/duty/all` |
| `getDutyGroups()` | `/duty/group/list` | GET `/duty/group/list` |
| `getDutyNotes()` | `/duty/note/list` | GET `/duty/note/list` |
| `getUserPermittedDutyGroups()` | `/duty/groups` | GET `/duty/groups` |
| `getMyDutyNotes()` | `/duty/note/list` | GET `/duty/note/list` |

#### [`statistics.api.ts`](src/api/statistics.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getStatPeriod()` | `/stat/period` | GET `/stat/period` |
| `getStatMonth()` | `/stat/month` | GET `/stat/month` |
| `getStatByAirline()` | `/stat/by/airline` | GET `/stat/by/airline` |
| `getStatByAircraft()` | `/stat/by/aircraft` | GET `/stat/by/aircraft` |
| `getStatByStation()` | `/stat/by/station` | GET `/stat/by/station` |
| `getRouteStatistics()` | `/stat/by/route` | GET `/stat/by/route` |

#### [`pilot.api.ts`](src/api/pilot.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getPilots()` | `/pilot/list` | GET `/pilot/list` |
| `getPilotProfile()` | `/pilot/profile` | GET `/pilot/profile` |
| `getPilotDuty()` | `/pilot/duty` | GET `/pilot/duty` |
| `getPilotAbsence()` | `/pilot/absence` | GET `/pilot/absence` |
| `getPilotTraining()` | `/pilot/training` | GET `/pilot/training` |
| `getPilotCrewMate()` | `/stat/crew/mate` | GET `/stat/crew/mate` |
| `getStatCrewFh()` | `/pilot/crew/fh` | GET `/pilot/crew/fh` |
| `getCrewMate()` | `/pilot/crew/mate` | GET `/pilot/crew/mate` |
| `getPilotFatigue()` | `/stat/crew/fatigue` | GET `/stat/crew/fatigue` |

#### [`role.api.ts`](src/api/role.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getRoleList()` | `/system/role/list` | GET `/system/role/list` |
| `getRolePermissions()` | `/system/role/permissions` | GET `/system/role/permissions` |

#### [`permission.api.ts`](src/api/permission.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getPermissionList()` | `/system/permission/list` | GET `/system/permission/list` |
| `getPermissionTree()` | `/system/permission/tree` | GET `/system/permission/tree` |
| `getPermissionActionList()` | `/system/permission-action/list` | GET `/system/permission-action/list` |
| `getPermissionActionDetail()` | `/system/permission-action/detail` | GET `/system/permission-action/detail` |

#### [`airport.api.ts`](src/api/airport.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getAirports()` | `/airport/code4` | GET `/airport/code4` |

#### [`staff.api.ts`](src/api/staff.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getStaff()` | `/staff/list` | GET `/staff/list` |
| `getDepartments()` | `/department/list` | GET `/department/list` |
| `getDutyToday()` | `/duty/today` | GET `/duty/today` |

#### [`sms.api.ts`](src/api/sms.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getSmsStat()` | `/sms/stat` | GET `/sms/stat` |
| `getSmsEvents()` | `/sms/event/list` | GET `/sms/event/list` |
| `getSmsVoluntarys()` | `/sms/voluntary/list` | GET `/sms/voluntary/list` |

#### [`resource.api.ts`](src/api/resource.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `getResourceDetail()` | `/system/resource/detail` | GET `/system/resource/detail` |
| `getResourceList()` | `/system/resource/list` | GET `/system/resource/list` |
| `getResourceTree()` | `/system/resource/tree` | GET `/system/resource/tree` |
| `getResourcePermissions()` | `/system/resource/resourcePermissions` | GET `/system/resource/resourcePermissions` |
| `getResourcePermissionIds()` | `/system/resource/resourcePermissionIds` | GET `/system/resource/resourcePermissionIds` |
| `getPermissionResources()` | `/system/permission/resources` | GET `/system/permission/resources` |

### 2. 创建类操作 (应使用 POST)

#### [`user.api.ts`](src/api/user.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `login()` | `/login/wx` | POST `/login/wx` |
| `activate()` | `/login/activate` | POST `/login/activate` |
| `confirmQrLogin()` | `/login/qr/confirm` | POST `/login/qr/confirm` |

#### [`duty.api.ts`](src/api/duty.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `createDutyNote()` | `/duty/note/create` | POST `/duty/note/create` |

#### [`role.api.ts`](src/api/role.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `createRole()` | `/system/role/create` | POST `/system/role/create` |
| `assignPermissions()` | `/system/role/assign-permissions` | POST `/system/role/assign-permissions` |

#### [`permission.api.ts`](src/api/permission.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `createPermission()` | `/system/permission/create` | POST `/system/permission/create` |
| `createPermissionAction()` | `/system/permission-action/create` | POST `/system/permission-action/create` |

#### [`resource.api.ts`](src/api/resource.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `createResource()` | `/system/resource/create` | POST `/system/resource/create` |
| `batchCreateResource()` | `/system/resource/batchCreate` | POST `/system/resource/batchCreate` |
| `assignResourcePermissions()` | `/system/resource/assignPermissions` | POST `/system/resource/assignPermissions` |

### 3. 更新类操作 (应使用 PUT)

#### [`role.api.ts`](src/api/role.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `updateRole()` | `/system/role/update` | PUT `/system/role/update` |

#### [`permission.api.ts`](src/api/permission.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `updatePermission()` | `/system/permission/update` | PUT `/system/permission/update` |
| `updatePermissionAction()` | `/system/permission-action/update` | PUT `/system/permission-action/update` |

#### [`resource.api.ts`](src/api/resource.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `updateResource()` | `/system/resource/update` | PUT `/system/resource/update` |
| `batchUpdateResource()` | `/system/resource/batchUpdate` | PUT `/system/resource/batchUpdate` |

### 4. 删除类操作 (应使用 DELETE)

#### [`role.api.ts`](src/api/role.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `deleteRole()` | `/system/role/delete` | DELETE `/system/role/delete` |

#### [`permission.api.ts`](src/api/permission.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `deletePermission()` | `/system/permission/delete` | DELETE `/system/permission/delete` |
| `deletePermissionAction()` | `/system/permission-action/delete` | DELETE `/system/permission-action/delete` |

#### [`resource.api.ts`](src/api/resource.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `deleteResource()` | `/system/resource/delete` | DELETE `/system/resource/delete` |
| `batchDeleteResource()` | `/system/resource/batchDelete` | DELETE `/system/resource/batchDelete` |

#### [`duty.api.ts`](src/api/duty.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `deleteDutyNote()` | `/duty/note/delete` | DELETE `/duty/note/delete` |

### 5. 特殊操作 (保持 POST)

#### [`user.api.ts`](src/api/user.api.ts:1)
| API函数 | 当前URL | 应改为 |
|---------|---------|--------|
| `assignRolesToUser()` | `/user/assignRoles` | POST `/user/assignRoles` |

## 迁移方案

### 方案一：修改 request.ts 支持动态方法（推荐）

#### 优点
- 灵活性高，可以支持任意HTTP方法
- 符合RESTful规范
- 代码改动最小

#### 实施步骤

1. **修改 [`request.ts`](src/utils/request.ts:1) 的 RequestParams 类型**
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

2. **修改 request 函数**
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

       // ...

       try {
           const config: any = { url, method, data, auth, noRetryOnFail };
           // GET请求时，将data转为params
           if (method === 'GET' && data) {
               config.params = data;
               delete config.data;
           }
           const response = await instance(config);
           // ...
       }
   }
   ```

3. **修改各个API文件中的调用**
   - 查询类操作添加 `method: 'GET'`
   - 创建类操作保持默认或显式指定 `method: 'POST'`
   - 更新类操作添加 `method: 'PUT'`
   - 删除类操作添加 `method: 'DELETE'`

### 方案二：创建专用的请求方法

#### 优点
- 语义更清晰
- 类型安全

#### 缺点
- 需要修改更多代码
- 可能破坏现有代码

#### 实施步骤

1. **在 request.ts 中添加专用方法**
   ```typescript
   export const get = <T = any>(params: Omit<RequestParams<T>, 'method'>) =>
       request<T>({ ...params, method: 'GET' });

   export const post = <T = any>(params: Omit<RequestParams<T>, 'method'>) =>
       request<T>({ ...params, method: 'POST' });

   export const put = <T = any>(params: Omit<RequestParams<T>, 'method'>) =>
       request<T>({ ...params, method: 'PUT' });

   export const del = <T = any>(params: Omit<RequestParams<T>, 'method'>) =>
       request<T>({ ...params, method: 'DELETE' });
   ```

2. **修改各个API文件使用专用方法**

## 推荐方案

**推荐使用方案一**，原因：
1. 改动最小，风险最低
2. 向后兼容，默认保持POST
3. 灵活性高，可以逐步迁移
4. 不需要修改所有API调用代码

## 实施计划

### 阶段一：修改 request.ts
1. 更新 RequestParams 类型，添加 method 参数
2. 修改 request 函数，支持动态HTTP方法
3. 处理 GET 请求的参数转换（data -> params）

### 阶段二：修改 API 文件
按优先级修改各个API文件：

**高优先级（核心功能）**
1. [`user.api.ts`](src/api/user.api.ts:1) - 用户相关
2. [`aircraft.api.ts`](src/api/aircraft.api.ts:1) - 飞机相关
3. [`mel.api.ts`](src/api/mel.api.ts:1) - MEL相关

**中优先级（业务功能）**
4. [`flight.api.ts`](src/api/flight.api.ts:1) - 航班相关
5. [`duty.api.ts`](src/api/duty.api.ts:1) - 值班相关
6. [`statistics.api.ts`](src/api/statistics.api.ts:1) - 统计相关
7. [`pilot.api.ts`](src/api/pilot.api.ts:1) - 飞行员相关

**低优先级（管理功能）**
8. [`role.api.ts`](src/api/role.api.ts:1) - 角色相关
9. [`permission.api.ts`](src/api/permission.api.ts:1) - 权限相关
10. [`resource.api.ts`](src/api/resource.api.ts:1) - 资源相关
11. [`airport.api.ts`](src/api/airport.api.ts:1) - 机场相关
12. [`staff.api.ts`](src/api/staff.api.ts:1) - 员工相关
13. [`sms.api.ts`](src/api/sms.api.ts:1) - SMS相关

### 阶段三：测试验证
1. 单元测试各个API调用
2. 集成测试验证前后端对接
3. 回归测试确保功能正常

## 注意事项

1. **向后兼容**：默认保持 POST 方法，确保现有代码不受影响
2. **参数处理**：GET 请求需要将 data 转换为 params
3. **错误处理**：确保不同HTTP方法的错误处理一致
4. **Token刷新**：401错误处理逻辑需要适配所有HTTP方法
5. **测试覆盖**：确保所有修改的API都有测试覆盖

## 总结

当前前端代码**无法直接支持**RESTful风格的API，需要进行以下修改：

1. **核心修改**：修改 [`request.ts`](src/utils/request.ts:1) 支持动态HTTP方法
2. **API修改**：更新所有API调用，根据操作类型指定正确的HTTP方法
3. **测试验证**：确保所有API调用正常工作

推荐采用**方案一**（修改 request.ts 支持动态方法），因为改动最小、风险最低、向后兼容。
