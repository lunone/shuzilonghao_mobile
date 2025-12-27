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
            <view v-for="group in processedGroups" :key="group.groupId" class="duty-group">
                <view v-if="group.users.length > 0" v-for="user in group.users" :key="user.userId" class="user-info" @click="handleUserClick(user)">
                    <view class="zl-icon-user user-avatar"></view>
                    <view class="user-details">
                        <p class="user-name">{{ user.name }}</p>
                        <p class="user-department">{{ group.groupName }}</p>
                    </view>
                </view>
                <view v-else class="user-info no-duty">
                    <view class="zl-icon-user user-avatar"></view>
                    <view class="user-details">
                        <p class="user-name">未排班</p>
                        <p class="user-department">{{ group.groupName }}</p>
                    </view>
                </view>
                <hr class="divider" v-if="showDivider(group)" />
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

// 是否显示分隔线
const showDivider = (group: any) => {
    if (props.layoutMode === 'horizontal') {
        return false;
    }
    const groups = processedGroups.value;
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
@text-slate-500: #64748B;
@text-slate-400: #94a3b8;
@white-color: #fff;

.duty-staff-list {
    .duty-group {
        margin-bottom: 12px;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 12px;

        &.no-duty {
            .user-name, .user-department {
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

    .divider {
        border: none;
        border-top: 1px solid #f1f5f9;
        margin: 12px 0;
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
