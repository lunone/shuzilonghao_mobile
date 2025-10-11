# API调用文档

## 概述
本文档基于MidwayJS后端项目的controller，分析每个API接口的传参规则和返回结果规则。传参规则基于DTO验证规则，返回规则基于服务层的实现。需要注意的是，很多接口直接返回service结果，具体返回结构需要查看entity定义。

## 系统模块 (system)

### 登录接口 (`/login`)

#### POST `/wx`
**描述**: 微信登录
**传参规则**:
- `code: string` (微信jscode, 长度20-40, 必须)

**返回规则**:
- 成功: string (JWT token)
- 失败: 抛出异常

#### POST `/password`
**描述**: 密码登录
**传参规则**:
- 使用 `PasswordLoginDTO`:
  - `username: string` (长度3-15, 必须)
  - `password: string` (长度3-25, 必须)

**返回规则**:
- 成功: string (JWT token)
- 失败: 抛出异常 (如用户名或密码错误)

#### POST `/activate`
**描述**: 激活账号
**传参规则**:
- 使用 `WxActivateDTO`:
  - `code: string` (微信jscode, 长度20-40, 必须)
  - `regCode: string` (激活码, 长度4, 必须)

**返回规则**:
- 成功: string (JWT token)
- 失败: 抛出异常

### 代理商接口 (`/agent`)

#### POST `/add`
**传参规则**:
- body: `Agent` (entity定义的字段)

**返回规则**:
- 成功: 创建的Agent对象

#### POST `/update`
**传参规则**:
- `body: {id: number, agent: Partial<Agent>}`

**返回规则**:
- 成功: 更新后的Agent对象

#### POST `/delete`
**传参规则**:
- `body: {id: number}`

**返回规则**:
- 成功: 删除结果

#### POST `/getById`
**传参规则**:
- `body: {id: number}`

**返回规则**:
- 成功: Agent对象或null

#### POST `/list`
**传参规则**:
- `query: any`

**返回规则**:
- 成功: Agent列表

### 航空公司接口 (`/airline`)

#### POST `/add`
**传参规则**:
- `airline: any`

**返回规则**:
- 创建结果

#### POST `/update`
**传参规则**:
- `body: {id: number, airline: any}`

**返回规则**:
- 更新结果

#### POST `/delete`
**传参规则**:
- `body: {id: number}`

**返回规则**:
- 删除结果

#### POST `/getById`
**传参规则**:
- `body: {id: number}`

**返回规则**:
- Airline对象

#### POST `/list`
**传参规则**:
- 无

**返回规则**:
- 航空公司列表

### 运单接口 (`/waybill`)

#### POST `/charter`
**传参规则**:
- 使用 `charterFlightDTO`:
  - `startDate: Date` (必须)
  - `endDate: Date` (必须)
  - `airlineId: number` (必须)

**返回规则**:
- 运单线数据

### 飞机接口 (`/aircraft`)

#### POST `/list`
**传参规则**:
- 无

**返回规则**:
- 飞机注册号列表

### 机场接口 (`/airport`)

#### POST `/code4`
**传参规则**:
- 无

**返回规则**:
- 机场信息对象 (按code4为key)

### 航班接口 (`/flight`)

#### POST `/:dateKey`
**传参规则**:
- URL参数: `dateKey` (必须, 枚举值: date/std/etd/atd/htd/sta/eta/ata/hta)
- 使用 `dateRangeQueryDTO`:
  - `startDate: Date` (必须)
  - `endDate: Date` (必须)

**返回规则**:
- 航班列表

#### POST `/plan`
**传参规则**:
- 使用 `dateRangeQueryDTO`

**返回规则**:
- 按日期和机型号分组的统计

### 维护接口 (`/me`)

#### POST `/mel`
**传参规则**:
- 使用 `MelQueryDTO` (日期和机号)

**返回规则**:
- MEL数据列表

### 飞行员接口 (`/pilot`)

#### POST `/list`
**传参规则**:
- 使用 `PilotListQueryDTO`

**返回规则**:
- 飞行员列表

#### POST `/profile`
**传参规则**:
- 使用 `PilotProfileQueryDTO`:
  - `userId: string` (必须)
  - `idType: string` (可选, 默认 userId)

**返回规则**:
- 飞行员档案

#### POST `/duty`
**传参规则**:
- 使用 `userIdOrCodeAndDateRangeQueryDTO`

**返回规则**:
- 值班记录

#### POST `/training`
**传参规则**:
- 使用 `userIdOrCodeAndDateRangeQueryDTO`

**返回规则**:
- 培训记录

