import { PERMISSION_CODES, ROLE_CODES, type UserPermission } from '@/interface/permission.interface';

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
};

export default permission;
