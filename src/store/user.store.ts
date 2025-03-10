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

    const getToken = computed(() => token.value);

    const getStaffObj = computed(() => staff.value);
    const getStaffByName = computed(() => {
        const userObj = staff.value;
        const staffByName: Record<string, UserItem> = {};
        for (let userId in userObj) {
            const name = userObj[userId].name;
            staffByName[name] = userObj[userId];
        }
        return staffByName;
    });

    const getPilots = computed(() => pilots.value);
    const setToken = (newToken?: string) => {
        if (newToken) {
            token.value = newToken;
        }
    };

    const getMyself = async (refresh = false) => {
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
        setToken,
        getStaffObj,
        getToken,
        getStaffByName,
        getMyself,
        getPilots,
        fetchPilots,
        fetchStaff,
    };
});