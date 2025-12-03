<template>
    <div class="date-picker-container">
        <span class="date-text">
            {{ dayjs(model[0]).format('MM月DD日') }} {{ seprater }} {{ dayjs(model[1]).format('MM月DD日') }}
        </span>
        <button class="calendar-btn" @click="showCalendar = true">日历</button>
    </div>
    <press-calendar :show="showCalendar" type="range" @confirm="onConfirm" :minDate="dayjs(minDate).valueOf()"
        :maxDate="dayjs(maxDate).valueOf()" :show-confirm="false" />
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

const onConfirm = (detail: [Date, Date]) => {
    const [start, end] = detail;
    showCalendar.value = false;
    model.value = [dayjs(start).toDate(), dayjs(end).toDate()];
}
</script>
<style lang="less" scoped>
.date-picker-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 15px;
    background-color: #6f7d99;
    border-radius: 20px;

    .date-text {
        color: white;
        font-size: 14px;
        flex: 1;
        text-align: left;
    }

    .calendar-btn {
        background: none;
        border: none;
        color: white;
        font-size: 14px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }
}
</style>