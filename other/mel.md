# MEL查询接口文档

## 概述
根据VMel实体创建的MEL数据查询接口，支持多维度查询和分页功能。采用分层架构设计，实现松耦合。

## 基础配置
- **实体类**: `src/entity/amro/VMel.entity.ts`
- **DTO层**: `src/dto/mel.rule.ts` - 专注于参数验证
- **Service层**: `src/service/amro/mel.service.ts` - 业务逻辑实现
- **Controller层**: `src/controller/amro/mel.controller.ts` - API接口定义

## 架构设计

### 分层职责
1. **DTO层**: 负责HTTP请求参数验证，不涉及业务逻辑
2. **Service层**: 定义独立的参数接口(`MelQueryParams`)，实现核心业务逻辑和数据访问
3. **Controller层**: 负责将DTO转换为Service参数，统一响应构建，调用业务逻辑

### 重构优化
- **消除重复代码**: Controller层提取`convertToQueryParams()`统一DTO转换
- **统一响应构建**: `buildStatsResponse()`方法规范化统计接口响应
- **简化架构**: 移除了过度设计的Repository层，Service直接管理数据访问
- **性能优化**: 统计查询使用Promise.all并行执行，提高响应速度

## 接口列表

### 1. 获取MEL数据列表
- **路径**: `POST /mel/list`
- **描述**: 通用查询接口，支持所有查询条件
- **参数**: `MelQueryDto`
  - `acReg?: string` - 飞机号
  - `startDate?: Date` - 开始日期
  - `endDate?: Date` - 结束日期
  - `dateType?: string` - 日期类型（applyDate/repairDate/approveDate/inputterDate）
  - `userId?: string` - 用户ID
  - `userIdType?: string` - 用户类型（inputter/approver/ata）
  - `melNo?: string` - MEL编号
  - `ddfNo?: string` - 缺陷报告单号
  - `ata1?: string` - ATA章节1
  - `ata2?: string` - ATA章节2
  - `acType?: string` - 机型
  - `deffer?: string` - 保留类型
  - `type?: string` - 类型
  - `status?: string` - 状态
  - `page?: number` - 页码，默认1
  - `size?: number` - 每页数量，默认20

### 2. 获取MEL统计数据
- **路径**: `POST /mel/stats`
- **描述**: 获取统计信息
- **参数**: `MelQueryDto`

### 3. 获取单个MEL记录详情
- **路径**: `POST /mel/detail`
- **描述**: 根据ID获取详细信息
- **参数**: `MelDetailDto`
  - `id: number` - 主键ID

### 4. 根据飞机号查询
- **路径**: `POST /mel/by/aircraft`
- **描述**: 根据飞机注册号查询
- **参数**: `MelByAircraftDto`
  - `acReg: string` - 飞机注册号（必填）
  - `page?: number` - 页码
  - `size?: number` - 每页数量

### 5. 根据用户查询
- **路径**: `POST /mel/by/user`
- **描述**: 根据用户类型和ID查询
- **参数**: `MelByUserDto`
  - `userId: string` - 用户ID（必填）
  - `userIdType: string` - 用户类型（必填：inputter/approver/ata）
  - `page?: number` - 页码
  - `size?: number` - 每页数量

### 6. 根据日期范围查询
- **路径**: `POST /mel/by/date-range`
- **描述**: 根据日期范围查询
- **参数**: `MelByDateRangeDto`
  - `startDate?: Date` - 开始日期
  - `endDate?: Date` - 结束日期
  - `dateType?: string` - 日期类型
  - `page?: number` - 页码
  - `size?: number` - 每页数量

### 7. 根据ATA章节查询
- **路径**: `POST /mel/by/ata`
- **描述**: 根据ATA章节查询
- **参数**: `MelByATADto`
  - `ata1?: string` - ATA章节1
  - `ata2?: string` - ATA章节2
  - `page?: number` - 页码
  - `size?: number` - 每页数量

### 8. 获取状态分布统计
- **路径**: `POST /mel/stats/status`
- **描述**: 获取MEL状态分布统计

### 9. 获取ATA章节分布统计
- **路径**: `POST /mel/stats/ata`
- **描述**: 获取ATA章节分布统计

### 10. 获取月度统计
- **路径**: `POST /mel/stats/monthly`
- **描述**: 获取月度分布统计

## 核心功能特性

### 1. 默认时间逻辑
- 如果没有提供`startDate`和`endDate`，默认查询`inputterDate`最近一个月的数据
- 支持灵活的日期范围设置

### 2. 动态日期字段过滤
根据`dateType`参数动态选择日期字段：
- `applyDate` - 申请日期
- `repairDate` - 维修日期
- `approveDate` - 批准日期
- `inputterDate` - 录入日期（默认）

### 3. 用户类型过滤
根据`userIdType`参数动态选择过滤字段：
- `inputter` - 录入人（字段：`inputter`）
- `approver` - 批准人（字段：`approver`）
- `ata` - ATA章节（字段：`ata1`）

### 4. 分页支持
- 所有列表查询接口都支持分页
- 默认每页20条记录
- 最大支持100条每页

