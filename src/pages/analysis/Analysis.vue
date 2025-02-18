<template>
    年度,月度,周报
    ----
    站点分析,飞机分析,航站分析,航线分析,
</template>
<script setup lang="ts">
import { ref, computed, watch, Ref, onMounted } from 'vue';
import CONFIG from '@/config';
import api from '@/utils/api';

onMounted(async () => {
    const startDate = '2025-02-10', endDate = '2025-02-19';
    const res = await api(CONFIG.url.statByStation, { startDate, endDate }) as any[];
    console.log('#####', startDate, endDate, res);
});
</script>
<style lang="less" scoped>
@import "@/css/base.less";
</style>