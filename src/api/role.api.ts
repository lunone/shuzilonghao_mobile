import { request, get, post, put, del } from '@/utils/request';
import type { IdDTO } from '@/types/common';
import type { Role, Permission } from './permission.api';

// 创建角色
export const createRole = async (data: Partial<Role>): Promise<Role> => {
    return post({ url: '/system/roles', data });
};

// 更新角色
export const updateRole = async (data: { id: number; data: Partial<Role> }): Promise<any> => {
    return put({ url: `/system/roles/${data.id}`, data: data.data });
};

// 删除角色
export const deleteRole = async (id: number): Promise<void> => {
    return del({ url: `/system/roles/${id}` });
};

// 获取角色列表
export const getRoleList = async (data?: any): Promise<{ list: Role[]; total: number }> => {
    return get({ url: '/system/roles', data });
};

// 分配权限
export const assignPermissions = async (data: { roleId: number; permissionIds: number[] }): Promise<void> => {
    return put({ url: `/system/roles/${data.roleId}/permissions`, data: { permissionIds: data.permissionIds } });
};

// 获取角色权限
export const getRolePermissions = async (roleId: number): Promise<Permission[]> => {
    return get({ url: `/system/roles/${roleId}/permissions` });
};
