<template>
    <view class="container">
        <view class="header">
            <text class="title">权限系统测试页面。</text>
        </view>

        <view class="section">
            <text class="section-title">当前用户权限信息</text>
            <view class="info-item">
                <text>用户ID: {{ userStore.selfObj?.userId || '未登录' }}</text>
            </view>
            <view class="info-item">
                <text>角色: {{ userStore.permissions?.roles?.join(', ') || '无' }}</text>
            </view>
            <view class="info-item">
                <text>权限: {{ userStore.permissions?.permissions?.join(', ') || '无' }}</text>
            </view>
        </view>

        <view class="section">
            <text class="section-title">权限检查测试</text>

            <!-- 权限指令测试 -->
            <view class="test-item">
                <text>飞行读取权限 (v-permission="'flight:read'"):</text>
                <view v-if="permission.hasPermission('flight:read')" class="permission-result success">
                    <text>✓ 有权限</text>
                </view>
                <view v-else class="permission-result fail">
                    <text>✗ 无权限</text>
                </view>
            </view>

            <view class="test-item">
                <text>用户管理权限 (v-permission="'user:manage'"):</text>
                <view v-if="permission.hasPermission('user:manage')" class="permission-result success">
                    <text>✓ 有权限</text>
                </view>
                <view v-else class="permission-result fail">
                    <text>✗ 无权限</text>
                </view>
            </view>

            <!-- 角色指令测试 -->
            <view class="test-item">
                <text>管理员角色 (v-role="'admin'"):</text>
                <view v-if="permission.hasRole('admin')" class="permission-result success">
                    <text>✓ 是管理员</text>
                </view>
                <view v-else class="permission-result fail">
                    <text>✗ 不是管理员</text>
                </view>
            </view>

            <view class="test-item">
                <text>员工角色 (v-role="'staff'"):</text>
                <view v-if="permission.hasRole('staff')" class="permission-result success">
                    <text>✓ 是员工</text>
                </view>
                <view v-else class="permission-result fail">
                    <text>✗ 不是员工</text>
                </view>
            </view>
        </view>

        <view class="section">
            <text class="section-title">权限组件测试</text>

            <!-- 权限组件测试 -->
            <Permission permission="analysis:read">
                <view class="component-test success">
                    <text>✓ Permission组件: 有分析读取权限</text>
                </view>
            </Permission>

            <Permission permission="system:manage">
                <view class="component-test success">
                    <text>✓ Permission组件: 有系统管理权限</text>
                </view>
                <template #fallback>
                    <view class="component-test fail">
                        <text>✗ Permission组件: 无系统管理权限</text>
                    </view>
                </template>
            </Permission>

            <Permission role="manager">
                <view class="component-test success">
                    <text>✓ Permission组件: 是管理者角色</text>
                </view>
            </Permission>
        </view>

        <view class="section">
            <text class="section-title">功能按钮测试</text>

            <button v-permission="'flight:write'" class="action-btn" @click="handleFlightWrite">
                编辑飞行信息
            </button>

            <button v-permission="'user:manage'" class="action-btn" @click="handleUserManage">
                管理用户
            </button>

            <button v-role="'admin'" class="action-btn admin-btn" @click="handleAdminAction">
                管理员操作
            </button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/store/user.store';
import Permission from '@/components/Permission.vue';
import permission from '@/utils/permission';

const userStore = useUserStore();

// 页面加载时刷新用户信息（包含权限数据）
onMounted(async () => {
    await userStore.fetchSelf();
});

// 测试函数
const handleFlightWrite = () => {
    uni.showToast({
        title: '执行飞行信息编辑',
        icon: 'success'
    });
};

const handleUserManage = () => {
    uni.showToast({
        title: '执行用户管理',
        icon: 'success'
    });
};

const handleAdminAction = () => {
    uni.showToast({
        title: '执行管理员操作',
        icon: 'success'
    });
};
</script>

<style lang="less" scoped>
.container {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.header {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.section {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
    display: block;
}

.info-item {
    margin-bottom: 10px;
}

.info-item text {
    font-size: 14px;
    color: #666;
}

.test-item {
    margin-bottom: 15px;
}

.test-item text {
    font-size: 14px;
    color: #333;
    display: block;
    margin-bottom: 5px;
}

.permission-result {
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
}

.success {
    background-color: #e8f5e8;
    color: #2e7d32;
}

.fail {
    background-color: #ffebee;
    color: #c62828;
}

.component-test {
    padding: 10px 15px;
    border-radius: 6px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
}

.action-btn {
    background-color: #1976d2;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 14px;
    margin-right: 10px;
    margin-bottom: 10px;
    min-width: 120px;
}

.admin-btn {
    background-color: #d32f2f;
}
</style>