#### POST `/absence`
**传参规则**:
- 使用 `userIdOrCodeAndDateRangeQueryDTO`

**返回规则**:
- 缺勤记录

### 统计接口 (`/stat`)

#### POST `/date`
**传参规则**:
- 使用 `dateRangeQueryDTO`

**返回规则**:
- 航班数据

#### POST `/period`
**传参规则**:
- 使用 `dateRangeQueryDTO`

**返回规则**:
- 期内统计和

#### POST `/month`
**传参规则**:
- 使用 `dateRangeQueryDTO`

**返回规则**:
- 按月统计

#### POST `/crew/fh`
**传参规则**:
- 使用 `dateRangeQueryDTO`

**返回规则**:
- 机组飞行小时统计

#### POST `/by/airline`
**传参规则**:
- 使用 `dateRangeQueryDTO`

**返回规则**:
- 按航空公司统计

#### POST `/by/station`
**传参规则**:
- 使用 `stationAndDateRangeDTO` (包括站点)

**返回规则**:
- 按站点统计

#### POST `/crew/mate`
**传参规则**:
- `body: {pcode, startDate, endDate}`

**返回规则**:
- 机组伙伴统计

#### POST `/crew/fatigue`
**传参规则**:
- `body: {pcode, startDate, endDate}`

**返回规则**:
- 机组疲劳统计

### SMS接口 (`/sms`)

#### POST `/voluntary/list`
**传参规则**:
- 使用 `dateRangeQueryDTO`

**返回规则**:
- 自愿义务列表

#### POST `/event/list`
**传参规则**:
- 使用 `dateRangeQueryDTO`

**返回规则**:
- 事件列表

#### POST `/stat`
**传参规则**:
- 使用 `dateRangeQueryDTO`

**返回规则**:
- 按月统计对象

### 包租接口 (`/charter`)

#### POST `/fule/price`
**传参规则**:
- 使用 `fuePriceDTO`:
  - `startDate: Date`, `endDate: Date`
  - `airports: string[]`

**返回规则**:
- 燃油价格数据

### 字典接口 (`/system/dict`)

#### POST `/type/add`
**传参规则**:
- `dict: any`

**返回规则**:
- 创建结果

#### POST `/type/update`
**传参规则**:
- `body: {id: number, dict: any}`

**返回规则**:
- 更新结果

#### POST `/data/add`
**传参规则**:
- `data: any`

**返回规则**:
- 创建结果

#### POST `/data/update`
**传参规则**:
- `body: {id: number, data: any}`

**返回规则**:
- 更新结果

#### POST `/data/byType`
**传参规则**:
- `body: {dictType: string}`

**返回规则**:
- 数据列表

### 权限接口 (`/system/permission`)

#### POST `/create`
**传参规则**:
- `body: {data: Partial<Permission>}`

**返回规则**:
- 创建的权限对象

#### POST `/update`
**传参规则**:
- `body: {id: number, data: Partial<Permission>}`

**返回规则**:
- 更新结果

#### POST `/delete`
**传参规则**:
- `body: {id: number}`

**返回规则**:
- null

其他权限接口根据service实现返回相应结果

### 角色接口 (`/system/role`)

#### POST `/create`
**传参规则**:
- `data: Partial<Role>` (使用Validate)

**返回规则**:
- 创建的角色对象

#### POST `/update`
**传参规则**:
- `body: {id: number, data: Partial<Role>}` (使用Validate)

**返回规则**:
- 更新结果

#### POST `/delete`
**传参规则**:
- `body: {id: number}` (使用Validate)

**返回规则**:
- null

#### POST `/detail`
**传参规则**:
- `body: IdDTO`

**返回规则**:
- 角色详情

其他角色接口根据service返回相应业务结果

### 员工接口 (`/staff`)

#### POST `/list`
**传参规则**:
- 使用 `StaffListQueryDTO`

**返回规则**:
- 员工列表

#### POST `/profile`
**传参规则**:
- 使用 `StaffProfileQueryDTO`

**返回规则**:
- 员工档案

### 用户接口 (`/user`)

#### POST `/init`
**传参规则**:
- 无 (从ctx获取userId)

**返回规则**:
- `{user: User, permissionTree: any[]}`

### 部门接口 (`/department`)

#### POST `/list`
**传参规则**:
- 无

**返回规则**:
- 部门列表

### 主页接口 (`/`)

#### GET `/`
**传参规则**:
- 无

**返回规则**:
- 各种测试数据

#### GET `/zhilun/sync`
**传参规则**:
- 无

**返回规则**:
- 同步结果
