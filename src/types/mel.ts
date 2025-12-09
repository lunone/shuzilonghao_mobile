// MEL系统类型定义
// 基于后端接口文档 other/mel.md

// 基础MEL实体
export interface VMel {
    id: number;
    ddfNo: string;        // 缺陷报告单号
    melNo: string;        // MEL编号
    acReg: string;        // 飞机注册号
    acType: string;       // 机型
    ata1: string;         // ATA章节1
    ata2: string;         // ATA章节2
    des: string;          // 故障描述
    inputter: string;     // 录入人
    approver: string;     // 批准人
    inputterDate: string; // 录入日期
    applyDate: string;    // 申请日期
    repairDate: string;   // 维修日期
    approveDate: string;  // 批准日期
    deffer: string;       // 保留类型
    type: string;         // 类型
    status: string;       // 状态
    source: string;       // 数据来源：base-主基地，outstation-外站
}

// 分页响应接口
export interface MelPageResponse {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    records: VMel[];
}

// DTO接口 - 对应后端文档的参数
export interface MelQueryDto {
    acReg?: string;           // 飞机号
    startDate?: string;       // 开始日期
    endDate?: string;         // 结束日期
    dateType?: string;        // 日期类型（applyDate/repairDate/approveDate/inputterDate）
    userId?: string;          // 用户ID
    userIdType?: string;      // 用户类型（inputter/approver/ata）
    melNo?: string;           // MEL编号
    ddfNo?: string;           // 缺陷报告单号
    ata1?: string;            // ATA章节1
    ata2?: string;            // ATA章节2
    acType?: string;          // 机型
    deffer?: string;          // 保留类型
    type?: string;            // 类型
    status?: string;          // 状态
    page?: number;            // 页码，默认1
    size?: number;            // 每页数量，默认20
}

export interface MelDetailDto {
    id: number;               // 主键ID（必填）
    source: string;           // 数据来源：base-主基地，outstation-外站（必填）
}

export interface MelByAircraftDto {
    acReg: string;            // 飞机注册号（必填）
    page?: number;            // 页码
    size?: number;            // 每页数量
}

export interface MelByUserDto {
    userId: string;           // 用户ID（必填）
    userIdType: string;       // 用户类型（必填：inputter/approver/ata）
    page?: number;            // 页码
    size?: number;            // 每页数量
}

export interface MelByDateRangeDto {
    startDate?: string;       // 开始日期
    endDate?: string;         // 结束日期
    dateType?: string;        // 日期类型
    page?: number;            // 页码
    size?: number;            // 每页数量
}

export interface MelByATADto {
    ata1?: string;            // ATA章节1
    ata2?: string;            // ATA章节2
    page?: number;            // 页码
    size?: number;            // 每页数量
}

// MEL完整实体接口 - 用于fullEntity字段
export interface MelFullEntity {
    // 包含数据库所有字段，这里暂时使用VMel的字段作为基础
    id: number;
    ddfNo: string;
    melNo: string;
    acReg: string;
    acType: string;
    ata1: string;
    ata2: string;
    des: string;
    inputter: string;
    approver: string;
    inputterDate: string;
    applyDate: string;
    repairDate: string;
    approveDate: string;
    deffer: string;
    type: string;
    status: string;
    source: string;
    // 可能还有其他数据库字段，根据实际后端实现补充
    [key: string]: any;      // 允许其他未知字段
}

// MEL详情响应接口
export interface MelDetailResponse {
    // 基础MEL信息
    id: number;
    ddfNo: string;
    melNo: string;
    acReg: string;
    acType: string;
    ata1: string;
    ata2: string;
    des: string;
    inputter: string;
    approver: string;
    inputterDate: string;
    applyDate: string;
    repairDate: string;
    approveDate: string;
    deffer: string;
    type: string;
    status: string;
    source: string;
    // 完整实体对象
    fullEntity: MelFullEntity;
}

// 统计响应接口
export interface MelStatsResponse {
    statusDistribution?: Record<string, number>;
    ataDistribution?: Record<string, number>;
    monthlyDistribution?: Record<string, number>;
    totalCount: number;
}

// 链式调用查询构建器
export interface MelQueryBuilder {
    // 基础筛选条件
    withAircraft(acReg: string): MelQueryBuilder;
    withDateRange(startDate: string, endDate: string, dateType?: string): MelQueryBuilder;
    withUser(userId: string, userIdType: 'inputter' | 'approver' | 'ata'): MelQueryBuilder;
    withMEL(melNo: string): MelQueryBuilder;
    withDDF(ddfNo: string): MelQueryBuilder;
    withATA(ata1: string, ata2?: string): MelQueryBuilder;
    withAircraftType(acType: string): MelQueryBuilder;
    withDeferralType(deffer: string): MelQueryBuilder;
    withType(type: string): MelQueryBuilder;
    withStatus(status: string): MelQueryBuilder;
    
    // 分页设置
    withPage(page: number): MelQueryBuilder;
    withSize(size: number): MelQueryBuilder;
    
    // 执行查询
    list(): Promise<MelPageResponse>;
    stats(): Promise<MelStatsResponse>;
    detail(id: number, source?: string): Promise<MelDetailResponse>;
    
    // 专用查询方法
    byAircraft(): Promise<MelPageResponse>;
    byUser(): Promise<MelPageResponse>;
    byDateRange(): Promise<MelPageResponse>;
    byATA(): Promise<MelPageResponse>;
    statusStats(): Promise<MelStatsResponse>;
    ataStats(): Promise<MelStatsResponse>;
    monthlyStats(): Promise<MelStatsResponse>;
}

// Store状态接口
export interface MelState {
    // 数据状态
    melList: VMel[];
    melDetail: MelDetailResponse | null;
    statsData: MelStatsResponse | null;
    
    // 查询状态
    loading: {
        list: boolean;
        detail: boolean;
        stats: boolean;
    };
    
    // 查询参数缓存
    lastQueryParams: MelQueryDto | null;
    
    // 分页信息
    pagination: {
        currentPage: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
    
    // 错误状态
    error: string | null;
}

// 兼容性：保持与现有MelItem的兼容
export interface MelItem {
    id?: number;
    acReg: string;           // 机号
    melCode: string;         // MEL代码
    description: string;     // 描述
    category: string;        // 分类
    deferralClass: string;   // 延期等级
    rectificationDate?: string; // 修复日期
    status: string;          // 状态
    createdAt: string;       // 创建时间
    updatedAt?: string;      // 更新时间
}