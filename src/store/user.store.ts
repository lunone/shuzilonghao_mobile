import { defineStore } from 'pinia';
import api from '@/utils/api';
import CONFIG from '@/config';
import { DepartmenItem, UserItem } from '@/interface';


export default defineStore('user', {
    state: () => ({
        staff: {},
        departments: [] as DepartmenItem[],
        self: {} as UserItem,
        _token: '' as string,
    }),
    getters: {

    },
    actions: {
        token(token?: string) {
            if (token) {
                this._token = token;
            }
            return this._token;
        },
        async myself(refresh = false) {
            // if (refresh) {
                api(CONFIG.url.aircrafts)// 模拟发出俩请求试试
                const self = await api(CONFIG.url.init) as UserItem;
                // console.log('myself', self);
                if (self?.id) {
                    this.self = self;
                }
                // this.self.isInit = false;
                // this.self.error = true;
            // }
            return this.self;
        },
        async staff() {
            if (!Object.keys(this.staff).length) {
                const res = await api(CONFIG.url.staff) as Record<string, UserItem>;
                this.staff = Object.keys(res).length ? res : {};
            }
            return this.staff;
        },
        async departments() {
            if (!this.departments.length) {
                const res = await api(CONFIG.url.departments) as Record<string, UserItem>;
                this.departments = res.length ? res : [];
            }
            return this.departments;
        },
    }
})