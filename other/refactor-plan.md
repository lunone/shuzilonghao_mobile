# `request` 函数调用点重构计划

## 1. 重构目标

将项目中所有对 `request` 函数的调用，从旧的位置参数形式 `request(url, data, options)` 更新为新的对象参数形式 `request({ url, data, ...options })`。

## 2. 需要修改的文件列表

根据之前的全局搜索，以下 11 个文件需要被修改：

1.  `src/api/aircraft.api.ts`
2.  `src/api/airport.api.ts`
3.  `src/api/flight.api.ts`
4.  `src/api/permission.api.ts`
5.  `src/api/pilot.api.ts`
6.  `src/api/resource.api.ts`
7.  `src/api/role.api.ts`
8.  `src/api/sms.api.ts`
9.  `src/api/staff.api.ts`
10. `src/api/statistics.api.ts`
11. `src/api/user.api.ts`

## 3. 修改规则与示例

核心修改是将多个参数合并成一个对象。以下是几种常见情况的修改示例：

### 场景一：只有 `url`

**修改前:**
```typescript
return request('/user/init');
```

**修改后:**
```typescript
return request({ url: '/user/init' });
```

### 场景二：有 `url` 和 `data`

**修改前:**
```typescript
return request('/login/wx', { code });
```

**修改后:**
```typescript
return request({ url: '/login/wx', data: { code } });
```

### 场景三：有 `url`, `data` 和 `options`

**修改前:**
```typescript
return request('/user/profile', data, { defaultValue: null });
```

**修改后:**
```typescript
return request({ url: '/user/profile', data, defaultValue: null });
```

### 场景四：`data` 为 `undefined` (需要省略)

**修改前:**
```typescript
return request('/user/staff', undefined, { defaultValue: [] });
```

**修改后:**
```typescript
return request({ url: '/user/staff', defaultValue: [] });
```

## 4. 具体文件修改指南

请逐一打开上述文件列表中的每个文件，并应用以上规则进行修改。

**以 `src/api/user.api.ts` 为例，修改方案如下：**

*   `initUser`: `request('/user/init')` -> `request({ url: '/user/init' })`
*   `login`: `request('/login/wx', { code })` -> `request({ url: '/login/wx', data: { code } })`
*   `activate`: `request('/login/activate', data)` -> `request({ url: '/login/activate', data })`
*   `getUserProfile`: `request('/user/profile', data, { defaultValue: null })` -> `request({ url: '/user/profile', data, defaultValue: null })`
*   `getStaffList`: `request('/user/staff', undefined, { defaultValue: [] })` -> `request({ url: '/user/staff', defaultValue: [] })`
*   `getUserRoles`: `request('/user/userRoles', data, { defaultValue: [] })` -> `request({ url: '/user/userRoles', data, defaultValue: [] })`
*   `getUserPermissionCodes`: `request('/user/userPermissionCodes', data, { defaultValue: [] })` -> `request({ url: '/user/userPermissionCodes', data, defaultValue: [] })`
*   `checkUserPermission`: `request('/user/hasPermission', data, { defaultValue: false })` -> `request({ url: '/user/hasPermission', data, defaultValue: false })`
*   `checkUserRole`: `request('/user/hasRole', data, { defaultValue: false })` -> `request({ url: '/user/hasRole', data, defaultValue: false })`
*   `assignRolesToUser`: `request('/user/assignRoles', data)` -> `request({ url: '/user/assignRoles', data })`
*   `getUserPermissions`: `request('/user/userPermissions', data, { defaultValue: [] })` -> `request({ url: '/user/userPermissions', data, defaultValue: [] })`

请对列表中的其余 10 个文件执行类似的操作。

---
**计划结束**