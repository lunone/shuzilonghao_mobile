<template>
    <div class="pilot-container">
        <div class="pilot-wrapper">
            <Search @select="select" />
            <zl-shortcut :links="links" class="links" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref } from 'vue';
import rankVue from './rank.vue';
import Search from './search.vue';
const showLink = ref(true);
const showMore = () => {
    showLink.value = !showLink.value;
};
const links = ref([[
    { size: 6, link: '/pages/pilot/rank', class: 'rank', text: '月度排名', error: '' },
    { size: 6, link: '/pages/pilot/fatigue', class: 'battery', text: '疲劳分析', error: '' },
    { size: 6, link: '/pages/pilot/technical', class: 'zoom', text: '能力分析', error: '' },
]]);
const select = (pcode: any) => {
    console.log('sel', pcode);
    // 跳转到page/pilot/participater，携带参数pcode
    uni.navigateTo({ url: `/pages/pilot/portrait?pcode=${pcode}` });
};
// 组件挂载时初始化
onMounted(() => { });
</script>
<style lang="less" scoped>
@import "@/css/base.less";

.pilot-container {
    padding: 10px;
}

.pilot-wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}

.links {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
