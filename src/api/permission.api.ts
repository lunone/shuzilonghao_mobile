import request from '@/utils/request';
import type { IdDTO, BaseEntity, DateRangeQueryDTO } from '@/interface/common.interface';

interface Permission extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  parentId?: number;
  type: string;
  sort?: number;
}

// 创建权限
export const createPermission = async (data: Partial<Permission>): Promise<Permission> => {
    return request({
        url: '/system/permission/create',
        data,
    });
};

// 更新权限
export const updatePermission = async (data: { id: number; data: Partial<Permission> }): Promise<Permission> => {
    return request({
        url: '/system/permission/update',
        data,
    });
};

// 删除权限
export const deletePermission = async (data: IdDTO): Promise<void> => {
    return request({
        url: '/system/permission/delete',
        data,
    });
};

// 获取权限列表
export const getPermissionList = async (data?: any): Promise<Permission[]> => {
    return request({
        url: '/system/permission/list',
        data,
    });
};

// 获取权限树
export const getPermissionTree = async (): Promise<any[]> => {
    return request({
        url: '/system/permission/tree',
    });
};

// 创建权限操作
export const createPermissionAction = async (data: any): Promise<any> => {
    return request({
        url: '/system/permission-action/create',
        data,
    });
};

// 更新权限操作
export const updatePermissionAction = async (data: any): Promise<any> => {
    return request({
        url: '/system/permission-action/update',
        data,
    });
};

// 删除权限操作
export const deletePermissionAction = async (data: any): Promise<any> => {
    return request({
        url: '/system/permission-action/delete',
        data,
    });
};

// 获取权限操作详情
export const getPermissionActionDetail = async (data: any): Promise<any> => {
    return request({
        url: '/system/permission-action/detail',
        data,
    });
};

// 获取权限操作列表
export const getPermissionActionList = async (): Promise<any[]> => {
    return request({
        url: '/system/permission-action/list',
    });
};
