import {request} from '@/utils/request';
import type { IdDTO } from '@/types/common';
import type { Role, Permission } from './permission.api';

// 创建角色
export const createRole = async (data: Partial<Role>): Promise<Role> => {
    return request('/system/role/create', data);
};

// 更新角色
export const updateRole = async (data: { id: number; data: Partial<Role> }): Promise<any> => {
    return request('/system/role/update', data);
};

// 删除角色
export const deleteRole = async (data: IdDTO): Promise<void> => {
    return request('/system/role/delete', data);
};

// 获取角色列表
export const getRoleList = async (data?: any): Promise<{ list: Role[]; total: number }> => {
    return request('/system/role/list', data);
};

// 分配权限
export const assignPermissions = async (data: { roleId: number; permissionIds: number[] }): Promise<void> => {
    return request('/system/role/assign-permissions', data);
};

// 获取角色权限
export const getRolePermissions = async (data: IdDTO): Promise<Permission[]> => {
    return request('/system/role/permissions', data);
};
