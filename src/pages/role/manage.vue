<template>
  <!-- <div class="permission-manage">
     
    <PageLoading :is-loading="pageLoading" :text="loadingText" />

     
    <div class="section-card user-selection-section">
      <div class="user-search-container">
        
        <div v-if="!selectedUser" class="user-search-input-wrapper">
          <wd-input
            v-model="userSearchKeyword"
            placeholder="输入人员姓名或ID进行搜索"
            @input="realTimeSearchUsers"
            @focus="showUserDropdown = true"
            @blur="handleSearchBlur"
            clearable
          />
          <div v-if="showUserDropdown && searchResults.length > 0" class="user-dropdown">
            <div
              v-for="user in searchResults"
              :key="user.id"
              class="user-dropdown-item"
              @click="selectUser(user)"
            >
              <div class="user-avatar">
                <text>{{ user.name?.charAt(0) || 'U' }}</text>
              </div>
              <div class="user-details">
                <h4>{{ user.name }}</h4>
                <p>{{ user.id }}</p>
              </div>
            </div>
          </div>
          <div v-if="showUserDropdown && searchResults.length === 0 && userSearchKeyword.trim()" class="user-dropdown">
            <div class="no-results">未找到匹配的人员</div>
          </div>
        </div>
         
        <div v-if="selectedUser" class="selected-user-info">
          <div class="user-avatar">
            <text>{{ selectedUser.name?.charAt(0) || 'U' }}</text>
          </div>
          <div class="user-details">
            <h4>{{ selectedUser.name }}</h4>
            <p>{{ selectedUser.id }}</p>
          </div>
          <span class="clear-user" @click="clearSelectedUser" title="清除选择">×</span>
        </div>
      </div>
    </div>

      
        <div class="section-card roles-section">
            <div class="section-header">
                <h3>系统角色</h3>
                <div class="header-actions">
                    <span class="action-icon" @click="showCreateRoleDialog = true" title="创建角色">➕</span>
                    <span class="action-icon" @click="openRoleDialog" title="分配角色">👥</span>
                </div>
            </div>
            <div class="roles-list">
                <div v-for="role in allRoles" :key="role.id"
                     :class="['role-item', {
                         'selected': selectedRole?.id === role.id,
                         'user-has-role': hasUserRole(role.id),
                         'user-no-role': !hasUserRole(role.id)
                     }]"
                     @click="handleSelectRole(role)">
                    <div class="role-info">
                        <div class="role-main">
                            <h4 class="role-name">{{ role.name }}</h4>
                            <span class="role-code">{{ role.code }}</span>
                            <span v-if="hasUserRole(role.id)" class="role-status owned">✓ 已拥有</span>
                            <span v-else class="role-status not-owned">✗ 未拥有</span>
                        </div>
                        <p class="role-desc">{{ role.description || '无描述' }}</p>
                    </div>
                </div>
                <div v-if="allRoles.length === 0" class="empty-state">
                    <div class="empty-icon">🔒</div>
                    <div>暂无角色</div>
                </div>
            </div>
        </div>
 
        <div class="section-card resources-section">
            <div class="section-header">
                <h3>系统资源</h3>
                <div class="header-actions">
                    <span class="action-icon" @click="openCreateResourceDialog" title="创建资源">➕</span>
                    <span v-if="selectedResource" class="action-icon" @click="openCreateChildResourceDialog" title="添加子资源">➕</span>
                    <span v-if="selectedResource" class="action-icon" @click="editSelectedResource" title="编辑资源">✏️</span>
                    <span v-if="selectedResource" class="action-icon delete-btn" @click="deleteSelectedResource" title="删除资源">🗑️</span>
                </div>
            </div>
            <div class="resource-tree-container">
                <ResourceManager
                    ref="resourceManagerRef"
                    @resource-selected="handleResourceSelected"
                />
            </div>
        </div>
 
        <div class="section-card permissions-section">
            <div class="section-header">
                <h3>{{ selectedResource ? `${selectedResource.name}权限` : (selectedRole ? `${selectedRole.name}权限` : (selectedUser ? `${selectedUser.name}权限` : '系统权限')) }}</h3>
                <div class="header-actions">
                    <span v-if="selectedResource" class="action-icon" @click="openCreateRootPermissionDialog" title="添加根权限">➕</span>
                    <span v-if="selectedResource && hasPermissionChanges" class="action-icon update-btn" @click="saveResourcePermissions" title="更新权限">💾</span>
                </div>
            </div>
            <div class="permission-tree-container">
                <PermissionTree
                    :all-permissions="allPermissions"
                    :selected-permission-ids="selectedResource ? selectedPermissionIds : (selectedRole ? rolePermissionIds : userPermissionIds)"
                    :read-only="!selectedResource"
                    @toggle-permission="handleTogglePermission"
                    @edit-node="handleEditNode"
                    @delete-node="handleDeleteNode"
                    @add-child="handleAddChild"
                />
            </div>
        </div>
 
        <div v-if="showUserSelector" class="modal-overlay" @click="showUserSelector = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>选择用户</h3>
                    <button class="close-btn" @click="showUserSelector = false">×</button>
                </div>
                <div class="modal-body">
                    <div class="search-box">
                        <wd-input v-model="userSearchKeyword" placeholder="搜索用户姓名或ID" @input="realTimeSearchUsers" />
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
 
        <div v-if="showCreatePermissionDialog" class="modal-overlay" @click="showCreatePermissionDialog = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>{{ newPermission.parentId === 0 ? '创建根权限' : '创建子权限' }}</h3>
                    <button class="close-btn" @click="showCreatePermissionDialog = false">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>权限名称</label>
                        <wd-input v-model="newPermission.name" placeholder="请输入权限名称" />
                    </div>
                    <div class="form-group">
                        <label>权限编码</label>
                        <wd-input v-model="newPermission.code" placeholder="请输入权限编码" />
                    </div>
                    <div class="form-group">
                        <label>权限类型</label>
                        <wd-radio-group v-model="newPermission.type">
                            <wd-radio :value="0">菜单</wd-radio>
                            <wd-radio :value="1">按钮</wd-radio>
                            <wd-radio :value="2">接口</wd-radio>
                        </wd-radio-group>
                    </div>
                    <div class="form-group" v-if="newPermission.type === 2">
                        <label>接口路径</label>
                        <wd-input v-model="newPermission.path" placeholder="请输入接口路径" />
                    </div>
                    <div class="form-group" v-if="newPermission.type === 2">
                        <label>请求方法</label>
                        <wd-radio-group v-model="newPermission.method">
                            <wd-radio value="GET">GET</wd-radio>
                            <wd-radio value="POST">POST</wd-radio>
                            <wd-radio value="PUT">PUT</wd-radio>
                            <wd-radio value="DELETE">DELETE</wd-radio>
                        </wd-radio-group>
                    </div>
                    <div class="form-group">
                        <label>权限描述</label>
                        <wd-textarea v-model="newPermission.description" placeholder="请输入权限描述" :maxlength="-1" />
                    </div>
                    <div class="form-group">
                        <wd-checkbox v-model="newPermission.enabled">启用状态</wd-checkbox>
                    </div>
                    <div class="modal-actions">
                        <wd-button type="default" @click="cancelCreatePermission">取消</wd-button>
                        <wd-button type="primary" @click="createPermission">创建</wd-button>
                    </div>
                </div>
            </div>
        </div>
 
        <div v-if="showEditPermissionDialog" class="modal-overlay" @click="showEditPermissionDialog = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>编辑权限</h3>
                    <button class="close-btn" @click="showEditPermissionDialog = false">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>权限名称</label>
                        <wd-input v-model="editPermission.name" placeholder="请输入权限名称" />
                    </div>
                    <div class="form-group">
                        <label>权限编码</label>
                        <wd-input v-model="editPermission.code" placeholder="请输入权限编码" />
                    </div>
                    <div class="form-group">
                        <label>权限类型</label>
                        <wd-radio-group v-model="editPermission.type">
                            <wd-radio :value="0">菜单</wd-radio>
                            <wd-radio :value="1">按钮</wd-radio>
                            <wd-radio :value="2">接口</wd-radio>
                        </wd-radio-group>
                    </div>
                    <div class="form-group" v-if="editPermission.type === 2">
                        <label>接口路径</label>
                        <wd-input v-model="editPermission.path" placeholder="请输入接口路径" />
                    </div>
                    <div class="form-group" v-if="editPermission.type === 2">
                        <label>请求方法</label>
                        <wd-radio-group v-model="editPermission.method">
                            <wd-radio value="GET">GET</wd-radio>
                            <wd-radio value="POST">POST</wd-radio>
                            <wd-radio value="PUT">PUT</wd-radio>
                            <wd-radio value="DELETE">DELETE</wd-radio>
                        </wd-radio-group>
                    </div>
                    <div class="form-group">
                        <label>权限描述</label>
                        <wd-textarea v-model="editPermission.description" placeholder="请输入权限描述" :maxlength="-1" />
                    </div>
                    <div class="form-group">
                        <wd-checkbox v-model="editPermission.enabled">启用状态</wd-checkbox>
                    </div>
                    <div class="modal-actions">
                        <wd-button type="default" @click="cancelEditPermission">取消</wd-button>
                        <wd-button type="primary" @click="updatePermission">保存</wd-button>
                    </div>
                </div>
            </div>
        </div>


    </div> -->
