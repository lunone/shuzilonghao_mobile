import { Directive } from 'vue';
import permission from './permission';

/**
 * 权限指令 v-permission="'flight:read'"
 * 使用方式：
 * <button v-permission="'flight:write'">编辑</button>
 * <div v-permission="['flight:read', 'user:read']">内容</div>
 */
export const permissionDirective: Directive = {
    mounted(el: HTMLElement, binding) {
        const { value } = binding;

        if (!value) return;

        let hasPermission = false;

        if (typeof value === 'string') {
            // 单个权限
            hasPermission = permission.hasPermission(value);
        } else if (Array.isArray(value)) {
            // 多个权限，任意一个即可
            hasPermission = permission.hasAnyPermission(value);
        }

        if (!hasPermission) {
            // 移除元素或隐藏
            el.style.display = 'none';
        }
    },

    updated(el: HTMLElement, binding) {
        const { value } = binding;

        if (!value) return;

        let hasPermission = false;

        if (typeof value === 'string') {
            hasPermission = permission.hasPermission(value);
        } else if (Array.isArray(value)) {
            hasPermission = permission.hasAnyPermission(value);
        }

        if (hasPermission) {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    }
};

/**
 * 角色指令 v-role="'admin'"
 * 使用方式：
 * <button v-role="'admin'">管理员功能</button>
 * <div v-role="['admin', 'manager']">管理内容</div>
 */
export const roleDirective: Directive = {
    mounted(el: HTMLElement, binding) {
        const { value } = binding;

        if (!value) return;

        let hasRole = false;

        if (typeof value === 'string') {
            // 单个角色
            hasRole = permission.hasRole(value);
        } else if (Array.isArray(value)) {
            // 多个角色，任意一个即可
            hasRole = permission.hasAnyRole(value);
        }

        if (!hasRole) {
            el.style.display = 'none';
        }
    },

    updated(el: HTMLElement, binding) {
        const { value } = binding;

        if (!value) return;

        let hasRole = false;

        if (typeof value === 'string') {
            hasRole = permission.hasRole(value);
        } else if (Array.isArray(value)) {
            hasRole = permission.hasAnyRole(value);
        }

        if (hasRole) {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    }
};

/**
 * 权限组件 Props
 */
export interface PermissionProps {
    permission?: string | string[];
    role?: string | string[];
    requireAll?: boolean; // 是否需要所有权限/角色都满足
}

/**
 * 检查权限的通用函数
 */
export function checkPermission(props: PermissionProps): boolean {
    const { permission: perm, role, requireAll = false } = props;

    if (perm) {
        if (typeof perm === 'string') {
            return permission.hasPermission(perm);
        } else if (Array.isArray(perm)) {
            return requireAll
                ? permission.hasAllPermissions(perm)
                : permission.hasAnyPermission(perm);
        }
    }

    if (role) {
        if (typeof role === 'string') {
            return permission.hasRole(role);
        } else if (Array.isArray(role)) {
            return requireAll
                ? permission.hasAllPermissions(role.map(r => `role:${r}`)) // 临时转换
                : permission.hasAnyRole(role);
        }
    }

    return true; // 如果没有指定权限或角色，默认显示
}

/**
 * 权限相关的组合式函数（非入侵方案）
 */
export function usePermission() {
    // 检查单个权限
    const hasPermission = (permissionCode: string) => {
        return permission.hasPermission(permissionCode);
    };

    // 检查多个权限（任意一个）
    const hasAnyPermission = (permissionCodes: string[]) => {
        return permission.hasAnyPermission(permissionCodes);
    };

    // 检查多个权限（全部满足）
    const hasAllPermissions = (permissionCodes: string[]) => {
        return permission.hasAllPermissions(permissionCodes);
    };

    // 检查角色
    const hasRole = (roleCode: string) => {
        return permission.hasRole(roleCode);
    };

    // 检查多个角色（任意一个）
    const hasAnyRole = (roleCodes: string[]) => {
        return permission.hasAnyRole(roleCodes);
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole
    };
}
