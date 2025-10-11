import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import { initUser, getStaffList, getUserRoles, getUserPermissionCodes } from '@/api/user.api';
import { UserItem } from '@/api/user.api';
import { UserPermission } from '@/api/permission.api';
import permission from '@/utils/permission';

export const useUserStore = defineStore('user', () => {
    const isLoading = { staff: false, myself: false };
    const staff = ref<Record<string, UserItem>>({});
    const self = ref({}) as Ref<UserItem>;
    const token = ref('');
    const userPermissions = ref<UserPermission | null>(null);

    const staffObj = computed(() => staff.value);
    const permissions = computed(() => userPermissions.value);

    const setToken = (newToken?: string) => {
        if (newToken) {
            token.value = newToken;
        }
    };

    /**
     * 设置用户权限
     */
    const setPermissions = (permissions: UserPermission) => {
        userPermissions.value = permissions;
        permission.setUserPermissions(permissions);
    };

    /**
     * 清除用户权限
     */
    const clearPermissions = () => {
        userPermissions.value = null;
        permission.clearPermissions();
    };

    const getStaff = {
        value: (userId: string): UserItem => {
            return staff.value[userId] || {} as UserItem;
        }
    };
    function getStaffByName(name: string): UserItem | undefined {
        return Object.values(staff.value).find(user => user.name === name);
    }

    const myself = async (refresh = false) => {
        const response = await initUser();
        const mySelf = (response as any).user as UserItem;
        console.log('mySelf', response, mySelf, self.value, refresh);
        if (mySelf?.id) {
            self.value = mySelf;

            // 获取用户的角色和权限信息
            try {
                // 并行获取用户角色和权限编码
                const [userRolesResponse, userPermissionCodesResponse] = await Promise.all([
                    getUserRoles({ userId: mySelf.id }),
                    getUserPermissionCodes({ userId: mySelf.id })
                ]);

                // 设置权限数据
                const permissions: UserPermission = {
                    roles: userRolesResponse || [],
                    permissions: userPermissionCodesResponse || []
                };
                setPermissions(permissions);

            } catch (error) {
                console.error('获取用户角色和权限失败:', error);
                clearPermissions();
            }
        }
        return self.value;
    };
    const fetchSelf = async () => {
        if (isLoading.staff) return; // 复用 isLoading.staff 状态，或者可以创建独立的 isLoading.self
        isLoading.staff = true;

        // 检查 self.value 是否已有数据
        if (!self.value || !self.value.id) {
            const response = await initUser();
            const mySelf = (response as any).user as UserItem;

            if (mySelf?.id) {
                self.value = mySelf;
                // 从用户信息中提取角色和权限数据
                extractPermissionsFromUser(mySelf);
            }
        }

        isLoading.staff = false;
    };

    /**
     * 从用户信息中提取角色和权限数据
     */
    const extractPermissionsFromUser = (user: UserItem) => {
        if (user.roles && user.permissions) {
            const userPerms: UserPermission = {
                roles: user.roles,
                permissions: user.permissions
            };
            setPermissions(userPerms);
        } else {
            // 如果用户信息中没有角色和权限数据，清空权限
            clearPermissions();
        }
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



    return {
        staffObj,
        token: computed(() => token.value),
        myself,
        selfObj: computed(() => self.value),
        staff: computed(() => Object.values(staff.value)),
        staffRaw: staff,
        permissions,
        getStaff,
        getStaffByName,
        setToken,
        setPermissions,
        clearPermissions,
        fetchSelf,
        fetchStaff,
    };
});
