# 前端API调用映射表

## 说明

本文档将前端旧的API调用方式映射到后端新的RESTful API调用方式。

**注意**：后端已配置 `globalPrefix: '/api/v1'`（当前在 `config.default.ts` 中被注释），启用后所有API路径前需要加上 `/api/v1`。

---

## 一、aircraft.api.ts - 飞机相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/aircraft/list` | `/shuzi/aircrafts` | GET | Query参数 |
| `/me/mel` | `/shuzi/maintenance/mel` | GET | Query参数 |
| `/aircraft/detail` | `/shuzi/aircrafts/:acReg` | GET | 路径参数 |
| `/stat/utilization` | `/shuzi/stats/utilization` | GET | Query参数 |

### 详细说明

#### 1. 获取飞机列表
```typescript
// 旧方式
POST /aircraft/list

// 新方式
GET /shuzi/aircrafts
```

#### 2. 获取MEL事件
```typescript
// 旧方式
POST /me/mel

// 新方式
GET /shuzi/maintenance/mel
```

#### 3. 获取飞机详细信息
```typescript
// 旧方式
POST /aircraft/detail
Body: { acReg: string }

// 新方式
GET /shuzi/aircrafts/:acReg
```

#### 4. 获取飞机利用率数据
```typescript
// 旧方式
POST /stat/utilization
Body: { startDate, endDate, acReg?, type? }

// 新方式
GET /shuzi/stats/utilization?startDate=xxx&endDate=xxx&acReg=xxx&type=xxx
```

---

## 二、airport.api.ts - 机场相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/airport/code4` | `/shuzi/airports/code4` | GET | 无参数 |

### 详细说明

#### 获取机场列表
```typescript
// 旧方式
POST /airport/code4

// 新方式
GET /shuzi/airports/code4
```

---

## 三、duty.api.ts - 值班相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/duty/all` | `/duties/all` | GET | Query参数 |
| `/duty/group/list` | `/system/duty-groups` | GET | Query参数 |
| `/duty/note/list` | `/duties/notes` | GET | Query参数 |
| `/duty/groups` | `/duties/groups/all` | GET | 无参数 |
| `/duty/note/create` | `/duties/notes` | POST | Body参数 |
| `/duty/note/delete` | `/duties/notes/:id` | DEL | 路径参数 |

### 详细说明

#### 1. 获取一段时间内所有人的排班情况
```typescript
// 旧方式
POST /duty/all
Body: { startDate, endDate }

// 新方式
GET /duties/all?startDate=xxx&endDate=xxx
```

#### 2. 获取排班组列表
```typescript
// 旧方式
POST /duty/group/list

// 新方式
GET /system/duty-groups?page=1&pageSize=20&search=xxx
```

#### 3. 获取指定值班组的交接日志列表
```typescript
// 旧方式
POST /duty/note/list
Body: { groupId, startDate, endDate }

// 新方式
GET /duties/notes?groupId=xxx&startDate=xxx&endDate=xxx
```

#### 4. 获取当前用户有权限的排班组
```typescript
// 旧方式
POST /duty/groups

// 新方式
GET /duties/groups/all
```

#### 5. 创建新的交接日志
```typescript
// 旧方式
POST /duty/note/create
Body: { scheduleDate, content, level, groupId }

// 新方式
POST /duties/notes
Body: { scheduleDate, content, level, groupId }
```

#### 6. 删除指定的交接日志
```typescript
// 旧方式
POST /duty/note/delete
Body: { id }

// 新方式
DEL /duties/notes/:id
```

---

## 四、flight.api.ts - 航班相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/flight/date` | `/shuzi/flights/:dateKey` | GET | 路径+Query参数 |
| `/flight/atd` | `/shuzi/flights/atd` | GET | Query参数 |
| `/flight/plan` | `/shuzi/flights/plan` | GET | Query参数 |
| `/flight/recent-flights` | `/shuzi/flights/recent` | GET | Query参数 |
| `/flight/detail` | `/shuzi/flights/:flightId` | GET | 路径参数 |

### 详细说明

#### 1. 根据日期获取航班
```typescript
// 旧方式
POST /flight/date
Body: { dateKey, startDate?, endDate? }

// 新方式
GET /shuzi/flights/:dateKey?startDate=xxx&endDate=xxx
// dateKey 可选值: date, std, etd, atd, htd, sta, eta, ata, hta
```

