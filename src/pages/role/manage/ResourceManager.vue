<template>
  <div class="resource-manager">
    <div class="resource-tree-container">
      <div class="resource-tree">
        <div v-for="resource in resourceTree" :key="resource.id"
             :class="['resource-node', {
               'selected': selectedResource?.id === resource.id,
               'expanded': expandedNodes.has(resource.id)
             }]">
          <div class="resource-content" @click="selectResource(resource)">
            <div class="resource-icon">
              <text v-if="resource.type === 0">📁</text>
              <text v-else-if="resource.type === 1">📄</text>
              <text v-else-if="resource.type === 2">⚙️</text>
              <text v-else-if="resource.type === 3">💾</text>
              <text v-else>🔗</text>
            </div>
            <div class="resource-info">
              <div class="resource-name">{{ resource.name }}</div>
              <div class="resource-code">{{ resource.code }}</div>
            </div>
            <div v-if="resource.children && resource.children.length > 0"
                 class="expand-icon"
                 @click.stop="toggleExpand(resource.id)">
              <text v-if="expandedNodes.has(resource.id)">▼</text>
              <text v-else>▶</text>
            </div>
          </div>

          <!-- 子资源 -->
          <div v-if="resource.children && resource.children.length > 0 && expandedNodes.has(resource.id)"
               class="resource-children">
            <div v-for="child in resource.children" :key="child.id"
                 :class="['resource-node child-node', {
                   'selected': selectedResource?.id === child.id,
                   'expanded': expandedNodes.has(child.id)
                 }]">
              <div class="resource-content" @click="selectResource(child)">
                <div class="resource-icon">
                  <text v-if="child.type === 0">📁</text>
                  <text v-else-if="child.type === 1">📄</text>
                  <text v-else-if="child.type === 2">⚙️</text>
                  <text v-else-if="child.type === 3">💾</text>
                  <text v-else>🔗</text>
                </div>
                <div class="resource-info">
                  <div class="resource-name">{{ child.name }}</div>
                  <div class="resource-code">{{ child.code }}</div>
                </div>
                <div v-if="child.children && child.children.length > 0"
                     class="expand-icon"
                     @click.stop="toggleExpand(child.id)">
                  <text v-if="expandedNodes.has(child.id)">▼</text>
                  <text v-else>▶</text>
                </div>
              </div>

              <!-- 递归子资源 -->
              <ResourceSubTree
                v-if="child.children && child.children.length > 0 && expandedNodes.has(child.id)"
                :resources="child.children"
                :selected-resource="selectedResource"
                :expanded-nodes="expandedNodes"
                @select="selectResource"
                @toggle-expand="toggleExpand"
              />
            </div>
          </div>
        </div>

        <div v-if="resourceTree.length === 0" class="empty-state">
          <div class="empty-icon">📂</div>
          <div>暂无资源</div>
        </div>
      </div>
    </div>

    <!-- 创建资源弹窗 -->
    <div v-if="showCreateResourceDialog" class="modal-overlay" @click="showCreateResourceDialog = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>创建资源</h3>
          <button class="close-btn" @click="showCreateResourceDialog = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>资源名称</label>
            <wd-input v-model="newResource.name" placeholder="请输入资源名称" />
          </div>
          <div class="form-group">
            <label>资源编码</label>
            <wd-input v-model="newResource.code" placeholder="请输入资源编码" />
          </div>
          <div class="form-group">
            <label>资源类型</label>
            <wd-radio-group v-model="newResource.type">
              <wd-radio :value="0">模块</wd-radio>
              <wd-radio :value="1">页面</wd-radio>
              <wd-radio :value="2">功能</wd-radio>
              <wd-radio :value="3">数据</wd-radio>
            </wd-radio-group>
          </div>
          <div class="form-group">
            <label>资源路径</label>
            <wd-input v-model="newResource.path" placeholder="请输入资源路径" />
          </div>
          <div class="form-group">
            <label>图标</label>
            <wd-input v-model="newResource.icon" placeholder="请输入图标" />
          </div>
          <div class="form-group">
            <label>描述</label>
            <wd-textarea v-model="newResource.description" placeholder="请输入资源描述" :maxlength="-1" />
          </div>
          <div class="form-group">
            <wd-checkbox v-model="newResource.enabled">启用状态</wd-checkbox>
          </div>
          <div class="modal-actions">
            <wd-button type="default" @click="cancelCreateResource">取消</wd-button>
            <wd-button type="primary" @click="createResource">创建</wd-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑资源弹窗 -->
    <div v-if="showEditResourceDialog" class="modal-overlay" @click="showEditResourceDialog = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑资源</h3>
          <button class="close-btn" @click="showEditResourceDialog = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>资源名称</label>
            <wd-input v-model="editResource.name" placeholder="请输入资源名称" />
          </div>
          <div class="form-group">
            <label>资源编码</label>
            <wd-input v-model="editResource.code" placeholder="请输入资源编码" />
          </div>
          <div class="form-group">
            <label>资源类型</label>
            <wd-radio-group v-model="editResource.type">
              <wd-radio :value="0">模块</wd-radio>
              <wd-radio :value="1">页面</wd-radio>
              <wd-radio :value="2">功能</wd-radio>
              <wd-radio :value="3">数据</wd-radio>
            </wd-radio-group>
          </div>
          <div class="form-group">
            <label>资源路径</label>
            <wd-input v-model="editResource.path" placeholder="请输入资源路径" />
          </div>
          <div class="form-group">
            <label>图标</label>
            <wd-input v-model="editResource.icon" placeholder="请输入图标" />
          </div>
          <div class="form-group">
            <label>描述</label>
            <wd-textarea v-model="editResource.description" placeholder="请输入资源描述" :maxlength="-1" />
          </div>
          <div class="form-group">
            <wd-checkbox v-model="editResource.enabled">启用状态</wd-checkbox>
          </div>
          <div class="modal-actions">
            <wd-button type="default" @click="cancelEditResource">取消</wd-button>
            <wd-button type="primary" @click="updateResource">保存</wd-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Resource } from '@/api/permission.api'
