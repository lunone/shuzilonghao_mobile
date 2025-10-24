import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { CONFIG } from '@/config';

let refreshTokenPromise: Promise<any> | null = null; // 管理Token刷新的Promise
let isShowNetworkErrorModal = false; // 确保对话框弹出一个的标志
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
                const response = { ...res, status: res.statusCode, statusText: res.errMsg, config, request: null, data: res.data, headers: res.header };
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(response);
                } else {
                    const error = new AxiosError(res.errMsg, String(res.statusCode), config, null, response);
                    reject(error);
                }
            },
            fail(err) {
                const error = new AxiosError(err.errMsg, 'NETWORK_ERROR', config);
                reject(error);
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

// 统一响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        // 任何成功的响应都可能携带新token，在此更新
        const { token } = response?.data || {};
        if (token) {
            uni.setStorageSync(CONFIG.key.token, token);
        }
        // 如果请求在网络错误队列中，成功后将其移除
        const requestId = response.config.url + JSON.stringify(response.config.data);
        delete networkErrorQueue[requestId];
        return response;
    },
    async (error: AxiosError) => {
        const response = error.response;
        const originalRequest = error.config as any;

        // 如果没有response或config，直接抛出错误
        if (!response || !originalRequest) {
            return Promise.reject(error);
        }

        // --- 处理 401: Token 无效或过期 ---
        if (response.status === 401) {
            // 如果正在刷新token，则等待刷新完成后重试
            if (refreshTokenPromise) {
                try {
                    await refreshTokenPromise;
                    return instance(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }

            // 发起第一次刷新token的请求
            refreshTokenPromise = new Promise(async (resolve, reject) => {
                try {
                    // 1. 调用 uni.login 获取 code
                    const loginRes = await uni.login({ provider: 'weixin' });
                    const code = (loginRes as any).code;

                    // 2. 用 code 请求新 token
                    const tokenResponse = await instance({ url: CONFIG.url.login, data: { code } });

                    // 3. 从响应中获取新 token 并更新
                    const newToken = tokenResponse?.data?.token;
                    if (newToken) {
                        uni.setStorageSync(CONFIG.key.token, newToken);
                        resolve(newToken);
                    } else {
                        throw new Error('刷新token失败');
                    }
                } catch (e) {
                    uni.removeStorageSync(CONFIG.key.token); // 清空token
                    uni.reLaunch({ url: `${CONFIG.page.index}?error=401` });
                    reject(e);
                } finally {
                    // 无论成功或失败，重置promise，以便下次401能重新触发刷新
                    refreshTokenPromise = null;
                }
            });

            try {
                await refreshTokenPromise;
                // 刷新成功后，重试原始请求
                return instance(originalRequest);
            } catch (refreshError) {
                // 刷新失败，原始请求也失败
                return Promise.reject(refreshError);
            }
        }

        // --- 处理 402: 需要注册 ---
        if (response.status === 402) {
            uni.removeStorageSync(CONFIG.key.token); // 清空token
            uni.reLaunch({ url: `${CONFIG.page.index}?error=402` });
            return Promise.reject(error);
        }

        // 对于403, 404, 500等统一让最后的catch处理,这里只透传

        // --- 其他未处理错误 ---
        return Promise.reject(error);
    }
);


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

export type RequestParams<T = any> = {
    url: string;
    data?: any;
    showLoading?: boolean;
    loadingText?: string;
    hideErrorToast?: boolean;
    defaultValue?: T;
};

/**
 * 通用的API请求函数，自动处理loading
 * @param params 请求参数对象
 * @param params.url 请求URL
 * @param params.data 请求数据
 * @param params.showLoading 是否显示loading，默认false
 * @param params.loadingText loading文本，默认'加载中...'
 * @param params.hideErrorToast 是否隐藏错误提示，默认false
 * @param params.defaultValue 失败时返回的默认值
 */
export const request = async <T = any>(
    params: RequestParams<T>
): Promise<T | undefined> => {
    const {
        url,
        data,
        showLoading = false,
        loadingText = '加载中...',
        hideErrorToast = false,
        defaultValue,
    } = params;

    const hasDefaultValue = defaultValue !== undefined;

    showLoading && loadingManager.show(loadingText);

    try {
        const response = await instance({ url, data });

        // 检查业务逻辑错误
        if (response.data.code) {
            const errorMessage = response.data.message || '业务处理失败';
            if (!hideErrorToast) {
                uni.showToast({ title: errorMessage, icon: 'none', duration: 3000 });
            }
            throw new Error(errorMessage);
        }
        return response?.data?.data;

    } catch (error: any) {
        if (!hideErrorToast) {
            const response = error.response;
            let errorMessage = '请求失败';

            if (response) {
                switch (response.status) {
                    case 403:
                        errorMessage = response.data?.message || '权限不足';
                        break;
                    case 404:
                        errorMessage = `接口地址不存在`;
                        break;
                    case 500:
                        errorMessage = '服务器内部错误';
                        break;
                    default:
                        errorMessage = response.data?.message || '未知错误';
                }
            } else if (error.message && !error.config) {
                errorMessage = error.message;
            }

            uni.showToast({ title: errorMessage, icon: 'none', duration: 3000 });
        }

        // 根据是否存在defaultValue决定是抛出异常还是返回默认值
        if (hasDefaultValue) {
            return defaultValue;
        } else {
            throw error;
        }

    } finally {
        if (showLoading) {
            loadingManager.hide();
        }
    }
};
