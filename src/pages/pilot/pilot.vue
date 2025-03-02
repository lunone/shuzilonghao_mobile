<template>
    <div class="pilot-wrapper">
        <!-- <rankVue @showMore="showMore" class="rank"/> -->
        <zl-shortcut :links="links" class="links" />
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref } from 'vue';
import rankVue from './rank.vue';
const showLink = ref(true);
const showMore = () => {
    console.log('showMore')
    showLink.value = !showLink.value;
};

const links = ref([[
    { size: 4, url: '/pages/pilot/rank', class: 'analysis', text: '生产排名' },
    { size: 4, url: '/pages/pilot/portrait', class: 'health', text: '人员画像' },
    { size: 4, url: '/pages/pilot/analysis', class: 'location', text: '技术分析' },
]]);

// 组件挂载时初始化
onMounted(() => { });
</script>
<style lang="less" scoped>
@import "@/css/base.less";

.pilot-wrapper {
    .column;
    justify-content: flex-start;
    width: 100%;
    background-color: @color-pilot;

    .rank {
        width: 100%;
    }

    .links {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 4px;
    }

}
</style>