import ResourceSubTree from './ResourceSubTree.vue'

// 响应式数据
const resourceTree = ref<Resource[]>([])
const selectedResource = ref<Resource | null>(null)
const expandedNodes = ref<Set<number>>(new Set())
const showCreateResourceDialog = ref(false)
const showEditResourceDialog = ref(false)

// 创建资源表单数据
const newResource = ref({
  name: '',
  code: '',
  description: '',
  parentId: 0,
  type: 0,
  path: '',
  icon: '',
  enabled: true
})

// 编辑资源表单数据
const editResource = ref({
  id: 0,
  name: '',
  code: '',
  description: '',
  parentId: 0,
  type: 0,
  path: '',
  icon: '',
  enabled: true
})

// 组件事件
const emit = defineEmits<{
  resourceSelected: [resource: Resource | null]
}>()

// 选择资源
const selectResource = (resource: Resource) => {
  selectedResource.value = resource
  emit('resourceSelected', resource)
}

// 切换展开状态
const toggleExpand = (resourceId: number) => {
  if (expandedNodes.value.has(resourceId)) {
    expandedNodes.value.delete(resourceId)
  } else {
    expandedNodes.value.add(resourceId)
  }
}

// 加载资源树
const loadResourceTree = async () => {
  try {
    // TODO: 调用API加载资源树
    // const result = await resourceApi.getResourceTree()
    // resourceTree.value = result

    // 临时模拟数据
    resourceTree.value = [
      {
        id: 1,
        name: '飞行管理',
        code: 'flight',
        description: '飞行相关功能模块',
        type: 0,
        enabled: true,
        children: [
          {
            id: 2,
            name: '航班查询',
            code: 'flight:query',
            description: '查询航班信息',
            type: 1,
            parentId: 1,
            enabled: true
          },
          {
            id: 3,
            name: '航班编辑',
            code: 'flight:edit',
            description: '编辑航班信息',
            type: 2,
            parentId: 1,
            enabled: true
          }
        ]
      },
      {
        id: 4,
        name: '用户管理',
        code: 'user',
        description: '用户管理模块',
        type: 0,
        enabled: true,
        children: [
          {
            id: 5,
            name: '用户列表',
            code: 'user:list',
            description: '查看用户列表',
            type: 1,
            parentId: 4,
            enabled: true
          }
        ]
      }
    ]

    // 默认展开所有节点
    const expandAll = (resources: Resource[]) => {
      resources.forEach(resource => {
        expandedNodes.value.add(resource.id)
        if (resource.children) {
          expandAll(resource.children)
        }
      })
    }
    expandAll(resourceTree.value)
  } catch (error) {
    uni.showToast({ title: '加载资源失败', icon: 'none' })
    console.error('加载资源失败:', error)
  }
}

// 创建资源
const createResource = async () => {
  if (!newResource.value.name.trim() || !newResource.value.code.trim()) {
    uni.showToast({ title: '请填写资源名称和编码', icon: 'none' })
    return
  }

  try {
    // TODO: 调用API创建资源
    // await resourceApi.createResource(newResource.value)
    uni.showToast({ title: '创建资源成功' })
    showCreateResourceDialog.value = false
    resetNewResource()
    await loadResourceTree()
  } catch (error) {
    uni.showToast({ title: '创建资源失败', icon: 'none' })
    console.error('创建资源失败:', error)
  }
}

// 取消创建资源
const cancelCreateResource = () => {
  showCreateResourceDialog.value = false
  resetNewResource()
}

// 重置新建资源表单
const resetNewResource = () => {
  newResource.value = {
    name: '',
    code: '',
    description: '',
    parentId: 0,
    type: 0,
    path: '',
    icon: '',
    enabled: true
  }
}

