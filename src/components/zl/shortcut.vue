<template>
    <div class="shortcut-wrapper">
        <div v-for="(cols, index) in links" :key="index" class="line">
            <div v-for="col in cols" :key="col.link" class="item" :style="{ width: col.size * 16 + '%' }"
                hover-class="navigator-hover" @click="jump(col.link, col.error)">
                <i :class="`icon zl-icon-${col.class}`" />
                <div class="text">{{ col.text }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType, Ref, ref } from 'vue';
type Link = { size: number, link: string, class: string, text: string, error?: string }
const props = defineProps({
    links: { type: Object as PropType<Link[][]>, default: () => [] }
})

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
    .column;
    width: 100%;

    .line {
        .row;
        width: 100%;
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