#### 2. 根据ATD获取航班
```typescript
// 旧方式
POST /flight/atd
Body: { startDate?, endDate? }

// 新方式
GET /shuzi/flights/atd?startDate=xxx&endDate=xxx
```

#### 3. 获取航班计划
```typescript
// 旧方式
POST /flight/plan
Body: { startDate?, endDate? }

// 新方式
GET /shuzi/flights/plan?startDate=xxx&endDate=xxx
```

#### 4. 获取最近执飞航班列表
```typescript
// 旧方式
POST /flight/recent-flights
Body: { acReg?, startDate?, endDate? }

// 新方式
GET /shuzi/flights/recent?acReg=xxx&startDate=xxx&endDate=xxx
```

#### 5. 获取航班详细信息
```typescript
// 旧方式
POST /flight/detail
Body: { flightId }

// 新方式
GET /shuzi/flights/:flightId
```

---

## 五、mel.api.ts - MEL相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/mel/list` | `/mels` | GET | Query参数 |
| `/mel/stats` | `/mels/stats` | GET | Query参数 |
| `/mel/detail` | `/mels/:id` | GET | 路径+Query参数 |
| `/mel/by/aircraft` | `/mels/aircraft/:acReg` | GET | 路径+Query参数 |
| `/mel/by/user` | `/mels/user/:userId` | GET | 路径+Query参数 |
| `/mel/by/date-range` | `/mels/date-range` | GET | Query参数 |
| `/mel/by/ata` | `/mels/ata` | GET | Query参数 |
| `/mel/stats/status` | `/mels/stats/status` | GET | Query参数 |
| `/mel/stats/ata` | `/mels/stats/ata` | GET | Query参数 |
| `/mel/stats/monthly` | `/mels/stats/monthly` | GET | Query参数 |

### 详细说明

#### 1. 通用查询接口，支持所有查询条件
```typescript
// 旧方式
POST /mel/list
Body: { acReg?, startDate?, endDate?, dateType?, userId?, userIdType?, melNo?, ddfNo?, ata1?, ata2?, acType?, deffer?, type?, status?, page?, size? }

// 新方式
GET /mels?acReg=xxx&startDate=xxx&endDate=xxx&dateType=xxx&userId=xxx&userIdType=xxx&melNo=xxx&ddfNo=xxx&ata1=xxx&ata2=xxx&acType=xxx&deffer=xxx&type=xxx&status=xxx&page=1&size=10
```

#### 2. 获取MEL统计数据
```typescript
// 旧方式
POST /mel/stats
Body: { ...查询参数 }

// 新方式
GET /mels/stats?acReg=xxx&startDate=xxx&endDate=xxx...
```

#### 3. 获取单个MEL记录详情
```typescript
// 旧方式
POST /mel/detail
Body: { id, source? }

// 新方式
GET /mels/:id?source=xxx
```

#### 4. 根据飞机号查询
```typescript
// 旧方式
POST /mel/by/aircraft
Body: { acReg, page?, size? }

// 新方式
GET /mels/aircraft/:acReg?page=1&size=10
```

#### 5. 根据用户查询
```typescript
// 旧方式
POST /mel/by/user
Body: { userId, userIdType?, page?, size? }

// 新方式
GET /mels/user/:userId?userIdType=xxx&page=1&size=10
```

#### 6. 根据日期范围查询
```typescript
// 旧方式
POST /mel/by/date-range
Body: { startDate, endDate, dateType?, page?, size? }

// 新方式
GET /mels/date-range?startDate=xxx&endDate=xxx&dateType=xxx&page=1&size=10
```

#### 7. 根据ATA章节查询
```typescript
// 旧方式
POST /mel/by/ata
Body: { ata1?, ata2?, page?, size? }

// 新方式
GET /mels/ata?ata1=xxx&ata2=xxx&page=1&size=10
```

#### 8. 获取状态分布统计
```typescript
// 旧方式
POST /mel/stats/status
Body: { ...查询参数 }

// 新方式
GET /mels/stats/status?acReg=xxx&startDate=xxx...
```

