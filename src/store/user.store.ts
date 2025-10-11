import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import { initUser, getStaffList } from '@/api/user.api';
import type { UserItem } from '@/api/user.api';
import type { UserPermission, PermissionTree } from '@/api/permission.api';
import { ROLE_CODES } from '@/api/permission.api';

export const useUserStore = defineStore('user', () => {
    // --- STATE ---
    const isLoading = { staff: false, self: false };
    const staff = ref<Record<string, UserItem>>({});
    const self = ref({}) as Ref<UserItem>;
    const token = ref('');
    const userPermissions = ref<UserPermission | null>(null);

    // --- GETTERS ---
    const staffObj = computed(() => staff.value);
    const permissions = computed(() => userPermissions.value);

    // --- ACTIONS ---

    /**
     * 递归扁平化权限树，提取所有权限代码
     */
    const flattenPermissionTree = (tree: PermissionTree[]): string[] => {
        let codes: string[] = [];
        for (const node of tree) {
            if (node.code) {
                codes.push(node.code);
            }
            if (node.children && node.children.length > 0) {
                codes = codes.concat(flattenPermissionTree(node.children));
            }
        }
        return codes;
    };

    const setToken = (newToken?: string) => {
        if (newToken) {
            token.value = newToken;
        }
    };

    /**
     * 获取当前用户信息和权限，内置防止并发请求的逻辑
     */
    const fetchSelf = async (forceRefresh = false) => {
        // 如果已存在用户信息且不强制刷新，则直接返回
        if (self.value?.id && !forceRefresh) {
            return self.value;
        }
        // 如果正在请求中，则直接返回
        if (isLoading.self) {
            return;
        }

        try {
            isLoading.self = true;
            const response = await initUser();
            const { user, permissionTree } = response;

            if (user?.id) {
                self.value = user;

                // 处理权限
                const flattenedPermissions = flattenPermissionTree(permissionTree);
                userPermissions.value = {
                    roles: user.roles || [],
                    permissions: flattenedPermissions,
                };
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
            // 清理状态
            self.value = {} as UserItem;
            userPermissions.value = null;
        } finally {
            isLoading.self = false;
        }
        return self.value;
    };

    const fetchStaff = async () => {
        if (isLoading.staff) return;
        isLoading.staff = true;
        if (!Object.keys(staff.value).length) {
            const response = await getStaffList();
            const res = response as UserItem[];
            const obj: Record<string, UserItem> = {};
            if (res.length) {
                for (let user of res) {
                    obj[user.userId] = user;
                }
            }
            staff.value = obj;
        }
        isLoading.staff = false;
    };

    // --- PERMISSION CHECKERS ---

    const hasPermission = (permissionCode: string): boolean => {
        if (!userPermissions.value) return false;
        return userPermissions.value.permissions.includes(permissionCode);
    };

    const hasRole = (roleCode: string): boolean => {
        if (!userPermissions.value) return false;
        return userPermissions.value.roles.includes(roleCode);
    };

    const isAdmin = (): boolean => {
        return hasRole(ROLE_CODES.ADMIN);
    };

    const hasAnyPermission = (permissionCodes: string[]): boolean => {
        if (!userPermissions.value) return false;
        return permissionCodes.some(code => userPermissions.value!.permissions.includes(code));
    };

    const hasAllPermissions = (permissionCodes: string[]): boolean => {
        if (!userPermissions.value) return false;
        return permissionCodes.every(code => userPermissions.value!.permissions.includes(code));
    };

    const hasAnyRole = (roleCodes: string[]): boolean => {
        if (!userPermissions.value) return false;
        return roleCodes.some(code => userPermissions.value!.roles.includes(code));
    };

    // --- LEGACY COMPATIBILITY ---

    const getStaff = {
        value: (userId: string): UserItem => {
            return staff.value[userId] || {} as UserItem;
        }
    };

    function getStaffByName(name: string): UserItem | undefined {
        return Object.values(staff.value).find(user => user.name === name);
    }

    // --- RETURN ---
    return {
        // State & Getters
        staffObj,
        token: computed(() => token.value),
        selfObj: computed(() => self.value),
        staff: computed(() => Object.values(staff.value)),
        staffRaw: staff,
        permissions,

        // Actions
        fetchSelf,
        fetchStaff,
        setToken,

        // Permission Checkers
        hasPermission,
        hasRole,
        hasAnyPermission,
        hasAllPermissions,
        hasAnyRole,
        isAdmin,

        // Legacy compatibility
        getStaff,
        getStaffByName,
        // 可根据需要从旧的 utils/permission.ts 中迁移更多检查器 (isManager, isPilot, etc.)
    };
});
