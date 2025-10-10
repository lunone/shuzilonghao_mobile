/// <reference path="../shims-uni.d.ts" />

declare const API_BASE_URL: string;

export const CONFIG = {
    url: {
        timeout: 30e3,
        api: API_BASE_URL,
        init: '/user/init',
        login: '/login/wx',
        activate: '/login/activate',
    },
    page: {
        index: '/pages/index',
        error: '/pages/public/error',
        register: '/pages/public/public'
    },
    key: { token: 'Authorization', },
    css: { splash: { duration: 2e3, } },
    chart: {
        color: {
            ZHCC: '#91CB74',
        }
    }
}