</template>

<script setup lang="ts">
// import { ref, onMounted, computed, onUnmounted } from 'vue'
// import { useUserStore } from '@/store/user.store'

// import type { Role, Permission, Resource, PermissionAction, RolePermissionAssignment } from '@/api/permission.api'
// // import {
// //   getRoleList,
// //   getUserRoles,
// //   getUserPermissionsById,
// //   getPermissionList,
// //   assignRolesToUser,
// //   assignPermissionsToRole,
// //   getRolePermissionIds,
// //   getResourcePermissionIds,
// //   assignPermissionsToResource,
// //   createPermission,
// //   updatePermission,
// //   deletePermission
// // } from '@/api/permission.api'
// // import { createRole } from '@/api/permission.api' // 假设存在
// // import UserRoleManager from './manage/UserRoleManager.vue'
// // import RolePermissionManager from './manage/RolePermissionManager.vue'
// // import PermissionTree from './manage/PermissionTree.vue'
// // import ResourceManager from './manage/ResourceManager.vue'
// import PageLoading from '@/components/PageLoading.vue'

// // 响应式数据
// const selectedUser = ref<any>(null)
// const selectedRole = ref<Role | null>(null)
// const selectedResource = ref<Resource | null>(null)
// const userRoles = ref<Role[]>([])
// const userPermissions = ref<Permission[]>([])
// const allRoles = ref<Role[]>([])
// const allPermissions = ref<Permission[]>([])
// const selectedPermissionIds = ref<number[]>([])
// const userPermissionIds = ref<number[]>([])
// const rolePermissionIds = ref<number[]>([])
// const originalPermissionIds = ref<number[]>([]) // 保存原始权限ID，用于比较变更
// const searchResults = ref<any[]>([])
// const showUserSelector = ref(false)
// const showUserDropdown = ref(false)
// const showRoleDialog = ref(false)
// const showCreateRoleDialog = ref(false)
// const showCreatePermissionDialog = ref(false)
// const showEditPermissionDialog = ref(false)
// const userSearchKeyword = ref('')
// const selectedRoleIds = ref<number[]>([])
// const resourceManagerRef = ref()
// const newRole = ref({
//     name: '',
//     code: '',
//     description: '',
//     enabled: true
// })