#### 9. 获取ATA章节分布统计
```typescript
// 旧方式
POST /mel/stats/ata
Body: { ...查询参数 }

// 新方式
GET /mels/stats/ata?acReg=xxx&startDate=xxx...
```

#### 10. 获取月度统计
```typescript
// 旧方式
POST /mel/stats/monthly
Body: { ...查询参数 }

// 新方式
GET /mels/stats/monthly?acReg=xxx&startDate=xxx...
```

---

## 六、permission.api.ts - 权限相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/system/permission/create` | `/system/permissions` | POST | Body参数 |
| `/system/permission/update` | `/system/permissions/:id` | PUT | Body参数 |
| `/system/permission/delete` | `/system/permissions/:id` | DEL | 路径参数 |
| `/system/permission/list` | `/system/permissions` | GET | Query参数 |
| `/system/permission/tree` | `/system/permissions/tree` | GET | 无参数 |
| `/system/permission-action/create` | `/system/permissions` | POST | Body参数 |
| `/system/permission-action/update` | `/system/permissions/:id` | PUT | Body参数 |
| `/system/permission-action/delete` | `/system/permissions/:id` | DEL | 路径参数 |
| `/system/permission-action/detail` | `/system/permissions/:id` | GET | 路径参数 |
| `/system/permission-action/list` | `/system/permissions` | GET | Query参数 |

### 详细说明

#### 1. 创建权限
```typescript
// 旧方式
POST /system/permission/create
Body: { data: Partial<Permission> }

// 新方式
POST /system/permissions
Body: { data: Partial<Permission> }
```

#### 2. 更新权限
```typescript
// 旧方式
POST /system/permission/update
Body: { id, data: Partial<Permission> }

// 新方式
PUT /system/permissions/:id
Body: { data: Partial<Permission> }
```

#### 3. 删除权限
```typescript
// 旧方式
POST /system/permission/delete
Body: { id }

// 新方式
DEL /system/permissions/:id
```

#### 4. 获取权限列表
```typescript
// 旧方式
POST /system/permission/list
Body: { ...查询参数 }

// 新方式
GET /system/permissions?name=xxx&code=xxx&type=xxx&page=1&pageSize=10
```

#### 5. 获取权限树
```typescript
// 旧方式
POST /system/permission/tree

// 新方式
GET /system/permissions/tree
```

#### 6. 创建权限操作
```typescript
// 旧方式
POST /system/permission-action/create
Body: { data: Partial<Permission> }

// 新方式
POST /system/permissions
Body: { data: Partial<Permission> }
```

#### 7. 更新权限操作
```typescript
// 旧方式
POST /system/permission-action/update
Body: { id, data: Partial<Permission> }

// 新方式
PUT /system/permissions/:id
Body: { data: Partial<Permission> }
```

#### 8. 删除权限操作
```typescript
// 旧方式
POST /system/permission-action/delete
Body: { id }

// 新方式
DEL /system/permissions/:id
```

#### 9. 获取权限操作详情
```typescript
// 旧方式
POST /system/permission-action/detail
Body: { id }

// 新方式
GET /system/permissions/:id
```

#### 10. 获取权限操作列表
```typescript
// 旧方式
POST /system/permission-action/list
Body: { ...查询参数 }

// 新方式
GET /system/permissions?name=xxx&code=xxx&type=xxx&page=1&pageSize=10
```

---

## 七、pilot.api.ts - 飞行员相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/pilot/list` | `/shuzi/pilots` | GET | Query参数 |
| `/pilot/profile` | `/shuzi/pilots/profile` | GET | Query参数 |
| `/pilot/duty` | `/shuzi/pilots/duty` | GET | Query参数 |
| `/pilot/absence` | `/shuzi/pilots/absence` | GET | Query参数 |
| `/pilot/training` | `/shuzi/pilots/training` | GET | Query参数 |
| `/pilot/crew/fh` | `/shuzi/pilots/crew/flight-hours` | GET | Query参数 |
| `/pilot/crew/mate` | `/shuzi/pilots/crew/mates` | GET | Query参数 |
| `/stat/crew/mate` | `/shuzi/pilots/crew/mates` | GET | Query参数 |
| `/stat/crew/fatigue` | `/shuzi/pilots/crew/fatigue` | GET | Query参数 |

