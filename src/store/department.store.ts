import { defineStore } from 'pinia';
import api from '@/utils/api';
import CONFIG from '@/config';
import { DepartmenItem, ListNode, PilotItem, UserItem } from '@/interface';


export default defineStore('user', {
    state: () => ({
        isLoading: { department: false },
        departments: [] as DepartmenItem[],
    }),
    getters: {
        // 获取部门树
        departmentsTree: (state): ListNode[] => {
            const deptMap = new Map<string | number, ListNode>();
            const tree: ListNode[] = [];
            const departments = state.departments;
            // 初始化deptMap
            departments.forEach(dept => {
                dept['children'] = []; // 初始化子节点数组
                deptMap.set(dept.id, dept);
            });

            // 构建树形结构
            departments.forEach(dept => {
                if (dept.parentId !== null && deptMap.has(dept.parentId)) {
                    const parent = deptMap.get(dept.parentId)!;
                    parent.children.push(dept);
                } else {
                    tree.push(dept); // 如果没有parentId或找不到父节点，则为根节点
                }
            });

            return tree;
        },
        // 获取部门子节点id
        departmentSubIds: function (state) {
            return function (targetName: string): (string | number)[] {
                const deptMap = new Map<string | number, ListNode>();  // 创建部门映射表
                const childMap = new Map<string | number, ListNode[]>();  // 父子关系映射

                // 初始化映射关系
                state.departments.forEach(dept => {
                    deptMap.set(dept.id, dept);
                    if (!childMap.has(dept.parentId)) {
                        childMap.set(dept.parentId, []);
                    }
                    childMap.get(dept.parentId)!.push(dept);
                });

                const result = new Set<string | number>();

                // 广度优先遍历
                const queue: (string | number)[] = [];

                // 先找到所有匹配名称的根节点
                state.departments
                    .filter(dept => dept.name === targetName)
                    .forEach(dept => queue.push(dept.id));

                while (queue.length > 0) {
                    const currentId = queue.shift()!;
                    result.add(currentId);

                    // 获取当前节点的直接子节点
                    const children = childMap.get(currentId) || [];
                    children.forEach(child => {
                        if (!result.has(child.id)) {
                            queue.push(child.id);
                        }
                    });
                }

                return Array.from(result);
            };
        },
        // 获取部门路径
        departmentPath: function (state) {
            return function (targetId: string | number, str: string = '/'): string {
                if (!targetId) return '';
                // 创建哈希映射提升查询效率
                const deptMap = new Map<string | number, ListNode>();
                const departments = state.departments;
                departments.forEach(dept => deptMap.set(dept.id, dept));

                const path: string[] = [];
                let currentId: string | number | undefined = targetId;
                const visited = new Set<string | number>(); // 防止循环引用
                while (currentId && deptMap.has(currentId)) {
                    if (visited.has(currentId)) break; // 检测到循环立即终止
                    visited.add(currentId);

                    const currentDept = deptMap.get(currentId)!;
                    path.unshift(currentDept.name); // 从头部插入保证层级顺序

                    currentId = currentDept.parentId;
                }
                // 因为root是中原龙浩,所以得裁掉一段
                return path.slice(1).join(str);
            }

        }
    },
    actions: {
        async getDepartments() {
            if (this.isLoading.department) return;
            this.isLoading.department = true;
            if (!this.departments.length) {
                const res = await api(CONFIG.url.departments) as Record<string, UserItem>;
                this.isLoading.department = false;
                this.departments = res.length ? res : [];
            }
        },

    }
})