import { PERMISSION_CODES, ROLE_CODES, type UserPermission, type Permission, type Role, type Resource, type PermissionAction, type RolePermissionAssignment } from '@/interface/permission.interface';
import { api, apiSilent, apiWithLoading, apiNoError } from './api';
import { CONFIG } from '@/config';

/**
 * 权限检查工具类
 */
class PermissionChecker {
    private userPermissions: UserPermission | null = null;

    /**
     * 设置用户权限
     */
    setUserPermissions(permissions: UserPermission) {
        this.userPermissions = permissions;
    }

    /**
     * 获取用户权限
     */
    getUserPermissions(): UserPermission | null {
        return this.userPermissions;
    }

    /**
     * 清除用户权限
     */
    clearPermissions() {
        this.userPermissions = null;
    }

    /**
     * 检查是否有指定权限
     */
    hasPermission(permissionCode: string): boolean {
        if (!this.userPermissions) return false;
        return this.userPermissions.permissions.includes(permissionCode);
    }

    /**
     * 检查是否有任意一个权限
     */
    hasAnyPermission(permissionCodes: string[]): boolean {
        if (!this.userPermissions) return false;
        return permissionCodes.some(code => this.userPermissions!.permissions.includes(code));
    }

    /**
     * 检查是否有所有权限
     */
    hasAllPermissions(permissionCodes: string[]): boolean {
        if (!this.userPermissions) return false;
        return permissionCodes.every(code => this.userPermissions!.permissions.includes(code));
    }

    /**
     * 检查是否有指定角色
     */
    hasRole(roleCode: string): boolean {
        if (!this.userPermissions) return false;
        return this.userPermissions.roles.includes(roleCode);
    }

    /**
     * 检查是否有任意一个角色
     */
    hasAnyRole(roleCodes: string[]): boolean {
        if (!this.userPermissions) return false;
        return roleCodes.some(code => this.userPermissions!.roles.includes(code));
    }

    /**
     * 检查是否是管理员
     */
    isAdmin(): boolean {
        return this.hasRole(ROLE_CODES.ADMIN);
    }

    /**
     * 检查是否是领导/管理者
     */
    isManager(): boolean {
        return this.hasRole(ROLE_CODES.MANAGER);
    }

    /**
     * 检查是否是飞行员
     */
    isPilot(): boolean {
        return this.hasRole(ROLE_CODES.PILOT);
    }

    /**
     * 检查是否是员工
     */
    isStaff(): boolean {
        return this.hasRole(ROLE_CODES.STAFF);
    }

    /**
     * 检查是否是访客
     */
    isGuest(): boolean {
        return this.hasRole(ROLE_CODES.GUEST);
    }

    /**
     * 检查是否是供应商
     */
    isAgent(): boolean {
        return this.hasRole(ROLE_CODES.AGENT);
    }

    /**
     * 检查飞行相关权限
     */
    canReadFlight(): boolean {
        return this.hasPermission(PERMISSION_CODES.FLIGHT_READ);
    }

    canWriteFlight(): boolean {
        return this.hasPermission(PERMISSION_CODES.FLIGHT_WRITE);
    }

    canManageFlight(): boolean {
        return this.hasPermission(PERMISSION_CODES.FLIGHT_MANAGE);
    }

    /**
     * 检查用户管理权限
     */
    canReadUser(): boolean {
        return this.hasPermission(PERMISSION_CODES.USER_READ);
    }

    canWriteUser(): boolean {
        return this.hasPermission(PERMISSION_CODES.USER_WRITE);
    }

    canManageUser(): boolean {
        return this.hasPermission(PERMISSION_CODES.USER_MANAGE);
    }

    /**
     * 检查飞机管理权限
     */
    canReadAircraft(): boolean {
        return this.hasPermission(PERMISSION_CODES.AIRCRAFT_READ);
    }

    canWriteAircraft(): boolean {
        return this.hasPermission(PERMISSION_CODES.AIRCRAFT_WRITE);
    }

    canManageAircraft(): boolean {
        return this.hasPermission(PERMISSION_CODES.AIRCRAFT_MANAGE);
    }

    /**
     * 检查分析统计权限
     */
    canReadAnalysis(): boolean {
        return this.hasPermission(PERMISSION_CODES.ANALYSIS_READ);
    }

    canExportAnalysis(): boolean {
        return this.hasPermission(PERMISSION_CODES.ANALYSIS_EXPORT);
    }

