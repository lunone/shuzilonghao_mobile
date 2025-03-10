import { defineStore } from 'pinia';
import api from '@/utils/api';
import CONFIG from '@/config';
import { DepartmenItem, ListNode, PilotItem, UserItem } from '@/interface';


export default defineStore('user', {
    state: () => ({
        // isStaffFatching: false,
        // isPilotsFatching: false,
        isLoading: { staff: false, pilot: false, department: false },
        staff: {} as Record<string, UserItem>,
        pilots: {} as Record<string, PilotItem>,
        departments: [] as DepartmenItem[],
        self: {} as UserItem,
        token: '' as string,
        nameToUserId: {} as Record<string, string>,
    }),
    getters: {
        staffByName: (state): Record<string, UserItem> => {
            const userObj = state.staff;
            const nameToUserId = {}
            for (let userId in userObj) {
                const name = userObj[userId].name;
                nameToUserId[name] = userObj[userId];
            }
            return nameToUserId;
        },
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
        departmentSubIds: function (state) {
            return function (targetName: string): (string | number)[] {
                const result: (string | number)[] = [];

                // 深度优先遍历收集所有子孙ID
                const collectAllChildren = (node: ListNode) => {
                    result.push(node.id);
                    node.children?.forEach(child => collectAllChildren(child));
                };
                // 遍历树查找目标节点
                const traverse = (nodes: ListNode[]) => {
                    nodes.forEach(node => {
                        if (node.name === targetName) {
                            collectAllChildren(node);
                        }
                        if (node.children) {
                            traverse(node.children);
                        }
                    });
                };

                traverse(this.departmentsTree);
                return [...new Set(result)]; // 去重处理
            };
        },
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
        getToken(token?: string) {
            if (token) {
                this.token = token;
            }
            return this.token;
        },
        async getMyself(refresh = false) {
            // if (refresh) {
            const mySelf = await api(CONFIG.url.init) as UserItem;
            if (mySelf?.id) {
                this.self = mySelf;
            }
            // }
            return this.self;
        },
        async getStaff(): Promise<Record<string, UserItem>> {
            if (this.isLoading.staff) return
            this.isStaffFatching = true;
            if (!Object.keys(this.staff).length) {
                const res = await api(CONFIG.url.staff) as UserItem[];
                const obj = {}
                if (res.length) {
                    for (let user of res) {
                        obj[user.userId] = user
                    }
                }
                this.isStaffFatching = false;
                this.staff = obj;
            }
        },
        async getPilots(): Promise<Record<string, PilotItem>> {
            if (this.isLoading.pilot) return;
            if (!Object.keys(this.pilot).length) {
                const res = await api(CONFIG.url.pilots) as Record<string, PilotItem>;
                this.isPilotsFatching = false;
                this.pilots = Object.keys(res).length ? res : {};
            }
        },
        async getDepartments() {
            if (this.isLoading.department) return;
            if (!this.departments.length) {
                const res = await api(CONFIG.url.departments) as Record<string, UserItem>;
                this.departments = res.length ? res : [];
            }
        },

    }
})