<template>
    <view class="container">
        <header class="header">
            <view class="header-bottom">
                <view class="date-navigator">
                    <button class="nav-button" @click="navigateDate(-1)">
                        <text class="arrow left"></text>
                    </button>
                    <p class="month-text" @click="goToday">{{ headerDateText }}</p>
                    <button class="nav-button" @click="navigateDate(1)">
                        <text class="arrow right"></text>
                    </button>
                </view>
                <view class="view-switcher">
                    <view :class="['switch-label', { active: viewMode === 'week' }]" @click="switchView('week')">周</view>
                    <view :class="['switch-label', { active: viewMode === 'month' }]" @click="switchView('month')">月</view>
                </view>
            </view>
        </header>

        <main class="main-content">

            <view v-if="viewMode === 'week'" class="calendar-grid">
                <view v-for="(day, index) in weekCalendar" :key="day.date" class="day-cell" @click="selectDay(day)">
                    <p class="day-name" :class="{ 'text-primary': isToday(day.date) }">{{ weekHeaders[index] }}</p>
                    <view class="day-number-wrapper" :class="{ 'selected-day': isSelected(day.date) }">
                        <p class="day-number">{{ day.day }}</p>
                        <!-- <view v-if="day.users.length > 0" class="duty-dot"></view> -->
                    </view>
                </view>
            </view>
            
            <view v-if="viewMode === 'month'" class="calendar-grid month-grid">
                <view v-for="day in monthCalendar" :key="day.date"
                    :class="['day-cell', { 'not-current': !day.isCurrentMonth }]"
                    @click="selectDay(day)">
                    <view class="day-number-wrapper" :class="{ 'selected-day': isSelected(day.date), 'today': isToday(day.date) }">
                        <p class="day-number">{{ day.day }}</p>
                        <!-- <view v-if="day.users.length > 0" class="duty-dot"></view> -->
                    </view>
                </view>
            </view>

            <view v-if="selectedDayDuties" class="duty-info-card">
                <h2 class="duty-info-header">{{ selectedDayText }}</h2>
                <view v-for="group in selectedDayDuties" :key="group.groupId" class="duty-group">
                    <h3 class="group-name">{{ group.groupName }}</h3>
                    <view v-for="user in group.users" :key="user.userId" class="user-info" @click="handleUserClick(user)">
                        <view class="zl-icon-user user-avatar"></view>
                        <view class="user-details">
                            <p class="user-name">{{ user.name }}</p>
                            <p class="user-department">{{ group.groupName }}</p>
                        </view>
                    </view>
                    <hr class="divider" v-if="selectedDayDuties.length > 1"/>
                </view>
            </view>
        </main>

        <button class="fab" @click="navigateToDutyUser">
            <text class="fab-icon">📝</text>
        </button>
    </view>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDutyStore } from '@/store/duty.store';
import { useUserStore } from '@/store/user.store';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';
import { call } from '@/utils/tools';

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.locale('zh-cn');

const dutyStore = useDutyStore();
const userStore = useUserStore();

const viewMode = ref<'week' | 'month'>('week');
const currentDate = ref(dayjs());
const selectedDate = ref(dayjs());
const weekHeaders = ['一', '二', '三', '四', '五', '六', '日'];

// --- 日期计算 ---
const headerDateText = computed(() => currentDate.value.format('YYYY年 M月'));
const selectedDayText = computed(() => selectedDate.value.format('M月D日 dddd'));

const isToday = (dateStr: string) => dayjs(dateStr).isSame(dayjs(), 'day');
const isSelected = (dateStr: string) => dayjs(dateStr).isSame(selectedDate.value, 'day');

// --- 数据获取 ---
const fetchDataForCurrentView = async () => {
    const unit = viewMode.value === 'week' ? 'isoWeek' : 'month';
    const startDate = currentDate.value.startOf(unit).toDate();
    const endDate = currentDate.value.endOf(unit).toDate();
    await dutyStore.fetchDutySchedule(startDate, endDate);
};

// --- 日历生成 ---
const weekCalendar = computed(() => {
    const startOfWeek = currentDate.value.startOf('isoWeek');
    const week: { date: string; day: number; users: any[] }[] = [];
    for (let i = 0; i < 7; i++) {
        const day = startOfWeek.add(i, 'day');
        const dateStr = day.format('YYYY-MM-DD');
        const users = dutyStore.dutySchedule[dateStr] || [];
        week.push({
            date: dateStr,
            day: day.date(),
            users: users,
        });
    }
    return week;
});

const monthCalendar = computed(() => {
    const startOfMonth = currentDate.value.startOf('month');
    const endOfMonth = currentDate.value.endOf('month');
    const startDay = startOfMonth.startOf('isoWeek');
    
    const days = [];
    let currentDay = startDay;

    while (days.length < 42) { // Display 6 weeks to fill grid
        const dateStr = currentDay.format('YYYY-MM-DD');
        const users = dutyStore.dutySchedule[dateStr] || [];
        days.push({
            date: dateStr,
            day: currentDay.date(),
            isCurrentMonth: currentDay.isSame(currentDate.value, 'month'),
            users: users,
        });
        currentDay = currentDay.add(1, 'day');
    }
    return days;
});


