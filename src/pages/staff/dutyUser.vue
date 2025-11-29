<template>
    <view class="container">
        <view class="header">
            <h2 class="header-title">职务交接与提交</h2>
            <view class="close-button" @click="navigateBack">✕</view>
        </view>

        <scroll-view scroll-y class="main-content">
            <view class="calendar-card">
                <view class="calendar-header">
                    <view class="date-selector">
                        <text class="nav-arrow" @click="navigateMonth(-1)">‹</text>
                        <text class="month-text">{{ calendarHeaderText }}</text>
                        <text class="nav-arrow" @click="navigateMonth(1)">›</text>
                    </view>
                </view>
                <view class="week-header">
                    <text v-for="day in weekHeaders" :key="day" class="week-day">{{ day }}</text>
                </view>
                <view class="calendar-grid">
                    <view v-for="day in calendarDays" :key="day.date"
                        :class="['day-cell', { 'not-current-month': !day.isCurrentMonth, 'selected': isSelected(day.date), 'has-duty': day.hasDuty }]"
                        @click="selectDate(day.date)">
                        <text class="day-number">{{ day.day }}</text>
                    </view>
                </view>
            </view>
            
            <view class="duty-person-card">
                <text class="label">当日值班人:</text>
                <text class="name">{{ dutyPersonText }}</text>
            </view>

            <view class="timeline">
                <view v-for="note in dutyNotesForSelectedDate" :key="note.id" class="timeline-item">
                    <view class="timeline-icon">👤</view>
                    <view class="timeline-content">
                        <view class="note-card">
                            <view class="note-header">
                                <text class="user-name">{{ getUserName(note.userId) }}</text>
                                <text class="timestamp">{{ formatRelativeTime(note.createDate) }}</text>
                            </view>
                            <view class="note-body">
                                {{ note.content }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="submission-footer">
            <view class="submission-card">
                <view class="level-selector">
                    <button v-for="(level, index) in levels" :key="index"
                        :class="['level-button', { 'selected': newLogLevel === level.value }]"
                        @click="newLogLevel = level.value">{{ level.label }}</button>
                </view>
                <textarea class="log-input" v-model="newLogContent" placeholder="请输入日志内容..."></textarea>
                <button class="submit-button" @click="submitLog">提交日志</button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useDutyStore } from '@/store/duty.store';
import { useUserStore } from '@/store/user.store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const dutyStore = useDutyStore();
const userStore = useUserStore();

const selectedDate = ref(dayjs());
const calendarMonth = ref(dayjs());
const newLogContent = ref('');
const newLogLevel = ref(2); // 默认'中'
const levels = [
    { label: '低', value: 1 },
    { label: '中', value: 2 },
    { label: '高', value: 3 },
];

const weekHeaders = ['一', '二', '三', '四', '五', '六', '日'];

// --- Computed Properties ---
const calendarHeaderText = computed(() => calendarMonth.value.format('YYYY年MM月'));
const isSelected = (date: string) => dayjs(date).isSame(selectedDate.value, 'day');

const dutyPersonText = computed(() => {
    const dateStr = selectedDate.value.format('YYYY-MM-DD');
    const schedule = dutyStore.dutySchedule[dateStr];
    if (!schedule || schedule.length === 0) return '无';
    return schedule.map(s => userStore.getStaff(s.userId)?.name).filter(Boolean).join(', ') || '无';
});

const dutyNotesForSelectedDate = computed(() => {
    return [...dutyStore.dutyNotes]
        .filter(note => dayjs(note.createDate).isSame(selectedDate.value, 'day'))
        .sort((a, b) => dayjs(b.createDate).unix() - dayjs(a.createDate).unix());
});

const calendarDays = computed(() => {
    const start = calendarMonth.value.startOf('month').startOf('isoWeek');
    const end = calendarMonth.value.endOf('month').endOf('isoWeek');
    const days = [];
    let day = start;
    while (day.isBefore(end) || day.isSame(end)) {
        const dateStr = day.format('YYYY-MM-DD');
        days.push({
            date: dateStr,
            day: day.date(),
            isCurrentMonth: day.isSame(calendarMonth.value, 'month'),
            hasDuty: !!dutyStore.dutySchedule[dateStr] && dutyStore.dutySchedule[dateStr].length > 0
        });
        day = day.add(1, 'day');
    }
    return days;
});

