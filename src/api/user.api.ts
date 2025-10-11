import request from '@/utils/request';
// 初始化用户信息
export const initUser = () => {
    return request({
        url: '/user/init',
    }).then(res => res.data);
};

// 登录
export const login = (code: string) => {
    return request({
        url: '/login/wx',
        data: { code },
    }).then(res => res.data);
};

// 激活
export const activate = (data: any) => {
    return request({
        url: '/login/activate',
        data,
    }).then(res => res.data);
};

// 获取用户档案
export const getUserProfile = (data: { userId: string }) => {
    return request({
        url: '/user/profile',
        data,
    }).then(res => res.data);
};

// 获取员工列表
export const getStaffList = () => {
    return request({
        url: '/user/staff',
    }).then(res => res.data);
};

// 获取用户角色列表
export const getUserRoles = (data: { userId: string }) => {
    return request({
        url: '/user/userRoles',
        data,
    }).then(res => res.data);
};

// 获取用户权限代码列表
export const getUserPermissionCodes = (data: { userId: string }) => {
    return request({
        url: '/user/userPermissionCodes',
        data,
    }).then(res => res.data);
};

// 检查用户权限
export const checkUserPermission = (data: { userId: string, permissionCode: string }) => {
    return request({
        url: '/user/hasPermission',
        data,
    }).then(res => res.data);
};

// 检查用户角色
export const checkUserRole = (data: { userId: string, roleCode: string }) => {
    return request({
        url: '/user/hasRole',
        data,
    }).then(res => res.data);
};

// 为用户分配角色
export const assignRolesToUser = (data: { userId: string; roleIds: number[] }) => {
    return request({
        url: '/user/assignRoles',
        data,
    }).then(res => res.data);
};

// 获取用户权限列表
export const getUserPermissions = (data: { userId: string }) => {
    return request({
        url: '/user/userPermissions',
        data,
    }).then(res => res.data);
};
