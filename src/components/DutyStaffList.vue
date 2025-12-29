<template>
    <view :class="['duty-staff-list', `layout-${layoutMode}`]">
        <view v-if="isLoading" class="loading-placeholder">
            <view class="loading-spinner"></view>
            <p class="loading-text">加载中...</p>
        </view>
        <view v-else-if="layoutMode === 'horizontal'" class="horizontal-list">
            <view v-for="item in horizontalItems" :key="item.userId" class="user-item" @click="handleUserClick(item)">
                <div class="avatar-container">
                    <i class="avatar-icon zl-icon-user"></i>
                    <div class="name-overlay">{{ item.name }}</div>
                </div>
                <div class="dep-name">{{ item.groupAbbr }}</div>
            </view>
        </view>
        <view v-else class="vertical-list">
            <!-- 时间段条 -->
            <view class="time-bar-container" v-for="group in processedDutyPairs" :key="group.groupId">
                <view class="time-bar">
                    <view class="time-segment current-segment" :style="{ width: group.currentRatio + '%' }"
                        @click="handleUserClick(group.currentUser)">
                        <view class="staff-item">
                            <view class="zl-icon-user user-avatar"></view>
                            <view class="user-details">
                                <p class="user-name">{{ group.currentUser?.name || '未排班' }}</p>
                                <p class="user-department">{{ group.currentTimeRange }}</p>
                            </view>
                        </view>
                    </view>
                    <view class="time-segment next-segment" :style="{ width: group.nextRatio + '%' }"
                        @click="handleUserClick(group.nextUser)">
                        <view class="staff-item">
                            <view class="zl-icon-user user-avatar"></view>
                            <view class="user-details">
                                <p class="user-name">{{ group.nextUser?.name || '未排班' }}</p>
                                <p class="user-department">{{ group.nextTimeRange }}</p>
                            </view>
                        </view>
                        <!--  -->
                    </view>
                </view>
                <text class="time-text">{{ group.groupName }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/store/user.store';
import { useDutyStore } from '@/store/duty.store';
import { call } from '@/utils/tools';
import type { DutySchedule } from '@/types/duty';
import dayjs from 'dayjs';

interface Props {
    dutyData?: DutySchedule[];
    layoutMode?: 'horizontal' | 'vertical';
    showEmptyGroups?: boolean;
    displayDate?: Date;
    selectedDate?: string; // 新增：当前选中的日期字符串 YYYY-MM-DD
}

const props = withDefaults(defineProps<Props>(), {
    layoutMode: 'horizontal',
    showEmptyGroups: true,
    dutyData: () => [],
});

const userStore = useUserStore();
const dutyStore = useDutyStore();

// 根据交接时间计算应该显示的日期
const getEffectiveDate = (referenceDate: dayjs.Dayjs) => {
    // 获取第一个值班组的交接时间作为参考
    const groups = Object.values(dutyStore.dutyGroups);
    if (groups.length === 0) return referenceDate;

    const firstGroup = groups[0];
    if (!firstGroup.handoverTime) return referenceDate;

    const [hours, minutes] = firstGroup.handoverTime.split(':').map(Number);
    const handoverTime = referenceDate.hour(hours).minute(minutes);
    const now = dayjs();

    // 如果当前时间早于交接时间，显示昨天的排班
    return now.isBefore(handoverTime)
        ? referenceDate.subtract(1, 'day')
        : referenceDate;
};

const isLoading = ref(false);

// 计算实际显示的排班数据
const effectiveDutyData = computed(() => {
    // 如果传入了 dutyData，直接使用
    if (props.dutyData && props.dutyData.length > 0) {
        return props.dutyData;
    }

    // 否则根据 displayDate 或今天计算
    const displayDate = props.displayDate ? dayjs(props.displayDate) : dayjs();
    const effectiveDate = props.displayDate ? displayDate : getEffectiveDate(displayDate);
    const dateStr = effectiveDate.format('YYYY-MM-DD');
    return dutyStore.dutySchedule[dateStr] || [];
});

// 初始化数据
onMounted(async () => {
    // 如果传入了 dutyData，不需要获取数据
    if (props.dutyData && props.dutyData.length > 0) {
        return;
    }

    isLoading.value = true;
    try {
        await Promise.all([
            userStore.fetchStaff(),
            dutyStore.fetchDutyGroups(),
        ]);

        // 获取今天前后各3天的数据，避免时区边界问题
        const today = dayjs();
        const startDate = today.subtract(3, 'day').toDate();
        const endDate = today.add(3, 'day').toDate();
        await dutyStore.fetchDutySchedule(startDate, endDate);
    } finally {
        isLoading.value = false;
    }
});

// 横向布局的扁平化数据
const horizontalItems = computed(() => {
    const items: any[] = [];

    // 初始化所有值班组
    const grouped: Record<string, { groupId: string; groupName: string; groupAbbr: string; users: any[] }> = {};
    Object.values(dutyStore.dutyGroups).forEach((group: any) => {
        grouped[group.id] = {
            groupId: String(group.id),
            groupName: group.name || '未知部门',
            groupAbbr: group.abbr || '未知',
            users: [],
        };
    });

    // 填充值班人员
    effectiveDutyData.value.forEach(duty => {
        if (grouped[duty.groupId]) {
            const staffInfo = userStore.getStaff(duty.userId);
            grouped[duty.groupId].users.push({
                userId: duty.userId,
                name: staffInfo?.name || '未知',
                avatar: staffInfo?.avatar,
                phone: staffInfo?.phone,
            });
        }
    });

    // 根据 showEmptyGroups 过滤
    const filteredGroups = Object.values(grouped).filter(group => {
        if (props.showEmptyGroups) {
            return true;
        }
        return group.users.length > 0;
    });

    // 扁平化为用户列表
    filteredGroups.forEach(group => {
        if (group.users.length > 0) {
            group.users.forEach(user => {
                items.push({
                    userId: user.userId,
                    name: user.name,
                    groupAbbr: group.groupAbbr,
                    phone: user.phone,
                });
            });
        } else {
            items.push({
                userId: `no-duty-${group.groupId}`,
                name: '未排班',
                groupAbbr: group.groupAbbr,
                phone: null,
            });
        }
    });

    return items;
});

// 处理后的值班组数据（纵向布局）
const processedGroups = computed(() => {
    const grouped: Record<string, { groupId: string; groupName: string; users: any[] }> = {};

    // 初始化所有值班组
    Object.values(dutyStore.dutyGroups).forEach((group: any) => {
        grouped[group.id] = {
            groupId: String(group.id),
            groupName: group.name || '未知部门',
            users: [],
        };
    });

    // 填充值班人员
    effectiveDutyData.value.forEach(duty => {
        if (grouped[duty.groupId]) {
            const staffInfo = userStore.getStaff(duty.userId);
            grouped[duty.groupId].users.push({
                userId: duty.userId,
                name: staffInfo?.name || '未知',
                avatar: staffInfo?.avatar,
                phone: staffInfo?.phone,
            });
        }
    });

    // 根据 showEmptyGroups 过滤
    const result = Object.values(grouped).filter(group => {
        if (props.showEmptyGroups) {
            return true;
        }
        return group.users.length > 0;
    });

    return result;
});

// 处理后的值班对数据（新的布局）
const processedDutyPairs = computed(() => {
    const result: any[] = [];

    // 初始化所有值班组
    const grouped: Record<string, {
        groupId: string;
        groupName: string;
        handoverTime?: string;
        currentUser?: any;
        nextUser?: any;
        currentTimeRange: string;
        nextTimeRange: string;
        currentRatio: number;
        nextRatio: number;
    }> = {};

    Object.values(dutyStore.dutyGroups).forEach((group: any) => {
        grouped[group.id] = {
            groupId: String(group.id),
            groupName: group.name || '未知部门',
            handoverTime: group.handoverTime,
            currentUser: undefined,
            nextUser: undefined,
            currentTimeRange: '',
            nextTimeRange: '',
            currentRatio: 0,
            nextRatio: 0,
        };
    });

    // 根据传入的 selectedDate 或当前日期计算
    const selectedDate = props.selectedDate ? dayjs(props.selectedDate) : dayjs();
    const selectedDateStr = selectedDate.format('YYYY-MM-DD');
    const previousDateStr = selectedDate.subtract(1, 'day').format('YYYY-MM-DD');

    // 使用传入的 dutyData 作为选中日期的duties，前一天从store获取
    const selectedDateDuties = props.dutyData && props.dutyData.length > 0 ? props.dutyData : dutyStore.dutySchedule[selectedDateStr] || [];
    const previousDateDuties = dutyStore.dutySchedule[previousDateStr] || [];

    // 为每个组分配用户
    Object.values(grouped).forEach(group => {
        const groupId = parseInt(group.groupId);

        // 前一班次用户（前一天的值班人员）
        const previousUser = previousDateDuties.find((d: any) => d.groupId === groupId);
        if (previousUser) {
            group.currentUser = {
                userId: previousUser.userId,
                name: userStore.getStaff(previousUser.userId)?.name || '未知',
                avatar: userStore.getStaff(previousUser.userId)?.avatar,
                phone: userStore.getStaff(previousUser.userId)?.phone,
            };
        }

        // 当前班次用户（选中日期的值班人员）
        const selectedUser = selectedDateDuties.find((d: any) => d.groupId === groupId);
        if (selectedUser) {
            group.nextUser = {
                userId: selectedUser.userId,
                name: userStore.getStaff(selectedUser.userId)?.name || '未知',
                avatar: userStore.getStaff(selectedUser.userId)?.avatar,
                phone: userStore.getStaff(selectedUser.userId)?.phone,
            };
        }

        // 计算时间段和比例（基于24小时）
        const handoverTime = group.handoverTime;
        if (handoverTime) {
            // 有交接时间的情况
            const [hours, minutes] = handoverTime.split(':').map(Number);
            const handoverHour = hours;
            const handoverMinute = minutes;
            const handoverTotalMinutes = handoverHour * 60 + handoverMinute;

            // 当前班次：00:00 到 handoverTime
            const currentHours = handoverTotalMinutes / 60;
            group.currentTimeRange = `00:00-${String(handoverHour).padStart(2, '0')}:${String(handoverMinute).padStart(2, '0')}`;

            // 下一班次：handoverTime 到 24:00
            const nextHours = 24 - currentHours;
            group.nextTimeRange = `${String(handoverHour).padStart(2, '0')}:${String(handoverMinute).padStart(2, '0')}-24:00`;

            // 根据交接时间使用近似比例，避免极端的宽度占比
            // 1:1 是中午12点左右（11:00-13:00之间）
            // 早于11点的是 1:2（currentRatio: 33.33%, nextRatio: 66.67%）
            // 晚于13点的是 2:1（currentRatio: 66.67%, nextRatio: 33.33%）
            if (handoverHour >= 11 && handoverHour < 13) {
                // 1:1 比例
                group.currentRatio = 50;
                group.nextRatio = 50;
            } else if (handoverHour < 11) {
                // 1:2 比例
                group.currentRatio = 33.33;
                group.nextRatio = 66.67;
            } else {
                // 2:1 比例（handoverHour >= 13）
                group.currentRatio = 66.67;
                group.nextRatio = 33.33;
            }
        } else {
            // 无交接时间，默认12小时一班
            group.currentTimeRange = '00:00-12:00';
            group.nextTimeRange = '12:00-24:00';
            group.currentRatio = 50;
            group.nextRatio = 50;
        }
    });

    // 根据 showEmptyGroups 过滤
    const filteredGroups = Object.values(grouped).filter(group => {
        if (props.showEmptyGroups) {
            return true;
        }
        return group.currentUser;
    });

    return filteredGroups;
});

// 是否显示分隔线
const showDivider = (group: any) => {
    if (props.layoutMode === 'horizontal') {
        return false;
    }
    const groups = processedDutyPairs.value;
    const index = groups.indexOf(group);
    return index < groups.length - 1;
};

// 点击用户处理
const handleUserClick = (user: { phone?: string }) => {
    if (user.phone) {
        call(user.phone);
    }
};
</script>

<style scoped lang="less">
@import "@/css/icon.less";

@primary-color: #137fec;
@text-slate-900: #1E293B;
@text-slate-500: #bdbdbd;
@text-slate-400: #94a3b8;
@white-color: #fff;
@time-text-height: 20px;

.duty-staff-list {


    .user-info {
        display: flex;
        align-items: center;
        gap: 12px;

        &.no-duty {

            .user-name,
            .user-department {
                color: @text-slate-400;
            }
        }
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
        color: @text-slate-500;
    }

    .user-details {
        .user-name {
            font-size: 16px;
            font-weight: 500;
            color: @text-slate-900;
            margin: 0;
        }

        .user-department {
            font-size: 14px;
            color: @text-slate-500;
            margin: 0;
        }
    }

    .horizontal-list {
        display: flex;
        flex-direction: row;
        overflow-x: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }

        .user-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 20px;
            flex-shrink: 0;
            cursor: pointer;

            &:last-child {
                margin-right: 0;
            }

            .avatar-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: #f0f0f0;
                border: 1px solid #e0e0e0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                color: #b0b0b0;
            }

            .avatar-container {
                position: relative;
                margin-bottom: 8px;
            }

            .name-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                font-size: 10px;
                padding: 2px 4px;
                text-align: center;
                border-radius: 0 0 25px 25px;
                line-height: 1.2;
                max-width: 50px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .dep-name {
                font-size: 12px;
                color: #666;
            }
        }
    }

    .vertical-list {
        .duty-group {
            margin-bottom: 12px;
        }

        .time-bar-container {
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 10px;

            .time-bar {
                width: 100%;
                height: 44px;
                display: flex;
                border-radius: 4px;
                overflow: visible;
                // background-color: #e5e7eb;
                padding-bottom: @time-text-height;

                .time-segment {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    transition: width 0.3s ease;
                    position: relative;
                    padding-bottom: @time-text-height;

                    .staff-item {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        padding: 0;
                        margin: 0;
                        border: none;
                        border-radius: 0;
                        background: transparent;
                        min-height: auto;
                    }

                    &.current-segment {
                        background-color: #d1d5db; // 浅灰色
                    }

                    &.next-segment {
                        background-color: #f3f4f6; // 更浅的灰色，接近白色
                    }
                }
            }

            .time-text {
                display: block;
                text-align: center;
                font-size: 12px;
                font-weight: 500;
                color: @text-slate-500;
                margin-top: -@time-text-height;
                line-height: 1.2;
                // background: transparent;
                position: relative;
                z-index: 1;
                border-top: solid 1rpx #ddd;
                background-color: rgba(190, 190, 190, 0.1);
            }

        }

        .user-avatar {
            width: 24px;
            height: 24px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            background-color: rgba(255, 255, 255, 0.5);
            color: @text-slate-500;
        }

        .user-details {
            .user-name {
                font-size: 11px;
                font-weight: 500;
                color: @text-slate-900;
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 70px;
            }

            .user-department {
                font-size: 9px;
                color: @text-slate-500;
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 70px;
            }
        }
    }


    .loading-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px 16px;
        text-align: center;

        .loading-spinner {
            width: 24px;
            height: 24px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid @primary-color;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 12px;
        }

        .loading-text {
            font-size: 14px;
            color: @text-slate-500;
            margin: 0;
        }
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