// // 创建权限表单数据
// const newPermission = ref({
//     name: '',
//     code: '',
//     description: '',
//     parentId: 0,
//     type: 0,
//     path: '',
//     method: '',
//     enabled: true
// })

// // 编辑权限表单数据
// const editPermission = ref({
//     id: 0,
//     name: '',
//     code: '',
//     description: '',
//     parentId: 0,
//     type: 0,
//     path: '',
//     method: '',
//     enabled: true
// })




// // 页面级别的loading状态
// const pageLoading = ref(false)
// const loadingText = ref('加载中...')

// // 使用userStore
// const userStore = useUserStore()

// // 注册页面loading回调
// // const unregisterPageLoading = loading.registerPageLoading((isLoading: boolean, text?: string) => {
// //     pageLoading.value = isLoading
// //     if (text) {
// //         loadingText.value = text
// //     }
// // })

// // 页面卸载时取消注册
// onUnmounted(() => {
//     // unregisterPageLoading()
// })

// // 计算属性：检测权限是否有变更
// const hasPermissionChanges = computed(() => {
//     if (!selectedRole.value) return false

//     // 比较当前选中的权限ID和原始权限ID
//     const currentIds = [...selectedPermissionIds.value].sort()
//     const originalIds = [...originalPermissionIds.value].sort()

//     if (currentIds.length !== originalIds.length) {
//         return true
//     }

//     return currentIds.some((id, index) => id !== originalIds[index])
// })

// // 检查用户是否拥有指定角色
// const hasUserRole = (roleId: number): boolean => {
//     if (!selectedUser.value || !userRoles.value.length) return false
//     return userRoles.value.some(role => role.id === roleId)
// }

// // 页面加载时初始化
// onMounted(async () => {
//     // 只加载角色数据，避免页面卡顿
//     await loadAllRoles()

//     // 预加载员工数据（异步，不阻塞页面）
//     userStore.fetchStaff()
// })



// // 加载所有角色
// const loadAllRoles = async () => {
//     try {
//         const result = await permission.getRoleList({ enabled: true })
//         allRoles.value = result.list
//     } catch (error) {
//         uni.showToast({ title: '加载角色失败', icon: 'none' })
//         console.error('加载角色失败:', error)
//     }
// }

// // 搜索用户
// const searchUsers = async () => {
//     if (!userSearchKeyword.value.trim()) {
//         searchResults.value = []
//         return
//     }

