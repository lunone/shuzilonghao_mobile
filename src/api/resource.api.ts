import { request, get, post, put, del } from '@/utils/request';
import type { IdDTO } from '@/types/common';
import type { Resource } from './permission.api';
// 创建资源
export const createResource = async (data: Partial<Resource>): Promise<Resource> => {
    return post({ url: '/system/permissions', data });
};

// 更新资源
export const updateResource = async (data: { id: number; data: Partial<Resource> }): Promise<any> => {
    return put({ url: `/system/permissions/${data.id}`, data: data.data });
};

// 删除资源
export const deleteResource = async (id: number): Promise<void> => {
    return del({ url: `/system/permissions/${id}` });
};

// 获取资源详情
export const getResourceDetail = async (id: number): Promise<Resource> => {
    return get({ url: `/system/permissions/${id}` });
};

// 获取资源列表
export const getResourceList = async (data?: any): Promise<Resource[]> => {
    return get({ url: '/system/permissions', data });
};

// 获取资源树
export const getResourceTree = async (): Promise<any[]> => {
    return get({ url: '/system/permissions/tree' });
};

// 批量创建资源
export const batchCreateResource = async (data: Partial<Resource>[]): Promise<Resource[]> => {
    return post({ url: '/system/permissions/batch', data });
};

// 批量更新资源
export const batchUpdateResource = async (data: { id: number; data: Partial<Resource> }[]): Promise<Resource[]> => {
    return put({ url: '/system/permissions/batch', data });
};

// 批量删除资源
export const batchDeleteResource = async (ids: number[]): Promise<void> => {
    return del({ url: '/system/permissions/batch', data: ids });
};

// 分配资源权限
export const assignResourcePermissions = async (data: { roleId: number; permissionIds: number[] }): Promise<void> => {
    return put({ url: `/system/roles/${data.roleId}/permissions`, data: { permissionIds: data.permissionIds } });
};

// 获取资源权限
export const getResourcePermissions = async (roleId: number): Promise<any[]> => {
    return get({ url: `/system/roles/${roleId}/permissions` });
};

// 获取资源权限ID
export const getResourcePermissionIds = async (roleId: number): Promise<number[]> => {
    return get({ url: `/system/roles/${roleId}/permissions` });
};

// 获取拥有某个权限的资源列表
export const getPermissionResources = async (roleId: number): Promise<Resource[]> => {
    return get({ url: `/system/roles/${roleId}/users` });
};
