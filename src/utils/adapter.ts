/**
 * 原作者:https://gitee.com/black-key/uniapp-axios-adapter
 * 用途:让uniapp适配axios,单独引入为了调试方便
 */
const getResponse = (res, config) => {
    const { statusCode, errMsg } = res;
    const response = {
        ...res,
        status: statusCode,
        statusText: errMsg,
        config,
        request: null,
    };

    return response;
};

const uniAdapter = (config) => {
    if (!uni) {
        throw new Error("please use this in uni-app project!");
    }
    return new Promise((resolve, reject) => {
        const { baseURL, url, headers, data, params } = config;
        const uniConfig = {
            ...config,
            url: baseURL + url,
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
                const response = getResponse(res, config);
                resolve(response);
            },
            fail(res) {
                const response = getResponse(res, config);
                reject(response);
            },
        });
    });
};

export default uniAdapter;