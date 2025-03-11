<template>
    <div class="main-container">
        <!-- <errorVue v-if="error" />
        <template v-else> -->
        <splashVue v-if="user == 'init'" />
        <leaderVue v-else-if="user == 'leader'" />
        <employeeVue v-else-if="user == 'employee'" />
        <agentVue v-else-if="user == 'agent'" />
        <publicVue v-else />
        <!-- </template> -->
        <activateVue v-if="user == 'public'" />

        <press-popup-plus :show="showReadme" round>
            <ReadmeVue @close="showReadme = false" />
        </press-popup-plus>
    </div>
</template>
<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import CONFIG from '@/config';
import activateVue from '@/pages/public/activate.vue';
import errorVue from '@/pages/public/error.vue';
import splashVue from '@/pages/public/splash.vue';
import publicVue from '@/pages/public/public.vue';
import leaderVue from '@/pages/staff/leader.vue';
import employeeVue from '@/pages/staff/employee.vue';
import agentVue from '@/pages/agent/agent.vue';
import {useUserStore} from '@/store/user.store';
import ReadmeVue from './staff/readme.vue';

const store = useUserStore();
const user = ref('init');
const error = ref('');
const showReadme = ref(false);

onLoad(async (e) => {
    if (e.error) {
        console.log('main里面的error', e, e.error);
        if (e.error == 402) {
            user.value = 'public';
        }
    } else {
        // e.activate是激活成功后需要强制刷新个人信息
        const res = await store.myself(e.activate);
        console.log('获取到的user', res);
        // 如果激活成功,显示readme
        if (e.activate) {
            showReadme.value = true;
        }
        // 因为现在本页面已经成了入口级别页面了.所以不一定要初始化了
        // 如果是初始化就要加载封面页,如果不是就立即跳转了
        const duration = CONFIG.css.splash.duration;
        setTimeout(() => user.value = res['type'] || '谁知道发生了肾么事啊', duration);
    }
})

</script>