### 详细说明

#### 1. 获取飞行员列表
```typescript
// 旧方式
POST /pilot/list

// 新方式
GET /shuzi/pilots
```

#### 2. 获取飞行员信息
```typescript
// 旧方式
POST /pilot/profile
Body: { userId, idType? }

// 新方式
GET /shuzi/pilots/profile?userId=xxx&idType=xxx
// idType 可选值: pcode, userId
```

#### 3. 获取飞行员值班信息
```typescript
// 旧方式
POST /pilot/duty
Body: { userId, idType?, startDate?, endDate? }

// 新方式
GET /shuzi/pilots/duty?userId=xxx&idType=xxx&startDate=xxx&endDate=xxx
```

#### 4. 获取飞行员缺勤信息
```typescript
// 旧方式
POST /pilot/absence
Body: { userId, idType?, startDate?, endDate? }

// 新方式
GET /shuzi/pilots/absence?userId=xxx&idType=xxx&startDate=xxx&endDate=xxx
```

#### 5. 获取飞行员培训信息
```typescript
// 旧方式
POST /pilot/training
Body: { userId, idType?, startDate?, endDate? }

// 新方式
GET /shuzi/pilots/training?userId=xxx&idType=xxx&startDate=xxx&endDate=xxx
```

#### 6. 获取机组飞行小时统计
```typescript
// 旧方式
POST /pilot/crew/fh
Body: { startDate?, endDate? }

// 新方式
GET /shuzi/pilots/crew/flight-hours?startDate=xxx&endDate=xxx
```

#### 7. 获取飞行员机搭子信息
```typescript
// 旧方式
POST /pilot/crew/mate
Body: { pcode, startDate?, endDate? }

// 新方式
GET /shuzi/pilots/crew/mates?pcode=xxx&startDate=xxx&endDate=xxx
```

#### 8. 获取机组同事统计
```typescript
// 旧方式
POST /stat/crew/mate
Body: { pcode, startDate?, endDate? }

// 新方式
GET /shuzi/pilots/crew/mates?pcode=xxx&startDate=xxx&endDate=xxx
```

#### 9. 获取飞行员疲劳信息
```typescript
// 旧方式
POST /stat/crew/fatigue
Body: { pcode, startDate?, endDate? }

// 新方式
GET /shuzi/pilots/crew/fatigue?pcode=xxx&startDate=xxx&endDate=xxx
```

---

## 八、resource.api.ts - 资源相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/system/resource/create` | `/system/permissions` | POST | Body参数 |
| `/system/resource/update` | `/system/permissions/:id` | PUT | Body参数 |
| `/system/resource/delete` | `/system/permissions/:id` | DEL | 路径参数 |
| `/system/resource/detail` | `/system/permissions/:id` | GET | 路径参数 |
| `/system/resource/list` | `/system/permissions` | GET | Query参数 |
| `/system/resource/tree` | `/system/permissions/tree` | GET | 无参数 |
| `/system/resource/batchCreate` | `/system/permissions/batch` | POST | Body参数 |
| `/system/resource/batchUpdate` | `/system/permissions/batch` | PUT | Body参数 |
| `/system/resource/batchDelete` | `/system/permissions/batch` | DEL | Body参数 |
| `/system/resource/assignPermissions` | `/system/roles/:roleId/permissions` | PUT | Body参数 |
| `/system/resource/resourcePermissions` | `/system/roles/:roleId/permissions` | GET | 路径参数 |
| `/system/resource/resourcePermissionIds` | `/system/roles/:roleId/permissions` | GET | 路径参数 |
| `/system/permission/resources` | `/system/roles/:roleId/users` | GET | 路径参数 |

### 详细说明

资源相关接口已合并到权限和角色管理中，具体映射如下：

#### 1. 创建资源
```typescript
// 旧方式
POST /system/resource/create
Body: { data: Partial<Permission> }

// 新方式
POST /system/permissions
Body: { data: Partial<Permission> }
```

#### 2. 更新资源
```typescript
// 旧方式
POST /system/resource/update
Body: { id, data: Partial<Permission> }

// 新方式
PUT /system/permissions/:id
Body: { data: Partial<Permission> }
```

