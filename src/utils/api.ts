import axios from "axios";
import { useStore } from "@/store";

const store = useStore();

const baseURL = 'http://127.0.0.1:7004';//'https://app.airlonghao.com/sz'
const loginURL = '/login/wx';
const registerPage = '/pages/public/Public';
const tokenKey = 'Authorization';


let isRefreshing = false// 是否正在刷新的flag
let qweue = []// 请求队列


const option = {
    baseURL, method: 'POST', timeout: 30e3,
    adapter: uniAdapter as any, // 指定uniapp适配器
    headers: { 'Content-Type': 'application/json;charset=UTF-8', },
}
// 创建axios实例
const instance = axios.create(option);
// 这个实例并不经过拦截器,虽然很丑,但是这样逻辑最简单
const instanceWithoutInterceptors = axios.create(option);

const beforeRequest = async (config) => {// todo:判断白名单
    const token = await store.useToken();
    // todo:是否从storage中获取token
    config.headers[tokenKey] = token;
    return config
}
// 请求拦截器
instance.interceptors.request.use(beforeRequest)
instanceWithoutInterceptors.interceptors.request.use(beforeRequest)

// 响应-处理token竞争问题
instance.interceptors.response.use(response => {
    if (response.status !== 401) {// 非401进入下一段拦截器
        return response as any // todo:原样返回为啥ts会报错?
    }
    if (isRefreshing) {// 刷新token时,将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
        return new Promise(resolve => qweue.push(() => resolve(instanceWithoutInterceptors(response.config))))
    }
    isRefreshing = true;
    return new Promise((resolve) => uni.login({ provider: 'weixin', success: res => resolve(res.code) }))
        .then(code => instanceWithoutInterceptors({ url: loginURL, data: { code } }))
        .then(resp => {// todo:是否storage固化token 持久化token
            if (resp.status == 200 && resp.data.data) {// 这里不使用可选链就是等报错
                store.useToken(resp.data.data)
            } else {// 因为没有任何拦截器,所以要自己处理异常
                throw new Error('refreshtokenError');
            }
        }).then(() => {
            qweue.forEach(f => f());// 新token重试积压请求
            qweue = []; // 清空队列
            return instanceWithoutInterceptors(response.config);// 重试本次请求
        }).catch(err => {
            if (err.message == 'refreshtokenError') {// 如果是刷新token失败,直接跳转登录页
                uni.redirectTo({ url: registerPage+`?redir=true` })
            } else {// 不在这里处理,继续抛出错误,让下一层捕获
                throw new Error('requestError', err);
            }
            console.error('refreshtoken error =>', err)
            // todo:window.location.href = '/'
        }).finally(() => {
            isRefreshing = false;
        })
})

// 响应-处理状态码
instance.interceptors.response.use(response => {
    const status = response?.status;
    if (status == 200) {
        return response.data || {};
    } else if (status == 402) {
        // 需要注册
    } else if (status == 403) {
        // 权限不足
        throw new Error('权限不足');
    } else if (status == 404) {
        // 禁止访问
    } else if (status == 500) {
        // 服务器错误
    } else if (status == 501) {

    } 
})

// 响应-处理内容部分
instance.interceptors.response.use(json => {
    return json?.data;
});

export default (url: string, data?: any) => instance({ url, data }) as Promise<any>;

/**
 * 下面代码原作者:https://gitee.com/black-key/uniapp-axios-adapter
 * 用途:让uniapp适配axios,单独引入为了调试方便,有改动
 */

function uniAdapter(config) {
    if (!uni) {
        throw new Error("please use this in uni-app project!");
    }
    return new Promise((resolve, reject) => {
        const { baseURL, url, headers, data, params } = config;
        const uniConfig = {
            ...config, url: baseURL + url,
            // * 此处使用析构,猜测axios的headers在使用后会删除,所以直接引用就为空
            header: { ...headers },
        };

        if (data || params) {
            try {
                uniConfig.data = JSON.parse(data || params);
            } catch (e) {
                uniConfig.data = data || params;
            }
        }
        uni.request({
            ...uniConfig,
            success(res) {
                resolve({ ...res, status: res.statusCode, statusText: res.errMsg, config, request: null });
            },
            fail(res) {
                reject({ ...res, status: res.statusCode, statusText: res.errMsg, config, request: null });
            },
        });
    });
};