<template>
    <div class="dates" @click="showCalendar = true">
        <div class="date">{{ dayjs(model[0]).format(format) }}</div>
        <div class="sep">{{ seprater }}</div>
        <div class="date">{{ dayjs(model[1]).format(format) }}</div>
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
.dates {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 15px;
    padding: 8px 20px;
    border-radius: 8px;
    background-color: #f5f7fa; // 改为更柔和的浅蓝灰色
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.05), // 外投影增加层次
        inset 0 1px 2px rgba(255, 255, 255, 0.8); // 内阴影增加立体感
    border: 1px solid #e0e0e0; // 添加浅色边框
    transition: all 0.2s ease;
    cursor: pointer;


    .date {
        font-size: 1.1em;
        color: #333; // 改为更沉稳的深灰色
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.9);
    }

    .sep {
        color: #666;
        margin: 0 12px;
        font-weight: 500;
    }
}
</style>