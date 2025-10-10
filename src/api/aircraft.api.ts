import request from '@/utils/request';
// 获取飞机列表
export const getAircrafts = () => {
    return request({
        url: '/aircraft/list',
    });
};

// 获取MEL事件
export const getMels = (data: any) => {
    return request({
        url: '/me/mel',
        data,
    });
};
