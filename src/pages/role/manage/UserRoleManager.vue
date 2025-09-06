<template>
    <div class="user-role-manager">
        <!-- 角色管理 -->
        <div class="section-card">
            <div class="section-header">
                <h3 class="section-title">角色管理</h3>
                <div class="header-actions">
                    <wd-button type="primary" @click="$emit('showCreateRoleDialog')">
                        创建角色
                    </wd-button>
                    <wd-button type="default" @click="$emit('showRoleDialog')">
                        分配角色
                    </wd-button>
                </div>
            </div>

            <div class="role-list">
                <div v-for="role in userRoles" :key="role.id"
                     :class="['role-item', { 'selected': selectedRole?.id === role.id }]"
                     @click="$emit('selectRole', role)">
                    <div class="role-info">
                        <div class="role-main">
                            <h4 class="role-name">{{ role.name }}</h4>
                            <span class="role-code">{{ role.code }}</span>
                        </div>
                        <p class="role-desc">{{ role.description || '无描述' }}</p>
                    </div>
                    <div class="role-actions">
                        <wd-button type="error" size="small" @click.stop="$emit('removeUserRole', role.id)">
                            移除
                        </wd-button>
                    </div>
                </div>
                <div v-if="userRoles.length === 0" class="empty-state">
                    <div class="empty-icon">🔒</div>
                    <div>该用户尚未分配任何角色</div>
                    <wd-button type="primary" size="small" @click="$emit('showRoleDialog')">
                        立即分配
                    </wd-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Role } from '@/interface/permission.interface'

// Props
interface Props {
    userRoles: Role[]
    selectedRole: Role | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
    selectRole: [role: Role]
    removeUserRole: [roleId: number]
    showCreateRoleDialog: []
    showRoleDialog: []
}>()
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.user-role-manager {
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

    .role-list {
        padding: 10px 12px;

        .role-item {
            background: #fafafa;
            border-radius: 6px;
            margin-bottom: 6px;
            padding: 8px 10px;
            border-left: 3px solid @color-primary;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background: #f0f0f0;
            }

            &.selected {
                background: #e6f7ff;
                border-left-color: #1890ff;
                box-shadow: 0 0 0 1px #1890ff;
            }

            .role-info {
                flex: 1;

                .role-main {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 4px;

                    .role-name {
                        margin: 0;
                        color: @color-text;
                        font-size: 14px;
                        font-weight: 600;
                    }
                }

                .role-desc {
                    margin: 0;
                    color: #666;
                    font-size: 12px;
                }

                .role-code {
                    background: @color-primary;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 500;
                }
            }

            .role-actions {
                display: flex;
                gap: 4px;
                align-items: center;
            }
        }

        .empty-state {
            text-align: center;
            color: #999;
            padding: 20px;

            .empty-icon {
                font-size: 24px;
                margin-bottom: 6px;
            }

            text {
                display: block;
                margin-bottom: 8px;
                font-size: 12px;
            }
        }
    }
}
</style>
