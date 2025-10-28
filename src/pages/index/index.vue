<template>
    <div class="main-container">
        <splashVue v-if="userType == 'init'" />
        <agentVue v-else-if="userType == 'agent'" />

        <publicVue v-else />

        <activateVue v-if="userType == 'public'" />
        <div v-else-if="userType == ''">你忘了设置用户了</div>

        <press-popup-plus :show="showReadme" round>
            <ReadmeVue @close="showReadme = false" />
        </press-popup-plus>
    </div>
</template>
<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { CONFIG } from '@/config';
import { useUserStore } from '@/store/user.store';
import activateVue from '@/pages/public/activate.vue';
import splashVue from '@/pages/public/splash.vue';
import publicVue from '@/pages/public/public.vue';
import agentVue from '@/pages/agent/agent.vue';
import ReadmeVue from '@/pages/staff/readme.vue';

const store = useUserStore();
const userType = ref('init');
const showReadme = ref(false);

onLoad(async (e) => {
    let user = { type: 'public' };
    if (e.error) {
        console.log('main里面的error', e, e.error);
        // if (e.error == 402) {
        //     userType.value = 'public';
        // }
    } else {
        user = await store.fetchMe(e.activate);// e.activate是激活成功后需要强制刷新个人信息
        console.log('获取到的user', user);
        // 如果激活成功,显示readme
        if (e.activate) {
            showReadme.value = true;
        };
    }
    // 开屏页展示结束后跳转
    setTimeout(() => {
        const userTypeValue = user.type || 'public';
        if (userTypeValue === 'staff') {
            // staff用户直接跳转到staff主页
            uni.switchTab({
                url: '/pages/staff/home'
            });
        } else {
            userType.value = userTypeValue;
        }
    }, CONFIG.css.splash.duration)
})

</script>
