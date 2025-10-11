import request from '@/utils/request';
import type { DateRangeQueryDTO } from '@/types/common';

// 航空相关接口定义 (从 flight.interface.ts 移动而来)

// 服务器接口
export type FlightItem = {
    id?: number,
    date: string,
    bay: string,
    bayarr?: string,
    lineId?: number,
    flightNo?: string,
    carrier?: string,
    abroad?: boolean,
    acReg?: string,
    acType?: string,
    acLinkLine: number,
    flightKind?: string,
    flightType?: string,
    std?: string,
    etd?: string,
    atd?: string,
    sta?: string,
    eta?: string,
    ata?: string,
    cobt?: string,
    arr?: string,
    arrName?: string,
    dep: string,
    depName?: string,
    isAltn: Boolean
    isCancle: Boolean,
    isDelay: Boolean,
    isNoRelease: Boolean,
    isPatch: Boolean,
    isPrint: Boolean,
    isRelease: Boolean,
    isReturn: Boolean,
    isTelegram: Boolean,
    cancleType?: string,
    netWeightCargo?: number,
}

type multi = { total: number, avg?: number, max?: number, min?: number };

export type StatSingle = {
    name?: string,
    acRegs?: string[],
    hour?: number
    counter: number
    netWeightCargo: number
};
export type StatMulti = {
    name?: string,
    acRegs?: string[],
    hour: multi
    counter: multi,
    netWeightCargo: multi,
};

// 航班日期查询类型
export type FlightDateKey = "date" | "std" | "etd" | "atd" | "htd" | "sta" | "eta" | "ata" | "hta";

// 航班查询DTO
export interface FlightQueryDTO {
  dateKey?: FlightDateKey;
  startDate: Date | string;
  endDate: Date | string;
}

// 航班计划统计响应 (按日期和机型号分组的统计)
export type FlightPlanStats = Record<string, Record<string, number>>;

// 根据日期获取航班
export const getFlightsByDate = async (data: DateRangeQueryDTO & { userId?: string, idType?: string }): Promise<FlightItem[]> => {
    return request({
        url: '/flight/date',
        data,
    });
};

// 根据ATD获取航班
export const getFlightsByATD = async (data: DateRangeQueryDTO): Promise<FlightItem[]> => {
    return request({
        url: '/flight/atd',
        data,
    });
};

// 获取航班计划
export const getFlightPlan = async (data: DateRangeQueryDTO): Promise<FlightPlanStats> => {
    return request({
        url: '/flight/plan',
        data,
    });
};
