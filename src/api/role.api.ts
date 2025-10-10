import request from '@/utils/request';
// 创建角色
export const createRole = (data: any) => {
    return request({
        url: '/system/role/create',
        data,
    });
};

// 更新角色
export const updateRole = (data: any) => {
    return request({
        url: '/system/role/update',
        data,
    });
};

// 删除角色
export const deleteRole = (data: any) => {
    return request({
        url: '/system/role/delete',
        data,
    });
};

// 获取角色列表
export const getRoleList = () => {
    return request({
        url: '/system/role/list',
    });
};

// 分配权限
export const assignPermissions = (data: any) => {
    return request({
        url: '/system/role/assign-permissions',
        data,
    });
};

// 获取角色权限
export const getRolePermissions = (data: any) => {
    return request({
        url: '/system/role/permissions',
        data,
    });
};