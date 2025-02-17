<template>
    <div class="login-wrapper">
        <div class="action">
            <input type="text" class="code" v-model="activationCode" placeholder="请输入邀请码">
            <button @click="activate" class="button" :disabled="disable">激活</button>
        </div>
        <div class="intro">
            测试期间需邀请才能使用, 激活后不再弹出
        </div>
    </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '@/utils/api';
import usebasisStore from '@/store/user.store';
import CONFIG from '@/config';
const store = usebasisStore();
const disable = ref(false);
const activationCode = ref('');
const activate = async () => {
    // 判断activationCode是否是一个4位字符串,如果不是弹出警告
    if (!/^[a-zA-Z0-9]{4}$/.test(activationCode.value)) {
        return error('激活码错误');
    }
    disable.value = true;
    const jsCode = await new Promise(resolve => uni.login({ provider: 'weixin', success: res => resolve(res.code) }));
    console.log('activate', activationCode.value, jsCode);
    api(CONFIG.url.activate, { regCode: activationCode.value, code: jsCode }).then((res) => {
        console.log('激活结果', res);
        // 激活成功返回token
        if (res) {
            store.token(res);
            // 跳转到首页
            uni.redirectTo({ url: '/pages/Index?activate=true' });
        } else {
            return error('激活失败');
        }
    }).finally(() => disable.value = false);
};
function error(message = '激活失败') {
    uni.showToast({ title: message, duration: 2e3, icon: 'error' });
}
</script>
<style lang="less" scoped>
@primary-color: #fea23e;
@background-color: #f8f8f8;
@text-color: #333;

.login-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50vh;
    margin: 0;
    padding: 0;
    text-align: center;
    
    background-image: url(https://app.airlonghao.com/cover.png);
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column-reverse;

    .action {
        margin-bottom: 40px;

        .code {
            padding: 10px;
            font-size: 18px;
            border: 1px solid @primary-color;
            border-radius: 5px;
            margin: 10px;
        }

        .button {
            background-color: @primary-color;
            color: white;
            margin: 0 10px;
            padding: 2px 25px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 18px;

            &:disabled {
                background-color: darken(@primary-color, 20%);
                cursor: not-allowed;
            }
        }
    }

    .intro {
        font-size: 12px;
        color: #97b8b5;
        text-align: center;
        width: 100%;
    }
}
</style>