//     // 直接使用响应式的userStore.staff数据进行搜索
//     const keyword = userSearchKeyword.value.toLowerCase()
//     searchResults.value = userStore.staff.filter(user =>
//         user.name?.toLowerCase().includes(keyword) ||
//         user.userId?.toLowerCase().includes(keyword) ||
//         user.id?.toLowerCase().includes(keyword)
//     ).map(user => ({
//         id: user.userId || user.id,
//         name: user.name || '未知用户'
//     }))

//     if (searchResults.value.length === 0) {
//         uni.showToast({ title: '未找到匹配的用户', icon: 'none' })
//     }
// }

// // 实时搜索用户（防抖处理）
// let searchTimeout: NodeJS.Timeout | null = null
// const realTimeSearchUsers = () => {
//     if (searchTimeout) {
//         clearTimeout(searchTimeout)
//     }
//     searchTimeout = setTimeout(() => {
//         searchUsers()
//     }, 300) // 300ms 防抖
// }

// // 选择用户
// const selectUser = async (user: any) => {
//     selectedUser.value = user
//     showUserSelector.value = false
//     userSearchKeyword.value = ''

//     await loadUserRoles()
//     await loadUserPermissions()
// }

// // 加载用户角色
// const loadUserRoles = async () => {
//     if (!selectedUser.value) return

//     try {
//         userRoles.value = await permission.getUserRoles(selectedUser.value.id)
//     } catch (error) {
//         uni.showToast({ title: '加载用户角色失败', icon: 'none' })
//         console.error('加载用户角色失败:', error)
//     }
// }

// // 加载用户权限
// const loadUserPermissions = async () => {
//     if (!selectedUser.value) return

//     try {
//         console.log('开始加载用户权限，用户ID:', selectedUser.value.id)

//         // 同时加载用户权限和完整权限列表
//         const [userPerms, allPerms] = await Promise.all([
//             permission.getUserPermissionsById(selectedUser.value.id),
//             permission.getPermissionList({})
//         ])

//         console.log('用户权限列表:', userPerms)
//         console.log('所有权限列表:', allPerms.list)

//         userPermissions.value = userPerms
//         allPermissions.value = allPerms.list

//         // 计算用户拥有的权限ID列表
//         userPermissionIds.value = userPermissions.value.map(p => p.id)
//         console.log('用户权限ID列表:', userPermissionIds.value)
//     } catch (error) {
//         uni.showToast({ title: '加载用户权限失败', icon: 'none' })
//         console.error('加载用户权限失败:', error)
//         console.error('错误详情:', error)
//     }
// }



// // 分配角色
// const assignRoles = async () => {
//     if (!selectedUser.value) return

//     console.log('开始分配角色，用户ID:', selectedUser.value.id)
//     console.log('要分配的角色ID列表:', selectedRoleIds.value)

//     try {
//         const result = await permission.assignRolesToUser(selectedUser.value.id, selectedRoleIds.value)
//         console.log('分配角色API返回结果:', result)

//         uni.showToast({ title: '分配角色成功' })
//         showRoleDialog.value = false
//         selectedRoleIds.value = []
//         await loadUserRoles()
//         await loadUserPermissions()
//     } catch (error) {
//         uni.showToast({ title: '分配角色失败', icon: 'none' })
//         console.error('分配角色失败:', error)
//     }
// }

// // 创建角色
// const createRole = async () => {
//     if (!newRole.value.name.trim() || !newRole.value.code.trim()) {
//         uni.showToast({ title: '请填写角色名称和编码', icon: 'none' })
//         return
//     }

//     try {
//         await permission.createRole({
//             name: newRole.value.name,
//             code: newRole.value.code,
//             description: newRole.value.description,
//             enabled: newRole.value.enabled
//         })
//         uni.showToast({ title: '创建角色成功' })
//         showCreateRoleDialog.value = false
//         newRole.value = { name: '', code: '', description: '', enabled: true }
//         await loadAllRoles()
//     } catch (error) {
//         uni.showToast({ title: '创建角色失败', icon: 'none' })
//         console.error('创建角色失败:', error)
//     }
// }

// // 取消创建角色
// const cancelCreateRole = () => {
//     showCreateRoleDialog.value = false
//     newRole.value = { name: '', code: '', description: '', enabled: true }
// }

// // 打开角色分配弹窗
// const openRoleDialog = () => {
//     showRoleDialog.value = true
//     // 初始化选中当前用户已有的角色
//     selectedRoleIds.value = userRoles.value.map(role => role.id)
// }

// // 切换角色选择状态
// const toggleRoleSelection = (roleId: number, checked: boolean) => {
//     if (checked) {
//         if (!selectedRoleIds.value.includes(roleId)) {
//             selectedRoleIds.value.push(roleId)
//         }
//     } else {
//         const index = selectedRoleIds.value.indexOf(roleId)
//         if (index > -1) {
//             selectedRoleIds.value.splice(index, 1)
//         }
//     }
// }