#### 3. 删除资源
```typescript
// 旧方式
POST /system/resource/delete
Body: { id }

// 新方式
DEL /system/permissions/:id
```

#### 4. 获取资源详情
```typescript
// 旧方式
POST /system/resource/detail
Body: { id }

// 新方式
GET /system/permissions/:id
```

#### 5. 获取资源列表
```typescript
// 旧方式
POST /system/resource/list
Body: { ...查询参数 }

// 新方式
GET /system/permissions?name=xxx&code=xxx&type=xxx&page=1&pageSize=10
```

#### 6. 获取资源树
```typescript
// 旧方式
POST /system/resource/tree

// 新方式
GET /system/permissions/tree
```

#### 7. 批量创建资源
```typescript
// 旧方式
POST /system/resource/batchCreate
Body: { data: Partial<Permission>[] }

// 新方式
POST /system/permissions/batch
Body: { data: Partial<Permission>[] }
```

#### 8. 批量更新资源
```typescript
// 旧方式
POST /system/resource/batchUpdate
Body: { data: { id: number; data: Partial<Permission> }[] }

// 新方式
PUT /system/permissions/batch
Body: { data: { id: number; data: Partial<Permission> }[] }
```

#### 9. 批量删除资源
```typescript
// 旧方式
POST /system/resource/batchDelete
Body: { ids: number[] }

// 新方式
DEL /system/permissions/batch
Body: [1, 2, 3] // 直接传数组
```

#### 10. 分配资源权限
```typescript
// 旧方式
POST /system/resource/assignPermissions
Body: { roleId, permissionIds }

// 新方式
PUT /system/roles/:roleId/permissions
Body: { permissionIds: number[] }
```

#### 11. 获取资源权限
```typescript
// 旧方式
POST /system/resource/resourcePermissions
Body: { roleId }

// 新方式
GET /system/roles/:roleId/permissions
```

#### 12. 获取资源权限ID
```typescript
// 旧方式
POST /system/resource/resourcePermissionIds
Body: { roleId }

// 新方式
GET /system/roles/:roleId/permissions
// 返回结果中包含权限ID
```

#### 13. 获取拥有某个权限的资源列表
```typescript
// 旧方式
POST /system/permission/resources
Body: { roleId }

// 新方式
GET /system/roles/:roleId/users
```

---

## 九、role.api.ts - 角色相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/system/role/create` | `/system/roles` | POST | Body参数 |
| `/system/role/update` | `/system/roles/:id` | PUT | Body参数 |
| `/system/role/delete` | `/system/roles/:id` | DEL | 路径参数 |
| `/system/role/list` | `/system/roles` | GET | Query参数 |
| `/system/role/assign-permissions` | `/system/roles/:roleId/permissions` | PUT | Body参数 |
| `/system/role/permissions` | `/system/roles/:roleId/permissions` | GET | 路径参数 |

### 详细说明

#### 1. 创建角色
```typescript
// 旧方式
POST /system/role/create
Body: { name, code, description, enabled? }

// 新方式
POST /system/roles
Body: { name, code, description, enabled? }
```

#### 2. 更新角色
```typescript
// 旧方式
POST /system/role/update
Body: { id, name?, code?, description?, enabled? }

// 新方式
PUT /system/roles/:id
Body: { name?, code?, description?, enabled? }
```

#### 3. 删除角色
```typescript
// 旧方式
POST /system/role/delete
Body: { id }

// 新方式
DEL /system/roles/:id
```

#### 4. 获取角色列表
```typescript
// 旧方式
POST /system/role/list
Body: { name?, code?, enabled?, page?, pageSize? }

// 新方式
GET /system/roles?name=xxx&code=xxx&enabled=true&page=1&pageSize=10
```

#### 5. 为角色分配权限
```typescript
// 旧方式
POST /system/role/assign-permissions
Body: { roleId, permissionIds }

// 新方式
PUT /system/roles/:roleId/permissions
Body: { permissionIds: number[] }
```

#### 6. 获取角色权限
```typescript
// 旧方式
POST /system/role/permissions
Body: { roleId }

// 新方式
GET /system/roles/:roleId/permissions
```

---

