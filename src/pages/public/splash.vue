<template>
    <div class="splash" />
</template>

<style lang="less" scoped>
.splash {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), 
        url('https://app.airlonghao.com/splash.jpg');
    background-size: cover, cover;
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-blend-mode: overlay; /* 或者使用 multiply, screen 等其他混合模式 */
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>