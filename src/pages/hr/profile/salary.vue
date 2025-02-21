<template>

    <div class="salary-wrapper">
        <div class="kv salary">
            <div class="key">薪点</div>
            <div class="value">6500</div>
        </div>
    </div>
    <!-- <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
        这部分数据在系统有简单信息，不知道是否能与线下完全对得上
    </van-notice-bar> -->
    <!-- <div class="level-title">级别:副驾F3</div> -->

    <!-- <van-divider>飞行员额外显示</van-divider>
    <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
        这部分数据在 财务 未上网
    </van-notice-bar>
    <div class="level">
        <div class="level-details">
            <div class="level-item">打包费：{{ }}</div>
            <div class="level-item">转会费：{{ }}</div>
            <div class="level-item">安家费：{{ a }}</div>
        </div>
    </div> -->
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

</script>
<style lang="less" scoped>
@import '@/css/base.less';
@import "@/css/kv.less";

.salary-wrapper {
    padding: 10px;

    .salary {
        width: 100%;
    }
}
</style>