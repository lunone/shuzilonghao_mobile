<template>
    <div id="header">
        <!-- 头部 -->
    </div>
    <van-row>
        <van-col span="16">
            <!-- 介绍 -->
        </van-col>
        <van-col span="8">
            <div id="wx_reg"></div>
        </van-col>
    </van-row>
</template>
<script lang="ts" setup>
import Config from '@/config';
import { onMounted, onUpdated } from 'vue';
import { loadJs, redirectUrlFomatter, parseUrl, jump } from '@/utils/tool';
import Cookies from 'js-cookie';
import router from '@/router';
// 判断当前有没有token，如果有，二话不说，跳转到主页。
const token = Cookies.get(Config.token.name || 'token') || undefined;
const jsCode = Cookies.get(Config.token.codeName || 'code') || undefined;
const { baseUrl, hashUrl } = parseUrl();
if (token || jsCode) {
    router.replace('/');
}
// 加载后再加载二维码
onMounted(async () => await renderCode())
onUpdated(async () => await renderCode())

async function renderCode() {
    if (!(window as any).WwLogin) {
        await loadJs("//wwcdn.weixin.qq.com/node/wework/wwopen/js/wwLogin-1.2.4.js");
    }
    let url = jump(Cookies.get('redirectUrl'), true);
    console.log('跳转：|', url);
    // 渲染二维码
    new (window as any).WwLogin({
        id: "wx_reg",
        appid: Config.app.crop,
        agentid: Config.app.id,
        redirect_uri: url,
    });
}

</script>
<style>
#header {
    width: 100vw;
    height: 10vh;
}

#wx_reg {
    width: 300px;
    height: 400px;
}
</style>