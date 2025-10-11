<template>
  <div class="resource-sub-tree">
    <div v-for="resource in resources" :key="resource.id"
         :class="['resource-node child-node', {
           'selected': selectedResource?.id === resource.id,
           'expanded': expandedNodes.has(resource.id)
         }]">
      <div class="resource-content" @click="handleSelect(resource)">
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
             @click.stop="handleToggleExpand(resource.id)">
          <text v-if="expandedNodes.has(resource.id)">▼</text>
          <text v-else>▶</text>
        </div>
      </div>

      <!-- 递归子资源 -->
      <ResourceSubTree
        v-if="resource.children && resource.children.length > 0 && expandedNodes.has(resource.id)"
        :resources="resource.children"
        :selected-resource="selectedResource"
        :expanded-nodes="expandedNodes"
        @select="handleSelect"
        @toggle-expand="handleToggleExpand"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Resource } from '@/api/permission.api'

// 组件属性
const props = defineProps<{
  resources: Resource[]
  selectedResource: Resource | null
  expandedNodes: Set<number>
}>()

// 组件事件
const emit = defineEmits<{
  select: [resource: Resource]
  toggleExpand: [resourceId: number]
}>()

// 处理选择资源
const handleSelect = (resource: Resource) => {
  emit('select', resource)
}

// 处理切换展开状态
const handleToggleExpand = (resourceId: number) => {
  emit('toggleExpand', resourceId)
}
</script>

<style lang="less" scoped>
.resource-sub-tree {
  margin-left: 20px;
  margin-top: 4px;
}

.resource-node {
  margin-bottom: 4px;

  &.selected {
    background: #e6f7ff;
    border-radius: 6px;
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
    color: #333;
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
</style>
