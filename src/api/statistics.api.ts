import request from '@/utils/request';
import type { DateRangeQueryDTO } from '@/interface/common.interface';
import type {
  CrewHourStats,
  PeriodStats,
  MonthlyStats,
  AirlineStats,
  StationStatsDTO,
  StationStats,
  CrewMateStats,
  CrewFatigueStats,
  CrewCrewMateStats,
  CrewFatigueStatsResponse
} from '@/interface/stat.interface';

// 获取机组飞行小时统计
export const getStatCrewFh = async (data: DateRangeQueryDTO): Promise<CrewHourStats[]> => {
    return request({
        url: '/stat/crew/fh',
        data,
    });
};

// 获取周期统计
export const getStatPeriod = async (data: DateRangeQueryDTO): Promise<PeriodStats> => {
    return request({
        url: '/stat/period',
        data,
    });
};

// 获取月度统计
export const getStatMonth = async (data: DateRangeQueryDTO): Promise<MonthlyStats[]> => {
    return request({
        url: '/stat/month',
        data,
    });
};

// 按航空公司统计
export const getStatByAirline = async (data: DateRangeQueryDTO): Promise<AirlineStats[]> => {
    return request({
        url: '/stat/by/airline',
        data,
    });
};

// 按飞机统计
export const getStatByAircraft = async (data: DateRangeQueryDTO): Promise<any[]> => {
    return request({
        url: '/stat/by/aircraft',
        data,
    });
};

// 按站点统计
export const getStatByStation = async (data: StationStatsDTO): Promise<StationStats[]> => {
    return request({
        url: '/stat/by/station',
        data,
    });
};

// 获取机组同事统计
export const getCrewMate = async (data: CrewMateStats): Promise<CrewCrewMateStats[]> => {
    return request({
        url: '/stat/crew/mate',
        data,
    });
};

// 获取机组疲劳统计
export const getCrewFatigue = async (data: CrewFatigueStats): Promise<CrewFatigueStatsResponse[]> => {
    return request({
        url: '/stat/crew/fatigue',
        data,
    });
};
