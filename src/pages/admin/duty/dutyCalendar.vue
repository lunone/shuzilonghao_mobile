<template>
    <div class="calendar-section">
        <!-- <press-calendar title="日历" :poppable="false" :show-confirm="false" class="calendar" :formatter="formatter"
            @select="handleDayClick" /> -->
        <wd-calendar-view v-model="value" :formatter="formatter" :first-day-of-week="1" :min-date="minDate"
            :max-date="maxDate" />
        <!-- <wd-loading v-else size="50px" /> -->
    </div>
    <DutyDialog v-model:show="showDialog" :selected-date="selectedDate" @update:show="updateShow" :isSingle="false"
        @confirm="" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, provide } from 'vue';
import dayjs from 'dayjs';
import { useUserStore } from '@/store/user.store';
import type { UserItem } from '@/interface/user.interface';
import DutyDialog from '@/pages/admin/duty/dutyDialog.vue';

interface StaffObj { [key: string]: UserItem; }

const props = defineProps<{
    staffObj: StaffObj;
}>();

const userStore = useUserStore();
const emit = defineEmits(['day-click']);

const minDate = dayjs().add(-1, 'month').startOf('month').valueOf();
const maxDate = dayjs().add(1, 'month').endOf('month').valueOf();

// 当前选中日期
const selectedDate = ref<Date | null>(null);
const showDialog = ref(false);
const value = ref(Date.now())
// 模拟排班数据
const dutyData = ref([]);
// 但由于ref的引用关系，formatter变化时，日历也会重新渲染
const createFormatter = () => (day: any) => {
    const duty = dutyData.value?.find(item => {
        const date = new Date(item.start);
        const $day = new Date(day.date)
        return (
            date.getFullYear() === $day.getFullYear() &&
            date.getMonth() === $day.getMonth() &&
            date.getDate() === $day.getDate()
        );
    });
    // 添加点击处理函数
    // day.onClick = () => {
    //     handleAnyDayClick(day);
    // };
    // console.log(day, '--------')
    // 如果day大于小于今天，就disabled=true
    if (day.date < Date.now()) {
        day.disabled = true;
    }
    // 把历史排班信息显示到日历底部
    if (duty && props.staffObj) {
        const staff = props.staffObj[duty.userId];
        day.bottomInfo = staff?.name || '';
    } else {
        day.bottomInfo = '';
    }
    return day;
};

provide('dayClick', ({ value }) => {
    const $day = dayjs(value)
    if (dayjs().startOf('day').isBefore($day)) {
        // 处理日期点击
        selectedDate.value = $day.toDate();
        showDialog.value = true;
    } else {
        uni.showToast({ title: '历史无法更改', icon: 'none' });
    }
})
function updateShow(e) {
    console.log('up', e)
}
// 没有方法使得日历重新渲染，尝试通过key的变化重新渲染失败，所以通过formatter的变化来重新渲染
// 将formatter定义为ref，每次数据变化时，重新创建formatter，虽然重新创建的formatter都是一样的，
const formatter = ref(createFormatter());
// 监听store数据变化
watch(() => [userStore.staffObj, dutyData], async () => {
    formatter.value = createFormatter();
}, { deep: true });



// 可排班人员列表
// const staffList = ref<UserItem[]>([]);
// todo:网络请求可排班人员

onMounted(async () => {
    // todo:请求服务器排班数据
    await setTimeout(() => {
        console.log('请求排班数据')
        dutyData.value = [
            { id: 1, userId: 'A00725', start: new Date(2025, 6, 28).getTime(), end: new Date(2025, 6, 21).getTime() },
            { id: 2, userId: 'A00732', start: new Date(2025, 6, 29).getTime(), end: new Date(2025, 6, 22).getTime() },
        ]
    }, 1e3)

})
</script>

<style scoped lang="less">
.calendar-section {
    margin-bottom: 24px;

    .calendar {
        --calendar-height: 500px;

        :deep(.van-calendar__day) {
            font-size: 12px;
        }

        :deep(.van-calendar__bottom-info) {
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }
    }
}
</style>
