import { defineStore } from 'pinia';
import api from '@/utils/api';
import CONFIG from '@/config';
import { DepartmenItem, UserItem } from '@/interface';


export default defineStore('user', {
    state: () => ({
        isStaffFatching: false,
        staff: {},
        departments: [] as DepartmenItem[],
        self: {} as UserItem,
        token: '' as string,
        nameToUserId: {} as Record<string, string>,
    }),
    getters: {

    },
    actions: {
        getToken(token?: string) {
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
            if(this.isStaffFatching){
                return
            }
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
            return this.staff;
        },
        async getDepartments() {
            if (!this.departments.length) {
                const res = await api(CONFIG.url.departments) as Record<string, UserItem>;
                this.departments = res.length ? res : [];
            }
            return this.departments;
        },
        async getNameToUserId() {
            if (Object.keys(this.nameToUserId).length === 0) {
                const userObj = await this.getStaff();
                const nameToUserId = {}
                for (let userId in userObj) {
                    const name = userObj[userId].name;
                    nameToUserId[name] = userId;
                }
                this.nameToUserId = nameToUserId;
            }

            return this.nameToUserId;
        },
    }
})