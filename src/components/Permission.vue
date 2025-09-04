<template>
    <slot v-if="hasAccess" />
    <slot v-else name="fallback" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { checkPermission, type PermissionProps } from '@/utils/directives';

interface Props extends PermissionProps {}

const props = withDefaults(defineProps<Props>(), {
    requireAll: false
});

const hasAccess = computed(() => {
    return checkPermission(props);
});
</script>
