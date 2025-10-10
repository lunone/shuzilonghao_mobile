import request from '@/utils/request';
// 获取机场列表
export const getAirports = () => {
    return request({
        url: '/airport/code4',
    });
};