### 5. 统计功能
提供多维度统计数据：
- 按状态分布统计
- 按ATA章节分布统计
- 按月份分布统计

## 返回格式示例

### 列表查询返回
```json
{
  "page": 1,
  "size": 20,
  "total": 100,
  "totalPages": 5,
  "records": [
    {
      "id": 1,
      "ddfNo": "DDF2025001",
      "melNo": "MEL001",
      "acReg": "B-1234",
      "acType": "A320",
      "ata1": "27",
      "ata2": "00",
      "des": "故障描述...",
      "inputter": "张三",
      "approver": "李四",
      "inputterDate": "2025-01-01T00:00:00.000Z",
      "applyDate": "2025-01-01T00:00:00.000Z",
      "repairDate": "2025-01-02T00:00:00.000Z",
      "approveDate": "2025-01-03T00:00:00.000Z",
      "deffer": "A",
      "type": "MEL",
      "status": "已批准"
    }
  ]
}
```

### 统计查询返回
```json
{
  "statusDistribution": {
    "已批准": 80,
    "待批准": 15,
    "已拒绝": 5
  },
  "ataDistribution": {
    "27": 45,
    "32": 30,
    "21": 25
  },
  "monthlyDistribution": {
    "2025-01": 30,
    "2025-02": 25,
    "2025-03": 45
  },
  "totalCount": 100
}
```

## 使用示例

### 基础查询
```bash
curl -X POST http://localhost:7001/mel/list \
  -H "Content-Type: application/json" \
  -d '{
    "acReg": "B-1234",
    "page": 1,
    "size": 10
  }'
```

### 按日期范围查询
```bash
curl -X POST http://localhost:7001/mel/by/date-range \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-31T23:59:59.999Z",
    "dateType": "applyDate"
  }'
```

### 按用户查询
```bash
curl -X POST http://localhost:7001/mel/by/user \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "张三",
    "userIdType": "inputter"
  }'
```

## 技术特点

### 1. 松耦合架构
- **DTO**: 专注于HTTP参数验证
- **Service**: 独立的参数接口和业务逻辑
- **Controller**: 负责数据转换和协调

### 2. 重构前后对比

#### 重构前问题
```typescript
// 重构前：重复的DTO转换代码
@Post('/stats')
@Validate()
async getMelStats(@Body() query: MelQueryDto) {
    // 重复的参数转换逻辑
    const params: MelQueryParams = {
        acReg: query.acReg,
        startDate: query.startDate,
        endDate: query.endDate,
        dateType: query.dateType,
        userId: query.userId,
        userIdType: query.userIdType,
        melNo: query.melNo,
        ddfNo: query.ddfNo,
        ata1: query.ata1,
        ata2: query.ata2,
        acType: query.acType,
        deffer: query.deffer,
        type: query.type,
        status: query.status,
        page: query.page,
        size: query.size
    };

    return this.melService.getMelStats(params);
}

// 统计接口返回构建重复
@Post('/stats/status')
@Validate()
async getStatusStats(@Body() query: MelQueryDto) {
    const params = { /* 同样的参数转换 */ };
    const stats = await this.melService.getMelStats(params);
    return {
        statusDistribution: stats.statusStats,
        totalCount: stats.totalCount
    };
}
```

#### 重构后优化
```typescript
// 重构后：统一的参数转换方法
private convertToQueryParams(dto: MelQueryDto): MelQueryParams {
    return {
        acReg: dto.acReg,
        startDate: dto.startDate,
        endDate: dto.endDate,
        dateType: dto.dateType,
        userId: dto.userId,
        userIdType: dto.userIdType,
        melNo: dto.melNo,
        ddfNo: dto.ddfNo,
        ata1: dto.ata1,
        ata2: dto.ata2,
        acType: dto.acType,
        deffer: dto.deffer,
        type: dto.type,
        status: dto.status,
        page: dto.page,
        size: dto.size
    };
}

// 统一的响应构建方法
private buildStatsResponse(stats: any, type: 'status' | 'ata' | 'monthly'): MelStatsResponse {
    const response: MelStatsResponse = { totalCount: stats.totalCount };
    switch (type) {
        case 'status': response.statusDistribution = stats.statusStats; break;
        case 'ata': response.ataDistribution = stats.ataStats; break;
        case 'monthly': response.monthlyDistribution = stats.monthlyStats; break;
    }
    return response;
}

// Controller方法变得简洁
@Post('/stats')
@Validate()
async getMelStats(@Body() query: MelQueryDto) {
    const params = this.convertToQueryParams(query);
    return this.melService.getMelStats(params);
}

@Post('/stats/status')
@Validate()
async getStatusStats(@Body() query: MelQueryDto) {
    const params = this.convertToQueryParams(query);
    const stats = await this.melService.getMelStats(params);
    return this.buildStatsResponse(stats, 'status');
}
```

## 注意事项
1. 所有接口都使用POST方法
2. 参数验证由DTO自动处理，缺少必填参数会返回验证错误
3. 默认时间范围是inputterDate最近一个月
4. 支持模糊匹配（使用LIKE查询）
5. 所有查询都按录入日期倒序排列
6. 严格遵循分层架构，DTO不深入到Service层
