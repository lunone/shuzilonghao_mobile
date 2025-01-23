<template>
    <view class="tabs-wrapper">
        <view class="titles">
            <text v-for="item in tabs" :key="item.index" class="title" :class="active == item.index ? 'activite' : ''"
                @click="click(item.index)">
                {{ item.title }}
            </text>
        </view>
        <view class="content">
            <slot></slot>
        </view>
    </view>
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
    // console.log('active tabs____', index);
}

onMounted(() => {
    nextTick(() => {
        // console.log('下一个将第一个设置为显示', tabs.value)
        click(tabs.value[0].index);
    })
})
</script>

<style scoped lang="less">
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
