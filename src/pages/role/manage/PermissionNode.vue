<template>
    <div class="permission-node" :style="{ 'padding-left': (node.level || 0) * 16 + 'px' }">
        <!-- 节点内容 -->
        <div class="node-content" :class="{ 'has-permission': hasPermission, 'no-permission': !hasPermission }">
            <!-- 复选框 -->
            <div class="checkbox-wrapper">
                <wd-checkbox
                    :model-value="hasPermission"
                    @change="$emit('togglePermission', node.id)"
                />
            </div>

            <!-- 节点信息 -->
            <div class="node-info" @click="$emit('expandToggle', node.id)">
                <!-- 展开/折叠图标 -->
                <div v-if="hasChildren" class="expand-icon" :class="{ 'expanded': isExpanded }">
                    <wd-icon :name="isExpanded ? 'arrow-down' : 'arrow-right'" />
                </div>

                <!-- 权限图标 -->
                <div class="permission-icon">
                    <text>{{ getPermissionIcon(node.type) }}</text>
                </div>

                <!-- 权限详情 -->
                <div class="permission-details">
                    <div class="permission-name">{{ node.name }}</div>
                    <div class="permission-meta">
                        <span class="permission-code">{{ node.code }}</span>
                        <span class="permission-type" :class="'type-' + node.type">
                            {{ getPermissionTypeText(node.type) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="node-actions">
                <div class="action-menu" :class="{ 'show': showActions }">
                    <wd-button type="info" size="small" @click.stop="handleEdit">
                        编辑
                    </wd-button>
                    <wd-button type="success" size="small" @click.stop="handleAddChild">
                        添加子项
                    </wd-button>
                    <wd-button type="error" size="small" @click.stop="handleDelete">
                        删除
                    </wd-button>
                </div>
                <div class="action-trigger" @click.stop="toggleActions">
                    <wd-icon name="more" />
                </div>
            </div>
        </div>

        <!-- 子节点 -->
        <div v-if="hasChildren && isExpanded" class="children-container">
            <div v-for="child in children" :key="child.id" class="child-node">
                <PermissionNode
                    :node="child"
                    :all-permissions="allPermissions"
                    :selected-ids="selectedIds"
                    :expanded-nodes="expandedNodes"
                    @toggle-permission="$emit('togglePermission', $event)"
                    @edit-node="$emit('editNode', $event)"
                    @delete-node="$emit('deleteNode', $event)"
                    @add-child="$emit('addChild', $event)"
                    @expand-toggle="$emit('expandToggle', $event)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Permission } from '@/interface/permission.interface'
// Props
interface Props {
    node: Permission & { level?: number }
    allPermissions: Permission[]
    selectedIds: number[]
    expandedNodes: Set<number>
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
    togglePermission: [permissionId: number]
    editNode: [node: Permission]
    deleteNode: [node: Permission]
    addChild: [parentId: number]
    expandToggle: [nodeId: number]
}>()

// 响应式数据
const showActions = ref(false)

// 计算属性
const hasPermission = computed(() => {
    return props.selectedIds.includes(props.node.id)
})

const hasChildren = computed(() => {
    const result = props.allPermissions.some(permission => permission.parentId === props.node.id)
    console.log(`节点 ${props.node.name} (ID: ${props.node.id}) hasChildren:`, result)
    return result
})

const children = computed(() => {
    const result = props.allPermissions
        .filter(permission => permission.parentId === props.node.id)
        .map(child => ({
            ...child,
            level: (props.node.level || 0) + 1
        }))
    console.log(`节点 ${props.node.name} (ID: ${props.node.id}) children:`, result)
    return result
})

const isExpanded = computed(() => {
    return props.expandedNodes.has(props.node.id)
})

// 方法
const toggleActions = () => {
    showActions.value = !showActions.value
}

const handleEdit = () => {
    emit('editNode', props.node)
    showActions.value = false
}

const handleAddChild = () => {
    emit('addChild', props.node.id)
    showActions.value = false
}

const handleDelete = () => {
    emit('deleteNode', props.node)
    showActions.value = false
}

const getPermissionIcon = (type?: number): string => {
    switch (type) {
        case 0: return '📁' // 菜单
        case 1: return '🔘' // 按钮
        case 2: return '🔗' // 接口
        default: return '📄'
    }
}

const getPermissionTypeText = (type?: number): string => {
    switch (type) {
        case 0: return '菜单'
        case 1: return '按钮'
        case 2: return '接口'
        default: return '未知'
    }
}

// 移除全局事件监听器，避免在小程序环境中出现问题
// 可以通过点击其他地方时手动调用方法来关闭菜单
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.permission-node {
    .node-content {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 6px;
        background: #fafafa;
        border: 1px solid #eee;
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover {
            background: #f5f5f5;
            border-color: #ddd;
        }

        &.has-permission {
            background: #f6ffed;
            border-color: #b7eb8f;

            .node-info {
                .permission-name {
                    color: #52c41a;
                    font-weight: 600;
                }
            }
        }

        &.no-permission {
            background: #fff2f0;
            border-color: #ffccc7;

            .node-info {
                .permission-name {
                    color: #ff4d4f;
                }
            }
        }

        .checkbox-wrapper {
            flex-shrink: 0;
        }

        .node-info {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 6px;
            min-width: 0;

            .expand-icon {
                flex-shrink: 0;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                transition: transform 0.2s ease;

                &.expanded {
                    transform: rotate(90deg);
                }
            }

            .permission-icon {
                flex-shrink: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            }

            .permission-details {
                flex: 1;
                min-width: 0;

                .permission-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: @color-text;
                    margin-bottom: 2px;
                    word-break: break-word;
                }

                .permission-meta {
                    display: flex;
                    gap: 6px;
                    align-items: center;

                    .permission-code {
                        background: @color-primary;
                        color: white;
                        padding: 1px 4px;
                        border-radius: 6px;
                        font-size: 9px;
                        font-weight: 500;
                    }

                    .permission-type {
                        padding: 1px 4px;
                        border-radius: 6px;
                        font-size: 9px;
                        font-weight: 500;

                        &.type-0 {
                            background: #52c41a;
                            color: white;
                        }

                        &.type-1 {
                            background: #fa8c16;
                            color: white;
                        }

                        &.type-2 {
                            background: #1890ff;
                            color: white;
                        }
                    }
                }
            }
        }

        .node-actions {
            flex-shrink: 0;
            position: relative;

            .action-menu {
                position: absolute;
                right: 0;
                top: 100%;
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 100;
                padding: 4px;
                display: flex;
                flex-direction: column;
                gap: 4px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.2s ease;

                &.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
            }

            .action-trigger {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                cursor: pointer;
                color: #999;

                &:hover {
                    background: #eee;
                    color: @color-text;
                }
            }
        }
    }

    .children-container {
        margin-top: 4px;
        padding-left: 16px;
        border-left: 2px solid #eee;

        .child-node {
            margin-bottom: 2px;
        }
    }
}
</style>
