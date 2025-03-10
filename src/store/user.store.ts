import { defineStore } from 'pinia';
import api from '@/utils/api';
import CONFIG from '@/config';
import { PilotItem, UserItem } from '@/interface';


export default defineStore('user', {
    state: () => ({
        isLoading: { staff: false, pilot: false },
        staff: {} as Record<string, UserItem>,
        pilots: {} as Record<string, PilotItem>,
        self: {} as UserItem,
        token: '' as string,
    }),
    getters: {
        staffObj: (state) => state.staff,
        getToken: (state) => {
            return state.token
        },
        // 按name为key的所有用户对象
        staffByName: (state): Record<string, UserItem> => {
            const userObj = state.staff;
            const staffByName = {}
            for (let userId in userObj) {
                const name = userObj[userId].name;
                staffByName[name] = userObj[userId];
            }
            return staffByName;
        },

    },
    actions: {
        setToken(token?: string) {
            if (token) {
                this.token = token;
            }
        },
        async getMyself(refresh = false) {
            const mySelf = await api(CONFIG.url.init) as UserItem;
            if (mySelf?.id) {
                this.self = mySelf;
            }
            return this.self;
        },
        async getStaff(): Promise<Record<string, UserItem>> {
            if (this.isLoading.staff) return
            this.isLoading.staff = true;
            if (!Object.keys(this.staff).length) {
                const res = await api(CONFIG.url.staff) as UserItem[];
                const obj = {}
                if (res.length) {
                    for (let user of res) {
                        obj[user.userId] = user
                    }
                }
                this.isLoading.staff = false;
                this.staff = obj;
            }
        },
        async getPilots(): Promise<Record<string, PilotItem>> {
            if (this.isLoading.pilot) return;
            this.isLoading.pilot = true;
            if (!Object.keys(this.pilots).length) {
                const res = await api(CONFIG.url.pilots) as Record<string, PilotItem>;
                this.pilots = Object.keys(res).length ? res : {};
                this.isLoading.pilot = false;
            }
        },

    }
})