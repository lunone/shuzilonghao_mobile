<template>
你看到这个就是加载test成功
</template>
<script setup lang="ts">
// 就是为了测试store

import { useUserStore } from '@/store/user.store';
import { onMounted } from 'vue';
const userStore = useUserStore();
onMounted(() => {
    userStore.fetchSelf();
})
</script>
<style lang="less" scoped></style>