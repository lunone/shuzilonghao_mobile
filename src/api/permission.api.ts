import { request, get, post, put, del } from '@/utils/request';
import type { IdDTO, BaseEntity, DateRangeQueryDTO } from '@/types/common';

// 权限相关接口定义 (从 permission.interface.ts 移动而来)

// 权限接口 - 匹配新API结构
export interface Permission {
    id: number;
    name: string;
    code: string;
    description?: string;
    parentId?: number;
    type?: number; // 0: 菜单, 1: 按钮, 2: 接口
    path?: string;
    method?: string;
    orderNum?: number;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
    children?: Permission[];
    level?: number;
}

// 角色接口 - 匹配新API结构
export interface Role {
    id: number;
    name: string;
    code: string; // 如 'admin', 'manager', 'pilot', 'staff'
    description?: string;
    orderNum?: number;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// 用户权限接口 - 匹配新API结构
export interface UserRole {
    id: number;
    userId: string;
    roleId: number;
    createdAt?: string;
}

// 角色权限接口 - 匹配新API结构
export interface RolePermission {
    id: number;
    roleId: number;
    permissionId: number;
    createdAt?: string;
}

// 权限操作接口 - 新增
export interface PermissionAction {
    id: number;
    name: string;
    actionCode: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

// 资源接口 - 新增
export interface Resource {
    id: number;
    name: string;
    type: string; // menu, page, button, api
    identifier: string; // 如 system:user
    parentId?: number | null;
    description?: string;
    path?: string;
    icon?: string;
    orderNum?: number;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
    children?: Resource[];
    level?: number;
}

// 角色权限分配接口 - 新增
export interface RolePermissionAssignment {
    roleId: number;
    permissions: Array<{
        resourceId: number;
        actionIds: number[];
    }>;
}

// 资源权限接口 - 新增
export interface ResourcePermission {
    id: number;
    resourceId: number;
    permissionId: number;
    createdAt?: string;
}

// export interface UserPermission {
//     roles: string[]; // 角色ID数组
//     permissions: string[]; // 权限代码数组（扁平化，用于快速检查）
// }

// 权限资源类型枚举
export enum PermissionResource {
    FLIGHT = 'flight',
    USER = 'user',
    AIRCRAFT = 'aircraft',
    ANALYSIS = 'analysis',
    HR = 'hr',
    MAINTENANCE = 'maintenance',
    SALE = 'sale',
    SMS = 'sms',
    SYSTEM = 'system'
}

// 权限操作类型枚举
export enum PermissionActionType {
    READ = 'read',
    WRITE = 'write',
    DELETE = 'delete',
    MANAGE = 'manage',
    EXPORT = 'export'
}

// 常用权限代码常量
export const PERMISSION_CODES = {
    // 飞行相关
    FLIGHT_READ: 'flight:read',
    FLIGHT_WRITE: 'flight:write',
    FLIGHT_MANAGE: 'flight:manage',

    // 用户管理
    USER_READ: 'user:read',
    USER_WRITE: 'user:write',
    USER_MANAGE: 'user:manage',

    // 飞机管理
    AIRCRAFT_READ: 'aircraft:read',
    AIRCRAFT_WRITE: 'aircraft:write',
    AIRCRAFT_MANAGE: 'aircraft:manage',

    // 分析统计
    ANALYSIS_READ: 'analysis:read',
    ANALYSIS_EXPORT: 'analysis:export',

    // 人力资源
    HR_READ: 'hr:read',
    HR_WRITE: 'hr:write',
    HR_MANAGE: 'hr:manage',

    // 维修管理
    MAINTENANCE_READ: 'maintenance:read',
    MAINTENANCE_WRITE: 'maintenance:write',
    MAINTENANCE_MANAGE: 'maintenance:manage',

    // 销售管理
    SALE_READ: 'sale:read',
    SALE_WRITE: 'sale:write',
    SALE_MANAGE: 'sale:manage',

    // 安全管理
    SMS_READ: 'sms:read',
    SMS_WRITE: 'sms:write',
    SMS_MANAGE: 'sms:manage',

    // 系统管理
    SYSTEM_MANAGE: 'system:manage'
} as const;

// 角色常量
export const ROLE_CODES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    PILOT: 'pilot',
    STAFF: 'staff',
    GUEST: 'guest',
    AGENT: 'agent'
} as const;

// 创建权限
export const createPermission = async (data: Partial<Permission>): Promise<Permission> => {
    return post({ url: '/system/permissions', data });
};

// 更新权限
export const updatePermission = async (data: { id: number; data: Partial<Permission> }): Promise<Permission> => {
    return put({ url: `/system/permissions/${data.id}`, data: data.data });
};

// 删除权限
export const deletePermission = async (id: number): Promise<void> => {
    return del({ url: `/system/permissions/${id}` });
};

// 获取权限列表
export const getPermissionList = async (data?: any): Promise<{ list: Permission[]; total: number }> => {
    return get({ url: '/system/permissions', data });
};

// 获取权限树
export const getPermissionTree = async (): Promise<any[]> => {
    return get({ url: '/system/permissions/tree' });
};

// 创建权限操作
export const createPermissionAction = async (data: any): Promise<any> => {
    return post({ url: '/system/permissions', data });
};

// 更新权限操作
export const updatePermissionAction = async (data: any): Promise<any> => {
    return put({ url: `/system/permissions/${data.id}`, data: data.data });
};

// 删除权限操作
export const deletePermissionAction = async (id: number): Promise<any> => {
    return del({ url: `/system/permissions/${id}` });
};

// 获取权限操作详情
export const getPermissionActionDetail = async (id: number): Promise<any> => {
    return get({ url: `/system/permissions/${id}` });
};

// 获取权限操作列表
export const getPermissionActionList = async (data?: any): Promise<any[]> => {
    return get({ url: '/system/permissions', data });
};

// ADD: 在文件末尾添加以下接口定义
export interface PermissionTree {
  id: number;
  code: string;
  name: string;
  type: 'API' | 'MENU' | 'ROUTE' | 'BUTTON' | 'PAGE';
  parentId?: number;
  path: string | null;
  method: string | null;
  component: string | null;
  icon: string | null;
  description: string | null;
  orderNum: number;
  meta: Record<string, any> | null;
  extra: Record<string, any> | null;
  enabled: boolean;
  children?: PermissionTree[];
}