// --- 值班信息 ---
const selectedDayDuties = computed(() => {
    const dateStr = selectedDate.value.format('YYYY-MM-DD');
    const duties = dutyStore.dutySchedule[dateStr];
    if (!duties) return null;

    const grouped: Record<string, { groupId: string; groupName: string; users: any[] }> = {};
    duties.forEach(duty => {
        if (!grouped[duty.groupId]) {
            grouped[duty.groupId] = {
                groupId: String(duty.groupId),
                groupName: dutyStore.dutyGroups[duty.groupId]?.name || '未知部门',
                users: [],
            };
        }
        const staffInfo = userStore.getStaff(duty.userId);
        grouped[duty.groupId].users.push({
            userId: duty.userId,
            name: staffInfo?.name || '未知',
            avatar: staffInfo?.avatar,
            phone: staffInfo?.phone,
        });
    });
    return Object.values(grouped);
});

// --- 事件处理 ---
const switchView = (mode: 'week' | 'month') => {
    viewMode.value = mode;
    fetchDataForCurrentView();
};

const navigateDate = (direction: 1 | -1) => {
    const unit = viewMode.value;
    currentDate.value = currentDate.value.add(direction, unit);
    selectedDate.value = currentDate.value.startOf('isoWeek'); // Select first day of new week
    fetchDataForCurrentView();
};

const goToday = () => {
    currentDate.value = dayjs();
    selectedDate.value = dayjs();
    fetchDataForCurrentView();
};

const selectDay = (day: { date: string }) => {
    selectedDate.value = dayjs(day.date);
};

const handleUserClick = (user: { phone?: string }) => {
    if (user.phone) {
        call(user.phone);
    }
};

const navigateToDutyUser = () => {
    uni.navigateTo({ url: '/pages/staff/dutyUser' });
};

// --- 生命周期 ---
onMounted(async () => {
    await Promise.all([userStore.fetchStaff(), dutyStore.fetchDutyGroups()]);
    fetchDataForCurrentView();
});
</script>


<style scoped lang="less">
@import "@/css/icon.less";

// Variables
@primary-color: #137fec;
@background-light: #f6f7f8;
@text-slate-900: #1E293B;
@text-slate-500: #64748B;
@text-slate-600: #475569;
@text-slate-800: #334155;
@white-color: #fff;

.container {
    background-color: @background-light;
    min-height: 100vh;
    font-family: "Inter", sans-serif;
}

.header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: fade(@background-light, 80%);
    backdrop-filter: blur(4px);
    padding: 8px 16px;
}



.header-title {
    font-size: 18px;
    font-weight: bold;
    color: @text-slate-900;
}

.header-left, .header-right {
    width: 48px;
}

.header-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
}

.date-navigator {
    display: flex;
    align-items: center;
    gap: 12px;

    .month-text {
        font-size: 18px;
        font-weight: bold;
        color: @text-slate-900;
    }

    .nav-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        background-color: transparent;
        border: none;
        border-radius: 9999px;
        width: 32px;
        height: 32px;

        &:active {
            background-color: #e5e7eb;
        }
    }

    .arrow {
        border: solid @text-slate-600;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
        &.left {
            transform: rotate(135deg);
        }
        &.right {
            transform: rotate(-45deg);
        }
    }
}

.view-switcher {
    display: flex;
    background-color: #e5e7eb;
    border-radius: 8px;
    padding: 4px;
    .switch-label {
        padding: 4px 12px;
        font-size: 14px;
        color: @text-slate-500;
        border-radius: 6px;
        &.active {
            background-color: @white-color;
            color: @text-slate-900;
            font-weight: 500;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
    }
}

.main-content {
    padding: 0 16px 96px;
}


.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-bottom: 16px;

    &.month-grid {
        .day-cell {
            aspect-ratio: 1/1;
            &.not-current {
                .day-number {
                    color: #ccc;
                }
            }
        }
        .day-number-wrapper {
             &.today {
                border: 1px solid @primary-color;
            }
        }
    }
}

.day-cell {
    text-align: center;
    .day-name {
        font-size: 12px;
        color: @text-slate-500;
        margin-bottom: 8px;
        &.text-primary {
            color: @primary-color;
        }
    }
    .day-number-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 12px;
        &.selected-day {
            background-color: fade(@primary-color, 50%);
            color: @white-color;
            .day-number {
                font-weight: bold;
            }
            .duty-dot {
                background-color: @white-color;
            }
        }
    }
    .day-number {
        font-size: 18px;
        color: @text-slate-800;
    }
    .duty-dot {
        position: absolute;
        bottom: 6px;
        height: 6px;
        width: 6px;
        border-radius: 9999px;
        background-color: @primary-color;
    }
}

.duty-info-card {
    background-color: @white-color;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    .duty-info-header {
        font-size: 16px;
        font-weight: 600;
        color: @text-slate-900;
        margin-bottom: 16px;
    }
    .duty-group {
        margin-bottom: 12px;
    }
    .group-name {
        font-size: 14px;
        font-weight: 500;
        color: @text-slate-500;
        margin-bottom: 12px;
    }
    .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        background-color: #e5e7eb;
        color: @text-slate-600;
    }
    .user-details {
        .user-name {
            font-size: 16px;
            font-weight: 500;
            color: @text-slate-900;
        }
        .user-department {
            font-size: 14px;
            color: @text-slate-500;
        }
    }
    .divider {
        border: none;
        border-top: 1px solid #f1f5f9;
        margin: 12px 0;
    }
}

.fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    background-color: @primary-color;
    color: @white-color;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1);
    border: none;
    .fab-icon {
        font-size: 24px;
    }
}

.month-view-placeholder {
    text-align: center;
    padding: 40px;
    color: @text-slate-500;
}
</style>