import { defineStore } from 'pinia';
import api from '@/utils/api';
import CONFIG from '@/config';
import { DepartmenItem, ListNode, PilotItem, UserItem } from '@/interface';


export default defineStore('department', {
    state: () => ({
        isLoading: { staff: false, pilot: false, department: false },
        staff: {} as Record<string, UserItem>,
        pilots: {} as Record<string, PilotItem>,
        self: {} as UserItem,
        token: '' as string,
    }),
    getters: {
        staffObj: (state) => state.staff,
        getToken: (state) => {
            // 可以在此添加验证逻辑或自动续期检查
            return state.token
        },
        staffByName: (state): Record<string, UserItem> => {
            const userObj = state.staff;
            const nameToUserId = {}
            for (let userId in userObj) {
                const name = userObj[userId].name;
                nameToUserId[name] = userObj[userId];
            }
            return nameToUserId;
        },
       
    },
    actions: {
        setToken(token?: string) {
            if (token) {
                this.token = token;
            }
            return this.token;
        },
        async getMyself(refresh = false) {
            // if (refresh) {
            const mySelf = await api(CONFIG.url.init) as UserItem;
            if (mySelf?.id) {
                this.self = mySelf;
            }
            // }
            return this.self;
        },
        async getStaff(): Promise<Record<string, UserItem>> {
            if (this.isLoading.staff) return
            this.isStaffFatching = true;
            if (!Object.keys(this.staff).length) {
                const res = await api(CONFIG.url.staff) as UserItem[];
                const obj = {}
                if (res.length) {
                    for (let user of res) {
                        obj[user.userId] = user
                    }
                }
                this.isStaffFatching = false;
                this.staff = obj;
            }
        },
        async getPilots(): Promise<Record<string, PilotItem>> {
            if (this.isLoading.pilot) return;
            if (!Object.keys(this.pilots).length) {
                const res = await api(CONFIG.url.pilots) as Record<string, PilotItem>;
                this.isPilotsFatching = false;
                this.pilots = Object.keys(res).length ? res : {};
            }
        },

    }
})