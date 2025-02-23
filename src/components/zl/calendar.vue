<template>
    <uni-calendar ref="calendar" :insert=false :lunar="true" :start-date="'2019-3-2'" :end-date="'2019-5-20'"
        @change="change" />
    <button @click="open">打开日历</button>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps({
    title: { type: String, default: '', },
    date: { type: String, default: '', },
    startDate: { type: Date, default: new Date(), },
    endDate: { type: Date, default: new Date(), },
    lunar: { type: Boolean, default: false, },
    insert: { type: Boolean, default: false, },
    range: { type: Boolean, default: false, },
    clear: { type: Boolean, default: true, },
    selected: { type: Array, default: () => [], },
});
const calendar = ref();
const show = defineModel({ default: false });
const emits = defineEmits(['change']);

watch(show, (newValue) => {
    if (newValue) {
        calendar.value.open();
    }
});
const open = () => {
    calendar.value.open();
}
const change = (e) => {
    console.log('日历发生变化:', e);
    emits('change', e);
}

</script>