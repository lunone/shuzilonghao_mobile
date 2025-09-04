import App from './App'
import * as Pinia from 'pinia';

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
import { permissionDirective, roleDirective } from './utils/directives';
import router from './utils/router';
import pagesJson from './pages.json';

export function createApp() {
    const app = createSSRApp(App);
    app.use(Pinia.createPinia());

    // 注册权限指令
    app.directive('permission', permissionDirective);
    app.directive('role', roleDirective);

    // 初始化路由守卫配置
    router.setConfig({
        permissionConfig: pagesJson.permissionConfig || {}
    });

    // 此处必须将 Pinia 返回
    return { app, Pinia, }
}
// #endif