// // 选择角色
// const selectRole = async (role: Role) => {
//     selectedRole.value = role
//     await loadRolePermissions()
// }

// // 加载角色权限
// const loadRolePermissions = async () => {
//     if (!selectedRole.value) return

//     try {
//         // 并行加载权限列表和角色已有权限，保持loading状态
//         const [result, rolePermissions] = await Promise.all([
//             permission.getPermissionList({}),
//             permission.getRolePermissionIds(selectedRole.value.id)
//         ])

//         allPermissions.value = result.list
//         selectedPermissionIds.value = rolePermissions
//         // 保存原始权限ID，用于比较变更
//         originalPermissionIds.value = [...rolePermissions]

//         // 保存原始权限ID，用于比较变更
//         originalPermissionIds.value = [...rolePermissions]
//     } catch (error) {
//         uni.showToast({ title: '加载角色权限失败', icon: 'none' })
//         console.error('加载角色权限失败:', error)
//     }
// }

// // 保存角色权限
// const saveRolePermissions = async () => {
//     if (!selectedRole.value) return

//     try {
//         await permission.assignPermissionsToRole(selectedRole.value.id, selectedPermissionIds.value)
//         uni.showToast({ title: '保存权限成功' })
//         // 更新原始权限ID，清除变更状态
//         originalPermissionIds.value = [...selectedPermissionIds.value]
//         // 刷新用户权限
//         await loadUserPermissions()
//     } catch (error) {
//         uni.showToast({ title: '保存权限失败', icon: 'none' })
//         console.error('保存权限失败:', error)
//     }
// }

// // 切换权限选择状态
// const togglePermission = (permissionId: number, checked: boolean) => {
//     if (checked) {
//         if (!selectedPermissionIds.value.includes(permissionId)) {
//             selectedPermissionIds.value.push(permissionId)
//         }
//         // 联动选择所有子节点
//         selectAllChildren(permissionId)
//     } else {
//         const index = selectedPermissionIds.value.indexOf(permissionId)
//         if (index > -1) {
//             selectedPermissionIds.value.splice(index, 1)
//         }
//         // 联动取消选择所有子节点
//         deselectAllChildren(permissionId)
//     }
// }

// // 递归选择所有子节点
// const selectAllChildren = (permissionId: number) => {
//     const findAndSelectChildren = (permissions: any[], parentId: number) => {
//         permissions.forEach(permission => {
//             if (permission.parentId === parentId) {
//                 if (!selectedPermissionIds.value.includes(permission.id)) {
//                     selectedPermissionIds.value.push(permission.id)
//                 }
//                 // 递归处理子节点的子节点
//                 findAndSelectChildren(permissions, permission.id)
//             }
//         })
//     }

//     findAndSelectChildren(allPermissions.value, permissionId)
// }

// // 递归取消选择所有子节点
// const deselectAllChildren = (permissionId: number) => {
//     const findAndDeselectChildren = (permissions: any[], parentId: number) => {
//         permissions.forEach(permission => {
//             if (permission.parentId === parentId) {
//                 const index = selectedPermissionIds.value.indexOf(permission.id)
//                 if (index > -1) {
//                     selectedPermissionIds.value.splice(index, 1)
//                 }
//                 // 递归处理子节点的子节点
//                 findAndDeselectChildren(permissions, permission.id)
//             }
//         })
//     }

//     findAndDeselectChildren(allPermissions.value, permissionId)
// }


// // 选择角色处理
// const handleSelectRole = async (role: Role) => {
//     // 如果点击的是已选中的角色，则取消选中，显示用户权限
//     if (selectedRole.value && selectedRole.value.id === role.id) {
//         selectedRole.value = null
//         selectedPermissionIds.value = []
//         // 刷新用户权限显示
//         if (selectedUser.value) {
//             await loadUserPermissions()
//         }
//     } else {
//         // 否则选中该角色，显示角色权限
//         selectedRole.value = role
//         await loadRolePermissions()
//     }
// }



// // 保存角色权限处理
// const handleSaveRolePermissions = async () => {
//     await saveRolePermissions()
// }

// // 加载角色权限处理
// const handleLoadRolePermissions = async () => {
//     await loadRolePermissions()
// }

// // 切换权限处理
// const handleTogglePermission = (permissionId: number) => {
//     // 计算当前选中状态：如果已选中则取消选中，否则选中
//     const isCurrentlySelected = selectedPermissionIds.value.includes(permissionId)
//     const checked = !isCurrentlySelected
//     togglePermission(permissionId, checked)
// }

