<template>
    <div class="permission-manage">
        <!-- 用户信息展示 -->
        <div v-if="selectedUser" class="user-info-card" @click="showUserSelector = true">
            <div class="user-header">
                <div class="user-avatar">
                    <text>{{ selectedUser.name?.charAt(0) || 'U' }}</text>
                </div>
                <div class="user-details">
                    <h3>{{ selectedUser.name || '未选择用户' }}</h3>
                    <p class="user-id">{{ selectedUser.id }}</p>
                </div>
                <div class="user-status">
                    <span class="status-badge active">已选择</span>
                    <div class="change-user-hint">
                        <text>点击重新选择</text>
                    </div>
                </div>
            </div>
        </div>

        <!-- 空状态提示 -->
        <div v-else class="empty-user-state">
            <div class="empty-content">
                <div class="empty-icon">👤</div>
                <wd-button type="primary" @click="showUserSelector = true">
                    选择用户
                </wd-button>
            </div>
        </div>

        <!-- 主要内容区域 -->
        <div v-if="selectedUser" class="content-area">
            <!-- 用户角色管理组件 -->
            <UserRoleManager
                :user-roles="userRoles"
                :selected-role="selectedRole"
                @select-role="handleSelectRole"
                @remove-user-role="handleRemoveUserRole"
                @show-create-role-dialog="showCreateRoleDialog = true"
                @show-role-dialog="showRoleDialog = true"
            />

            <!-- 角色权限管理组件 -->
            <RolePermissionManager
                v-if="selectedRole"
                :selected-role="selectedRole"
                :all-permissions="allPermissions"
                :selected-permission-ids="selectedPermissionIds"
                @save-role-permissions="handleSaveRolePermissions"
                @load-role-permissions="handleLoadRolePermissions"
                @toggle-permission="handleTogglePermission($event, true)"
            />

            <!-- 用户权限查看 -->
            <div v-else class="section-card">
                <div class="section-header">
                    <h3>用户权限</h3>
                    <wd-button type="info" @click="loadUserPermissions">
                        刷新权限
                    </wd-button>
                </div>

                <div class="permission-list">
                    <div v-for="permission in userPermissions" :key="permission.id" class="permission-item">
                        <div class="permission-info">
                            <div class="permission-main">
                                <h4>{{ permission.name }}</h4>
                                <div class="permission-tags">
                                    <span class="permission-code">{{ permission.code }}</span>
                                    <span class="permission-type" :class="'type-' + permission.type">
                                        {{ getPermissionTypeText(permission.type) }}
                                    </span>
                                </div>
                            </div>
                            <p class="permission-desc">{{ permission.description || '无描述' }}</p>
                        </div>
                    </div>
                    <div v-if="userPermissions.length === 0" class="empty-state">
                        <div class="empty-icon">🔑</div>
                        <text>该用户尚无任何权限</text>
                        <p class="empty-hint">请先为用户分配角色获取权限</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 用户选择弹窗 -->
        <div v-if="showUserSelector" class="modal-overlay" @click="showUserSelector = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>选择用户</h3>
                    <button class="close-btn" @click="showUserSelector = false">×</button>
                </div>
                <div class="modal-body">
                    <div class="search-box">
                        <wd-input v-model="userSearchKeyword" placeholder="搜索用户姓名或ID" />
                        <wd-button @click="searchUsers">搜索</wd-button>
                    </div>
                    <div class="user-list">
                        <div v-for="user in searchResults" :key="user.id" class="user-item" @click="selectUser(user)">
                            <div class="user-avatar">
                                <text>{{ user.name?.charAt(0) || 'U' }}</text>
                            </div>
                            <div class="user-details">
                                <h4>{{ user.name }}</h4>
                                <p>{{ user.id }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 创建角色弹窗 -->
        <div v-if="showCreateRoleDialog" class="modal-overlay" @click="showCreateRoleDialog = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>创建角色</h3>
                    <button class="close-btn" @click="showCreateRoleDialog = false">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>角色名称</label>
                        <wd-input v-model="newRole.name" placeholder="请输入角色名称" />
                    </div>
                    <div class="form-group">
                        <label>角色编码</label>
                        <wd-input v-model="newRole.code" placeholder="请输入角色编码" />
                    </div>
                    <div class="form-group">
                        <label>角色描述</label>
                        <wd-textarea v-model="newRole.description" placeholder="请输入角色描述" :maxlength="-1" />
                    </div>
                    <div class="form-group">
                        <wd-checkbox v-model="newRole.enabled">启用状态</wd-checkbox>
                    </div>
                    <div class="modal-actions">
                        <wd-button type="default" @click="cancelCreateRole">取消</wd-button>
                        <wd-button type="primary" @click="createRole">创建</wd-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 角色分配弹窗 -->
        <div v-if="showRoleDialog" class="modal-overlay" @click="showRoleDialog = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>分配角色</h3>
                    <button class="close-btn" @click="showRoleDialog = false">×</button>
                </div>
                <div class="modal-body">
                    <div class="role-selection">
                        <wd-checkbox-group v-model="selectedRoleIds">
                            <template v-for="role in allRoles" :key="role.id">
                                <wd-checkbox class="role-checkbox" v-model="role.id">
                                    <div class="role-info">
                                        <h4>{{ role.name }}</h4>
                                        <p>{{ role.description }}</p>
                                        <span class="role-code">{{ role.code }}</span>
                                    </div>
                                </wd-checkbox>
                            </template>
                        </wd-checkbox-group>
                    </div>
                    <div class="modal-actions">
                        <wd-button type="default" @click="showRoleDialog = false">取消</wd-button>
                        <wd-button type="primary" @click="assignRoles">确定</wd-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <text>加载中...</text>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import permission from '@/utils/permission'
import { useUserStore } from '@/store/user.store'
import type { Role, Permission } from '@/interface/permission.interface'
import UserRoleManager from './manage/UserRoleManager.vue'
import RolePermissionManager from './manage/RolePermissionManager.vue'

// 响应式数据
const selectedUser = ref<any>(null)
const selectedRole = ref<Role | null>(null)
const userRoles = ref<Role[]>([])
const userPermissions = ref<Permission[]>([])
const allRoles = ref<Role[]>([])
const allPermissions = ref<Permission[]>([])
const selectedPermissionIds = ref<number[]>([])
const searchResults = ref<any[]>([])
const showUserSelector = ref(false)
const showRoleDialog = ref(false)
const showCreateRoleDialog = ref(false)
const userSearchKeyword = ref('')
const selectedRoleIds = ref<number[]>([])
const loading = ref(false)

// 创建角色表单数据
const newRole = ref({
    name: '',
    code: '',
    description: '',
    enabled: true
})

// 使用userStore
const userStore = useUserStore()

// 页面加载时初始化
onMounted(async () => {
    await Promise.all([
        loadAllRoles(),
        userStore.fetchStaff() // 预加载员工数据
    ])
})

// 加载所有角色
const loadAllRoles = async () => {
    try {
        loading.value = true
        const result = await permission.getRoleList({ enabled: true })
        allRoles.value = result.list
    } catch (error) {
        uni.showToast({ title: '加载角色失败', icon: 'none' })
        console.error('加载角色失败:', error)
    } finally {
        loading.value = false
    }
}

// 搜索用户
const searchUsers = () => {
    if (!userSearchKeyword.value.trim()) {
        uni.showToast({ title: '请输入搜索关键词', icon: 'none' })
        return
    }

    // 直接使用响应式的userStore.staff数据进行搜索
    const keyword = userSearchKeyword.value.toLowerCase()
    searchResults.value = userStore.staff.filter(user =>
        user.name?.toLowerCase().includes(keyword) ||
        user.userId?.toLowerCase().includes(keyword) ||
        user.id?.toLowerCase().includes(keyword)
    ).map(user => ({
        id: user.userId || user.id,
        name: user.name || '未知用户'
    }))

    if (searchResults.value.length === 0) {
        uni.showToast({ title: '未找到匹配的用户', icon: 'none' })
    }
}

// 选择用户
const selectUser = async (user: any) => {
    selectedUser.value = user
    showUserSelector.value = false
    userSearchKeyword.value = ''

    await loadUserRoles()
    await loadUserPermissions()
}

// 加载用户角色
const loadUserRoles = async () => {
    if (!selectedUser.value) return

    try {
        loading.value = true
        userRoles.value = await permission.getUserRoles(selectedUser.value.id)
    } catch (error) {
        uni.showToast({ title: '加载用户角色失败', icon: 'none' })
        console.error('加载用户角色失败:', error)
    } finally {
        loading.value = false
    }
}

// 加载用户权限
const loadUserPermissions = async () => {
    if (!selectedUser.value) return

    try {
        loading.value = true
        userPermissions.value = await permission.getUserPermissionsById(selectedUser.value.id)
    } catch (error) {
        uni.showToast({ title: '加载用户权限失败', icon: 'none' })
        console.error('加载用户权限失败:', error)
    } finally {
        loading.value = false
    }
}

// 移除用户角色
const removeUserRole = async (roleId: number) => {
    if (!selectedUser.value) return

    try {
        await permission.removeUserRole(selectedUser.value.id, roleId)
        uni.showToast({ title: '移除角色成功' })
        await loadUserRoles()
        await loadUserPermissions()
    } catch (error) {
        uni.showToast({ title: '移除角色失败', icon: 'none' })
        console.error('移除角色失败:', error)
    }
}

// 分配角色
const assignRoles = async () => {
    if (!selectedUser.value) return

    try {
        loading.value = true
        console.log(`!!!!!!!!`, selectedRoleIds.value);
        await permission.assignRolesToUser(selectedUser.value.id, selectedRoleIds.value)
        uni.showToast({ title: '分配角色成功' })
        showRoleDialog.value = false
        selectedRoleIds.value = []
        await loadUserRoles()
        await loadUserPermissions()
    } catch (error) {
        uni.showToast({ title: '分配角色失败', icon: 'none' })
        console.error('分配角色失败:', error)
    } finally {
        loading.value = false
    }
}

// 创建角色
const createRole = async () => {
    if (!newRole.value.name.trim() || !newRole.value.code.trim()) {
        uni.showToast({ title: '请填写角色名称和编码', icon: 'none' })
        return
    }

    try {
        loading.value = true
        await permission.createRole({
            name: newRole.value.name,
            code: newRole.value.code,
            description: newRole.value.description,
            enabled: newRole.value.enabled
        })
        uni.showToast({ title: '创建角色成功' })
        showCreateRoleDialog.value = false
        newRole.value = { name: '', code: '', description: '', enabled: true }
        await loadAllRoles()
    } catch (error) {
        uni.showToast({ title: '创建角色失败', icon: 'none' })
        console.error('创建角色失败:', error)
    } finally {
        loading.value = false
    }
}

// 取消创建角色
const cancelCreateRole = () => {
    showCreateRoleDialog.value = false
    newRole.value = { name: '', code: '', description: '', enabled: true }
}

// 打开角色分配弹窗
const openRoleDialog = () => {
    showRoleDialog.value = true
    // 初始化选中当前用户已有的角色
    selectedRoleIds.value = userRoles.value.map(role => role.id)
}

// 选择角色
const selectRole = async (role: Role) => {
    selectedRole.value = role
    await loadRolePermissions()
}

// 加载角色权限
const loadRolePermissions = async () => {
    if (!selectedRole.value) return

    try {
        loading.value = true
        // 加载所有权限树
        const permissions = await permission.getPermissionTree()
        console.log('服务器返回的权限数据:', permissions)

        // 将树形结构转换为扁平结构
        const flattenedPermissions = flattenPermissionTree(permissions)
        console.log('转换后的扁平权限数据:', flattenedPermissions)

        allPermissions.value = buildPermissionTree(flattenedPermissions)

        // 加载角色已有权限
        const rolePermissions = await permission.getRolePermissionIds(selectedRole.value.id)
        selectedPermissionIds.value = rolePermissions
        console.log('角色已有权限IDs:', rolePermissions)
    } catch (error) {
        uni.showToast({ title: '加载角色权限失败', icon: 'none' })
        console.error('加载角色权限失败:', error)
    } finally {
        loading.value = false
    }
}

// 保存角色权限
const saveRolePermissions = async () => {
    if (!selectedRole.value) return

    try {
        loading.value = true
        await permission.assignPermissionsToRole(selectedRole.value.id, selectedPermissionIds.value)
        uni.showToast({ title: '保存权限成功' })
        // 刷新用户权限
        await loadUserPermissions()
    } catch (error) {
        uni.showToast({ title: '保存权限失败', icon: 'none' })
        console.error('保存权限失败:', error)
    } finally {
        loading.value = false
    }
}

// 切换权限选择状态
const togglePermission = (permissionId: number, checked: boolean) => {
    if (checked) {
        if (!selectedPermissionIds.value.includes(permissionId)) {
            selectedPermissionIds.value.push(permissionId)
        }
    } else {
        const index = selectedPermissionIds.value.indexOf(permissionId)
        if (index > -1) {
            selectedPermissionIds.value.splice(index, 1)
        }
    }
}

// 将树形权限结构转换为扁平结构
const flattenPermissionTree = (treeData: any[]): Permission[] => {
    const result: Permission[] = []

    const traverse = (nodes: any[], parentId: number | null = null) => {
        nodes.forEach(node => {
            // 创建扁平结构的权限对象
            const permission: Permission = {
                id: node.id,
                name: node.name,
                code: node.code,
                description: node.description,
                parentId: parentId,
                type: node.type,
                path: node.path,
                method: node.method,
                orderNum: node.orderNum,
                enabled: node.enabled !== false,
                createdAt: node.createdAt,
                updatedAt: node.updatedAt
            }

            result.push(permission)

            // 递归处理子节点
            if (node.children && node.children.length > 0) {
                traverse(node.children, node.id)
            }
        })
    }

    traverse(treeData)
    return result
}

// 构建权限树结构
const buildPermissionTree = (permissions: Permission[]): Permission[] => {
    const result: Permission[] = []
    const map = new Map<number, Permission & { level: number }>()

    // 建立ID映射
    permissions.forEach(permission => {
        map.set(permission.id, { ...permission, level: 0 })
    })

    // 构建树结构
    permissions.forEach(permission => {
        if (permission.parentId) {
            const parent = map.get(permission.parentId)
            if (parent) {
                map.get(permission.id)!.level = parent.level + 1
            }
        }
        result.push(map.get(permission.id)!)
    })

    // 按层级和顺序排序
    return result.sort((a, b) => {
        const aLevel = (a as any).level || 0
        const bLevel = (b as any).level || 0
        if (aLevel !== bLevel) {
            return aLevel - bLevel
        }
        return (a.orderNum || 0) - (b.orderNum || 0)
    })
}

// 选择角色处理
const handleSelectRole = async (role: Role) => {
    selectedRole.value = role
    await loadRolePermissions()
}

// 移除用户角色处理
const handleRemoveUserRole = async (roleId: number) => {
    await removeUserRole(roleId)
}

// 保存角色权限处理
const handleSaveRolePermissions = async () => {
    await saveRolePermissions()
}

// 加载角色权限处理
const handleLoadRolePermissions = async () => {
    await loadRolePermissions()
}

// 切换权限处理
const handleTogglePermission = (permissionId: number, checked: boolean) => {
    togglePermission(permissionId, checked)
}

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

.permission-manage {
    padding: 10px;
    background: #f5f5f5;
    min-height: 100vh;
}

.user-info-card {
    background: white;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    cursor: pointer;

    .user-header {
        display: flex;
        align-items: center;
        gap: 10px;

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: @color-primary;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
        }

        .user-details {
            flex: 1;

            h3 {
                margin: 0 0 4px 0;
                color: @color-text;
                font-size: 16px;
                font-weight: 600;
            }

            .user-id {
                color: #666;
                font-size: 12px;
            }
        }

        .user-status {
            text-align: right;

            .status-badge {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
                background: #52c41a;
                color: white;
            }

            .change-user-hint {
                margin-top: 4px;
                font-size: 10px;
                color: #999;
            }
        }
    }
}

