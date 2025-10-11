<template>
    <div class="calendar-section">
        <!-- <press-calendar title="日历" :poppable="false" :show-confirm="false" class="calendar" :formatter="formatter"
            @select="handleDayClick" /> -->
        <wd-calendar-view v-model="value" :formatter="formatter" :first-day-of-week="1" :min-date="minDate"
            :max-date="maxDate" />
        <!-- <wd-loading v-else size="50px" /> -->
    </div>

</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, provide } from 'vue';
import dayjs from 'dayjs';
import { useUserStore } from '@/store/user.store';
import type { UserItem } from '@/api/user.api';
import { useDepartmentStore } from '@/store/department.store';
import type { Duty } from '@/types/duty';

interface StaffObj { [key: string]: UserItem; }

const props = defineProps<{
    staffObj: StaffObj;
    dutyData: Duty[];
}>();

const userStore = useUserStore();
const departmentStore = useDepartmentStore();
const emit = defineEmits(['dayClick']);

const minDate = dayjs().add(-1, 'month').startOf('month').valueOf();
const maxDate = dayjs().add(1, 'month').endOf('month').valueOf();

// 当前选中日期

const value = ref(Date.now())
// 但由于ref的引用关系，formatter变化时，日历也会重新渲染
const createFormatter = () => (day: any) => {
    const duty = props.dutyData?.find(item => {
        const $day = new Date(day.date).getTime();
        const itemDate = new Date(item.date).getTime()
        return (
            new Date($day).getFullYear() === new Date(itemDate).getFullYear() &&
            new Date($day).getMonth() === new Date(itemDate).getMonth() &&
            new Date($day).getDate() === new Date(itemDate).getDate()
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
        console.log($day.format('YYYY-MM-DD'),)
        emit('dayClick', $day.toDate())
    } else {
        uni.showToast({ title: '历史无法更改', icon: 'none' });
    }
})

// 没有方法使得日历重新渲染，尝试通过key的变化重新渲染失败，所以通过formatter的变化来重新渲染
// 将formatter定义为ref，每次数据变化时，重新创建的formatter都是一样的，
const formatter = ref(createFormatter());
// 监听store数据变化
watch(() => [userStore.staffObj, props.dutyData], async () => {
    formatter.value = createFormatter();
}, { deep: true });



// 可排班人员列表
// const staffList = ref<UserItem[]>([]);
// todo:网络请求可排班人员
onMounted(async () => {
    userStore.fetchSelf()
    userStore.fetchStaff()
    departmentStore.fetchDepartments()
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
