<template>
    <div class="permission-tree">
        <div v-for="node in treeData" :key="node.id">
            <PermissionNode
                :node="node"
                :selected-ids="selectedPermissionIds"
                :expanded-nodes="expandedNodes"
                :read-only="readOnly"
                @toggle-permission="$emit('togglePermission', $event)"
                @edit-node="$emit('editNode', $event)"
                @delete-node="$emit('deleteNode', $event)"
                @add-child="$emit('addChild', $event)"
                @expand-toggle="handleExpandToggle"
            />
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import PermissionNode from './PermissionNode.vue'

export default {
    name: 'PermissionTree',
    components: {
        PermissionNode
    },
    props: {
        allPermissions: {
            type: Array,
            default: () => []
        },
        selectedPermissionIds: {
            type: Array,
            default: () => []
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    emits: ['togglePermission', 'editNode', 'deleteNode', 'addChild'],
    setup(props, { emit }) {
        const treeData = ref([])
        const expandedNodes = ref(new Set())

        const buildTree = (permissions) => {
            const tree = []
            const childrenOf = new Map()

            permissions.forEach(p => {
                const parentId = p.parentId ?? 0
                if (!childrenOf.has(parentId)) {
                    childrenOf.set(parentId, [])
                }
                childrenOf.get(parentId).push({ ...p, children: [], level: 0 })
            })

            const buildNode = (node, level) => {
                node.level = level
                const children = childrenOf.get(node.id)
                if (children) {
                    node.children = children
                    // 默认展开所有节点
                    expandedNodes.value.add(node.id)
                    children.forEach(child => buildNode(child, level + 1))
                }
            }

            const roots = childrenOf.get(0) || []
            roots.forEach(root => buildNode(root, 0))
            return roots
        }

        const handleExpandToggle = (nodeId) => {
            if (expandedNodes.value.has(nodeId)) {
                expandedNodes.value.delete(nodeId)
            } else {
                expandedNodes.value.add(nodeId)
            }
        }

        const handleTogglePermission = (data) => {
            emit('togglePermission', data.permissionId, data.checked)
        }

        watch(() => props.allPermissions, (newPermissions) => {
            treeData.value = buildTree(newPermissions)
        }, { immediate: true, deep: true })

        onMounted(() => {
            treeData.value = buildTree(props.allPermissions)
        })

        return {
            treeData,
            expandedNodes,
            handleExpandToggle,
            handleTogglePermission
        }
    }
}
</script>

<style lang="less" scoped>
.permission-tree {
    padding: 10px;
}
</style>
