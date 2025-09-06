<template>
    <div class="permission-tree">
        <!-- 权限树容器 -->
        <div class="tree-container">
            <!-- 根节点添加按钮 -->
            <div class="add-root-btn" @click="showAddDialog(null)">
                <wd-icon name="plus" />
                <text>添加根权限</text>
            </div>

            <!-- 权限节点列表 -->
            <div class="permission-nodes">
                <div v-for="node in treeNodes" :key="node.id" class="permission-node-wrapper">
                    <PermissionNode
                        :node="node"
                        :all-permissions="props.allPermissions"
                        :selected-ids="selectedPermissionIds"
                        :expanded-nodes="expandedNodes"
                        @toggle-permission="$emit('togglePermission', $event)"
                        @edit-node="handleEditNode"
                        @delete-node="handleDeleteNode"
                        @add-child="handleAddChild"
                        @expand-toggle="handleExpandToggle"
                    />
                </div>
            </div>

            <!-- 空状态 -->
            <div v-if="treeNodes.length === 0" class="empty-state">
                <div class="empty-icon">🌳</div>
                <text>暂无权限数据</text>
                <br>
                <wd-button type="primary" size="small" @click="showAddDialog(null)">
                    添加第一个权限
                </wd-button>
                <!-- 调试信息 -->
                <div style="margin-top: 10px; font-size: 12px; color: #666;">
                    调试: treeNodes.length = {{ treeNodes.length }}<br>
                    allPermissions.length = {{ props.allPermissions.length }}
                </div>
            </div>
        </div>

        <!-- 添加/编辑权限弹窗 -->
        <div v-if="showDialog" class="modal-overlay" @click="hideDialog">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>{{ isEditing ? '编辑权限' : '添加权限' }}</h3>
                    <button class="close-btn" @click="hideDialog">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>权限名称</label>
                        <wd-input v-model="formData.name" placeholder="请输入权限名称" />
                    </div>
                    <div class="form-group">
                        <label>权限编码</label>
                        <wd-input v-model="formData.code" placeholder="请输入权限编码" />
                    </div>
                    <div class="form-group">
                        <label>权限类型</label>
                        <wd-radio-group v-model="formData.type">
                            <wd-radio :value="0">菜单</wd-radio>
                            <wd-radio :value="1">按钮</wd-radio>
                            <wd-radio :value="2">接口</wd-radio>
                        </wd-radio-group>
                    </div>
                    <div class="form-group">
                        <label>权限描述</label>
                        <wd-textarea v-model="formData.description" placeholder="请输入权限描述" :maxlength="-1" />
                    </div>
                    <div class="form-group">
                        <wd-checkbox v-model="formData.enabled">启用状态</wd-checkbox>
                    </div>
                    <div class="modal-actions">
                        <wd-button type="default" @click="hideDialog">取消</wd-button>
                        <wd-button type="primary" @click="submitForm">
                            {{ isEditing ? '保存' : '添加' }}
                        </wd-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 删除确认弹窗 -->
        <div v-if="showDeleteDialog" class="modal-overlay" @click="cancelDelete">
            <div class="modal-content delete-modal" @click.stop>
                <div class="modal-header">
                    <h3>确认删除</h3>
                    <button class="close-btn" @click="cancelDelete">×</button>
                </div>
                <div class="modal-body">
                    <div class="delete-warning">
                        <div class="warning-icon">⚠️</div>
                        <p>确定要删除权限 "{{ deleteTarget?.name }}" 吗？</p>
                        <p class="warning-text">此操作不可恢复，将同时删除所有子权限。</p>
                    </div>
                    <div class="modal-actions">
                        <wd-button type="default" @click="cancelDelete">取消</wd-button>
                        <wd-button type="error" @click="confirmDelete">删除</wd-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import permission from '@/utils/permission'
import type { Permission } from '@/interface/permission.interface'
import PermissionNode from '@/pages/role/manage/PermissionNode.vue'

