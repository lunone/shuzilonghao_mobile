import request from '@/utils/request';
import type { StaffListQueryDTO, StaffProfile, DutyTodayResponse } from '@/interface/staff.interface';
import type { DepartmenItem } from '@/interface/user.interface';

// 获取员工信息
export const getStaff = async (data?: StaffListQueryDTO): Promise<StaffProfile[]> => {
    return request({
        url: '/user/staff',
        data,
    });
};

// 获取部门列表
export const getDepartments = async (): Promise<DepartmenItem[]> => {
    return request({
        url: '/department/list',
    });
};

// 获取今日值班信息
export const getDutyToday = async (): Promise<DutyTodayResponse[]> => {
    return request({
        url: '/duty/today',
    });
};
