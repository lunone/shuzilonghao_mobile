import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import api from '@/utils/api';
import CONFIG from '@/config';
import { PilotItem, UserItem } from '@/interface';

export const useUserStore = defineStore('user', () => {
    const isLoading = { staff: false, pilot: false };
    const staff = ref<Record<string, UserItem>>({});
    const pilots = ref<Record<string, PilotItem>>({});
    const self = ref({}) as Ref<UserItem>;
    const token = ref('');

    const staffObj = computed(() => staff.value);
    const setToken = (newToken?: string) => {
        if (newToken) {
            token.value = newToken;
        }
    };

    const getStaff = computed(() => (userId: string, idType = 'userId'): UserItem => {
        if (idType === 'userId') {
            return staff.value[userId] || {} as UserItem;
        } else if (idType === 'name') {
            return Object.values(staff.value).find(user => user.name === userId) || {} as UserItem;
        }
    });
    
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

    const fetchPilots = async () => {
        if (isLoading.pilot) return;
        isLoading.pilot = true;
        if (!Object.keys(pilots.value).length) {
            const res = await api(CONFIG.url.pilots) as Record<string, PilotItem>;
            pilots.value = Object.keys(res).length ? res : {};
        }
        isLoading.pilot = false;
    };

    return {
        self,
        staffObj,
        pilots,
        myself,
        token,
        getStaff,
        setToken,
        fetchPilots,
        fetchStaff,
    };
});