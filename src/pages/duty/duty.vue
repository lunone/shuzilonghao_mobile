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
                        <view v-if="day.hasCurrentUser" class="duty-dot"></view>
                        <view v-if="day.hasNotes" class="notes-dot"></view>
                    </view>
                </view>
            </view>
            
            <view v-if="viewMode === 'month'" class="calendar-grid month-grid">
                <view v-for="day in monthCalendar" :key="day.date"
                    :class="['day-cell', { 'not-current': !day.isCurrentMonth }]"
                    @click="selectDay(day)">
                    <view class="day-number-wrapper" :class="{ 'selected-day': isSelected(day.date), 'today': isToday(day.date) }">
                        <p class="day-number">{{ day.day }}</p>
                        <view v-if="day.hasCurrentUser" class="duty-dot"></view>
                        <view v-if="day.hasNotes" class="notes-dot"></view>
                    </view>
                </view>
            </view>

            <!-- 统一的日期标题 -->
            <view class="selected-date-header">
                <h2 class="date-title">{{ selectedDayText }}</h2>
            </view>

            <view class="duty-info-card">
                <view v-if="isLoading" class="loading-placeholder">
                    <view class="loading-spinner"></view>
                    <p class="loading-text">加载中...</p>
                </view>
                <DutyStaffList
                    v-else
                    :dutyData="selectedDayDuties"
                    layoutMode="vertical"
                    :showEmptyGroups="true"
                />
            </view>

            <!-- 交接日志区域 - 只在有权限时显示 -->
            <view v-if="hasDutyGroupPermission" class="notes-card">
                <view v-if="isLoading" class="loading-placeholder">
                    <view class="loading-spinner"></view>
                    <p class="loading-text">加载中...</p>
                </view>
                <view v-else-if="notesForSelectedDate && notesForSelectedDate.length > 0" class="notes-content">
                    <view v-for="note in notesForSelectedDate" :key="note.id" :class="['note-item', `note-level-${note.level}`]" @longpress="handleLongPress(note.id)">
                        <view class="note-header">
                            <text class="note-user">{{ getUserName(note.userId) }}</text>
                            <text class="note-time">{{ formatTime(note.createDate) }}</text>
                        </view>
                        <p class="note-content">{{ note.content }}</p>
                        <!-- 长按删除按钮 -->
                        <view v-if="showDeleteButton === note.id" class="delete-overlay">
                            <button class="delete-btn" @click="deleteNote(note.id)">
                                <text class="delete-text">删除</text>
                            </button>
                        </view>
                    </view>
                </view>
                <view v-else class="empty-placeholder">
                    <view class="empty-icon zl-icon-duty"></view>
                    <p class="empty-text">该日无交接日志</p>
                </view>
            </view>
        </main>

        <!-- 新建交接日志按钮 - 只在有权限时显示 -->
        <button v-if="hasDutyGroupPermission" class="fab" @click="showCreateNoteDialog">
            <text class="fab-icon">✏️</text>
        </button>

        <!-- 新建交接日志 - 弹窗 -->
        <view v-if="showDialog" class="modal-overlay" @click="hideCreateNoteDialog">
            <view class="modal-content" @click.stop>
                <view class="modal-header">
                    <text class="modal-title">新建交接日志</text>
                </view>
                <view class="modal-body">
                    <textarea
                        v-model="newNote.content"
                        class="content-input"
                        placeholder="请输入交接日志内容..."
                        maxlength="500"
                        :auto-height="true"
                    ></textarea>
                </view>
                <view class="modal-footer">
                    <view class="level-selector">
                        <view
                            v-for="(level, index) in levels"
                            :key="index"
                            :class="['level-dot', { active: newNote.level === level.value }, `level-${level.value}`]"
                            @click="newNote.level = level.value"
                        >
                            <text>{{ level.label }}</text>
                        </view>
                    </view>
                    <button class="btn-confirm" @click="createNote">提交</button>
                </view>
            </view>
        </view>
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
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import DutyStaffList from '@/components/DutyStaffList.vue';

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('zh-cn');

const dutyStore = useDutyStore();
const userStore = useUserStore();

const viewMode = ref<'week' | 'month'>('week');
const currentDate = ref(dayjs());
const selectedDate = ref(dayjs());
const weekHeaders = ['一', '二', '三', '四', '五', '六', '日'];
const userGroupId = ref<number | null>(null);
const currentUserId = ref<string | null>(null);
const isLoading = ref(false);

