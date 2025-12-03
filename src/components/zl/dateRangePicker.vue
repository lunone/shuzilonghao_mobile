<template>
    <wd-calendar
        v-model="model"
        :show="showCalendar"
        @close="showCalendar = false"
        type="daterange"
        :first-day-of-week="1"
        :min-date="dayjs(minDate).valueOf()"
        :max-date="dayjs(maxDate).valueOf()"
        @confirm="onConfirm"
    />
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { PropType, ref } from 'vue';

const props = defineProps({
    minDate: { type: Date, default: dayjs().subtract(45, 'day').toDate(), },
    maxDate: { type: Date, default: dayjs().subtract(1, 'day').toDate(), },
    format: { type: String, default: 'YYYY-MM-DD' },
    seprater: { type: String, default: '至' }
})
const model = defineModel({
    type: Object as PropType<[Date, Date]>, default: () => [
        dayjs().add(-11, 'day').toDate(),
        dayjs().add(-1, 'day').toDate()],
})

const showCalendar = ref(false);

const onConfirm = (event: { value: [Date, Date] }) => {
    const detail = event.value;
    if (detail && Array.isArray(detail) && detail.length === 2) {
        model.value = detail;
    }
    showCalendar.value = false;
}
</script>
<style lang="less" scoped></style>