<template>
    <div class="splash">
        <div class="splash-logo"></div>
    </div>
</template>

<script lang="ts" setup>
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
// 这个页面是公开页面,在本页面会请求一下token,如果有token,就直接跳过这个页面。如果没有就停留在这个页面
// 请求用户信息,不做任何操作,非注册用户会自动跳到注册页面。注册用户会跳转到首页
onMounted(async () => {
    const user = await api('/user/self');
    console.log('获取到的user', user);
    if (user) {
        uni.redirectTo({
            url: '/pages/index/Index'
        });
    }
})

</script>