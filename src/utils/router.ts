import permission from './permission';

/**
 * 页面权限配置类型
 */
interface PagePermission {
    permissions?: string[];
    roles?: string[];
}

/**
 * 路由守卫配置
 */
interface RouterGuardConfig {
    permissionConfig: Record<string, PagePermission>;
}

/**
 * 路由守卫类
 */
class RouterGuard {
    private config: RouterGuardConfig | null = null;

    /**
     * 设置路由配置
     */
    setConfig(config: RouterGuardConfig) {
        this.config = config;
    }

    /**
     * 检查页面访问权限
     */
    checkPageAccess(pagePath: string): boolean {
        if (!this.config) {
            console.warn('RouterGuard: 配置未设置');
            return true; // 如果没有配置，默认允许访问
        }

        const pageConfig = this.config.permissionConfig[pagePath];
        if (!pageConfig) {
            return true; // 如果页面没有配置权限，默认允许访问
        }

        const { permissions, roles } = pageConfig;

        // 检查权限
        if (permissions && permissions.length > 0) {
            const hasPermission = permission.hasAnyPermission(permissions);
            if (!hasPermission) {
                console.warn(`RouterGuard: 用户没有访问页面 ${pagePath} 的权限`);
                return false;
            }
        }

        // 检查角色
        if (roles && roles.length > 0) {
            const hasRole = permission.hasAnyRole(roles);
            if (!hasRole) {
                console.warn(`RouterGuard: 用户没有访问页面 ${pagePath} 的角色权限`);
                return false;
            }
        }

        return true;
    }

    /**
     * 获取页面权限配置
     */
    getPageConfig(pagePath: string): PagePermission | null {
        if (!this.config) return null;
        return this.config.permissionConfig[pagePath] || null;
    }

    /**
     * 获取所有页面配置
     */
    getAllPageConfigs(): Record<string, PagePermission> {
        return this.config?.permissionConfig || {};
    }
}

// 创建单例实例
const routerGuard = new RouterGuard();

// 便捷方法
export const router = {
    /**
     * 设置路由配置
     */
    setConfig: (config: RouterGuardConfig) => routerGuard.setConfig(config),

    /**
     * 检查页面访问权限
     */
    checkPageAccess: (pagePath: string) => routerGuard.checkPageAccess(pagePath),

    /**
     * 获取页面权限配置
     */
    getPageConfig: (pagePath: string) => routerGuard.getPageConfig(pagePath),

    /**
     * 获取所有页面配置
     */
    getAllPageConfigs: () => routerGuard.getAllPageConfigs(),
};

export default router;
