import request from '@/utils/request';
// 获取机组飞行小时统计
export const getStatCrewFh = (data: any) => {
    return request({
        url: '/stat/crew/fh',
        data,
    });
};

// 获取周期统计
export const getStatPeriod = (data: any) => {
    return request({
        url: '/stat/period',
        data,
    });
};

// 获取月度统计
export const getStatMonth = (data: any) => {
    return request({
        url: '/stat/month',
        data,
    });
};

// 按航空公司统计
export const getStatByAirline = (data: any) => {
    return request({
        url: '/stat/by/airline',
        data,
    });
};

// 按飞机统计
export const getStatByAircraft = (data: any) => {
    return request({
        url: '/stat/by/aircraft',
        data,
    });
};

// 按站点统计
export const getStatByStation = (data: any) => {
    return request({
        url: '/stat/by/station',
        data,
    });
};

// 获取机组同事统计
export const getCrewMate = (data: any) => {
    return request({
        url: '/stat/crew/mate',
        data,
    });
};

// 获取机组疲劳统计
export const getCrewFatigue = (data: any) => {
    return request({
        url: '/stat/crew/fatigue',
        data,
    });
};