<template>
    <div class="tabs-wrapper">
        <div class="titles">
            <span v-for="item in tabs" :key="item.index" class="title" :class="isActive(item) ? 'activite' : ''"
                @click="click(item.index)">
                <i :class="`zl-icon-${item.icon}`"> </i>
                {{ item.title }}
            </span>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, nextTick } from 'vue';

const active = defineModel<number | string>('active', { default: 0 });
// 父组件provide
const tabs = ref([]);
provide('TABS', tabs.value);
provide('ACTIVE', active);
const click = (index = 0) => {
    active.value = index;
}

const isActive = (index: { name: string, index: number, title: string }) => {
    let flag = false;
    if (typeof active.value === 'number') {
        return active.value === index.index;
    } else if (typeof active.value === 'string') {
        return active.value === index.name;
    }
};

onMounted(() => {
    nextTick(() => {
        // console.log('下一个将第一个设置为显示', tabs.value)
        // click(tabs.value[0].index);
    })
})
</script>

<style scoped lang="less">
@import "@/css/base.less";

.tabs-wrapper {
    display: flex;
    flex-direction: column;

    .titles {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .title {
            margin: 20rpx auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1rem;
            font-weight: normal;
            color: #CCCCCC;
            border-bottom: solid 1px transparent;
        }


        .activite {
            color: #333;
            font-weight: bold;
            border-color: #04c9c3;
        }
    }

    .content {
        /* background: #008000; */
        height: 100%;
    }
}
</style>
