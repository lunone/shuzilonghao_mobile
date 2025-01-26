<template>
    <view class="tab">
        <view v-if="index == active">
            <slot></slot>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { watch, onMounted, inject, Ref } from 'vue';
const props = defineProps({
    title: { type: String, default: '' },// 接收一个title传给父组件
    icon: { type: String, default: '' },
});
const index = Math.floor(10000000 + Math.random() * 90000000);

const tabs = inject('TABS') as { index: number, title: string, icon: string }[];
const active = inject('ACTIVE') as Ref;

watch(() => active.value, (newValue) => {
    // console.log(`在${index}组件中，active值变化为${newValue}`, tabs);
})


onMounted(() => {
    // 初始化到父组件数组中
    // console.log('sun tab----------', index, props.title);
    tabs.push({ index, title: props.title, icon: props.icon });
});
</script>
<style lang="less" scoped></style>