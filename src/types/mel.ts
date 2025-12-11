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
    source?: string;          // 数据来源：base-主基地，outstation-外站（可选）
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

// 主基地数据完整实体接口 - 使用实际API返回的大写字段名
export interface MelBaseFullEntity {
    DDF_NO: string;
    PKID: number;
    ACNO: string;
    ATA1: string;
    TERMINAL: string;
    APPLY_DATE: string;
    BLTYP: string;
    BLBS: string;
    BLREA: string;
    TRANSCRIBED_FROM: string;
    FAUREP: string;
    REPAIR_PERIOD_DAY: string;
    REPAIR_PERIOD_UNIT: string;
    WORKING_DATE: string;
    EXPECTED_REPAIR_TIME: string;
    RII: string;
    UNIT_OPERATION_MEASURES: string;
    OPERATIONAL_RESTRICTIONS: string;
    WARNING_SIGN: string;
    MAINTENANCE_MEASURES: string;
    OBSERVATION_PROJECT: string;
    P_SOURCE_ATA: string;
    CHECK_INTERVAL: string;
    CHECK_INTERVAL_UNIT: string;
    HANDLE_PEOPLE: string;
    APPROVED_PERSON: string;
    INSPECTION_STANDARDS: string;
    OFF_CONDITION: string;
    REASONS_FOR_RENEWAL: string;
    RENEWAL_DAT: string;
    RENEWAL_DAT_UNIT: string;
    RENEWAL_DATE: string;
    RENEWAL_APPLY_MAN: string;
    RENEWAL_APPROVED_MAN: string;
    CORRECTIVE_ACTION: string;
    CLOSE_DATE: string;
    CLOSE_MAN: string;
    CONTROL_LIST: string;
    FEEDBACK_MAN: string;
    FEEDBACK_DATE: string;
    FEEDBACK_COMNET: string;
    NOTE: string;
    INPUTTER_ID: string;
    INPUTTER_NAME: string;
    INPUTTER_DATE: string;
    OPEARTOR_NAME: string;
    OPEARTOR_ID: string;
    OPEARTOR_DATE: string;
    STATUS: string;
    OLD_DDF_NO: string;
    NOW_DDF_NO: string;
    REPAIR_PERIOD_FC: string;
    REPAIR_PERIOD_FH: string;
    CLOSE_APPROVED_MAN: string;
    ACTYPE: string;
    DYD: string;
    FH: string;
    FC: string;
    FLD: string;
    NEXT_A: string;
    NEXT_C: string;
    BLBS_NO: string;
    SEAT_NO: string;
    M_NO: string;
    REPEAT_CHECK: string;
    ETOPS_PKID: string;
    LS_MEMO: string;
    SG_MEMO: string;
    LS: string;
    SP: string;
    SG: string;
    OI: string;
    APPROVE_EMP: string;
    APPROVE_NAME: string;
    APPROVE_DATE: string;
    REVIEW_EMP: string;
    REVIEW_NAME: string;
    REVIEW_DATE: string;
    RENEW_INS_PKID: string;
    REPAIR_DATE: string;
    ZB_PKID: string;
    CLOSE_PKID: string;
    OUT_PKID: string;
    TYPE: string;
    REPEAT_DAY: string;
    REPEAT_FH: string;
    REPEAT_FC: string;
    HD_CHECK: string;
    RE_PKIDS: string;
    ATA2: string;
    OTHER_RP: string;
    FAUREP_EN: string;
    ETOPS_NO: string;
    SP_SON: string;
    OTHER_RP_CHECK: string;
    ETOPS: string;
    XB_TIME: string;
    NEXT_A_DESC: string;
    NEXT_C_DESC: string;
    NOTES: string;
    REPEAT_CHECK_RE: string;
    SCAL_DATE: string;
    FLB_NO: string;
    SRC_NRC: string;
    TS: string;
    TS_MEMO: string;
    TRANSFER: string;
    IF_BUSINESS: string;
    EXPECT_REPAIR_TIME: string;
    POST_TREATMENT: string;
    ATA_SOURCE: string;
    PERSONS: string;
    TH: string;
    OPERATIONAL_DESC: string;
    
