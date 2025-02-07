import axios from "axios";
import UniAdapter from "./adapter";

// const baseURL = 'https://app.airlonghao.com/sz'
const baseURL = 'http://127.0.0.1:7004'
const loginURL = '/login';
const tokenKey = 'Authorization';

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requestQweue = []

 
async function refreshToken() {
    // 获取code
    const code = await new Promise((r) => uni.login({
        provider: 'weixin',
        success: async res => r(res.code)
    }));
    console.log('微信登录', code);
    // instance是当前request.js中已创建的axios实例
    // return instance.post(loginURL, { code }).then(res => {
    //     console.log('refreshToken', res);
    //     return res.data
    // })'Basic ' + 
    return {
        data: {
            token: 'caicaiwoshishui2',
        }
    }
}

const option = {
    baseURL, method: 'POST', timeout: 30e3,
    adapter: UniAdapter as any, // 指定uniapp适配器
    headers: { 'Content-Type': 'application/json;charset=UTF-8', [tokenKey]: 'Authorization', },
}
// 创建axios实例
const instance = axios.create(option);
// 这个实例并不经过拦截器,虽然很丑,但是这样逻辑最简单
const instanceWithoutInterceptors = axios.create(option);

// 请求拦截器
instance.interceptors.request.use(config => {
    // todo:判断白名单,持久化token获取
    const token = 'Basic ' + 'caicaiwoshishui';
    config.headers[tokenKey] = token;
    return config
}, e => Promise.reject(e))

// 响应-处理token竞争问题
instance.interceptors.response.use(response => {
    console.log('token竞争器', response);
    if (response.status === 401) {
        console.log('token已过期,此时isRef', isRefreshing);
        const config = response.config;
        if (!isRefreshing) {
            isRefreshing = true
            return refreshToken().then(res => {
                const { token } = res.data;
                instance.defaults.headers[tokenKey] = token;
                // todo:持久化token
                config.headers[tokenKey] = token;

                // config.baseURL = '';
                // console.log('refreshToken_____', res, token, config);
                // 已经刷新了token，将所有队列中的请求进行重试
                requestQweue.forEach(cb => cb(token))
                // 清空队列
                requestQweue = []
                return instanceWithoutInterceptors(config)
            }).catch(res => {
                console.error('refreshtoken error =>', res)
                // todo:window.location.href = '/'
            }).finally(() => {
                isRefreshing = false
            })
        } else { // 正在刷新token，将返回一个未执行resolve的promise
            // console.log(config,)
            return new Promise((resolve) => {
                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                requestQweue.push((token) => {
                    // config.baseURL = ''
                    config.headers[tokenKey] = token
                    // console.log('队列调用__', config);
                    resolve(instanceWithoutInterceptors(config))
                })
            })
        }
    }
    return response as any // todo:原样返回为啥ts会报错?
}, e => Promise.reject(e))

// 响应-处理状态码
instance.interceptors.response.use(response => {
    const { status, data } = response;
    console.log('响应拦截器###', response);
    if (status == 200) {
        return data || {};
    } else
        if (status == 403) {
            // 权限不足
            throw new Error('权限不足');
        } else if (status == 404) {
            // 禁止访问
        } else if (status == 500) {
            // 服务器错误
        } else if (status == 501) {

        } else {
        }
    // return response.data
})

// 响应-处理内容部分
instance.interceptors.response.use(json => {
    console.log('页面解析器', json);
    return json.data;
});


export default (url: string, data?: any) => instance({ url, data }) as Promise<any>;