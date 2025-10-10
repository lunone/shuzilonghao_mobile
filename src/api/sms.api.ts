import request from '@/utils/request';
// 获取SMS统计
export const getSmsStat = (data: any) => {
    return request({
        url: '/sms/stat',
        data,
    });
};

// 获取SMS事件列表
export const getSmsEvents = (data: any) => {
    return request({
        url: '/sms/event/list',
        data,
    });
};

// 获取SMS自愿报告列表
export const getSmsVoluntarys = (data: any) => {
    return request({
        url: '/sms/voluntary/list',
        data,
    });
};