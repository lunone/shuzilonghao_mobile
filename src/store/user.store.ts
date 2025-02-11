import { defineStore } from 'pinia';
import api from '@/utils/api';
import CONFIG from '@/config';
import { User } from '@/interface';


export default defineStore('user', {
    state: () => ({
        users: {},
        self: { isInit: true } as User & { isInit?: boolean },
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
            if (this.self.isInit || refresh) {
                let self = await api(CONFIG.url.init) as User;
                if (self?.id) {
                    this.self = self;
                }
                this.self.isInit = false;
            }
            return this.self;
        },
        async users() {
            if (!Object.keys(this.users).length) {
                const res = {}//await api('/user/list/') as Record<string, User>;
                this.users = res;
            }
            return this.users;
        },
    }
})