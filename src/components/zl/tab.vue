<template>
    <view class="tab">
        <view v-if="isActive()">
            <slot></slot>
        </view>
    </view>
</template>
<script lang="ts" setup>
import _ from 'lodash';
import { watch, onMounted, inject, Ref, ref } from 'vue';
const props = defineProps({
    name: { type: String, default: '' },// 接收一个title传给父组件
    title: { type: String, default: '' },// 接收一个title传给父组件
    icon: { type: String, default: '' },
});
const index = ref(0) //Math.floor(10000000 + Math.random() * 90000000);
type Tab = { name?: string, title: string, icon: string, index: number };

const tabs = inject('TABS') as Tab[];
const active = inject('ACTIVE') as Ref;

watch(() => props.title, () => {
    tabs[index.value].title = props.title;
})

const isActive = () => active.value === (_.isNumber(active.value) ? index.value : props.name)


onMounted(() => {
    // 初始化到父组件数组中
    // 查找tabs最大的
    // const last =
    // console.log('sun tab----------', index, props.title);
    index.value = tabs.length;
    tabs.push({ title: props.title, icon: props.icon, index: index.value, name: props.name });
    // 从父组件获取active,看自己是不是要显示


});
</script>
<style lang="less" scoped></style>