// // 编辑节点处理
// const handleEditNode = async (node: any) => {
//     try {
//         // 获取权限详情
//         // 使用权限列表获取详情（新API没有单独的详情接口）
//         const permissionList = await permission.getPermissionList({ enabled: true })
//         const permissionDetail = permissionList.list.find(p => p.id === node.id)

//         // 填充编辑表单
//         editPermission.value = {
//             id: permissionDetail.id,
//             name: permissionDetail.name,
//             code: permissionDetail.code,
//             description: permissionDetail.description || '',
//             parentId: permissionDetail.parentId || 0,
//             type: permissionDetail.type || 0,
//             path: permissionDetail.path || '',
//             method: permissionDetail.method || '',
//             enabled: permissionDetail.enabled !== false
//         }

//         // 显示编辑弹窗
//         showEditPermissionDialog.value = true
//     } catch (error) {
//         uni.showToast({
//             title: '获取权限详情失败',
//             icon: 'none'
//         })
//         console.error('获取权限详情失败:', error)
//     }
// }

// // 删除节点处理
// const handleDeleteNode = async (node: any) => {
//     try {
//         // 使用权限列表获取详情（新API没有单独的详情接口）
//         const permissionList = await permission.getPermissionList({ enabled: true })
//         const permissionDetail = permissionList.list.find(p => p.id === node.id)

//         if (!permissionDetail) {
//             uni.showToast({
//                 title: '权限不存在',
//                 icon: 'none'
//             })
//             return
//         }

//         uni.showModal({
//             title: '删除权限',
//             content: `确定要删除权限 "${permissionDetail.name}" 吗？\n\n注意：删除权限将影响所有相关用户和角色。`,
//             showCancel: true,
//             confirmText: '删除',
//             cancelText: '取消',
//             success: async (res) => {
//                 if (res.confirm) {
//                     try {
//                         await permission.deletePermission(node.id)
//                         uni.showToast({
//                             title: '删除权限成功',
//                             icon: 'success'
//                         })
//                         // 刷新权限列表
//                         await refreshPermissions()
//                     } catch (error) {
//                         uni.showToast({
//                             title: '删除权限失败',
//                             icon: 'none'
//                         })
//                         console.error('删除权限失败:', error)
//                     }
//                 }
//             }
//         })
//     } catch (error) {
//         uni.showToast({
//             title: '获取权限详情失败',
//             icon: 'none'
//         })
//         console.error('获取权限详情失败:', error)
//     }
// }

// // 添加子节点处理
// const handleAddChild = async (parentId: number) => {
//     await openCreateChildPermissionDialog(parentId)
// }

// // 清除角色选择
// const clearRoleSelection = () => {
//     selectedRole.value = null
//     selectedPermissionIds.value = []
// }

// // 刷新权限
// const refreshPermissions = async () => {
//     if (selectedRole.value) {
//         await loadRolePermissions()
//     } else {
//         await loadUserPermissions()
//     }
// }

// // 获取权限类型文本
// const getPermissionTypeText = (type?: number): string => {
//     switch (type) {
//         case 0: return '菜单'
//         case 1: return '按钮'
//         case 2: return '接口'
//         default: return '未知'
//     }
// }

// // 打开创建根权限弹窗
// const openCreateRootPermissionDialog = () => {
//     newPermission.value = {
//         name: '',
//         code: '',
//         description: '',
//         parentId: 0,
//         type: 0,
//         path: '',
//         method: '',
//         enabled: true
//     }
//     showCreatePermissionDialog.value = true
// }

// // 打开创建子权限弹窗
// const openCreateChildPermissionDialog = async (parentId: number) => {
//     try {
//         // 使用权限列表获取父权限详情（新API没有单独的详情接口）
//         const permissionList = await permission.getPermissionList({ enabled: true })
//         const parentPermission = permissionList.list.find(p => p.id === parentId)

//         if (!parentPermission) {
//             uni.showToast({
//                 title: '父权限不存在',
//                 icon: 'none'
//             })
//             return
//         }

//         newPermission.value = {
//             name: '',
//             code: '',
//             description: '',
//             parentId: parentId,
//             type: 0,
//             path: '',
//             method: '',
//             enabled: true
//         }
//         showCreatePermissionDialog.value = true
//     } catch (error) {
//         uni.showToast({
//             title: '获取父权限详情失败',
//             icon: 'none'
//         })
//         console.error('获取父权限详情失败:', error)
//     }
// }

// // 创建权限
// const createPermission = async () => {
//     if (!newPermission.value.name.trim() || !newPermission.value.code.trim()) {
//         uni.showToast({ title: '请填写权限名称和编码', icon: 'none' })
//         return
//     }

