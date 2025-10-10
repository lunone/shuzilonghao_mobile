import request from '@/utils/request';
// 创建权限
export const createPermission = (data: any) => {
    return request({
        url: '/system/permission/create',
        data,
    });
};

// 更新权限
export const updatePermission = (data: any) => {
    return request({
        url: '/system/permission/update',
        data,
    });
};

// 删除权限
export const deletePermission = (data: any) => {
    return request({
        url: '/system/permission/delete',
        data,
    });
};

// 获取权限列表
export const getPermissionList = () => {
    return request({
        url: '/system/permission/list',
    });
};

// 获取权限树
export const getPermissionTree = () => {
    return request({
        url: '/system/permission/tree',
    });
};

// 创建权限操作
export const createPermissionAction = (data: any) => {
    return request({
        url: '/system/permission-action/create',
        data,
    });
};

// 更新权限操作
export const updatePermissionAction = (data: any) => {
    return request({
        url: '/system/permission-action/update',
        data,
    });
};

// 删除权限操作
export const deletePermissionAction = (data: any) => {
    return request({
        url: '/system/permission-action/delete',
        data,
    });
};

// 获取权限操作详情
export const getPermissionActionDetail = (data: any) => {
    return request({
        url: '/system/permission-action/detail',
        data,
    });
};

// 获取权限操作列表
export const getPermissionActionList = () => {
    return request({
        url: '/system/permission-action/list',
    });
};