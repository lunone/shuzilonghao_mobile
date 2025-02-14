<template>
    <view class="error-wrapper">
        <view>
            <i class="icon zl-icon-error" />
        </view>
        <view class="error-content">{{ message }}</view>
    </view>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const message = ref('发生错误');

onLoad(async (e) => {
    message.value = e.error || message.value;
})
</script>
<style lang="less" scoped>
@import '@/css/base.less';
</style>