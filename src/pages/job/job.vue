<template>
    <NavVue>
        这里放个跑马灯，提示今日还有什么没有填报
    </NavVue>
    <van-steps direction="vertical" :active="0">
        <van-step>
            <h3>【城市】物流状态1</h3>
            <p>2016-07-12 12:40</p>
        </van-step>
        <van-step>
            <h3>【城市】物流状态2</h3>
            <p>2016-07-11 10:00</p>
        </van-step>
        <van-step>
            <h3>快件已发货</h3>
            <p>2016-07-10 09:30</p>
        </van-step>
    </van-steps>
</template>
<script setup lang="ts">


</script>
<style lang="less" scoped>
</style>