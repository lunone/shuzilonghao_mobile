<template>
    <div class="shortcut-wrapper">
        <div v-for="(cols, index) in data" :key="index" class="line">
            <div v-for="col in cols" :key="col.link" class="item" :style="{ width: col.size * 16 + 'vw' }"
                hover-class="navigator-hover" @click="jump(col.link, col.error)">
                <i :class="`icon zl-icon-${col.class}`" />
                <div class="text">{{ col.text }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';

const data = ref([
    [
        { size: 12, link: '/pages/analysis/analysis', class: 'analysis', text: '运行分析' },
        { size: 6, link: '/pages/airplane/airplane', class: 'airplane', text: '机队' },
        { size: 6, link: '/pages/sale/sale', class: 'sale', text: '销售', error: '敬请期待' },
        { size: 6, link: '/pages/hr/Hr', class: 'person', text: '人员', error: '敬请期待' },
    ],
    [
        { size: 8, link: '/pages/sms/sms', class: 'sms', text: '安全' },
        { size: 8, link: '/pages/pilot/pilot', class: 'pilot', text: '飞行' },
        { size: 8, link: '/pages/maintenance/maintenance', class: 'maintenance', text: '维修', error: '敬请期待' },
    ],
]) as Ref<{ size: number, link: string, class: string, text: string, error?: string }[][]>;
function jump(link: string, error?: string) {
    if (error) {
        uni.showToast({ title: error, icon: 'none', mask: true, duration: 1e3 })
    } else {
        uni.navigateTo({ url: link });
    }
}
</script>

<style lang="less" scoped>
@import "@/css/base.less";

@color-background: #fafafa;
@active-background-color: #e0e0e0; // 激活时的背景颜色
@active-border-color: #bbb; // 激活时的边框颜色

.shortcut-wrapper {
    display: flex;
    flex-direction: column;

    .line {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 14vw;
        margin: 4px 0;

        .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;

            margin: 2px;
            border-radius: 8px;
            background-color: @color-background;
            /* 浅色背景 */
            border: 1px solid #ddd;
            height: 100%;

            .icon {
                font-size: 1.8rem;
                color: #c52005;
            }

            .text {
                font-size: 0.7rem;
                color: #999;
                margin-top: -4px;
            }

        }
    }
}
</style>