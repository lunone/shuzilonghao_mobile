<template>
    <div class="duty-container">
        <div class="header">
            <h3 class="title">今日值班</h3>
            <div class="more-button" @click="navigateToDutyWatch">更多</div>
        </div>
        <div class="user-list">
            <div v-for="item in processedData" :key="item.userId" class="user-item" @click="callUser(item.userId)">
                <div class="avatar-container">
                    <i class="avatar-icon zl-icon-user"></i>
                    <div class="name-overlay">{{ item.name }}</div>
                </div>
                <div class="dep-name">{{ item.groupAbbr }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useUserStore } from '@/store/user.store';
import { useDutyStore } from '@/store/duty.store';
import { call } from '@/utils/tools';
import dayjs from 'dayjs';

// 初始化 store
const userStore = useUserStore();
const dutyStore = useDutyStore();

// 计算属性：处理今日值班数据
const processedData = computed(() => {
    // 确保 userStore.staff 和 dutyStore.dutyGroups 已经被访问，建立响应式依赖
    const staffLoaded = Object.keys(userStore.staffObj).length > 0;
    const groupsLoaded = Object.keys(dutyStore.dutyGroups).length > 0;
    if (!staffLoaded || !groupsLoaded) {
        return [];
    }

    const today = dayjs().format('YYYY-MM-DD');
    const todayDuty = dutyStore.dutySchedule[today] || [];
    
    return todayDuty.map(duty => {
        const user = userStore.getStaff(duty.userId);
        const group = dutyStore.dutyGroups[duty.groupId];
        return {
            userId: duty.userId,
            name: user?.name || '未知',
            groupAbbr: group?.abbr || '未知',
        };
    });
});

// 拨打电话函数
const callUser = (userId: string) => {
    const user = userStore.getStaff(userId);
    if (user?.mobile) {
        call(user.mobile);
    } else {
        uni.showToast({
            title: '无电话号码',
            icon: 'none'
        });
    }
};

// 跳转到值班总览页面
const navigateToDutyWatch = () => {
    uni.navigateTo({ url: '/pages/duty/duty' });
};

// 页面加载时初始化
onMounted(async () => {
    const today = new Date();
    // 并行获取所有依赖数据，确保全部完成后再渲染
    await Promise.all([
        userStore.fetchStaff(),
        dutyStore.fetchDutyGroups(),
        dutyStore.fetchDutySchedule(today, today)
    ]);
});
</script>

<style scoped lang="less">
@import "@/css/icon.less";

.duty-container {
    padding: 16px 16px;
    background-color: #fff;
    border-radius: 8px;
    margin: 0 16px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.more-button {
    font-size: 14px;
    color: #999;
    cursor: pointer;
}

.user-list {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
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
    font-size: 28px; /* 图标大小 */
    color: #b0b0b0; /* 图标颜色 */
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
</style>
