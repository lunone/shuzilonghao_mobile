<template>
    <div class="title">
        今日值班
    </div>
    <div v-for="item of data" :key="item.id">
        <div class="item">
            <div class="name">{{ item.name }}</div>
            <div class="dep">{{ item.dep }}</div>
        </div>
    </div>

</template>
<script setup lang="ts">
import { ref } from 'vue';

console.log('dddddddddd')

let data = ref([
    { name: 'xxx', dep: '信息', id: 1 },
    { name: 'xxx', dep: '保卫', id: 2 },
    { name: 'xxx', dep: '商务', id: 3 },
    { name: 'xxx', dep: '安监', id: 4 },
])





</script>