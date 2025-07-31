<template>
    <div class="duty-container">
        <!-- 排班日历 -->
        <calendar :staff-obj="userStore.staffObj" />
        <!-- 排班人员 -->
        <arrange />
        <!-- <test /> -->
        <div class="action-section">
            <press-button type="primary" @click="generateDuty" :disabled="hasCurrentMonthData">
                生成本月排班
            </press-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import dayjs from 'dayjs';
import { useUserStore } from '@/store/user.store';
import type { UserItem } from '@/interface/user.interface';
import calendar from '@/pages/guanli/paiban/dutyCalendar.vue';
import arrange from '@/pages/guanli/paiban/dutyArrange.vue';
const userStore = useUserStore();
const loading = ref(true);



// const pickerRef = ref();

// 可排班人员列表
// const staffList = ref<UserItem[]>([]);

// 处理人员列表更新
// const handleStaffListUpdate = (newList: UserItem[]) => {
//     staffList.value = newList;
//     userStore.$patch({
//         staffRaw: newList.reduce((acc, cur) => {
//             acc[cur.userId] = cur;
//             return acc;
//         }, {} as Record<string, UserItem>)
//     });
// };




// 检查当月是否有数据
const hasCurrentMonthData = computed(() => {
    const now = new Date();
    // return dutyData.value.some(item => {
    //     const date = new Date(item.start);
    //     return date.getFullYear() === now.getFullYear() &&
    //         date.getMonth() === now.getMonth();
    // });
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
