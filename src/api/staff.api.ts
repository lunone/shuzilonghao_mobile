import request from '@/utils/request';
// 获取员工信息
export const getStaff = () => {
    return request({
        url: '/user/staff',
    });
};

// 获取部门列表
export const getDepartments = () => {
    return request({
        url: '/department/list',
    });
};

// 获取今日值班信息
export const getDutyToday = () => {
    return request({
        url: '/duty/today',
    });
};