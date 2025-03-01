<template>
    <div class="analysis-wrapper">
        <year-vue class="year" />
        <zl-shortcut :links="links" class="links" />
    </div>
</template>

<script setup lang="ts">

import { ref, computed, watch, Ref } from 'vue';
import yearVue from './year.vue';
import _ from 'lodash';

const links = ref([[
    { size: 6, link: '/pages/analysis/overview', class: 'health', text: '趋势分析', error: '' },
    { size: 6, link: '/pages/analysis/airlines', class: 'location', text: '航线分析', error: '' },
]]);

function jump(link: string, error?: string) {
    if (error) {
        uni.showToast({ title: error, icon: 'none', mask: true, duration: 1e3 })
    } else {
        uni.navigateTo({ url: link });
    }
}
</script>
<style lang="less" scoped>
/* 添加样式 */
@import "@/css/base.less";

.analysis-wrapper {
    .column;
    background-color: #fff;
    // height: 100vh;
    justify-content: flex-start;
    width: 100%;

    .year {
        width: 100%;
        padding: 10px;
        box-sizing: border-box
    }

    .links {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 4px;
    }
}
</style>