// 新建日志对话框相关
const showDialog = ref(false);
const newNote = ref({
    level: 1,
    content: ''
});
const levels = [
    { label: '低', value: 1 },
    { label: '中', value: 2 },
    { label: '高', value: 3 }
];

// 滑动删除相关
const isSwipeDeleteMode = ref(false);
const touchStartX = ref(0);
const touchStartY = ref(0);
const currentSwipeNoteId = ref<number | null>(null);
const showDeleteButton = ref<number | null>(null);

// 权限检查
const hasDutyGroupPermission = computed(() => {
    return dutyStore.userDutyGroups.length > 0;
});

// 获取当前登录用户ID
const getCurrentUserId = () => {
    const userId = userStore.me?.id || null;
    return userId;
};

// --- 日期计算 ---
const headerDateText = computed(() => currentDate.value.format('YYYY年 M月'));
const selectedDayText = computed(() => selectedDate.value.format('M月D日 dddd'));

const isToday = (dateStr: string) => dayjs(dateStr).isSame(dayjs(), 'day');
const isSelected = (dateStr: string) => dayjs(dateStr).isSame(selectedDate.value, 'day');

// --- 数据获取 ---
const fetchDataForCurrentView = async () => {
    isLoading.value = true;
    try {
        const unit = viewMode.value === 'week' ? 'isoWeek' : 'month';
        const startDate = currentDate.value.startOf(unit).toDate();
        const endDate = currentDate.value.endOf(unit).toDate();
        await dutyStore.fetchDutySchedule(startDate, endDate);
        if (userGroupId.value) {
            await dutyStore.fetchDutyNotes(userGroupId.value, startDate, endDate);
        }
    } finally {
        isLoading.value = false;
    }
};

const isCurrentUserOnDuty = (users: any[]) => {
    if (!currentUserId.value || !users.length) return false;
    return users.some(user => user.userId === currentUserId.value);
};

// 检查某天是否有交接日志
const hasDutyNotes = (dateStr: string) => {
    return dutyStore.dutyNotes.some(note => {
        const noteDay = dayjs(note.date).utc().format('YYYY-MM-DD');
        return noteDay === dateStr;
    });
};

