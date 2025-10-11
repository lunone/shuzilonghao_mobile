import request from '@/utils/request';
// 根据日期获取航班
export const getFlightsByDate = async (data: any) => {
    const res = await request({
        url: '/flight/date',
        data,
    });
    return res.data.data;
};

// 根据ATD获取航班
export const getFlightsByATD = (data: any) => {
    return request({
        url: '/flight/atd',
        data,
    });
};

// 获取航班计划
export const getFlightPlan = async (data: any) => {
    const res = await request({
        url: '/flight/plan',
        data,
    });
    return res.data.data;
};