// Props
interface Props {
    allPermissions: Permission[]
    selectedPermissionIds: number[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
    togglePermission: [permissionId: number]
    permissionUpdated: []
}>()

// 响应式数据
const treeNodes = ref<Permission[]>([])
const showDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const currentParentId = ref<number | null>(null)
const editTarget = ref<Permission | null>(null)
const deleteTarget = ref<Permission | null>(null)

// 表单数据
const formData = ref({
    name: '',
    code: '',
    description: '',
    type: 0,
    enabled: true
})

// 计算属性
const expandedNodes = ref<Set<number>>(new Set())

// 生命周期
onMounted(() => {
    buildTree()
})

// 监听权限变化
watch(() => props.allPermissions, () => {
    buildTree()
}, { deep: true })

// 构建树结构
const buildTree = () => {
    const nodes = [...props.allPermissions]
    const rootNodes = nodes.filter(node => !node.parentId)

    // 为根节点设置层级
    rootNodes.forEach(node => {
        setNodeLevel(node, nodes, 0)
    })

    treeNodes.value = rootNodes
}

// 设置节点层级
const setNodeLevel = (node: Permission, allNodes: Permission[], level: number) => {
    (node as any).level = level
    const children = allNodes.filter(n => n.parentId === node.id)
    children.forEach(child => {
        setNodeLevel(child, allNodes, level + 1)
    })
}

// 显示添加对话框
const showAddDialog = (parentId: number | null) => {
    isEditing.value = false
    currentParentId.value = parentId
    formData.value = {
        name: '',
        code: '',
        description: '',
        type: 0,
        enabled: true
    }
    showDialog.value = true
}

// 显示编辑对话框
const handleEditNode = (node: Permission) => {
    isEditing.value = true
    editTarget.value = node
    formData.value = {
        name: node.name,
        code: node.code,
        description: node.description || '',
        type: node.type || 0,
        enabled: node.enabled !== false
    }
    showDialog.value = true
}

// 处理删除节点
const handleDeleteNode = (node: Permission) => {
    deleteTarget.value = node
    showDeleteDialog.value = true
}

// 处理添加子节点
const handleAddChild = (parentId: number) => {
    showAddDialog(parentId)
}

// 处理展开/折叠
const handleExpandToggle = (nodeId: number) => {
    if (expandedNodes.value.has(nodeId)) {
        expandedNodes.value.delete(nodeId)
    } else {
        expandedNodes.value.add(nodeId)
    }
}

// 隐藏对话框
const hideDialog = () => {
    showDialog.value = false
    isEditing.value = false
    currentParentId.value = null
    editTarget.value = null
    formData.value = {
        name: '',
        code: '',
        description: '',
        type: 0,
        enabled: true
    }
}

// 提交表单
const submitForm = async () => {
    if (!formData.value.name.trim() || !formData.value.code.trim()) {
        uni.showToast({ title: '请填写权限名称和编码', icon: 'none' })
        return
    }

    try {
        const data = {
            name: formData.value.name,
            code: formData.value.code,
            description: formData.value.description,
            type: formData.value.type,
            enabled: formData.value.enabled,
            parentId: currentParentId.value
        }

        if (isEditing.value && editTarget.value) {
            await permission.updatePermission(editTarget.value.id, data)
            uni.showToast({ title: '权限更新成功' })
        } else {
            await permission.createPermission(data)
            uni.showToast({ title: '权限创建成功' })
        }

        hideDialog()
        emit('permissionUpdated')
    } catch (error) {
        uni.showToast({
            title: isEditing.value ? '权限更新失败' : '权限创建失败',
            icon: 'none'
        })
        console.error('权限操作失败:', error)
    }
}

// 取消删除
const cancelDelete = () => {
    showDeleteDialog.value = false
    deleteTarget.value = null
}

// 确认删除
const confirmDelete = async () => {
    if (!deleteTarget.value) return

    try {
        await permission.deletePermission(deleteTarget.value.id)
        uni.showToast({ title: '权限删除成功' })
        showDeleteDialog.value = false
        deleteTarget.value = null
        emit('permissionUpdated')
    } catch (error) {
        uni.showToast({ title: '权限删除失败', icon: 'none' })
        console.error('权限删除失败:', error)
    }
}
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.permission-tree {
    .tree-container {
        .add-root-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 12px;
            margin-bottom: 10px;
            background: linear-gradient(135deg, @color-primary, #ff4757);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(197, 32, 5, 0.3);
            }

            text {
                font-size: 14px;
                font-weight: 500;
            }
        }

        .permission-nodes {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .empty-state {
            text-align: center;
            color: #999;
            padding: 40px 20px;

            .empty-icon {
                font-size: 48px;
                margin-bottom: 12px;
            }

            text {
                display: block;
                margin-bottom: 16px;
                font-size: 14px;
            }
        }
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    width: 95%;
    max-width: 500px;
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;

    &.delete-modal {
        max-width: 400px;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        background: @color-primary;
        color: white;

        h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: white;
        }
    }

    .modal-body {
        padding: 12px 15px;
        overflow-y: auto;
        flex: 1;
    }
}

.form-group {
    margin-bottom: 12px;

    label {
        display: block;
        margin-bottom: 4px;
        font-size: 13px;
        color: @color-text;
        font-weight: 600;
    }
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid #eee;
}

.delete-warning {
    text-align: center;

    .warning-icon {
        font-size: 32px;
        margin-bottom: 8px;
    }

    p {
        margin: 8px 0;
        color: @color-text;
        font-size: 14px;
        font-weight: 500;
    }

    .warning-text {
        color: #ff4d4f;
        font-size: 12px;
        margin: 4px 0 0 0;
    }
}
</style>
