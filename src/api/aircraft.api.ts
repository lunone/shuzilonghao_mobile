import { request } from '@/utils/request';

// 飞机相关接口定义 (从 aircraft.interface.ts 移动而来)

export type AircraftItem = {
    acReg: string; // 注册号
    acType: string; // 机型
    acTypeLong?: string; // 机型
    filiale?: string  // 分公司
    restYn: string; // 是否有休息区(Y/N)
    dow?: number;  // 基本重量-近程
    doi?: number;   // 空重指数-近程
    startDate?: Date | string; // 服役日期
    endDate?: Date | string; // 退役日期
    maxDepartWeight: number; // 最大起飞重量
    maxLandfallWeight: number; // 最大着陆重量
    maxNoOilWeight: number; // 最大无油重量
    flyDevice?: string  // 飞机飞行设备
    validFlag: string; // 有效标志
    dowL?: number; // 基本重量-远程
    doiL?: number;  // 空重指数-远程
    oper: string; // 操作人
    opTime: Date | string; // 操作时间
    remarks: string; // 备注
    operIp: string; // IP地址
    operHost: string; // 主机名
    iscat2: string; // 是否CAT II
    typeSon: string; // 乘务机型
    restEquipmentLevel: string; // 休息设施等级维护（L1一级 L2二级 L3三级）
    barycenter: number; // 空机重心
    regId: string; // 飞机ID
    typeId: string; // 机型ID
    pOrC: string; // 客货标志
    carrier: string; // 承运人
    layout: string; // 布局
    class: string; // 飞机分类(预留,目前未用)
    totalLength: number; // 全长
    totalHeight: number; // 全高
    wingSpan: number; // 翼展
    winglet: string; // 小翼
    sfp: string; // short field performance 短跑道性能
    engPower: string; // 发动机推力
    maxSeatNum: number; // 总座位数
    availableSeatNum: number; // 可用座位数，计财维护
    oew: number; // 使用空重
    bew: number; // 基本空重
    oewIdx: number; // 空重指数oewIdx
    oewGc: number; // 空重重心oewGc
    maxTaxiWt: number; // 最大滑行重量maxTaxiWt
    limitTkofWt: number; // 起飞限重修正
    limitLndWt: number; // 着陆限重修正
    maxPayload: number; // 最大可用燃油maxPayload
    availableLoad: number; // 可用业载,计财维护availableLoad
    callFreq: string; // 选呼callFreq
    modS: string; // MODS码
    telNo: string; // 联系电话
    fltStartDate: Date | string; // 启用日期，在启用日期/停用日期之内可排班
    fltEndDate: Date | string; // 停用日期，在启用日期/停用日期之内可排班
    rvsmYn: string; // RVSM
    rnpApchYn: string; // RNP_APCH
    rnpArYn: string; // RNP_AR
    oxygenTime: number; // 供氧时长，以分钟为单位
    plateauYn: string; // 能否飞高原
    cat2Yn: string; // 是否CAT2
    rmk: string; // RMK项
    overwaterFlag: string; // 跨水标识
    extOverwaterFlag: string; // 延伸跨水
    hightPalteauFlag: string; // 能否飞高高原能力，Y是，N否
    etops: number; // ETOPS 分钟数
    dCode: string; // 飞机的D字码
    tenDeviceCodeA: string; // 第十项目设备能力A
    tenDeviceCodeB: string; // 第十项目设备能力B
    eighteenItemPbn: string; // 第十八项PBN
    eighteenItemO: string; // 第十八项其它
    restGrade: string; // 该飞机休息设施等级，1级，2级，3级
    cabinCount: number; // 客舱乘务员配备最低数量
    seatings: number; // 乘务员座位数
    invalidstart: Date | string; // 机上休息等级失效开始日期
    invalidend: Date | string; // 机上休息等级失效结束日期
    takelandGroupActype: string; // 长机型
    phone: string; // 卫星电话
    acTypeFtb: string; // 任务书打印长机型
    acTypeFpl: string; // FPL中使用的机型
    msn: number; // MSN号
    engineModel: string; // 发送机型号
    toga: number; // 起飞全发TOGA推力
    togaInvalid: number; // 起飞一发失效TOGA推力
    oxygenType: string; // 氧气类型
    oxygenCapacity: number; // 氧气能力
    tankWeight: number; // 油箱容量/重量
    taxiingConsumption: number; // 滑行油耗
    apuConsumption: number; // APU油耗
    consumption: number; // 小时耗油率
    tora: number; // TORA
    asda: number; // ASDA
    isCbp: string; // 是否有无碳刹车配件
    isFpa: string; // 是否场压机场
    isOsa: string; // 是否是运行规范中机场
    storeVolume: number; // 货仓容积
    extOverWaterFlagTemp: string; // 临时延伸跨水标识
    extOverWaterFlag: string; // 固化延伸跨水标识
    maxTakeOffWeight: number; // 最大起飞重量
    maxLandWeight: number; // 最大着陆重量
    maxZerofuelWeight: number; // 最大无油重量
    typeLong: string; // 长机型
    units: string; // 巡航方式
    isHf: string; // 是否有HF
    isSatelliteTelephone: string; // 便捷式或固定式卫星电话（0便携式1固定式）
    efbSpeedtoplimit: number; // EFB接口列，航速上限
    efbSpeedfloorlimit: number; // EFB接口列，航速下限
    efbOilweartoplimit: number; // EFB接口列，油耗上限
    efbOilwearfloorlimit: number; // EFB接口列，油耗下限
    efbHudflag: string; // EFB接口列，是否使用HUD设备
    efbGroundoil: number; // EFB接口列，飞机在地面每小时标准油耗
    eighteenItem19: string; // 补充情报第19项编组
};

// MEL查询DTO （日期+机号可选）
export interface MelQueryDTO {
  startDate: Date | string;
  endDate: Date | string;
  acReg?: string; // 机号可选
}

// MEL事件项
export interface MelItem {
  id?: number;
  acReg: string; // 机号
  melCode: string; // MEL代码
  description: string; // 描述
  category: string; // 分类
  deferralClass: string; // 延期等级
  rectificationDate?: Date | string; // 修复日期
  status: string; // 状态
  createdAt: Date | string; // 创建时间
  updatedAt?: Date | string; // 更新时间
}

// 飞机列表响应
export type AircraftListResponse = string[];

// 获取飞机列表
export const getAircrafts = (): Promise<AircraftListResponse> => {
    return request({ url: '/aircraft/list' });
};

// 获取MEL事件
export const getMels = (data: MelQueryDTO): Promise<MelItem[]> => {
    return request({ url: '/me/mel', data });
};
