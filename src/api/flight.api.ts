import request from '@/utils/request';
// 根据日期获取航班
export const getFlightsByDate = (data: any) => {
    return request({
        url: '/flight/date',
        data,
    });
};

// 根据ATD获取航班
export const getFlightsByATD = (data: any) => {
    return request({
        url: '/flight/atd',
        data,
    });
};

// 获取航班计划
export const getFlightPlan = (data: any) => {
    return request({
        url: '/flight/plan',
        data,
    });
};