//     try {
//         await permission.createPermission({
//             name: newPermission.value.name,
//             code: newPermission.value.code,
//             description: newPermission.value.description,
//             parentId: newPermission.value.parentId,
//             type: newPermission.value.type,
//             path: newPermission.value.path,
//             method: newPermission.value.method,
//             enabled: newPermission.value.enabled
//         })
//         uni.showToast({ title: '创建权限成功', icon: 'success' })
//         showCreatePermissionDialog.value = false
//         // 重置表单
//         newPermission.value = {
//             name: '',
//             code: '',
//             description: '',
//             parentId: 0,
//             type: 0,
//             path: '',
//             method: '',
//             enabled: true
//         }
//         // 刷新权限列表
//         await refreshPermissions()
//     } catch (error) {
//         uni.showToast({ title: '创建权限失败', icon: 'none' })
//         console.error('创建权限失败:', error)
//     }
// }

// // 取消创建权限
// const cancelCreatePermission = () => {
//     showCreatePermissionDialog.value = false
//     newPermission.value = {
//         name: '',
//         code: '',
//         description: '',
//         parentId: 0,
//         type: 0,
//         path: '',
//         method: '',
//         enabled: true
//     }
// }

// // 取消编辑权限
// const cancelEditPermission = () => {
//     showEditPermissionDialog.value = false
//     editPermission.value = {
//         id: 0,
//         name: '',
//         code: '',
//         description: '',
//         parentId: 0,
//         type: 0,
//         path: '',
//         method: '',
//         enabled: true
//     }
// }

// // 更新权限
// const updatePermission = async () => {
//     if (!editPermission.value.name.trim() || !editPermission.value.code.trim()) {
//         uni.showToast({ title: '请填写权限名称和编码', icon: 'none' })
//         return
//     }

//     try {
//         const updateData: any = {
//             name: editPermission.value.name,
//             code: editPermission.value.code,
//             description: editPermission.value.description,
//             type: editPermission.value.type,
//             enabled: editPermission.value.enabled
//         }

//         // 只有当type为2（接口）时才包含path和method
//         if (editPermission.value.type === 2) {
//             updateData.path = editPermission.value.path
//             updateData.method = editPermission.value.method
//         }

//         await permission.updatePermission(editPermission.value.id, updateData)
//         uni.showToast({ title: '更新权限成功', icon: 'success' })
//         showEditPermissionDialog.value = false
//         // 重置表单
//         editPermission.value = {
//             id: 0,
//             name: '',
//             code: '',
//             description: '',
//             parentId: 0,
//             type: 0,
//             path: '',
//             method: '',
//             enabled: true
//         }
//         // 刷新权限列表
//         await refreshPermissions()
//     } catch (error) {
//         uni.showToast({ title: '更新权限失败', icon: 'none' })
//         console.error('更新权限失败:', error)
//     }
// }

// // 资源相关函数
// const openCreateResourceDialog = () => {
//     if (resourceManagerRef.value) {
//         resourceManagerRef.value.openCreateDialog()
//     }
// }

// const openCreateChildResourceDialog = () => {
//     if (resourceManagerRef.value && selectedResource.value) {
//         resourceManagerRef.value.openCreateChildDialog(selectedResource.value.id)
//     }
// }

// const editSelectedResource = () => {
//     if (resourceManagerRef.value && selectedResource.value) {
//         resourceManagerRef.value.editResource(selectedResource.value)
//     }
// }

// const deleteSelectedResource = () => {
//     if (resourceManagerRef.value && selectedResource.value) {
//         resourceManagerRef.value.deleteResource(selectedResource.value)
//     }
// }

// const handleResourceSelected = (resource: Resource | null) => {
//     selectedResource.value = resource
//     if (resource) {
//         // 加载资源权限
//         loadResourcePermissions()
//     } else {
//         selectedPermissionIds.value = []
//     }
// }

// const loadResourcePermissions = async () => {
//     if (!selectedResource.value) return

//     try {
//         // 调用新API加载资源权限
//         const resourcePermissionIds = await permission.getResourcePermissionIds(selectedResource.value.id)
//         selectedPermissionIds.value = resourcePermissionIds
//     } catch (error) {
//         uni.showToast({ title: '加载资源权限失败', icon: 'none' })
//         console.error('加载资源权限失败:', error)
//     }
// }

// const saveResourcePermissions = async () => {
//     if (!selectedResource.value) return

//     try {
//         // 调用新API保存资源权限
//         await permission.assignPermissionsToResource(selectedResource.value.id, selectedPermissionIds.value)
//         uni.showToast({ title: '保存权限成功' })
//     } catch (error) {
//         uni.showToast({ title: '保存权限失败', icon: 'none' })
//         console.error('保存权限失败:', error)
//     }
// }