## 十、sms.api.ts - SMS相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/sms/stat` | `/shuzi/sms/stats` | GET | Query参数 |
| `/sms/event/list` | `/shuzi/sms/events` | GET | Query参数 |
| `/sms/voluntary/list` | `/shuzi/sms/voluntary` | GET | Query参数 |

### 详细说明

#### 1. 获取SMS统计
```typescript
// 旧方式
POST /sms/stat
Body: { startDate, endDate }

// 新方式
GET /shuzi/sms/stats?startDate=xxx&endDate=xxx
```

#### 2. 获取SMS事件列表
```typescript
// 旧方式
POST /sms/event/list
Body: { startDate?, endDate? }

// 新方式
GET /shuzi/sms/events?startDate=xxx&endDate=xxx
```

#### 3. 获取SMS自愿报告列表
```typescript
// 旧方式
POST /sms/voluntary/list
Body: { startDate?, endDate? }

// 新方式
GET /shuzi/sms/voluntary?startDate=xxx&endDate=xxx
```

---

## 十一、staff.api.ts - 员工相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/staff/list` | `/system/staffs` | GET | Query参数 |
| `/department/list` | `/system/departments` | GET | 无参数 |
| `/duty/today` | `/duties/data` | GET | Query参数 |

### 详细说明

#### 1. 获取员工信息
```typescript
// 旧方式
POST /staff/list
Body: { page?, pageSize? }

// 新方式
GET /system/staffs?page=1&pageSize=10
```

#### 2. 获取部门列表
```typescript
// 旧方式
POST /department/list

// 新方式
GET /system/departments
```

#### 3. 获取今日值班信息
```typescript
// 旧方式
POST /duty/today

// 新方式
GET /duties/data?startDate=today&endDate=today
```

---

## 十二、statistics.api.ts - 统计相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/stat/period` | `/shuzi/stats/summary` | GET | Query参数 |
| `/stat/month` | `/shuzi/stats/monthly` | GET | Query参数 |
| `/stat/by/airline` | `/shuzi/stats/airline` | GET | Query参数 |
| `/stat/by/aircraft` | `/shuzi/stats/airline` | GET | Query参数 |
| `/stat/by/station` | `/shuzi/stats/station` | GET | Query参数 |
| `/stat/by/route` | `/shuzi/stats/route` | GET | Query参数 |

### 详细说明

#### 1. 获取周期统计
```typescript
// 旧方式
POST /stat/period
Body: { startDate?, endDate? }

// 新方式
GET /shuzi/stats/summary?startDate=xxx&endDate=xxx
```

#### 2. 获取月度统计
```typescript
// 旧方式
POST /stat/month
Body: { startDate?, endDate? }

// 新方式
GET /shuzi/stats/monthly?startDate=xxx&endDate=xxx
```

#### 3. 按航空公司统计
```typescript
// 旧方式
POST /stat/by/airline
Body: { startDate?, endDate? }

// 新方式
GET /shuzi/stats/airline?startDate=xxx&endDate=xxx
```

#### 4. 按飞机统计
```typescript
// 旧方式
POST /stat/by/aircraft
Body: { startDate?, endDate? }

// 新方式
GET /shuzi/stats/airline?startDate=xxx&endDate=xxx
// 注意：按飞机统计目前使用与按航空公司相同的接口
```

#### 5. 按站点统计
```typescript
// 旧方式
POST /stat/by/station
Body: { startDate?, endDate?, station? }

// 新方式
GET /shuzi/stats/station?startDate=xxx&endDate=xxx&station=xxx
```

#### 6. 获取航线统计数据
```typescript
// 旧方式
POST /stat/by/route
Body: { route, startDate?, endDate?, carrier? }

// 新方式
GET /shuzi/stats/route?route=xxx&startDate=xxx&endDate=xxx&carrier=xxx
```

---

## 十三、user.api.ts - 用户相关接口