    // 为了向后兼容，添加小写字段名
    ddfNo?: string;
    pkid?: number;
    acReg?: string;
    ata1?: string;
    terminal?: string;
    applyDate?: string;
    deffer?: string;
    blbs?: string;
    blrea?: string;
    transcribedFrom?: string;
    des?: string;
    repairPeriodDay?: string;
    repairPeriodUnit?: string;
    workingDate?: string;
    expectedRepairTime?: string;
    rii?: string;
    operation?: string;
    operationalRestrictions?: string;
    warningSign?: string;
    maintenanceMeasures?: string;
    obserse?: string;
    pSourceAta?: string;
    checkInterval?: string;
    checkIntervalUnit?: string;
    handlePeople?: string;
    approvedPerson?: string;
    inspectionStandards?: string;
    offCondition?: string;
    reasonsForRenewal?: string;
    renewalDat?: string;
    renewalDatUnit?: string;
    renewalDate?: string;
    renewalApplyMan?: string;
    renewalApprovedMan?: string;
    correctiveAction?: string;
    closeDate?: string;
    closeMan?: string;
    controlList?: string;
    feedbackMan?: string;
    feedbackDate?: string;
    feedbackComnet?: string;
    note?: string;
    inputterId?: string;
    inputter?: string;
    inputterDate?: string;
    opeartorName?: string;
    opeartorId?: string;
    opeartorDate?: string;
    status?: string;
    oldDdfNo?: string;
    nowDdfNo?: string;
    repairPeriodFc?: string;
    repairPeriodFh?: string;
    closeApprovedMan?: string;
    actype?: string;
    dyd?: string;
    fh?: string;
    fc?: string;
    fld?: string;
    nextA?: string;
    nextC?: string;
    melNo?: string;
    seatNo?: string;
    mNo?: string;
    repeatCheck?: string;
    etopsPkid?: string;
    lsMemo?: string;
    sgMemo?: string;
    ls?: string;
    sp?: string;
    sg?: string;
    oi?: string;
    approveEmp?: string;
    approver?: string;
    approveDate?: string;
    reviewEmp?: string;
    reviewName?: string;
    reviewDate?: string;
    renewInsPkid?: string;
    repairDate?: string;
    zbPkid?: string;
    closePkid?: string;
    outPkid?: string;
    type?: string;
    repeatDay?: string;
    repeatFh?: string;
    repeatFc?: string;
    hdCheck?: string;
    rePkids?: string;
    ata2?: string;
    otherRp?: string;
    faurepEn?: string;
    etopsNo?: string;
    spSon?: string;
    otherRpCheck?: string;
    etops?: string;
    xbTime?: string;
    nextADesc?: string;
    nextCDesc?: string;
    notes?: string;
    repeatCheckRe?: string;
    scalDate?: string;
    flbNo?: string;
    srcNrc?: string;
    ts?: string;
    tsMemo?: string;
    transfer?: string;
    ifBusiness?: string;
    postTreatment?: string;
    ataSource?: string;
    persons?: string;
    th?: string;
    operationalDesc?: string;
}

// 外站数据完整实体接口
export interface MelOutstationFullEntity {
    pkid: number;
    ddfNo: string;
    acReg: string;
    ata1: string;
    status: string;
    flightSite: string;
    des: string;
    melNo: string;
    seatNo: string;
    corrAction: string;
    ifLimit: string;
    inputter: string;
    inputterDate: string;
    applyDate: string;
    modifyBy: string;
    modifyDate: string;
    closeBy: string;
    closeDate: string;
    creatName: string;
    closeName: string;
    updateTime: string;
    actype: string;
    ata2: string;
}

// MEL完整实体接口 - 联合类型
export type MelFullEntity = MelBaseFullEntity | MelOutstationFullEntity;

// MEL详情响应接口
export interface MelDetailResponse {
    source: string;
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