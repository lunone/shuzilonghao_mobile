<template>
    <div class="calendar-section">
        <wd-calendar-view v-model="value" @change="handleDayClick" :formatter="formatter" :first-day-of-week="1"
            :min-date="minDate" :max-date="maxDate" />
        <!-- <wd-loading v-else size="50px" /> -->
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/store/user.store';
import dayjs from 'dayjs';

interface DutyItem {
    id: number;
    userId: string;
    start: number;
    end: number;
}

import type { UserItem } from '@/interface/user.interface';
import { first } from 'lodash-es';

interface StaffObj {
    [key: string]: UserItem;
}

const props = defineProps<{
    loading: boolean;
    dutyData: DutyItem[];
    staffObj: StaffObj;
}>();

const emit = defineEmits(['day-click']);
const minDate = dayjs().add(-1, 'month').startOf('month').valueOf();
const maxDate = dayjs().add(1, 'month').endOf('month').valueOf();


const value = ref(Date.now())
// 没有方法使得日历重新渲染，尝试通过key的变化重新渲染失败，所以通过formatter的变化来重新渲染
// 将formatter定义为ref，每次数据变化时，重新创建formatter，虽然重新创建的formatter都是一样的，
// 但由于ref的引用关系，formatter变化时，日历也会重新渲染
const formatter = ref((day: any) => day);

function createFormatter() {
    return (day: any) => {
        const duty = props.dutyData?.find(item => {
            const date = new Date(item.start);
            const $day = new Date(day.date)
            return (
                date.getFullYear() === $day.getFullYear() &&
                date.getMonth() === $day.getMonth() &&
                date.getDate() === $day.getDate()
            );
        });
        // 如果day大于小于今天，就disabled=true
        if (day.date < Date.now()) {
            day.disabled = true;
        }
        if (duty && props.staffObj) {
            const staff = props.staffObj[duty.userId];
            day.bottomInfo = staff?.name || '';
        } else {
            day.bottomInfo = '';
        }

        return day;
    };
}

// 初始化
formatter.value = createFormatter();

const calendarKey = ref(0);


const userStore = useUserStore();


watch(() => userStore.staffObj, async () => {
    calendarKey.value = Date.now();
    console.log('人员发生变化，日历刷新', calendarKey.value, userStore.staffObj)
    // formatter = formatter2
    formatter.value = createFormatter();
}, { deep: true });

const handleDayClick = (day: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dayjs(day.date).isAfter(today)) {
        emit('day-click', day.date);
    } else {
        uni.showToast({
            title: '只能修改今日及之后的排班',
            icon: 'none'
        });
    }
};


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
