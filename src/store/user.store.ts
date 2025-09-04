import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import { api } from '@/utils/api';
import { CONFIG } from '@/config';
import { UserItem } from '@/interface/user.interface';
import { UserPermission } from '@/interface/permission.interface';
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


    const myself = async (refresh = false) => {
        const mySelf = await api(CONFIG.url.init) as UserItem;
        if (mySelf?.id) {
            self.value = mySelf;
        }
        return self.value;
    };
    const fetchSelf = async () => {
        if (isLoading.staff) return; // 复用 isLoading.staff 状态，或者可以创建独立的 isLoading.self
        isLoading.staff = true;

        // 检查 self.value 是否已有数据
        if (!self.value || !self.value.id) {
            const mySelf = await api(CONFIG.url.init) as UserItem;
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
            const res = await api(CONFIG.url.staff) as UserItem[];
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
        setToken,
        setPermissions,
        clearPermissions,
        fetchSelf,
        fetchStaff,
    };
});
