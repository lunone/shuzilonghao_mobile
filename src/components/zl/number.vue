<template>
    {{ format }}
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
const format = ref('');
const props = defineProps({
    value: { type: Number, default: 0 }
})
watch(() => props.value, () => {
    format.value = (props.value + '').replace(/\B(?=(\d{4})+(?!\d))/g, ',');
}, { immediate: true })

</script>