// 打开创建子资源弹窗
const openCreateChildResourceDialog = () => {
  if (!selectedResource.value) return

  newResource.value.parentId = selectedResource.value.id
  showCreateResourceDialog.value = true
}

// 编辑资源
const showEditResourceDialogFn = async () => {
  if (!selectedResource.value) return

  try {
    // TODO: 调用API获取资源详情
    // const resourceDetail = await resourceApi.getResourceDetail(selectedResource.value.id)

    // 填充编辑表单
    editResource.value = {
      id: selectedResource.value.id,
      name: selectedResource.value.name,
      code: selectedResource.value.code,
      description: selectedResource.value.description || '',
      parentId: selectedResource.value.parentId || 0,
      type: selectedResource.value.type || 0,
      path: selectedResource.value.path || '',
      icon: selectedResource.value.icon || '',
      enabled: selectedResource.value.enabled !== false
    }

    showEditResourceDialog.value = true
  } catch (error) {
    uni.showToast({ title: '获取资源详情失败', icon: 'none' })
    console.error('获取资源详情失败:', error)
  }
}

// 更新资源
const updateResource = async () => {
  if (!editResource.value.name.trim() || !editResource.value.code.trim()) {
    uni.showToast({ title: '请填写资源名称和编码', icon: 'none' })
    return
  }

  try {
    // TODO: 调用API更新资源
    // await resourceApi.updateResource(editResource.value.id, editResource.value)
    uni.showToast({ title: '更新资源成功' })
    showEditResourceDialog.value = false
    await loadResourceTree()
  } catch (error) {
    uni.showToast({ title: '更新资源失败', icon: 'none' })
    console.error('更新资源失败:', error)
  }
}

// 取消编辑资源
const cancelEditResource = () => {
  showEditResourceDialog.value = false
  resetEditResource()
}

// 重置编辑资源表单
const resetEditResource = () => {
  editResource.value = {
    id: 0,
    name: '',
    code: '',
    description: '',
    parentId: 0,
    type: 0,
    path: '',
    icon: '',
    enabled: true
  }
}

// 删除资源
const deleteResource = async () => {
  if (!selectedResource.value) return

  uni.showModal({
    title: '删除资源',
    content: `确定要删除资源 "${selectedResource.value.name}" 吗？\n\n注意：删除资源将影响所有相关权限配置。`,
    showCancel: true,
    confirmText: '删除',
    cancelText: '取消',
    success: async (res) => {
      if (res.confirm) {
        try {
          // TODO: 调用API删除资源
          // await resourceApi.deleteResource(selectedResource.value.id)
          uni.showToast({ title: '删除资源成功', icon: 'success' })
          selectedResource.value = null
          emit('resourceSelected', null)
          await loadResourceTree()
        } catch (error) {
          uni.showToast({ title: '删除资源失败', icon: 'none' })
          console.error('删除资源失败:', error)
        }
      }
    }
  })
}

// 页面加载时初始化
onMounted(async () => {
  await loadResourceTree()
})

// 暴露方法给父组件
defineExpose({
  openCreateDialog: () => {
    showCreateResourceDialog.value = true
  },
  openCreateChildDialog: (parentId: number) => {
    newResource.value.parentId = parentId
    showCreateResourceDialog.value = true
  },
  editResource: (resource: Resource) => {
    editResource.value = {
      id: resource.id,
      name: resource.name,
      code: resource.code,
      description: resource.description || '',
      parentId: resource.parentId || 0,
      type: resource.type || 0,
      path: resource.path || '',
      icon: resource.icon || '',
      enabled: resource.enabled !== false
    }
    showEditResourceDialog.value = true
  },
  deleteResource: (resource: Resource) => {
    selectedResource.value = resource
    deleteResource()
  }
})
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.resource-manager {
  width: 100%;
  height: 100%;
}

.resource-tree-container {
  height: 100%;
  overflow-y: auto;
}

.resource-tree {
  padding: 10px;
}

.resource-node {
  margin-bottom: 4px;

  &.selected {
    background: #e6f7ff;
    border-radius: 6px;
  }

  &.child-node {
    margin-left: 20px;
  }
}

.resource-content {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }
}

.resource-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 14px;
}

.resource-info {
  flex: 1;

  .resource-name {
    font-size: 14px;
    font-weight: 600;
    color: @color-text;
    margin-bottom: 2px;
  }

  .resource-code {
    font-size: 12px;
    color: #666;
  }
}

.expand-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  color: #999;
}

.resource-children {
  margin-top: 4px;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 30px 20px;

  .empty-icon {
    font-size: 40px;
    margin-bottom: 10px;
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #eee;
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

  &.delete-btn {
    color: #ff4d4f;

    &:hover {
      background: rgba(255, 77, 79, 0.1);
    }
  }
}
</style>
