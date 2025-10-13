import { request } from '@/utils/request';
import type { DateRangeQueryDTO } from '@/types/common';

// 统计相关接口定义 (从 stat.interface.ts 移动而来)

// 机组飞行小时统计
export interface CrewHourStats {
  pilotCode: string;
  pilotName: string;
  totalHours: number;
  monthStats: Record<string, number>;
}

// 周期统计和
export interface PeriodStats {
  totalFlights: number;
  totalHours: number;
  totalNetWeightCargo: number;
  averageLoadFactor: number;
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
}

// 机组同事统计
export interface CrewMateStats {
  pcode: string;
  startDate: Date | string;
  endDate: Date | string;
}

// 机组疲劳统计
export interface CrewFatigueStats {
  pcode: string;
  startDate: Date | string;
  endDate: Date | string;
}

// 机组机搭子统计响应
export interface CrewCrewMateStats {
  pilotA: string;
  pilotB: string;
  flightCount: number;
  totalHours: number;
}

// 机组疲劳统计响应
export interface CrewFatigueStatsResponse {
  pilotCode: string;
  fatigueLevel: 'low' | 'medium' | 'high';
  restHours: number;
  flightHours: number;
  lastRest: Date | string;
}

// 获取机组飞行小时统计
export const getStatCrewFh = (data: DateRangeQueryDTO): Promise<CrewHourStats[]> => {
    return request({ url: '/stat/crew/fh', data });
};

// 获取周期统计
export const getStatPeriod = (data: DateRangeQueryDTO): Promise<PeriodStats> => {
    return request({ url: '/stat/period', data });
};

// 获取月度统计
export const getStatMonth = (data: DateRangeQueryDTO): Promise<MonthlyStats[]> => {
    return request({ url: '/stat/month', data });
};

// 按航空公司统计
export const getStatByAirline = (data: DateRangeQueryDTO): Promise<AirlineStats[]> => {
    return request({ url: '/stat/by/airline', data });
};

// 按飞机统计
export const getStatByAircraft = (data: DateRangeQueryDTO): Promise<any[]> => {
    return request({ url: '/stat/by/aircraft', data });
};

// 按站点统计
export const getStatByStation = (data: StationStatsDTO): Promise<StationStats[]> => {
    return request({ url: '/stat/by/station', data });
};

// 获取机组同事统计
export const getCrewMate = (data: CrewMateStats): Promise<CrewCrewMateStats[]> => {
    return request({ url: '/stat/crew/mate', data });
};

// 获取机组疲劳统计
export const getCrewFatigue = (data: CrewFatigueStats): Promise<CrewFatigueStatsResponse[]> => {
    return request({ url: '/stat/crew/fatigue', data });
};