| 旧API | 新API | HTTP方法 | 传参方式 |
|-------|-------|----------|----------|
| `/user/init` | `/system/users/init` | GET | 无参数 |
| `/login/wx` | `/login/wx` | POST | Body参数 |
| `/login/activate` | `/login/activate` | POST | Body参数 |
| `/user/profile` | `/system/staffs/:userId/profile` | GET | 路径参数 |
| `/staff/list` | `/system/staffs` | GET | Query参数 |
| `/user/userRoles` | `/system/users/:userId/roles` | GET | 路径参数 |
| `/user/userPermissionCodes` | `/system/permissions/users/:userId/permission-codes` | GET | 路径参数 |
| `/user/hasPermission` | `/system/permissions/users/:userId/has-permission/:code` | GET | 路径参数 |
| `/user/hasRole` | `/system/roles/users/:userId/has-role/:code` | GET | 路径参数 |
| `/user/assignRoles` | `/system/roles/users/:userId/roles` | PUT | Body参数 |
| `/user/userPermissions` | `/system/permissions/users/:userId/permissions` | GET | 路径参数 |
| `/login/qr/confirm` | `/login/qr/confirm` | POST | Body参数 |
| `/login/health` | `/login/health` | GET | 无参数 |

### 详细说明

#### 1. 初始化用户信息
```typescript
// 旧方式
POST /user/init

// 新方式
GET /system/users/init
// 需要携带认证token
```

#### 2. 微信登录
```typescript
// 旧方式
POST /login/wx
Body: { code }

// 新方式
POST /login/wx
Body: { code }
```

#### 3. 激活
```typescript
// 旧方式
POST /login/activate
Body: { regCode, code }

// 新方式
POST /login/activate
Body: { regCode, code }
```

#### 4. 获取用户档案
```typescript
// 旧方式
POST /user/profile
Body: { userId }

// 新方式
GET /system/staffs/:userId/profile
```

#### 5. 获取员工列表
```typescript
// 旧方式
POST /staff/list
Body: { page?, pageSize? }

// 新方式
GET /system/staffs?page=1&pageSize=10
```

#### 6. 获取用户角色列表
```typescript
// 旧方式
POST /user/userRoles
Body: { userId }

// 新方式
GET /system/users/:userId/roles
```

#### 7. 获取用户权限代码列表
```typescript
// 旧方式
POST /user/userPermissionCodes
Body: { userId }

// 新方式
GET /system/permissions/users/:userId/permission-codes
```

#### 8. 检查用户权限
```typescript
// 旧方式
POST /user/hasPermission
Body: { userId, code }

// 新方式
GET /system/permissions/users/:userId/has-permission/:code
```

#### 9. 检查用户角色
```typescript
// 旧方式
POST /user/hasRole
Body: { userId, code }

// 新方式
GET /system/roles/users/:userId/has-role/:code
```

#### 10. 为用户分配角色
```typescript
// 旧方式
POST /user/assignRoles
Body: { userId, roleIds }

// 新方式
PUT /system/roles/users/:userId/roles
Body: { roleIds: number[] }
```

#### 11. 获取用户权限列表
```typescript
// 旧方式
POST /user/userPermissions
Body: { userId }

// 新方式
GET /system/permissions/users/:userId/permissions
```

#### 12. 确认扫码登录
```typescript
// 旧方式
POST /login/qr/confirm
Body: { ticketId }

// 新方式
POST /login/qr/confirm
Body: { ticketId }
```

#### 13. 获取服务器状态信息
```typescript
// 旧方式
POST /login/health

// 新方式
GET /login/health
```

---

## 总结

### 主要变更

1. **HTTP方法变更**：
   - 创建：`POST` → `POST`（保持不变）
   - 更新：`POST` → `PUT`
   - 删除：`POST` → `DEL`
   - 查询：`POST` → `GET`

2. **路径变更**：
   - 单数 → 复数：`/aircraft` → `/aircrafts`
   - 移除冗余词汇：`/list`, `/detail`, `/create`, `/update`, `/delete`
   - 使用连字符：`/flightHours` → `/flight-hours`
   - 规范子资源：`/by/aircraft` → `/aircraft/:acReg`

3. **传参方式变更**：
   - POST Body → GET Query参数
   - POST Body中的ID → 路径参数

### 注意事项

1. 如果启用 `globalPrefix: '/api/v1'`，所有新API路径前需要加上 `/api/v1`
2. 日期参数格式：`YYYY-MM-DD`
3. 分页参数：`page`（页码，从1开始），`pageSize`（每页数量）
4. 需要认证的接口需要在请求头中携带 `Authorization: Bearer {token}`
