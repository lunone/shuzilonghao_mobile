import { request } from '@/utils/request';
import type { UserIdDTO, WxActivateDTO } from '@/types/common';
import { PermissionTree } from './permission.api'; // <--- ADD THIS IMPORT

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
    name?: string,
    avatar?: string,
    gender?: number,
    phone?: string,
    position: string,
    department: number,
    type: string,
    relatedId?: string,
    email?: string,
    mobile?: string,
    status: number,
    lastLogin?: Date,
    regTime?: Date,
}

interface UserInitResponse {
    user: UserItem;
    permissionTree: PermissionTree[];
}

// 初始化用户信息
export const initUser = (): Promise<UserInitResponse> => {
    // 关键操作，失败时应抛出异常
    return request({ url: '/user/init' });
};

// 登录
export const login = (code: string): Promise<{ token: string }> => {
    // 关键操作，失败时应抛出异常
    return request({ url: '/login/wx', data: { code } });
};

// 激活
export const activate = (data: WxActivateDTO): Promise<{ token: string }> => {
    // 关键操作，失败时应抛出异常
    return request({ url: '/login/activate', data });
};

// 获取用户档案
export const getUserProfile = (data: UserIdDTO): Promise<any> => {
    // 获取数据，失败时返回null
    return request({ url: '/user/profile', data, defaultValue: null });
};

// 获取员工列表
export const getStaffList = (): Promise<UserItem[]> => {
    // 获取列表，失败时返回空数组
    return request({ url: '/staff/list', defaultValue: [] });
};

// 获取用户角色列表
export const getUserRoles = (data: UserIdDTO): Promise<string[]> => {
    // 获取列表，失败时返回空数组
    return request({ url: '/user/userRoles', data, defaultValue: [] });
};

// 获取用户权限代码列表
export const getUserPermissionCodes = (data: UserIdDTO): Promise<string[]> => {
    // 获取列表，失败时返回空数组
    return request({ url: '/user/userPermissionCodes', data, defaultValue: [] });
};

// 检查用户权限
export const checkUserPermission = (data: { userId: string; permissionCode: string }): Promise<boolean> => {
    // 检查权限，失败时应返回false
    return request({ url: '/user/hasPermission', data, defaultValue: false });
};

// 检查用户角色
export const checkUserRole = (data: { userId: string; roleCode: string }): Promise<boolean> => {
    // 检查角色，失败时应返回false
    return request({ url: '/user/hasRole', data, defaultValue: false });
};

// 为用户分配角色
export const assignRolesToUser = (data: { userId: string; roleIds: number[] }): Promise<void> => {
    // 关键操作，失败时应抛出异常
    return request({ url: '/user/assignRoles', data });
};

// 获取用户权限列表
export const getUserPermissions = (data: UserIdDTO): Promise<any[]> => {
    // 获取列表，失败时返回空数组
    return request({ url: '/user/userPermissions', data, defaultValue: [] });
};

/**
 * @description 确认扫码登录
 * @param ticketId 扫码获取的ticketId
 */
export const confirmQrLogin = (ticketId: string): Promise<any> => {
    return request({ url: '/login/qr/confirm', data: { ticketId } });
};


/**
 * @description 获取服务器状态信息
 * @returns Promise<{ message: string }>
 */
export const getServerStatus = () => {
    return request<{ message: string }>({
        url: '/api/status',
        auth: false, // 明确指定此请求无需认证
        hideErrorToast: true,
        noRetryOnFail: true, // 禁止此请求在失败时触发自动重试登录
        defaultValue: { message: '无法连接到服务器，请检查您的网络连接。' }
    });
};
