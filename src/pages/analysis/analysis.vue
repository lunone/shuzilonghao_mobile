<template>
    <div class="analysis-wrapper">
        <year-vue class="year" />
        <star-vue class="star" />
        <div class="content">
            <zl-shortcut :links="links" class="links" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue';
import yearVue from './year.vue';
import starVue from './star.vue';
const links = ref([[
    { size: 6, link: '/pages/analysis/overview', class: 'health', text: '趋势分析', error: '' },
    { size: 6, link: '/pages/analysis/airlines', class: 'location', text: '航线分析', error: '' },
]]);

</script>
<style lang="less" scoped>
@import "@/css/base.less";

.analysis-wrapper {
    .column;
    background-color: #f8f8f8;
    justify-content: flex-start;
    width: 100%;

    .year,
    .star {
        width: 100%;
        padding: 10px;
        box-sizing: border-box
    }

    .content {
        .column;
        width: 100%;
        border-top-left-radius: 14px;
        border-top-right-radius: 14px;
        box-sizing: border-box;
        background-color: #fff;

        .links {
            width: 100%;
            box-sizing: border-box;
            padding: 10px 4px;
        }
    }
}
</style>