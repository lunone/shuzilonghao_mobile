export interface Permission {
    id: string;
    name: string;
    code: string; // 如 'flight:read', 'user:manage'
    resource: string; // 资源类型：flight, user, aircraft等
    action: string; // 操作类型：read, write, delete, manage
    description?: string;
}

export interface Role {
    id: string;
    name: string;
    code: string; // 如 'admin', 'manager', 'pilot', 'staff'
    description: string;
    permissions: string[]; // 权限ID数组
    status: number; // 0:禁用 1:启用
}

export interface UserPermission {
    roles: string[]; // 角色ID数组
    permissions: string[]; // 权限代码数组（扁平化，用于快速检查）
}

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
export enum PermissionAction {
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
