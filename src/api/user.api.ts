import request from '@/utils/request';
import type { UserIdDTO, WxActivateDTO } from '@/types/common';

// 用户相关接口定义 (从 user.interface.ts 移动而来)

export type PilotItem = {
    name: string,
    userId: number,
    pcode: string,
    techs: { acType: string, techNo: string, techName: string }[],
}
export type CrewItem = {
    id?: string,
    flightId?: number,
    flightDate?: string,
    userId?: string,
    name?: string,
    level?: string,
}

export type DepartmenItem = {
    id: number,
    name: string,
    abbr?: string,
    order?: number,
    parentId: number,
}
export type WatchUser = {
    [x: string]: any;
    // 添加watch的User
    id?: number,
    userId: string,
    station: string,
    startDate?: Date | string,
    endDate?: Date | string,
    remark?: string,
    state?: number,
}
//
export type UserItem = {
    id: string,
    userId: string,
    name?: string,
    avatar?: string,
    gender?: number,
    position: string,
    department: number,
    // departmentName?: string,
    // topDepartmentId?: number,
    // topDepartmentName?: string,
    hireDate?: string,
    mobile?: string,
    contract?: string,
    contractMobile?: string,
    idCard?: string,
    district?: string,
    address?: string,
    status: number,
    // 角色和权限相关字段
    roles?: string[], // 角色代码数组
    permissions?: string[] // 权限代码数组
}

interface UserInitResponse {
  user: UserItem;
  permissionTree: any[];
}

// 初始化用户信息
export const initUser = async (): Promise<UserInitResponse> => {
    return request({
        url: '/user/init',
    });
};

// 登录
export const login = async (code: string): Promise<{ token: string }> => {
    return request({
        url: '/login/wx',
        data: { code },
    });
};

// 激活
export const activate = async (data: WxActivateDTO): Promise<{ token: string }> => {
    return request({
        url: '/login/activate',
        data,
    });
};

// 获取用户档案
export const getUserProfile = async (data: UserIdDTO): Promise<any> => {
    return request({
        url: '/user/profile',
        data,
    });
};

// 获取员工列表
export const getStaffList = async (): Promise<UserItem[]> => {
    return request({
        url: '/user/staff',
    });
};

// 获取用户角色列表
export const getUserRoles = async (data: UserIdDTO): Promise<string[]> => {
    return request({
        url: '/user/userRoles',
        data,
    });
};

// 获取用户权限代码列表
export const getUserPermissionCodes = async (data: UserIdDTO): Promise<string[]> => {
    return request({
        url: '/user/userPermissionCodes',
        data,
    });
};

// 检查用户权限
export const checkUserPermission = async (data: { userId: string; permissionCode: string }): Promise<boolean> => {
    return request({
        url: '/user/hasPermission',
        data,
    });
};

// 检查用户角色
export const checkUserRole = async (data: { userId: string; roleCode: string }): Promise<boolean> => {
    return request({
        url: '/user/hasRole',
        data,
    });
};

// 为用户分配角色
export const assignRolesToUser = async (data: { userId: string; roleIds: number[] }): Promise<void> => {
    return request({
        url: '/user/assignRoles',
        data,
    });
};

// 获取用户权限列表
export const getUserPermissions = async (data: UserIdDTO): Promise<any[]> => {
    return request({
        url: '/user/userPermissions',
        data,
    });
};
