<template>
    <div class="main-container">
        <splashVue v-if="user == 'init'" />
        <leaderVue v-else-if="user == 'leader'" />
        <employeeVue v-else-if="user == 'employee'" />
        <agentVue v-else-if="user == 'agent'" />
        <publicVue v-else />
    </div>
</template>
<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import config from '@/config';

import splashVue from '@/pages/public/splash.vue';
import publicVue from '@/pages/public/public.vue';
import leaderVue from '@/pages/staff/leader.vue';
import employeeVue from '@/pages/staff/employee.vue';
import agentVue from '@/pages/agent/agent.vue';
import { useStore } from '@/store';

const store = useStore();
const user = ref('init');

onLoad(async (e) => {
    // todo:跳转页逻辑
    if (!e.redir) {// 防止玩意死循环跳转
        const res = await store.useSelf();
        console.log('获取到的user', res);
        // 因为现在本页面已经成了入口级别页面了.所以不一定要初始化了
        // 如果是初始化就要加载封面页,如果不是就立即跳转了
        const duration = res.isInit ? config.css.splash.duration : 0;
        setTimeout(() => user.value = res.type || '谁知道发生了肾么事啊', duration);
    }
})

</script>
