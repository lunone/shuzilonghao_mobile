<template>
    <div class="role-permission-manager">
        <!-- 角色权限管理 -->
        <div class="section-card">
            <div class="section-header">
                <h3 class="section-title">{{ selectedRole.name }} - 权限管理</h3>
                <div class="header-actions">
                    <wd-button type="success" @click="$emit('saveRolePermissions')">
                        保存权限
                    </wd-button>
                    <wd-button type="info" @click="$emit('loadRolePermissions')">
                        刷新权限
                    </wd-button>
                </div>
            </div>

            <!-- 使用权限树组件 -->
            <div class="permission-tree-container">
                <PermissionTree
                    :all-permissions="allPermissions"
                    :selected-permission-ids="selectedPermissionIds"
                    @toggle-permission="$emit('togglePermission', $event)"
                    @permission-updated="$emit('permissionUpdated')"
                />
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import type { Role, Permission } from '@/interface/permission.interface'
import PermissionTree from './PermissionTree.vue'
// Props
interface Props {
    selectedRole: Role
    allPermissions: Permission[]
    selectedPermissionIds: number[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
    saveRolePermissions: []
    loadRolePermissions: []
    togglePermission: [permissionId: number]
    permissionUpdated: []
}>()

// 获取权限类型文本
const getPermissionTypeText = (type?: number): string => {
    switch (type) {
        case 0: return '菜单'
        case 1: return '按钮'
        case 2: return '接口'
        default: return '未知'
    }
}
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.role-permission-manager {
    .section-card {
        background: white;
        border-radius: 8px;
        border: 1px solid #ddd;
        overflow: hidden;

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            background: #fafafa;
            border-bottom: 1px solid #eee;

            .section-title {
                margin: 0;
                color: @color-text;
                font-size: 15px;
                font-weight: 600;
            }

            .header-actions {
                display: flex;
                gap: 6px;
            }
        }
    }

    .permission-tree-container {
        padding: 10px 12px;
        height: 30vh;
        overflow-y: auto;
    }
}
</style>
