<template>
    <!-- <page-meta background-color="red" page-style="color: green" root-font-size="16px"> -->
        <view class="top-back" @click="topBack" v-if="isShow">
            <text>^</text>
            <text>顶部</text>
        </view>
    <!-- </page-meta> -->
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const isShow = ref(false);
const onPageScroll = (e) => {
    // console.log('e:',e)
    if (e.scrollTop >= 200) {
        // 显示
        isShow.value = true
    } else {
        // 隐藏
        isShow.value = false
    }
}
const topBack = () => {

    uni.pageScrollTo({
        scrollTop: 0,   // 滚动到页面的目标位置  这个是滚动到顶部, 0 
        duration: 300  // 滚动动画的时长
    })
}
onMounted(() => {
    console.log('top-back已经加载');
})
</script>
<style lang="less" scoped></style>