    /**
     * 检查人力资源权限
     */
    canReadHR(): boolean {
        return this.hasPermission(PERMISSION_CODES.HR_READ);
    }

    canWriteHR(): boolean {
        return this.hasPermission(PERMISSION_CODES.HR_WRITE);
    }

    canManageHR(): boolean {
        return this.hasPermission(PERMISSION_CODES.HR_MANAGE);
    }

    /**
     * 检查维修管理权限
     */
    canReadMaintenance(): boolean {
        return this.hasPermission(PERMISSION_CODES.MAINTENANCE_READ);
    }

    canWriteMaintenance(): boolean {
        return this.hasPermission(PERMISSION_CODES.MAINTENANCE_WRITE);
    }

    canManageMaintenance(): boolean {
        return this.hasPermission(PERMISSION_CODES.MAINTENANCE_MANAGE);
    }

    /**
     * 检查销售管理权限
     */
    canReadSale(): boolean {
        return this.hasPermission(PERMISSION_CODES.SALE_READ);
    }

    canWriteSale(): boolean {
        return this.hasPermission(PERMISSION_CODES.SALE_WRITE);
    }

    canManageSale(): boolean {
        return this.hasPermission(PERMISSION_CODES.SALE_MANAGE);
    }

    /**
     * 检查安全管理权限
     */
    canReadSMS(): boolean {
        return this.hasPermission(PERMISSION_CODES.SMS_READ);
    }

    canWriteSMS(): boolean {
        return this.hasPermission(PERMISSION_CODES.SMS_WRITE);
    }

    canManageSMS(): boolean {
        return this.hasPermission(PERMISSION_CODES.SMS_MANAGE);
    }

    /**
     * 检查系统管理权限
     */
    canManageSystem(): boolean {
        return this.hasPermission(PERMISSION_CODES.SYSTEM_MANAGE);
    }
}

// 创建单例实例
const permissionChecker = new PermissionChecker();

