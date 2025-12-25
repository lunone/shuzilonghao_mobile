import { request, get } from '@/utils/request';
import type { DateRangeQueryDTO } from '@/types/common';

// 统计相关接口定义 (从 stat.interface.ts 移动而来)


// 周期统计和
export interface PeriodStats {
    counter: number;
    hour: number;
    netWeightCargo: number;
    averageLoadFactor?: number;
}

// 月度统计
export interface MonthlyStats {
    year: number;
    month: number;
    flightCount: number;
    totalHours: number;
    netWeightCargo: number;
    activeDays: number;
}

// 按航空公司统计
export interface AirlineStats {
    airlineCode: string;
    airlineName: string;
    flightCount: number;
    totalHours: number;
    marketShare: number;
}

// 按站点统计DTO
export interface StationStatsDTO {
    station: string;
    startDate: Date | string;
    endDate: Date | string;
}

// 按站点统计响应
export interface StationStats {
    station: string;
    flightCount: number;
    totalHours: number;
    averageDelay: number;
    netWeightCargo: number;
}


// 航线统计数据类型（更新后的结构 - 飞机数据直接平铺在根级别）
export interface AircraftStats {
    counter: number;         // 航班总数
    hour: { total: number, avg: number, max: number, min: number }; // 飞行时间统计
    netWeightCargo: { total: number, avg: number, max: number, min: number }; // 货量统计
    acType?: string;         // 飞机型号（可选）
}

export interface RouteStatistics {
    total: {                // 总统计
        counter: number;     // 航班总数
        hour: { total: number, avg: number, max: number, min: number };     // 总飞行小时
        netWeightCargo: { total: number, avg: number, max: number, min: number };  // 总货量（吨）
    };
    // 飞机数据直接平铺在根级别，其他字段包含飞机注册号为key的统计数据
    [key: string]: AircraftStats | RouteStatistics['total'] | undefined;
}

// 航线统计查询DTO
export interface RouteStatisticsQueryDTO {
    route: string;
    startDate: string;
    endDate: string;
    carrier?: string;
}

// 获取周期统计
export const getStatPeriod = (data: DateRangeQueryDTO): Promise<PeriodStats> => {
    return get({ url: '/stats/summary', data });
};

// 获取月度统计
export const getStatMonth = (data: DateRangeQueryDTO): Promise<MonthlyStats[]> => {
    return get({ url: '/stats/monthly', data });
};

// 按航空公司统计
export const getStatByAirline = (data: DateRangeQueryDTO): Promise<AirlineStats[]> => {
    return get({ url: '/stats/airline', data });
};

// 按飞机统计
export const getStatByAircraft = (data: DateRangeQueryDTO): Promise<any[]> => {
    return get({ url: '/stats/airline', data });
};

// 按站点统计
export const getStatByStation = (data: StationStatsDTO): Promise<StationStats[]> => {
    return get({ url: '/stats/station', data });
};



// 获取航线统计数据
export const getRouteStatistics = async (data: RouteStatisticsQueryDTO): Promise<RouteStatistics> => {
    return get({ url: '/stats/route', data });
};

// ==================== 首页统计摘要 API ====================

// 单个指标的完整数据
export interface MetricData {
    theDayBeforeYesterday: number;  // 前天
    yesterday: number;              // 昨天
    lastYear: number;               // 去年
    thisYear: number;               // 今年
    dayRate: number | null;    // 日变化率（小数）
    yearRate: number | null;   // 年变化率（小数）
}

// 时间信息
export interface TimeInfo {
    theDayBeforeYesterday: [string, string];  // 前天 [start, end]
    yesterday: [string, string];              // 昨天 [start, end]
    lastYear: [string, string];               // 去年 [start, end]
    thisYear: [string, string];               // 今年 [start, end]
}

// 首页统计响应
export interface IndexSummaryResponse {
    time: TimeInfo;
    counter: MetricData;
    netWeightCargo: MetricData;
    hour: MetricData;
}

// 获取首页统计摘要
export const getIndexSummary = (date: string): Promise<IndexSummaryResponse> => {
    return get({ url: '/stats/index-summary', data: { date } });
};
