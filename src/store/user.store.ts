import { defineStore } from 'pinia';
import api from '@/utils/api';
import CONFIG from '@/config';
import { DepartmenItem, UserItem } from '@/interface';


export default defineStore('user', {
    state: () => ({
        staff: {},
        departments: [] as DepartmenItem[],
        self: {} as UserItem,
        token: '' as string,
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
            const self = await api(CONFIG.url.init) as UserItem;
            if (self?.id) {
                this.self = self;
            }
            // }
            return this.self;
        },
        async getStaff() {
            if (!Object.keys(this.staff).length) {
                const res = await api(CONFIG.url.staff) as Record<string, UserItem>;
                this.staff = Object.keys(res).length ? res : {};
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
    }
})