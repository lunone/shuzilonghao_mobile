<template>
    <div class="permission-node">
        <div class="node-content" :style="{ 'padding-left': node.level * 16 + 'px' }">
            <div class="expand-icon" @click="$emit('expandToggle', node.id)">
                <wd-icon v-if="hasChildren" :name="isExpanded ? 'arrow-down' : 'arrow-right'" />
            </div>
            <div class="checkbox-wrapper">
                <wd-checkbox
                    :model-value="checkboxValue"
                    :indeterminate="isIndeterminate"
                    :half-checked="isIndeterminate"
                    :disabled="readOnly"
                    @change="readOnly ? null : $emit('togglePermission', node.id)"
                    :class="{ 'indeterminate-checkbox': isIndeterminate }"
                >
                    {{ node.name }}
                </wd-checkbox>
                <div v-if="isIndeterminate" class="indeterminate-indicator">—</div>
            </div>
            <div v-if="!readOnly" class="actions">
                <span class="action-icon" @click="$emit('editNode', node)" title="编辑">✏️</span>
                <span class="action-icon" @click="$emit('deleteNode', node)" title="删除">🗑️</span>
                <span class="action-icon" @click="$emit('addChild', node.id)" title="添加子项">➕</span>
            </div>
            <div v-else class="read-only-actions">
                <span class="eye-icon" @click="showPermissionRoles">👁️</span>
            </div>
        </div>
        <div v-if="hasChildren && isExpanded" class="children-container">
            <PermissionNode
                v-for="child in node.children"
                :key="child.id"
                :node="child"
                :selected-ids="selectedIds"
                :expanded-nodes="expandedNodes"
                :read-only="readOnly"
                @toggle-permission="$emit('togglePermission', $event)"
                @edit-node="$emit('editNode', $event)"
                @delete-node="$emit('deleteNode', $event)"
                @add-child="$emit('addChild', $event)"
                @expand-toggle="$emit('expandToggle', $event)"
            />
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import PermissionNode from './PermissionNode.vue'

export default {
    name: 'PermissionNode',
    components: {
        PermissionNode
    },
    props: {
        node: {
            type: Object,
            required: true
        },
        selectedIds: {
            type: Array,
            default: () => []
        },
        expandedNodes: {
            type: Set,
            default: () => new Set()
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    emits: ['togglePermission', 'editNode', 'deleteNode', 'addChild', 'expandToggle'],
    setup(props, { emit }) {
        const isSelected = computed(() => props.selectedIds.includes(props.node.id))
        const isExpanded = computed(() => props.expandedNodes.has(props.node.id))
        const hasChildren = computed(() => props.node.children && props.node.children.length > 0)

        // 计算所有子节点ID（递归）
        const getAllChildIds = (node) => {
            const ids = []
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                    ids.push(child.id)
                    ids.push(...getAllChildIds(child))
                })
            }
            return ids
        }

        // 计算checkbox的值和半选状态
        const checkboxValue = computed(() => {
            if (!hasChildren.value) {
                // 没有子节点：直接返回当前选中状态
                return isSelected.value
            } else {
                // 有子节点：检查所有子节点是否都选中
                const childIds = getAllChildIds(props.node)
                const selectedChildCount = childIds.filter(id => props.selectedIds.includes(id)).length
                const result = selectedChildCount === childIds.length && childIds.length > 0



                return result
            }
        })

        const isIndeterminate = computed(() => {
            if (!hasChildren.value) {
                // 没有子节点：没有半选状态
                return false
            } else {
                // 有子节点：检查是否部分选中
                const childIds = getAllChildIds(props.node)
                const selectedChildCount = childIds.filter(id => props.selectedIds.includes(id)).length
                const result = selectedChildCount > 0 && selectedChildCount < childIds.length



                return result
            }
        })

        const showPermissionRoles = () => {
            uni.showModal({
                title: `权限角色信息`,
                content: `权限: ${props.node.name}\n\n该权限相关的角色信息需要从服务器获取。\n\nAPI路径: /system/permission/roles`,
                showCancel: false,
                confirmText: '知道了'
            })
        }

        const handlePermissionToggle = (checked) => {
            emit('togglePermission', { permissionId: props.node.id, checked })
        }

        return {
            isSelected,
            isExpanded,
            hasChildren,
            checkboxValue,
            isIndeterminate,
            showPermissionRoles,
            handlePermissionToggle
        }
    }
}
</script>

<style lang="less" scoped>
.permission-node {
    .node-content {
        display: flex;
        align-items: center;
        padding: 3px 0;
    }

    .expand-icon {
        width: 16px;
        text-align: center;
        cursor: pointer;
    }

    .actions {
        margin-left: auto;
    }

    .read-only-actions {
        margin-left: auto;
        cursor: pointer;
    }

    .children-container {
        padding-left: 16px;
    }

    .eye-icon {
        cursor: pointer;
        font-size: 14px;
        padding: 2px;
        border-radius: 3px;
        transition: all 0.2s ease;

        &:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        &:active {
            transform: scale(0.9);
        }
    }

    .action-icon {
        cursor: pointer;
        font-size: 14px;
        padding: 2px;
        border-radius: 3px;
        transition: all 0.2s ease;
        margin-left: 2px;

        &:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        &:active {
            transform: scale(0.9);
        }
    }

    .checkbox-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .indeterminate-indicator {
            position: absolute;
            left: 4px;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: #1890ff;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
            z-index: 1;
            pointer-events: none;
        }
    }
}
</style>
