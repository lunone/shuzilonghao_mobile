import request from '@/utils/request';
import type { FlightQueryDTO, FlightItem, FlightPlanStats } from '@/interface/flight.interface';
import type { DateRangeQueryDTO } from '@/interface/common.interface';

// 根据日期获取航班
export const getFlightsByDate = async (data: DateRangeQueryDTO): Promise<FlightItem[]> => {
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
