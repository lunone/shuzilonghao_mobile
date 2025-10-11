import { Directive } from 'vue';
import type { useUserStore } from '@/store/user.store';

// 全局用户 store 实例，用于指令中访问
let globalUserStore: ReturnType<typeof useUserStore> | null = null;

/**
 * 设置全局用户权限检查器（需要在应用初始化时调用）
 */
export function setGlobalUserStore(store: ReturnType<typeof useUserStore>) {
    globalUserStore = store;
}

/**
 * 权限指令 v-permission="'flight:read'"
 * 使用方式：
 * <button v-permission="'flight:write'">编辑</button>
 * <div v-permission="['flight:read', 'user:read']">内容</div>
 */
export const permissionDirective: Directive = {
    mounted(el: HTMLElement, binding) {
        const { value } = binding;
        if (!value || !globalUserStore) return;

        let hasPermission = false;
        if (typeof value === 'string') {
            hasPermission = globalUserStore.hasPermission(value);
        } else if (Array.isArray(value)) {
            hasPermission = globalUserStore.hasAnyPermission(value);
        }

        if (!hasPermission) {
            el.style.display = 'none';
        }
    },

    updated(el: HTMLElement, binding) {
        const { value } = binding;
        if (!value || !globalUserStore) return;

        let hasPermission = false;
        if (typeof value === 'string') {
            hasPermission = globalUserStore.hasPermission(value);
        } else if (Array.isArray(value)) {
            hasPermission = globalUserStore.hasAnyPermission(value);
        }

        el.style.display = hasPermission ? '' : 'none';
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
        if (!value || !globalUserStore) return;

        let hasRole = false;
        if (typeof value === 'string') {
            hasRole = globalUserStore.hasRole(value);
        } else if (Array.isArray(value)) {
            hasRole = globalUserStore.hasAnyRole(value);
        }

        if (!hasRole) {
            el.style.display = 'none';
        }
    },

    updated(el: HTMLElement, binding) {
        const { value } = binding;
        if (!value || !globalUserStore) return;

        let hasRole = false;
        if (typeof value === 'string') {
            hasRole = globalUserStore.hasRole(value);
        } else if (Array.isArray(value)) {
            hasRole = globalUserStore.hasAnyRole(value);
        }

        el.style.display = hasRole ? '' : 'none';
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

    if (!globalUserStore) return true;

    if (perm) {
        if (typeof perm === 'string') {
            return globalUserStore.hasPermission(perm);
        } else if (Array.isArray(perm)) {
            return requireAll
                ? globalUserStore.hasAllPermissions(perm)
                : globalUserStore.hasAnyPermission(perm);
        }
    }

    if (role) {
        if (typeof role === 'string') {
            return globalUserStore.hasRole(role);
        } else if (Array.isArray(role)) {
            // 角色不区分 requireAll，对于数组直接视为任意一个
            return globalUserStore.hasAnyRole(role);
        }
    }

    return true; // 如果没有指定权限或角色，默认显示
}

/**
 * 权限相关的组合式函数（非入侵方案）
 * 注意：这个函数需要在 Vue 组件的 setup 函数中使用，因为它需要访问 userStore
 */
export function usePermission() {
    // 由于这个函数可能在组件外调用，我们假定全局 store 被设置
    // 在组件中，应该直接使用 useUserStore()

    // 检查单个权限
    const hasPermission = (permissionCode: string) => {
        return globalUserStore?.hasPermission(permissionCode) ?? true;
    };

    // 检查多个权限（任意一个）
    const hasAnyPermission = (permissionCodes: string[]) => {
        return globalUserStore?.hasAnyPermission(permissionCodes) ?? true;
    };

    // 检查多个权限（全部满足）
    const hasAllPermissions = (permissionCodes: string[]) => {
        return globalUserStore?.hasAllPermissions(permissionCodes) ?? true;
    };

    // 检查角色
    const hasRole = (roleCode: string) => {
        return globalUserStore?.hasRole(roleCode) ?? true;
    };

    // 检查多个角色（任意一个）
    const hasAnyRole = (roleCodes: string[]) => {
        return globalUserStore?.hasAnyRole(roleCodes) ?? true;
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole
    };
}
