import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { CONFIG } from '@/config';

let isRefreshing = false; // 是否正在刷新的flag
let isShowNetworkErrorModal = false; // 确保对话框弹出一个的标志
let notLoginQweue: (() => void)[] = []; // 401请求队列
let networkErrorQueue: Record<string, any> = {}; // 网络错误请求队列

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
                res.statusCode >= 200 && res.statusCode < 300 ? resolve(params) : reject({ response: params });
            },
            fail(res) {
                reject({ ...res, status: res.statusCode, statusText: res.errMsg, config, request: null });
            },
        })
    }) as any, // 指定uniapp适配器
}

// 创建axios实例
const instance = axios.create(option)

const beforeRequest = (config: any) => {
    // todo:判断白名单
    config.headers[CONFIG.key.token] = uni.getStorageSync(CONFIG.key.token);
    return config
}
// 请求拦截器
instance.interceptors.request.use(beforeRequest)

// 响应-处理状态码,服务器只有200正常,401刷新token,402需要注册,403需要权限,
// 404服务器不存在但是可能因为网关原因存在,500以上都是服务器错误
// 再有内部错误都以code来处理,

// 新增的响应拦截器，处理服务器导致的错误:404反代失效造成,500服务器未启动等.正常的内部错误使用200
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        const requestId = response.config.url + JSON.stringify(response.config.data); // 生成唯一的请求ID
        delete networkErrorQueue[requestId];
        return response
    },
    (error: AxiosError) => {
        const response = error.response;
        if (!response) {
            return Promise.reject(error);
        }
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
        .then(code => instance({ url: CONFIG.url.login, data: { code } }))// 重试token
        .then(_ => instance(response.config)) // 重试本次需求
})

// 响应-处理内容部分,判断code问题,判断token问题.
instance.interceptors.response.use((response: AxiosResponse) => {
    const { token } = response?.data || {};
    if (token) {// 返回如过携带了token,就是要更新token了.
        uni.setStorageSync(CONFIG.key.token, token);
        notLoginQweue.forEach(f => f());// 新token重试积压请求
        notLoginQweue = []; // 清空队列
        isRefreshing = false;
    }
    return response;
});

// 最后-错误处理,默认的void返回也会触发之前pending的Promise,就不会继续进行.
instance.interceptors.response.use(response => response, error => {
    const response = error.response;
    if (!response?.status) {
        // 前面终止继续的到这里,防止报错
    } else if (response.status == 402) {
        notLoginQweue = [];// 非注册用户就不可能再401重试了,清空401队列了
        uni.reLaunch({ url: `${CONFIG.page.index}?error=402` })
    } else if (response.status == 403) {// 权限问题,弹出
        uni.showToast({ title: '权限不足', duration: 3e3, icon: 'none' });
    } else if ([404, 500].indexOf(response.status) != -1) {
        if (!isShowNetworkErrorModal) {// 只弹出一次对话框
            isShowNetworkErrorModal = true;
            uni.showModal({
                title: '提示', confirmText: '重试', showCancel: false, confirmColor: '#f55850',
                content: `网络出错(${response.status})，请检查网络连接`,
                success: (res) => {
                    if (res.confirm) {
                        isShowNetworkErrorModal = false;
                        for (let id in networkErrorQueue) {// 重试队列中的所有请求
                            networkErrorQueue[id]();
                        }
                    }
                }
            })
        }
    }
    return Promise.reject(error);
});


// Loading状态管理
class LoadingManager {
    private loadingCount = 0;
    private loadingText = '加载中...';
    private pageLoadingCallbacks: Array<(isLoading: boolean, text?: string) => void> = [];

    registerPageLoading(callback: (isLoading: boolean, text?: string) => void) {
        this.pageLoadingCallbacks.push(callback);
        return () => {
            const index = this.pageLoadingCallbacks.indexOf(callback);
            if (index > -1) {
                this.pageLoadingCallbacks.splice(index, 1);
            }
        };
    }

    show(text?: string) {
        if (text) {
            this.loadingText = text;
        }
        this.loadingCount++;
        this.pageLoadingCallbacks.forEach(callback => callback(true, this.loadingText));
    }

    hide() {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        if (this.loadingCount === 0) {
            this.pageLoadingCallbacks.forEach(callback => callback(false));
        }
    }

    hideAll() {
        this.loadingCount = 0;
        this.pageLoadingCallbacks.forEach(callback => callback(false));
    }

    isLoading(): boolean {
        return this.loadingCount > 0;
    }
}

const loadingManager = new LoadingManager();

export const loading = {
    show: (text?: string) => loadingManager.show(text),
    hide: () => loadingManager.hide(),
    hideAll: () => loadingManager.hideAll(),
    isLoading: () => loadingManager.isLoading(),
    registerPageLoading: (callback: (isLoading: boolean, text?: string) => void) => loadingManager.registerPageLoading(callback)
};

/**
 * 通用的API请求函数，自动处理loading
 * @param url 请求URL
 * @param data 请求数据
 * @param options 配置选项
 * @param options.showLoading 是否显示loading，默认false
 * @param options.loadingText loading文本，默认'加载中...'
 * @param options.hideErrorToast 是否隐藏错误提示，默认false
 */
export const request = (
    url: string,
    data: any = undefined,
    options: {
        showLoading?: boolean;
        loadingText?: string;
        hideErrorToast?: boolean;
    } = {}
): Promise<any> => {
    const {
        showLoading = false,
        loadingText = '加载中...',
        hideErrorToast = false
    } = options;

    if (showLoading) {
        loadingManager.show(loadingText);
    }

    return instance({ url, data })
        .then(response => {
            if (showLoading) {
                loadingManager.hide();
            }
            // 检查业务逻辑错误 (假设成功的 code 是 0 或 200)
            if (response.data.code) {
                const errorMessage = response.data.message || '业务处理失败';
                if (!hideErrorToast) {
                    uni.showToast({
                        title: errorMessage,
                        icon: 'none',
                        duration: 3000
                    });
                }
                return Promise.reject(new Error(errorMessage));
            }
            return response?.data?.data;
        })
        .catch(error => {
            if (showLoading) {
                loadingManager.hide();
            }

            if (!hideErrorToast) {
                const response = error.response;
                let errorMessage = '请求失败';

                if (response?.data?.message) {
                    errorMessage = response.data.message;
                } else if (error.message && !(error.config)) {
                    // 只显示我们自己 reject 的业务错误，而不是 axios 的网络错误信息
                    errorMessage = error.message;
                }

                // 避免为拦截器已处理的HTTP错误（403, 404, 500等）重复显示toast
                if (response?.status !== 403 && response?.status !== 404 && response?.status !== 500) {
                    uni.showToast({
                        title: errorMessage,
                        icon: 'none',
                        duration: 3000
                    });
                }
            }

            throw error;
        });
};

/**
 * 不显示loading的API请求函数
 */
export const apiSilent = (url: string, data?: any) =>
    request(url, data, { showLoading: false });

/**
 * 自定义loading文本的API请求函数
 */
export const apiWithLoading = (url: string, data: any = undefined, loadingText: string) =>
    request(url, data, { showLoading: true, loadingText });

/**
 * 不显示错误提示的API请求函数
 */
export const apiNoError = (url: string, data?: any) =>
    request(url, data, { hideErrorToast: true });