// 导出便捷方法
export const permission = {
    // 基础权限检查
    hasPermission: (code: string) => permissionChecker.hasPermission(code),
    hasAnyPermission: (codes: string[]) => permissionChecker.hasAnyPermission(codes),
    hasAllPermissions: (codes: string[]) => permissionChecker.hasAllPermissions(codes),

    // 角色检查
    hasRole: (code: string) => permissionChecker.hasRole(code),
    hasAnyRole: (codes: string[]) => permissionChecker.hasAnyRole(codes),
    isAdmin: () => permissionChecker.isAdmin(),
    isManager: () => permissionChecker.isManager(),
    isPilot: () => permissionChecker.isPilot(),
    isStaff: () => permissionChecker.isStaff(),
    isGuest: () => permissionChecker.isGuest(),
    isAgent: () => permissionChecker.isAgent(),

    // 模块权限检查
    canReadFlight: () => permissionChecker.canReadFlight(),
    canWriteFlight: () => permissionChecker.canWriteFlight(),
    canManageFlight: () => permissionChecker.canManageFlight(),

    canReadUser: () => permissionChecker.canReadUser(),
    canWriteUser: () => permissionChecker.canWriteUser(),
    canManageUser: () => permissionChecker.canManageUser(),

    canReadAircraft: () => permissionChecker.canReadAircraft(),
    canWriteAircraft: () => permissionChecker.canWriteAircraft(),
    canManageAircraft: () => permissionChecker.canManageAircraft(),

    canReadAnalysis: () => permissionChecker.canReadAnalysis(),
    canExportAnalysis: () => permissionChecker.canExportAnalysis(),

    canReadHR: () => permissionChecker.canReadHR(),
    canWriteHR: () => permissionChecker.canWriteHR(),
    canManageHR: () => permissionChecker.canManageHR(),

    canReadMaintenance: () => permissionChecker.canReadMaintenance(),
    canWriteMaintenance: () => permissionChecker.canWriteMaintenance(),
    canManageMaintenance: () => permissionChecker.canManageMaintenance(),

    canReadSale: () => permissionChecker.canReadSale(),
    canWriteSale: () => permissionChecker.canWriteSale(),
    canManageSale: () => permissionChecker.canManageSale(),

    canReadSMS: () => permissionChecker.canReadSMS(),
    canWriteSMS: () => permissionChecker.canWriteSMS(),
    canManageSMS: () => permissionChecker.canManageSMS(),

    canManageSystem: () => permissionChecker.canManageSystem(),

    // 管理方法
    setUserPermissions: (permissions: UserPermission) => permissionChecker.setUserPermissions(permissions),
    getUserPermissions: () => permissionChecker.getUserPermissions(),
    clearPermissions: () => permissionChecker.clearPermissions(),

    // ==================== 用户权限管理API ====================

    // ==================== 权限管理API ====================

    // 创建权限
    async createPermission(data: {
        name: string;
        code: string;
        description?: string;
        parentId?: number;
        type?: number;
        path?: string;
        method?: string;
        enabled?: boolean;
    }, options?: { showLoading?: boolean; loadingText?: string }): Promise<Permission> {
        return api(CONFIG.url.permissionCreate, { data }, {
            showLoading: options?.showLoading ?? false,
            loadingText: options?.loadingText ?? '创建权限中...'
        });
    },

    // 更新权限
    async updatePermission(id: number, data: {
        name?: string;
        code?: string;
        description?: string;
        type?: number;
        parentId?: number;
        path?: string;
        method?: string;
        enabled?: boolean;
    }): Promise<any> {
        return api(CONFIG.url.permissionUpdate, { id, data });
    },

    // 删除权限
    async deletePermission(id: number): Promise<any> {
        return api(CONFIG.url.permissionDelete, { id });
    },

    // 获取权限列表
    async getPermissionList(params?: {
        name?: string;
        code?: string;
        type?: number;
        enabled?: boolean;
        page?: number;
        pageSize?: number;
    }, options?: { showLoading?: boolean; loadingText?: string }): Promise<{ list: Permission[]; total: number }> {
        return api(CONFIG.url.permissionList, params, {
            showLoading: options?.showLoading ?? false,
            loadingText: options?.loadingText ?? '加载权限中...'
        });
    },

    // 获取权限树
    async getPermissionTree(): Promise<Permission[]> {
        return api(CONFIG.url.permissionTree);
    },

    // ==================== 角色管理API ====================

    // 创建角色
    async createRole(data: {
        name: string;
        code: string;
        description?: string;
        orderNum?: number;
        enabled?: boolean;
    }): Promise<Role> {
        return api(CONFIG.url.roleCreate, { data });
    },

    // 更新角色
    async updateRole(id: number, data: Partial<Role>): Promise<any> {
        return api(CONFIG.url.roleUpdate, { id, data });
    },

    // 删除角色
    async deleteRole(id: number): Promise<any> {
        return api(CONFIG.url.roleDelete, { id });
    },



    // 获取角色列表
    async getRoleList(params?: {
        name?: string;
        code?: string;
        enabled?: boolean;
        page?: number;
        pageSize?: number;
    }, options?: { showLoading?: boolean; loadingText?: string }): Promise<{ list: Role[]; total: number }> {
        return api(CONFIG.url.roleList, params, {
            showLoading: options?.showLoading ?? false,
            loadingText: options?.loadingText ?? '加载角色中...'
        });
    },

    // 为角色分配权限
    async assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<any> {
        return api(CONFIG.url.roleAssignPermissions, { roleId, permissionIds });
    },

    // 获取角色的权限
    async getRolePermissions(roleId: number): Promise<Permission[]> {
        return api(CONFIG.url.rolePermissions, { roleId });
    },

    // 获取角色的权限ID列表 (使用新API)
    async getRolePermissionIds(roleId: number, options?: { showLoading?: boolean; loadingText?: string }): Promise<number[]> {
        const permissions = await api(CONFIG.url.rolePermissions, { roleId }, {
            showLoading: options?.showLoading ?? false,
            loadingText: options?.loadingText ?? '加载角色已有权限...'
        });
        return permissions.map((p: Permission) => p.id);
    },

    // ==================== 用户角色管理API ====================

    // 为用户分配角色
    async assignRolesToUser(userId: string, roleIds: number[]): Promise<any> {
        return api(CONFIG.url.userAssignRoles, { userId, roleIds });
    },

    // 获取用户的角色列表
    async getUserRoles(userId: string, options?: { showLoading?: boolean; loadingText?: string }): Promise<Role[]> {
        return api(CONFIG.url.userRoles, { userId }, {
            showLoading: options?.showLoading ?? false,
            loadingText: options?.loadingText ?? '加载用户角色...'
        });
    },

    // 获取用户的权限列表
    async getUserPermissionsById(userId: string): Promise<Permission[]> {
        return api(CONFIG.url.userPermissions, { userId });
    },

    // 获取用户的权限编码列表
    async getUserPermissionCodes(userId: string): Promise<string[]> {
        return api(CONFIG.url.userPermissionCodes, { userId });
    },

    // 检查用户是否有指定权限
    async hasUserPermission(userId: string, permissionCode: string): Promise<{ hasPermission: boolean }> {
        return api(CONFIG.url.userHasPermission, { userId, permissionCode });
    },

    // 检查用户是否有指定角色 (使用新API)
    async hasUserRole(userId: string, roleCode: string): Promise<{ hasRole: boolean }> {
        const userRoles = await api(CONFIG.url.userRoles, { userId });
        return { hasRole: userRoles.some((role: Role) => role.code === roleCode) };
    },

    // ==================== 权限操作管理API (新增) ====================

    // 创建权限操作
    async createPermissionAction(data: {
        name: string;
        actionCode: string;
        description?: string;
    }): Promise<PermissionAction> {
        return api(CONFIG.url.permissionActionCreate, { data });
    },

    // 更新权限操作
    async updatePermissionAction(id: number, data: Partial<PermissionAction>): Promise<any> {
        return api(CONFIG.url.permissionActionUpdate, { id, data });
    },

    // 删除权限操作
    async deletePermissionAction(id: number): Promise<any> {
        return api(CONFIG.url.permissionActionDelete, { id });
    },

    // 获取权限操作详情
    async getPermissionActionDetail(id: number): Promise<PermissionAction> {
        return api(CONFIG.url.permissionActionDetail, { id });
    },

    // 获取权限操作列表
    async getPermissionActionList(): Promise<PermissionAction[]> {
        return api(CONFIG.url.permissionActionList, {});
    },

    // ==================== 资源管理API (新增) ====================

    // 创建资源
    async createResource(data: {
        name: string;
        type: string;
        identifier: string;
        parentId?: number | null;
        description?: string;
        path?: string;
        icon?: string;
        orderNum?: number;
        enabled?: boolean;
    }): Promise<Resource> {
        return api(CONFIG.url.resourceCreate, { data });
    },

    // 更新资源
    async updateResource(id: number, data: Partial<Resource>): Promise<any> {
        return api(CONFIG.url.resourceUpdate, { id, data });
    },

    // 删除资源
    async deleteResource(id: number): Promise<any> {
        return api(CONFIG.url.resourceDelete, { id });
    },

    // 获取资源详情
    async getResourceDetail(id: number): Promise<Resource> {
        return api(CONFIG.url.resourceDetail, { id });
    },

    // 获取资源列表
    async getResourceList(): Promise<Resource[]> {
        return api(CONFIG.url.resourceList, {});
    },

    // 获取资源树
    async getResourceTree(): Promise<Resource[]> {
        return api(CONFIG.url.resourceTree, {});
    },

    // 批量创建资源
    async batchCreateResources(data: Array<{
        name: string;
        type: string;
        identifier: string;
        parentId?: number | null;
        description?: string;
        path?: string;
        icon?: string;
        orderNum?: number;
        enabled?: boolean;
    }>): Promise<any> {
        return api(CONFIG.url.resourceBatchCreate, { data });
    },

    // 批量更新资源
    async batchUpdateResources(data: Array<{
        id: number;
        data: Partial<Resource>;
    }>): Promise<any> {
        return api(CONFIG.url.resourceBatchUpdate, { data });
    },

    // 批量删除资源
    async batchDeleteResources(ids: number[]): Promise<any> {
        return api(CONFIG.url.resourceBatchDelete, { ids });
    },



    // ==================== 资源权限关联API ====================

    // 为资源分配权限
    async assignPermissionsToResource(resourceId: number, permissionIds: number[]): Promise<any> {
        return api(CONFIG.url.resourceAssignPermissions, { resourceId, permissionIds });
    },

    // 获取资源的权限
    async getResourcePermissions(resourceId: number): Promise<any> {
        return api(CONFIG.url.resourcePermissions, { resourceId });
    },

    // 获取资源的权限ID列表
    async getResourcePermissionIds(resourceId: number): Promise<number[]> {
        return api(CONFIG.url.resourcePermissionIds, { resourceId });
    },
};

export default permission;
