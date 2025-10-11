import request from '@/utils/request';
// 创建权限
export const createPermission = (data: any) => {
    return request({
        url: '/system/permission/create',
        data,
    }).then(res => res.data);
};

// 更新权限
export const updatePermission = (data: any) => {
    return request({
        url: '/system/permission/update',
        data,
    }).then(res => res.data);
};

// 删除权限
export const deletePermission = (data: any) => {
    return request({
        url: '/system/permission/delete',
        data,
    }).then(res => res.data);
};

// 获取权限列表
export const getPermissionList = (data: any) => {
    return request({
        url: '/system/permission/list',
        data,
    }).then(res => res.data);
};

// 获取权限树
export const getPermissionTree = () => {
    return request({
        url: '/system/permission/tree',
    }).then(res => res.data);
};

// 创建权限操作
export const createPermissionAction = (data: any) => {
    return request({
        url: '/system/permission-action/create',
        data,
    }).then(res => res.data);
};

// 更新权限操作
export const updatePermissionAction = (data: any) => {
    return request({
        url: '/system/permission-action/update',
        data,
    }).then(res => res.data);
};

// 删除权限操作
export const deletePermissionAction = (data: any) => {
    return request({
        url: '/system/permission-action/delete',
        data,
    }).then(res => res.data);
};

// 获取权限操作详情
export const getPermissionActionDetail = (data: any) => {
    return request({
        url: '/system/permission-action/detail',
        data,
    }).then(res => res.data);
};

// 获取权限操作列表
export const getPermissionActionList = () => {
    return request({
        url: '/system/permission-action/list',
    }).then(res => res.data);
};