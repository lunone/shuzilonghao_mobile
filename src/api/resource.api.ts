import { request } from '@/utils/request';
import type { IdDTO } from '@/types/common';
import type { Resource } from './permission.api';
// 创建资源
export const createResource = async (data: Partial<Resource>): Promise<Resource> => {
    return request({ url: '/system/resource/create', data });
};

// 更新资源
export const updateResource = async (data: { id: number; data: Partial<Resource> }): Promise<any> => {
    return request({ url: '/system/resource/update', data });
};

// 删除资源
export const deleteResource = async (data: IdDTO): Promise<void> => {
    return request({ url: '/system/resource/delete', data });
};

// 获取资源详情
export const getResourceDetail = async (data: IdDTO): Promise<Resource> => {
    return request({ url: '/system/resource/detail', data });
};

// 获取资源列表
export const getResourceList = async (): Promise<Resource[]> => {
    return request({ url: '/system/resource/list' });
};

// 获取资源树
export const getResourceTree = async (): Promise<any[]> => {
    return request({ url: '/system/resource/tree' });
};

// 批量创建资源
export const batchCreateResource = async (data: Partial<Resource>[]): Promise<Resource[]> => {
    return request({ url: '/system/resource/batchCreate', data });
};

// 批量更新资源
export const batchUpdateResource = async (data: { id: number; data: Partial<Resource> }[]): Promise<Resource[]> => {
    return request({ url: '/system/resource/batchUpdate', data });
};

// 批量删除资源
export const batchDeleteResource = async (data: IdDTO[]): Promise<void> => {
    return request({ url: '/system/resource/batchDelete', data });
};

// 分配资源权限
export const assignResourcePermissions = async (data: { resourceId: number; permissionIds: number[] }): Promise<void> => {
    return request({ url: '/system/resource/assignPermissions', data });
};

// 获取资源权限
export const getResourcePermissions = async (data: IdDTO): Promise<any[]> => {
    return request({ url: '/system/resource/resourcePermissions', data });
};

// 获取资源权限ID
export const getResourcePermissionIds = async (data: IdDTO): Promise<number[]> => {
    return request({ url: '/system/resource/resourcePermissionIds', data });
};

// 获取拥有某个权限的资源列表
export const getPermissionResources = async (data: IdDTO): Promise<Resource[]> => {
    return request({ url: '/system/permission/resources', data });
};
