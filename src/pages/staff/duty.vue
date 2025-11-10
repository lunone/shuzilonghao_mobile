<template>
    <div class="container">
        <div class="title-wrapper">
            <!-- <div class="title">今日值班</div> -->
            <div class="title-badge">今日</div>
        </div>
        <div class="duty-grid">
            <div v-for="item in processedData" :key="item.id" class="duty-card">
                <div class="dep">{{ item.dep }}</div>
                <div class="name" @click="callUser(item.userId)">{{ item.name }}</div>
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
        return {
            id: index + 1,
            name: user?.name || '未知',
            dep: dept?.name || '未知部门',
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
    try {
        // 注释掉真实 API 调用，使用模拟数据
        // const res = await getDutyToday();
        // dutyData.value = res || [];

        // 模拟数据
        dutyData.value = [
            { departmentId: '1', userId: 'user1' },
            { departmentId: '2', userId: 'user2' },
            { departmentId: '3', userId: 'user3' },
            { departmentId: '4', userId: 'user4' },
        ];
    } catch (error) {
        console.error('获取值班数据失败:', error);
        // 模拟数据作为后备
        dutyData.value = [
            { departmentId: '1', userId: 'user1' },
            { departmentId: '2', userId: 'user2' },
            { departmentId: '3', userId: 'user3' },
            { departmentId: '4', userId: 'user4' },
        ];
    }
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

<style scoped>
.container {
    /* min-height: 100vh; */
    /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
    padding: 20px;
}

.title-wrapper {
    position: relative;
    margin-bottom: 30px;
    text-align: center;
}

.title {
    font-size: 24px;
    font-weight: bold;
    color: white;
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    padding: 15px 30px;
    border-radius: 15px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.title-badge {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #ff6b6b;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 20px;
    transform: rotate(15deg);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: rotate(15deg) scale(1); }
    50% { transform: rotate(15deg) scale(1.05); }
    100% { transform: rotate(15deg) scale(1); }
}

.duty-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.duty-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 20px 15px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.duty-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.dep {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.name {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    transition: color 0.3s ease;
    padding: 5px;
    border-radius: 10px;
}

.name:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
}

/* 移动端适配 */
@media (max-width: 480px) {
    .container {
        padding: 15px;
    }

    .title {
        font-size: 20px;
        padding: 12px 25px;
    }

    .duty-grid {
        gap: 12px;
    }

    .duty-card {
        padding: 15px 12px;
    }
}
</style>
