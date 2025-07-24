import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import { api } from '@/utils/api';
import { CONFIG } from '@/config';
import { UserItem } from '@/interface/user.interface';

export const useUserStore = defineStore('user', () => {
    const isLoading = { staff: false };
    const staff = ref<Record<string, UserItem>>({});
    const self = ref({}) as Ref<UserItem>;
    const token = ref('');

    const staffObj = computed(() => staff.value);
    const setToken = (newToken?: string) => {
        if (newToken) {
            token.value = newToken;
        }
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
        staff: computed(() => Object.values(staff.value)),
        staffRaw: staff,
        getStaff,
        setToken,
        fetchStaff,
    };
});