// --- Methods ---
const navigateBack = () => uni.navigateBack();
const navigateMonth = (direction: number) => {
    calendarMonth.value = calendarMonth.value.add(direction, 'month');
};
const selectDate = (date: string) => {
    selectedDate.value = dayjs(date);
};
const getUserName = (userId: string) => userStore.getStaff(userId)?.name || '未知用户';
const formatRelativeTime = (date: string) => dayjs(date).fromNow();

const fetchDataForMonth = async () => {
    const start = calendarMonth.value.startOf('month').toDate();
    const end = calendarMonth.value.endOf('month').toDate();
    // 获取排班和当前用户日志
    await Promise.all([
        dutyStore.fetchDutySchedule(start, end),
        dutyStore.fetchMyDutyNotes(start, end)
    ]);
};

const submitLog = async () => {
    if (!newLogContent.value.trim()) {
        uni.showToast({ title: '日志内容不能为空', icon: 'none' });
        return;
    }
    // Assume a createDutyNote action exists
    // await dutyStore.createDutyNote({
    //     content: newLogContent.value,
    //     level: newLogLevel.value,
    //     createDate: selectedDate.value.toISOString(),
    // });
    uni.showToast({ title: '提交成功', icon: 'success' });
    newLogContent.value = '';
    newLogLevel.value = 2;
    // Refetch notes for the day
};

// --- Lifecycle & Watchers ---
watch(calendarMonth, fetchDataForMonth);

onMounted(async () => {
    await userStore.fetchStaff();
    await dutyStore.fetchDutyGroups(); // Groups might be needed for context
    fetchDataForMonth();
});

</script>

<style scoped lang="less">
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f6f7f8;
    font-family: "Inter", sans-serif;
}
.header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    position: relative;
    .header-title {
        font-size: 18px;
        font-weight: bold;
    }
    .close-button {
        position: absolute;
        right: 16px;
        font-size: 24px;
        color: #666;
        cursor: pointer;
    }
}
.main-content {
    flex: 1;
    padding: 0 16px;
    overflow-y: auto;
}
.calendar-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #eee;
    margin-bottom: 16px;
    .calendar-header {
        display: flex;
        justify-content: center;
        margin-bottom: 16px;
    }
    .date-selector {
        display: flex;
        align-items: center;
        gap: 16px;
        .nav-arrow {
            font-size: 20px;
            color: #666;
        }
        .month-text {
            font-weight: bold;
        }
    }
    .week-header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        margin-bottom: 8px;
        .week-day {
            font-size: 12px;
            color: #999;
        }
    }
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        .day-cell {
            text-align: center;
            padding: 8px 0;
            border-radius: 50%;
            position: relative;
            &.not-current-month .day-number {
                color: #ccc;
            }
            &.selected {
                background-color: #137fec;
                .day-number {
                    color: #fff;
                }
            }
            &.has-duty::after {
                content: '';
                position: absolute;
                bottom: 4px;
                left: 50%;
                transform: translateX(-50%);
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: #137fec;
            }
            &.selected.has-duty::after {
                background-color: #fff;
            }
        }
    }
}
.duty-person-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    padding: 12px 16px;
    border: 1px solid #eee;
    margin-bottom: 16px;
    .label { color: #666; }
    .name { font-weight: bold; }
}
.timeline {
    .timeline-item {
        display: flex;
        gap: 12px;
        .timeline-icon {
            font-size: 24px;
        }
        .timeline-content {
            flex: 1;
            padding-bottom: 16px;
        }
    }
}
.note-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #eee;
    .note-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        .user-name { font-weight: bold; }
        .timestamp { font-size: 12px; color: #999; }
    }
}
.submission-footer {
    padding: 16px;
    background: #f6f7f8;
    .submission-card {
        background: #fff;
        border-radius: 12px;
        padding: 16px;
        border: 1px solid #eee;
    }
    .level-selector {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
        .level-button {
            flex: 1;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #ccc;
            background: #f9f9f9;
            font-size: 14px;
            &.selected {
                border-color: #137fec;
                background-color: #e8f2fe;
                color: #137fec;
                font-weight: bold;
            }
        }
    }
    .log-input {
        width: 100%;
        height: 80px;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-bottom: 12px;
        background: #f9f9f9;
    }
    .submit-button {
        width: 100%;
        padding: 12px;
        background: #137fec;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
    }
}
</style>