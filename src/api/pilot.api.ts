import request from '@/utils/request';
// 获取飞行员列表
export const getPilots = async () => {
    const res = await request({
        url: '/pilot/list',
    });
    return res.data.data;
};

// 获取飞行员信息
export const getPilotProfile = async (data: any) => {
    const res = await request({
        url: '/pilot/profile',
        data,
    });
    return res.data.data;
};

// 获取飞行员值班信息
export const getPilotDuty = async (data: any) => {
    const res = await request({
        url: '/pilot/duty',
        data,
    });
    return res.data.data;
};

// 获取飞行员缺勤信息
export const getPilotAbsence = async (data: any) => {
    const res = await request({
        url: '/pilot/absence',
        data,
    });
    return res.data.data;
};

// 获取飞行员培训信息
export const getPilotTraining = async (data: any) => {
    const res = await request({
        url: '/pilot/training',
        data,
    });
    return res.data.data;
};

// 获取飞行员机搭子信息
export const getPilotCrewMate = async (data: any) => {
    const res = await request({
        url: '/crew/mate',
        data,
    });
    return res.data.data;
};

// 获取飞行员疲劳信息
export const getPilotFatigue = async (data: any) => {
    const res = await request({
        url: '/crew/fatigue',
        data,
    });
    return res.data.data;
};
