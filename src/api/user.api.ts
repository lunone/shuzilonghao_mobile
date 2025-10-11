import { request } from '@/utils/request';
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
export const initUser = (): Promise<UserInitResponse> => {
    return request('/user/init');
};

// 登录
export const login = (code: string): Promise<{ token: string }> => {
    return request('/login/wx', { code });
};

// 激活
export const activate = (data: WxActivateDTO): Promise<{ token: string }> => {
    return request('/login/activate', data);
};

// 获取用户档案
export const getUserProfile = (data: UserIdDTO): Promise<any> => {
    return request('/user/profile', data);
};

// 获取员工列表
export const getStaffList = (): Promise<UserItem[]> => {
    return request('/user/staff');
};

// 获取用户角色列表
export const getUserRoles = (data: UserIdDTO): Promise<string[]> => {
    return request('/user/userRoles', data);
};

// 获取用户权限代码列表
export const getUserPermissionCodes = (data: UserIdDTO): Promise<string[]> => {
    return request('/user/userPermissionCodes', data);
};

// 检查用户权限
export const checkUserPermission = (data: { userId: string; permissionCode: string }): Promise<boolean> => {
    return request('/user/hasPermission', data);
};

// 检查用户角色
export const checkUserRole = (data: { userId: string; roleCode: string }): Promise<boolean> => {
    return request('/user/hasRole', data);
};

// 为用户分配角色
export const assignRolesToUser = (data: { userId: string; roleIds: number[] }): Promise<void> => {
    return request('/user/assignRoles', data);
};

// 获取用户权限列表
export const getUserPermissions = (data: UserIdDTO): Promise<any[]> => {
    return request('/user/userPermissions', data);
};
