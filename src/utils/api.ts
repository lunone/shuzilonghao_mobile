import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStore } from '@/store/user.store';
import { CONFIG } from '@/config';

const store = useUserStore();

let isRefreshing = false; // 是否正在刷新的flag
let isShowNetworkErrorModal = false; // 确保对话框弹出一个的标志
let notLoginQweue = []; // 401请求队列
let networkErrorQueue = {} as Record<string, any>; // 网络错误请求队列

const option: AxiosRequestConfig = {
    baseURL: CONFIG.url.api, method: 'POST', timeout: CONFIG.url.timeout,
    headers: { 'Content-Type': 'application/json;charset=UTF-8', },
    adapter: (config: any) => uni && new Promise((resolve, reject) => {
        const { baseURL, url, headers, data, params } = config;
        const uniConfig = {// * 此处使用析构新建,猜测axios的headers在使用后会删除,所以直接引用就为空
            ...config, url: baseURL + url, header: { ...headers },
        };

        if (data || params) {
            try { uniConfig.data = JSON.parse(data || params); }
            catch (e) { uniConfig.data = data || params; }
        }
        uni.request({
            ...uniConfig,
            success(res) {
                // 兼容axios的错误处理,
                const params = { ...res, status: res.statusCode, statusText: res.errMsg, config, request: null }
                res.statusCode > 200 && res.statusCode < 300 ? resolve(params) : reject({ response: params });
            },
            fail(res) {
                reject({ ...res, status: res.statusCode, statusText: res.errMsg, config, request: null });
            },
        })
    }) as any, // 指定uniapp适配器
}

// 创建axios实例
const instance = axios.create(option)
// 这个实例并不经过拦截器,虽然很丑,但是这样逻辑最简单

const beforeRequest = async (config) => {
    // todo:判断白名单
    config.headers[CONFIG.key.token] = store.token;
    return config
}
// 请求拦截器
instance.interceptors.request.use(beforeRequest)

// 响应-处理状态码,服务器只有200正常,401刷新token,402需要注册,403需要权限,
// 404服务器不存在但是可能因为网关原因存在,500以上都是服务器错误
// 再有内部错误都以code来处理,

// 注意这里的resolve实际并没有被调用,所以返回的这个Promise一直pending,挂起状态,并不执行后续的then也不结束.
// 但是存入队列一个可以被立即resolve的函数,后续队列被调用的时候,才会被resolve
// 由于Promise的穿透性,这个pending的Promise会被立即执行,进而执行后续的then

// 新增的响应拦截器，处理服务器导致的错误:404反代失效造成,500服务器未启动等.正常的内部错误使用200
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        const requestId = response.config.url + JSON.stringify(response.config.data); // 生成唯一的请求ID
        delete networkErrorQueue[requestId];
        return response
    },
    (error: AxiosError) => {
        const response = error.response;
        const requestId = response.config.url + JSON.stringify(response.config.data); // 生成唯一的请求ID
        if (![404, 500].includes(response.status)) {// 非404,500进入下一段拦截器
            delete networkErrorQueue[requestId];
            return Promise.reject(error);// 抛出错误,后面处理
        }
        return new Promise((resolve) => {
            if (!networkErrorQueue[requestId]) {// 请求不在队列里面,将请求存入队列
                networkErrorQueue[requestId] = () => resolve(instance(response.config));
            }
        })
    }
)

// 响应-处理401的token竞争问题
instance.interceptors.response.use(response => {
    console.log('401竞争', response, response.config.url)
    return response
}, (error: AxiosError) => {
    const response = error.response;
    if (response?.status == 200) {// * 401重试队列也会走这里,不走正常?
        return response;
    } else if (response?.status !== 401) {
        return Promise.reject(error);// 抛出错误,后面处理
    }
    // 刷新token时,将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
    if (isRefreshing) {
        return new Promise(resolve => notLoginQweue.push(() => resolve(instance(response.config))))
    }
    isRefreshing = true// 第一次要登录一下
    return new Promise((resolve) => uni.login({ provider: 'weixin', success: res => resolve(res.code) }))// 登录微信
        .then(code => instance({ url: CONFIG.url.login, data: { code } }))// 刷新token
        .then(_ => instance(response.config)) // 重试本次需求
})
// 响应-402错误

// 响应-处理内容部分,判断code问题,判断token问题.
instance.interceptors.response.use((response: AxiosResponse) => {
    const { token, code, status } = response?.data || {};
    if (token) {// 返回如过携带了token,就是要更新token了.
        store.setToken(token);
        notLoginQweue.forEach(f => f());// 新token重试积压请求
        notLoginQweue = []; // 清空队列
        isRefreshing = false;
        return response // 正常返回,防止在进入错误拦截,只不过这个结果后面不用.
    }
    if (!code) {
        return response;
    }
});

// 最后-错误处理,默认的void返回也会触发之前pending的Promise,就不会继续进行.
instance.interceptors.response.use(response => response, error => {
    const response = error.response;
    if (!response?.status) {
        console.log('错误处理逃单', error)
        // 前面终止继续的到这里,防止报错
    } else if (response.status == 402) {
        notLoginQweue = [];// 非注册用户就不可能再401重试了,清空401队列了
        console.log('402___跳转____', response)
        uni.reLaunch({ url: `${CONFIG.page.index}?error=402` })
    } else if (response.status == 403) {// 权限问题,弹出
        uni.showToast({ title: '权限不足', duration: 3e3 });
    } else if ([404, 500].indexOf(response.status) != -1) {
        if (!isShowNetworkErrorModal) {// 只弹出一次对话框
            isShowNetworkErrorModal = true;
            uni.showModal({
                title: '提示', confirmText: '重试', showCancel: false, confirmColor: '#f55850',
                content: `网络出错${response.status}，请检查网络连接${Object.values(networkErrorQueue).length}`,
                success: (res) => {
                    if (res.confirm) {
                        isShowNetworkErrorModal = false;
                        console.log('重试队列中的所有请求', networkErrorQueue);
                        for (let id in networkErrorQueue) {// 重试队列中的所有请求
                            networkErrorQueue[id]();
                        }
                    }
                }
            })
        }
    } else {
        // 其他未知严重错误
    }
});


export const api = (url: string, data?: any) => instance({ url, data }).then(repsonse => repsonse?.data?.data) as Promise<any>;