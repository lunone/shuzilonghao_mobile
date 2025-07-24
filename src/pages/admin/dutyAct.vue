<template>
    <div class="duty-container">
        <DutyCalendar :loading="loading" :duty-data="dutyData" :staff-obj="userStore.staffObj"
            @day-click="handleDayClick" />

        <DutyDialog v-model:show="showDialog" :selected-date="selectedDate" :duty-data="dutyData"
            :staff-list="staffList" />

        <DutyArrange :staff-list="staffList" @update:staff-list="handleStaffListUpdate" />

        <div class="action-section">
            <press-button type="primary" @click="generateDuty" :disabled="hasCurrentMonthData">
                生成本月排班
            </press-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useUserStore } from '@/store/user.store';
import type { UserItem } from '@/interface/user.interface';
import dayjs from 'dayjs';
import DutyCalendar from './duty/dutyCalendar.vue';
import DutyDialog from './duty/dutyDialog.vue';
import DutyArrange from './duty/dutyArrange.vue';

const userStore = useUserStore();
const loading = ref(true);

// 模拟排班数据
const dutyData = ref([
    { id: 1, userId: 'A00725', start: new Date(2025, 6, 21).getTime(), end: new Date(2025, 6, 21).getTime() },
    { id: 2, userId: 'A00732', start: new Date(2025, 6, 22).getTime(), end: new Date(2025, 6, 22).getTime() },
]);

// 当前选中日期
const selectedDate = ref<Date | null>(null);
const showDialog = ref(false);
// const pickerRef = ref();

// 可排班人员列表
const staffList = ref<UserItem[]>([]);

// 监听store数据变化
const calendarKey = ref(0);
watch(() => userStore.staffObj, (newStaff) => {
    staffList.value = Object.values(newStaff);
    calendarKey.value++; // 强制日历重新渲染
}, { immediate: true, deep: true });

// 处理日期点击
const handleDayClick = (date: Date) => {
    console.log(showDialog.value, selectedDate.value)
    selectedDate.value = date;
    showDialog.value = true;
};

// 处理人员列表更新
const handleStaffListUpdate = (newList: UserItem[]) => {
    staffList.value = newList;
    userStore.$patch({
        staffRaw: newList.reduce((acc, cur) => {
            acc[cur.userId] = cur;
            return acc;
        }, {} as Record<string, UserItem>)
    });
};

// 检查当月是否有数据
const hasCurrentMonthData = computed(() => {
    const now = new Date();
    return dutyData.value.some(item => {
        const date = new Date(item.start);
        return date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth();
    });
});

// 生成排班
const generateDuty = () => {
    // 这里可以添加生成排班的逻辑
    console.log('生成本月排班');
};
onMounted(async () => {
    await userStore.fetchStaff();
    loading.value = false;
});

</script>

<style scoped lang="less">
// .duty-container {
//     padding: 16px;
// }

.calendar-section {
    margin-bottom: 24px;

    .calendar {
        --calendar-height: 500px;

        /* 日期文字变小 */
        :deep(.van-calendar__day) {
            font-size: 12px;
        }

        /* bottomInfo字体变大且颜色加深 */
        :deep(.van-calendar__bottom-info) {
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }
    }
}

.staff-section {
    margin-bottom: 24px;

    .title {
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: bold;
    }

    .staff-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .staff-item {
        cursor: move;
    }
}

.action-section {
    display: flex;
    justify-content: center;
}
</style>
