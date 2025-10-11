<template>
    <div class="user-role-manager">
        <!-- 角色管理 -->
        <div class="section-card">
            <div class="section-header">
                <h3 class="section-title">角色管理</h3>
                <div class="header-actions">
                    <span class="action-icon" @click="$emit('showCreateRoleDialog')" title="创建角色">➕</span>
                    <span class="action-icon" @click="$emit('showRoleDialog')" title="分配角色">👥</span>
                </div>
            </div>

            <div class="role-list">
                <div v-for="role in userRoles" :key="role.id"
                     :class="['role-item', { 'selected': selectedRole?.id === role.id }]"
                     @click="handleRoleClick(role)">
                    <div class="role-info">
                        <div class="role-main">
                            <h4 class="role-name">{{ role.name }}</h4>
                            <span class="role-code">{{ role.code }}</span>
                        </div>
                        <p class="role-desc">{{ role.description || '无描述' }}</p>
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
import type { Role } from '@/api/permission.api'

// Props
interface Props {
    userRoles: Role[]
    selectedRole: Role | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
    selectRole: [role: Role | null]
    showCreateRoleDialog: []
    showRoleDialog: []
}>()

// 处理角色点击
const handleRoleClick = (role: Role) => {
    // 如果点击的是已选中的角色，则取消选中
    if (props.selectedRole?.id === role.id) {
        emit('selectRole', null as any) // 发送null表示取消选中
    } else {
        // 否则选中该角色
        emit('selectRole', role)
    }
}
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
            padding: 8px 10px;
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
                gap: 4px;
            }
        }
    }

    .role-list {
        padding: 6px 8px;

        .role-item {
            background: #fafafa;
            margin-bottom: 2px;
            padding: 4px 6px;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background: #f0f0f0;
            }

            &.selected {
                background: #e6f7ff;
                box-shadow: 0 0 0 1px #1890ff;
            }

            .role-info {
                flex: 1;

                .role-main {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1px;

                    .role-name {
                        margin: 0;
                        color: @color-text;
                        font-size: 13px;
                        font-weight: 600;
                    }
                }

                .role-desc {
                    margin: 0;
                    color: #666;
                    font-size: 11px;
                }

                .role-code {
                    background: @color-primary;
                    color: white;
                    padding: 1px 3px;
                    border-radius: 3px;
                    font-size: 8px;
                    font-weight: 500;
                }
            }
        }

        .empty-state {
            text-align: center;
            color: #999;
            padding: 15px;

            .empty-icon {
                font-size: 20px;
                margin-bottom: 4px;
            }

            text {
                display: block;
                margin-bottom: 6px;
                font-size: 12px;
            }
        }
    }

    .action-icon {
        cursor: pointer;
        font-size: 16px;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;

        &:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        &:active {
            transform: scale(0.9);
        }
    }
}
</style>