.empty-user-state {
    background: white;
    border-radius: 8px;
    padding: 30px 20px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    text-align: center;

    .empty-content {
        .empty-icon {
            font-size: 40px;
            margin-bottom: 10px;
        }
    }
}

.content-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: calc(100vh - 120px); /* 减去用户信息卡片和padding的高度 */
    overflow-y: auto;
}

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

        h3 {
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

.role-list,
.permission-list {
    padding: 10px 12px;

    .role-item,
    .permission-item {
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

        .role-info,
        .permission-info {
            flex: 1;

            .role-main,
            .permission-main {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 4px;

                h4 {
                    margin: 0;
                    color: @color-text;
                    font-size: 14px;
                    font-weight: 600;
                }
            }

            .role-desc,
            .permission-desc {
                margin: 0;
                color: #666;
                font-size: 12px;
            }

            .role-code,
            .permission-code {
                background: @color-primary;
                color: white;
                padding: 2px 6px;
                border-radius: 8px;
                font-size: 10px;
                font-weight: 500;
            }

            .permission-tags {
                display: flex;
                gap: 4px;
                align-items: center;
            }

            .permission-type {
                padding: 2px 6px;
                border-radius: 8px;
                font-size: 10px;
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

        .empty-hint {
            font-size: 11px;
            color: #bbb;
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

.search-box {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.user-list {
    max-height: 250px;
    overflow-y: auto;

    .user-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border: 1px solid #eee;
        border-radius: 6px;
        margin-bottom: 6px;
        cursor: pointer;
        background: #fafafa;

        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: @color-primary;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }

        .user-details {
            h4 {
                margin: 0 0 2px 0;
                font-size: 14px;
                font-weight: 600;
            }

            p {
                margin: 0;
                color: #666;
                font-size: 11px;
            }
        }
    }
}

.role-selection {
    max-height: 300px;
    overflow-y: auto;

    .role-checkbox {
        padding: 8px 10px;
        margin-bottom: 6px;
        border: 1px solid #eee;
        border-radius: 6px;
        background: #fafafa;

        .role-info {
            margin-left: 8px;

            h4 {
                margin: 0 0 2px 0;
                color: @color-text;
                font-size: 13px;
                font-weight: 600;
            }

            p {
                margin: 0 0 2px 0;
                color: #666;
                font-size: 11px;
            }

            .role-code {
                background: @color-primary;
                color: white;
                padding: 1px 4px;
                border-radius: 6px;
                font-size: 9px;
                font-weight: 500;
            }
        }
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

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2000;

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid @color-primary;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
    }

    text {
        color: @color-text;
        font-size: 13px;
        font-weight: 500;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
