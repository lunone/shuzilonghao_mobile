import request from '@/utils/request';
// 获取飞行员列表
export const getPilots = () => {
    return request({
        url: '/pilot/list',
    });
};

// 获取飞行员信息
export const getPilotProfile = (data: any) => {
    return request({
        url: '/pilot/profile',
        data,
    });
};

// 获取飞行员值班信息
export const getPilotDuty = (data: any) => {
    return request({
        url: '/pilot/duty',
        data,
    });
};

// 获取飞行员缺勤信息
export const getPilotAbsence = (data: any) => {
    return request({
        url: '/pilot/absence',
        data,
    });
};

// 获取飞行员培训信息
export const getPilotTraining = (data: any) => {
    return request({
        url: '/pilot/training',
        data,
    });
};