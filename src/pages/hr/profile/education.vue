<template>
    <div class="education-title">
        <div class="title">学历</div>
        <div class="value">{{ }}</div>
    </div>
    <div class="school">
        <div class="title">毕业院校</div>
        <div class="value">{{ }}</div>
    </div>
    <div class="education">
        <div class="item" v-for="(edu, index) in edu" :key="index">
            <div class="period">{{ edu.startDate }} - {{ edu.endDate }}</div>
            <div class="school">{{ edu.school }}</div>
            <div class="nature">{{ edu.nature }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
const props = defineProps({
    userId: { type: String, default: '' },
    educations: { type: Array, default: [] },
});
const edu = []
</script>