const weekCalendar = computed(() => {
    const startOfWeek = currentDate.value.startOf('isoWeek');
    const week: { date: string; day: number; users: any[]; hasCurrentUser: boolean; hasNotes: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
        const day = startOfWeek.add(i, 'day');
        const dateStr = day.format('YYYY-MM-DD');
        const users = dutyStore.dutySchedule[dateStr] || [];
        const hasCurrentUser = isCurrentUserOnDuty(users);
        const hasNotes = hasDutyNotes(dateStr);
        
        week.push({
            date: dateStr,
            day: day.date(),
            users: users,
            hasCurrentUser: hasCurrentUser,
            hasNotes: hasNotes,
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

    while (days.length < 42) {
        const dateStr = currentDay.format('YYYY-MM-DD');
        const users = dutyStore.dutySchedule[dateStr] || [];
        const hasCurrentUser = isCurrentUserOnDuty(users);
        const hasNotes = hasDutyNotes(dateStr);
        
        days.push({
            date: dateStr,
            day: currentDay.date(),
            isCurrentMonth: currentDay.isSame(currentDate.value, 'month'),
            users: users,
            hasCurrentUser: hasCurrentUser,
            hasNotes: hasNotes,
        });
        currentDay = currentDay.add(1, 'day');
    }
    return days;
});

// --- 值班信息 ---
const selectedDayDuties = computed(() => {
    const dateStr = selectedDate.value.format('YYYY-MM-DD');
    return dutyStore.dutySchedule[dateStr] || [];
});

const notesForSelectedDate = computed(() => {
    const selectedDay = selectedDate.value.format('YYYY-MM-DD');
    return dutyStore.dutyNotes.filter(note => {
        // 使用UTC插件正确处理UTC时间
        const noteDay = dayjs(note.date).utc().format('YYYY-MM-DD');
        return noteDay === selectedDay;
    });
});

const formatTime = (isoDate: string) => {
    return dayjs(isoDate).format('MM-DD HH:mm');
};

// --- 工具函数 ---
const getLevelText = (level: number) => {
    const levelMap: Record<number, string> = {
        1: '低',
        2: '中',
        3: '高'
    };
    return levelMap[level] || '未知';
};

const getUserName = (userId: string) => {
    const staffInfo = userStore.getStaff(userId);
    return staffInfo?.name || '未知用户';
};

// --- 事件处理 ---
const switchView = (mode: 'week' | 'month') => {
    viewMode.value = mode;
    
    // 确保当前视图包含选中的日期
    if (mode === 'week') {
        // 如果当前视图不是周视图，确保周视图的 currentDate 包含选中的日期
        if (!currentDate.value.isSame(selectedDate.value, 'week')) {
            currentDate.value = selectedDate.value.startOf('isoWeek');
        }
    } else if (mode === 'month') {
        // 如果当前视图不是月视图，确保月视图的 currentDate 包含选中的日期
        if (!currentDate.value.isSame(selectedDate.value, 'month')) {
            currentDate.value = selectedDate.value.startOf('month');
        }
    }
    
    fetchDataForCurrentView();
};

const navigateDate = (direction: 1 | -1) => {
    const unit = viewMode.value;
    const newDate = currentDate.value.add(direction, unit);
    
    currentDate.value = newDate;
    
    // 如果当前视图是周，保持选中的日期在该周的相对位置
    if (viewMode.value === 'week') {
        // 周视图模式下，如果选中的日期不在新周内，重置为新周的第一天
        if (!selectedDate.value.isSame(currentDate.value, 'week')) {
            selectedDate.value = currentDate.value.startOf('isoWeek');
        }
    } else if (viewMode.value === 'month') {
        // 月视图模式下，如果选中的日期不在当前显示的月份内，重置为当前月份第一天
        if (!selectedDate.value.isSame(currentDate.value, 'month')) {
            selectedDate.value = currentDate.value.startOf('month');
        }
    }
    
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

// 对话框相关方法
const showCreateNoteDialog = () => {
    showDialog.value = true;
    // 重置表单
    newNote.value = {
        level: 1,
        content: ''
    };
};

const hideCreateNoteDialog = () => {
    showDialog.value = false;
};

const createNote = async () => {
    if (!newNote.value.content.trim()) {
        uni.showToast({
            title: '请输入日志内容',
            icon: 'none'
        });
        return;
    }

    try {
        const noteData = {
            date: selectedDate.value.format('YYYY-MM-DD'),
            content: newNote.value.content.trim(),
            level: newNote.value.level,
            groupId: dutyStore.userDutyGroups[0].id // 使用用户第一个值班组
        };

        await dutyStore.addDutyNote(noteData);
        
        // 刷新数据
        await fetchDataForCurrentView();
        
        // 关闭对话框
        hideCreateNoteDialog();
        
        uni.showToast({
            title: '交接日志创建成功',
            icon: 'success'
        });
    } catch (error) {
        console.error('创建交接日志失败:', error);
        uni.showToast({
            title: '创建失败，请重试',
            icon: 'error'
        });
    }
};

// 滑动删除相关函数
const handleTouchStart = (event: any, noteId: number) => {
    const touch = event.touches[0];
    touchStartX.value = touch.clientX;
    touchStartY.value = touch.clientY;
    currentSwipeNoteId.value = noteId;
};

const handleTouchMove = (event: any) => {
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX.value;
    const deltaY = touch.clientY - touchStartY.value;
    
    // 如果水平滑动距离超过垂直滑动距离，则启用删除模式
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && currentSwipeNoteId.value) {
        isSwipeDeleteMode.value = true;
    }
};

const handleLongPress = (noteId: number) => {
    // 显示删除按钮
    showDeleteButton.value = noteId;
    
    // 3秒后自动隐藏删除按钮
    setTimeout(() => {
        if (showDeleteButton.value === noteId) {
            showDeleteButton.value = null;
        }
    }, 3000);
};

const deleteNote = async (noteId: number) => {
    try {
        await dutyStore.removeDutyNote(noteId);
        
        // 刷新数据
        await fetchDataForCurrentView();
        
        // 重置删除按钮状态
        showDeleteButton.value = null;
        
        uni.showToast({
            title: '删除成功',
            icon: 'success'
        });
    } catch (error) {
        console.error('删除交接日志失败:', error);
        uni.showToast({
            title: '删除失败，请重试',
            icon: 'error'
        });
    }
};

onMounted(async () => {
    await Promise.all([
        userStore.fetchStaff(),
        userStore.fetchMe(), // 确保获取用户信息
        dutyStore.fetchDutyGroups(),
        dutyStore.fetchUserDutyGroups() // 获取用户有权限的值班组
    ]);

    // 设置当前用户ID
    currentUserId.value = getCurrentUserId();

    if (dutyStore.userDutyGroups.length > 0) {
        userGroupId.value = dutyStore.userDutyGroups[0].id;
    }

    fetchDataForCurrentView();
});
</script>


<style scoped lang="less">
@import "@/css/icon.less";

@primary-color: #137fec;
@background-light: #f6f7f8;
@text-slate-900: #1E293B;
@text-slate-700: #374151;
@text-slate-500: #64748B;
@text-slate-600: #475569;
@text-slate-800: #334155;
@text-slate-400: #94a3b8;
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

.selected-date-header {
    text-align: left;
    padding: 16px 0 8px;
    margin-bottom: 16px;
    
    .date-title {
        font-size: 16px;
        font-weight: 500;
        color: @text-slate-500;
        margin: 0;
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
    .notes-dot {
        position: absolute;
        bottom: 6px;
        left: 14px;
        height: 6px;
        width: 6px;
        border-radius: 9999px;
        background-color: #ff9500; // 橙色，区别于值班小点的蓝色
    }
}

.duty-info-card, .notes-card {
    background-color: @white-color;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 16px;

    .note-item {
        background-color: @white-color;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        border: 1px solid transparent;
        
        &.note-level-1 {
            background-color: #f0f9ff; // 浅蓝色 - 低重要程度
            border-left: 4px solid @primary-color;
        }
        
        &.note-level-2 {
            background-color: #fef3c7; // 浅黄色 - 中等重要程度
            border-left: 4px solid #f59e0b;
        }
        
        &.note-level-3 {
            background-color: #fee2e2; // 浅红色 - 高重要程度
            border-left: 4px solid #ef4444;
        }
        
        .note-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            .note-user {
                font-size: 14px;
                font-weight: 500;
                color: @text-slate-900;
            }
            
            .note-time {
                font-size: 12px;
                color: @text-slate-500;
            }
        }
        
        .note-content {
            font-size: 15px;
            color: @text-slate-800;
            line-height: 1.4;
        }
        
        .delete-overlay {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 80px;
            background-color: rgba(239, 68, 68, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0 8px 8px 0;
            
            .delete-btn {
                background: none;
                border: none;
                color: @white-color;
                font-size: 14px;
                font-weight: 500;
                padding: 8px;
                
                .delete-text {
                    font-size: 14px;
                }
                
                &:active {
                    opacity: 0.8;
                }
            }
        }
    }
    .empty-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px 16px;
        text-align: center;
        
        .empty-icon {
            font-size: 32px;
            margin-bottom: 12px;
            opacity: 0.5;
        }
        
        .empty-text {
            font-size: 14px;
            color: @text-slate-500;
            margin: 0;
        }
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

// 模态弹窗样式
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: @white-color;
    border-radius: 16px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    width: 85%;
    max-width: 400px;
    
    .modal-header {
        padding: 16px;
        text-align: center;
        border-bottom: 1px solid #f1f3f5;

        .modal-title {
            font-size: 17px;
            font-weight: 600;
            color: @text-slate-800;
        }
    }
    
    .modal-body {
        padding: 16px;
        
        .content-input {
            width: 100%;
            min-height: 100px;
            padding: 12px;
            border: none;
            font-size: 15px;
            color: @text-slate-900;
            background-color: #f1f3f5;
            border-radius: 8px;
            resize: none;
            box-sizing: border-box;
            
            &:focus {
                outline: none;
            }
        }
    }
    
    .modal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-top: 1px solid #f1f3f5;
        
        .level-selector {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-grow: 1;
            .level-dot {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 14px;
                padding: 6px 10px;
                border-radius: 20px;
                border: 1.5px solid transparent;
                transition: all 0.2s ease;
                
                &::before {
                    content: '';
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                
                &.level-1::before { background-color: #74c0fc; }
                &.level-2::before { background-color: #ffd43b; }
                &.level-3::before { background-color: #ffa8a8; }
                
                &.active {
                    font-weight: 600;
                    &.level-1 { background-color: #e7f5ff; color: #1c7ed6; }
                    &.level-2 { background-color: #fff9db; color: #f59f00; }
                    &.level-3 { background-color: #fff5f5; color: #e03131; }
                }
            }
        }
        
        .btn-confirm {
            padding: 8px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            border: none;
            background-color: @primary-color;
            color: @white-color;
            line-height: 1.5;
        }
    }
}
</style>