// // 处理搜索框失去焦点
// const handleSearchBlur = () => {
//     // 延迟隐藏下拉框，以便点击选项
//     setTimeout(() => {
//         showUserDropdown.value = false
//     }, 200)
// }

// // 清除选中的用户
// const clearSelectedUser = () => {
//     selectedUser.value = null
//     userRoles.value = []
//     userPermissions.value = []
//     userPermissionIds.value = []
//     selectedRole.value = null
//     selectedResource.value = null
//     selectedPermissionIds.value = []
// }
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.permission-manage {
    padding: 10px;
    background: #f5f5f5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    transition: all 0.3s ease;

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

    // 用户权限模式样式
    &.user-mode {
        border-color: #52c41a;
        box-shadow: 0 0 0 1px rgba(82, 196, 26, 0.2);

        .section-header {
            background: linear-gradient(135deg, #f6ffed 0%, #b7eb8f 100%);
            border-bottom-color: #52c41a;

            h3 {
                color: #389e0d;
            }
        }
    }

    // 角色权限模式样式
    &.role-mode {
        border-color: #1890ff;
        box-shadow: 0 0 0 1px rgba(24, 144, 255, 0.2);

        .section-header {
            background: linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%);
            border-bottom-color: #1890ff;

            h3 {
                color: #0958d9;
            }
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



.refresh-icon {
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

// 四部分布局样式
.user-selection-section {
    flex-shrink: 0;
    overflow: visible; // 允许下拉框溢出

    .user-search-container {
        width: 100%;

        .user-search-input-wrapper {
            position: relative;
            width: 100%;

            .user-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                max-height: 200px;
                overflow-y: auto;
                margin-top: 2px;

                .user-dropdown-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background-color 0.2s;

                    &:hover {
                        background: #f5f5f5;
                    }

                    &:last-child {
                        border-bottom: none;
                    }

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
                        margin-right: 8px;
                    }

                    .user-details {
                        flex: 1;

                        h4 {
                            margin: 0 0 2px 0;
                            font-size: 14px;
                            font-weight: 600;
                            color: @color-text;
                        }

                        p {
                            margin: 0;
                            font-size: 12px;
                            color: #666;
                        }
                    }
                }

                .no-results {
                    padding: 12px;
                    text-align: center;
                    color: #999;
                    font-size: 14px;
                }
            }
        }

        .selected-user-info {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            background: #f6ffed;
            border: 1px solid #b7eb8f;
            border-radius: 6px;
            margin-top: 8px;

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
                margin-right: 8px;
            }

            .user-details {
                flex: 1;

                h4 {
                    margin: 0 0 2px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: @color-text;
                }

                p {
                    margin: 0;
                    font-size: 12px;
                    color: #666;
                }
            }

            .clear-user {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ff4d4f;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.2s;

                &:hover {
                    background: #d4380d;
                }
            }
        }
    }
}

.roles-section {
    flex: 1;
    min-height: 200px;
    max-height: 300px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .roles-list {
        flex: 1;
        overflow-y: auto;
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

            // 用户拥有该角色的样式
            &.user-has-role {
                background: linear-gradient(135deg, #f6ffed 0%, #b7eb8f 100%);
                border-left-color: #52c41a;
                box-shadow: 0 0 0 1px rgba(82, 196, 26, 0.2);

                &:hover {
                    background: linear-gradient(135deg, #f6ffed 0%, #91d5ff 100%);
                }

                &.selected {
                    background: linear-gradient(135deg, #e6f7ff 0%, #b7eb8f 100%);
                    box-shadow: 0 0 0 1px #1890ff;
                }
            }

            // 用户没有该角色的样式
            &.user-no-role {
                background: linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%);
                border-left-color: #ff4d4f;
                box-shadow: 0 0 0 1px rgba(255, 77, 79, 0.2);

                &:hover {
                    background: linear-gradient(135deg, #fff2f0 0%, #ffd8bf 100%);
                }

                &.selected {
                    background: linear-gradient(135deg, #e6f7ff 0%, #ffccc7 100%);
                    box-shadow: 0 0 0 1px #1890ff;
                }
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

                .role-status {
                    font-size: 10px;
                    font-weight: 600;
                    padding: 2px 4px;
                    border-radius: 4px;

                    &.owned {
                        background: #52c41a;
                        color: white;
                    }

                    &.not-owned {
                        background: #ff4d4f;
                        color: white;
                    }
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
}

.resources-section {
    flex: 1;
    min-height: 200px;
    max-height: 300px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .resource-tree-container {
        flex: 1;
        overflow-y: auto;
        padding: 6px 8px;
    }
}

.permissions-section {
    flex: 2;
    min-height: 300px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .permission-tree-container {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
    }
}


</style>
