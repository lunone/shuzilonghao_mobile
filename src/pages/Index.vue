<template>
    <div class="main-container">
        <splashVue v-if="user == 'init'" />
        <indexVue v-else-if="user == 'employee'" />
        <publicVue v-else />
    </div>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import api from '@/utils/api';
import config from '@/config';

import splashVue from '@/pages/public/splash.vue';
import publicVue from '@/pages/public/public.vue';
import indexVue from '@/pages/staff/index.vue';

const user = ref('init');
onLoad(async (e) => {
    // todo:跳转页逻辑
    if (!e.redir) {// 防止玩意死循环跳转
        const res = await api('/user/init');
        console.log('获取到的user', res);
        setTimeout(() => {
            if (res) {// 存在用户登录到内容页
                user.value = 'employee';
            } else {// 不存在的用户显示注册页面.
                user.value = 'guest';
            }
        }, config.css.splash.duration);

    }
})

</script>


<style lang="less" scoped>
@import "@/css/base.less";

.main-container {
    background-color: #f3f3f3;
    display: flex;
    flex-direction: column;

    &>.section {
        padding: @padding-page;
        border-radius: @radius-base;
        background-color: @color-block;
        margin: @margin-page @margin-page;
        border-top-left-radius: @radius-sm;
        border-top-right-radius: @radius-sm;
        box-sizing: border-box;
        box-shadow: @shadow-base;
    }

    &>.overview {
        background-color: #f9f9f9;
        border-radius: @radius-base;
        margin: 0 @margin-page;
        // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        /* 添加渐变背景 */
        // background: linear-gradient(to bottom right, #c52005, #fa5430);
        background: linear-gradient(to bottom right, @color-primary, @color-secondary);

        .day {
            position: relative;
            padding-bottom: 10px;
            margin-bottom: 10px;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 10%;
                right: 10%;
                height: 2px;
                background-color: #f55b5b;
                /* 更浅的颜色 */
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
                /* 更浅的内阴影 */
            }
        }

        .year {
            margin-top: 2px;
        }
    }

    &>.shortcut {
        background-color: transparent;
        border-radius: 0;
        box-shadow: 0;
        padding: @padding-mini 0
    }

    &>.asset {
        .row;
        flex-wrap: wrap;

        .aircraft,
        .hr {
            width: 50%;
        }
    }


    &>.more {
        box-shadow: none;
        background-color: transparent;
    }
}
</style>