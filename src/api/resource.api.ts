import request from '@/utils/request';
// 创建资源
export const createResource = (data: any) => {
    return request({
        url: '/system/resource/create',
        data,
    });
};

// 更新资源
export const updateResource = (data: any) => {
    return request({
        url: '/system/resource/update',
        data,
    });
};

// 删除资源
export const deleteResource = (data: any) => {
    return request({
        url: '/system/resource/delete',
        data,
    });
};

// 获取资源详情
export const getResourceDetail = (data: any) => {
    return request({
        url: '/system/resource/detail',
        data,
    });
};

// 获取资源列表
export const getResourceList = () => {
    return request({
        url: '/system/resource/list',
    });
};

// 获取资源树
export const getResourceTree = () => {
    return request({
        url: '/system/resource/tree',
    });
};

// 批量创建资源
export const batchCreateResource = (data: any) => {
    return request({
        url: '/system/resource/batchCreate',
        data,
    });
};

// 批量更新资源
export const batchUpdateResource = (data: any) => {
    return request({
        url: '/system/resource/batchUpdate',
        data,
    });
};

// 批量删除资源
export const batchDeleteResource = (data: any) => {
    return request({
        url: '/system/resource/batchDelete',
        data,
    });
};

// 分配资源权限
export const assignResourcePermissions = (data: any) => {
    return request({
        url: '/system/resource/assignPermissions',
        data,
    });
};

// 获取资源权限
export const getResourcePermissions = (data: any) => {
    return request({
        url: '/system/resource/resourcePermissions',
        data,
    });
};

// 获取资源权限ID
export const getResourcePermissionIds = (data: any) => {
    return request({
        url: '/system/resource/resourcePermissionIds',
        data,
    });
};

// 获取拥有某个权限的资源列表
export const getPermissionResources = (data: any) => {
    return request({
        url: '/system/permission/resources',
        data,
    });
};