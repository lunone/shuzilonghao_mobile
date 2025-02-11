<template>
    <div class="login-wrapper">
        <div class="intro">
            hi~朋友:<br>
            本程序属于内部数据,需要小组人员身份才能访问,<br>
            进行访问要求身份绑定后才能使用,绑定只需要一次,后续你会自动跳过本界面.<br>
            如果你通过邀请链接绑定身份,本页会自动跳过.如果你能看到这段文字,说明你未从邀请链接进入<br>
            如果你拥有激活码,输入激活码,如果你没有激活码,既然你都看到这个程序了,你知道找谁申请的<br>
        </div>
        <div class="action">
            <input type="text" class="code" v-model="activationCode" placeholder="请输入激活码">
            <button @click="activate" class="button" :disabled="disable">激活</button>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '@/utils/api';
import useInfoStore from '@/store/user.store';

const store = useInfoStore();
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
    api('/login/activate', { code: activationCode.value, wx: jsCode }).then((res) => {
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
@import '@/css/base.less';


.info-wrapper {
    // background-color: @background-color;
    // color: @text-color;
    font-family: Arial, sans-serif;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 0 auto;
}

.intro {
    margin-bottom: 20px;

    .title {
        font-size: 24px;
        // color: @primary-color;
        margin-bottom: 10px;
        text-align: center;
    }

    .section {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 15px;
        text-align: justify;
    }
}

.message {
    // background-color: @secondary-color;
    // color: @text-color;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.5;
}

.action {
    text-align: center;
    .column;
    // border:solid 1px red;

    .code {
        .row;
        margin: 10px auto;
        width: 80%;
        height: 20px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 22px; // 增加字体大小
    }

    .button {
        padding: 10px 20px;
        background-color: #fea23e;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        display: inline-block; // 确保按钮和输入框在同一行
        vertical-align: middle; // 垂直居中对齐


    }
}
</style>