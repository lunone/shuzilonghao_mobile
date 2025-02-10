export default {
    url: {
        api: 'http://127.0.0.1:7004',//'https://app.airlonghao.com/sz'
        login: '/login/wx',
        init: '/user/init',
        timeout: 30e3,
    },
    page: {
        register: '/pages/public/Public',
    },
    key: { token: 'Authorization', },
    css: { splash: { duration: 5e3, } }
}
