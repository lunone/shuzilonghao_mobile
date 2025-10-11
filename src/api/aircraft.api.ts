import request from '@/utils/request';
// 获取飞机列表
export const getAircrafts = async () => {
    const res = await request({
        url: '/aircraft/list',
    });
    return res.data.data;
};

// 获取MEL事件
export const getMels = async (data: any) => {
    const res = await request({
        url: '/me/mel',
        data,
    });
    return res.data.data;
};
