<template>
    <div class="duty-container">
        <div class="user-list">
            <div v-for="item in processedData" :key="item.id" class="user-item" @click="callUser(item.userId)">
                <div class="avatar-container">
                    <i class="avatar-icon zl-icon-user"></i>
                    <div class="name-overlay">{{ item.name }}</div>
                </div>
                <div class="dep-name">{{ item.depAbbr }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDepartmentStore } from '@/store/department.store';
import { useUserStore } from '@/store/user.store';
import { DutyResponse } from '@/types/duty';
import { call } from '@/utils/tools';
// import { getDutyToday } from '@/api/staff.api';

// 初始化 store
const departmentStore = useDepartmentStore();
const userStore = useUserStore();

// 响应式数据
const dutyData = ref<DutyResponse[]>([]);

// 计算属性：处理数据，结合部门和用户名称
const processedData = computed(() => {
    return dutyData.value.map((duty, index) => {
        const dept = departmentStore.list.find(d => d.id.toString() === duty.departmentId);
        const user = userStore.getStaff(duty.userId);
        // 获取部门名称的前两个字作为缩写
        const depAbbr = dept?.name.slice(0, 2) || '未知';
        return {
            id: index + 1,
            name: user?.name || '未知',
            depAbbr: depAbbr,
            userId: duty.userId,
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

// 获取当日值班数据
const fetchDutyData = async () => {
    // try {
    //     const res = await getDutyToday();
    //     dutyData.value = res || [];
    // } catch (error) {
    //     console.error('获取值班数据失败:', error);
    //     uni.showToast({
    //         title: '加载值班数据失败',
    //         icon: 'none'
    //     });
    // }
    // 使用模拟数据
    dutyData.value = [
        { departmentId: '1', userId: '1' },
        { departmentId: '2', userId: '2' },
        { departmentId: '3', userId: '3' },
        { departmentId: '4', userId: '4' },
        { departmentId: '5', userId: '5' },
        { departmentId: '6', userId: '6' },
        { departmentId: '7', userId: '7' },
        { departmentId: '8', userId: '8' },
        { departmentId: '9', userId: '9' },
        { departmentId: '10', userId: '10' },
    ];
};

// 页面加载时初始化
onMounted(async () => {
    // 初始化部门和员工数据
    await departmentStore.fetchDepartments();
    await userStore.fetchStaff();

    // 获取值班数据
    await fetchDutyData();
});
</script>

<style scoped lang="less">
@import "@/css/icon.less";

.duty-container {
    padding: 16px 0;
    background-color: #fff;
}

.user-list {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    padding: 0 16px;
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
