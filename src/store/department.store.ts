import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api'; // 导入API工具函数
import CONFIG from '@/config'; // 导入配置文件
import { DepartmenItem, ListNode } from '@/interface'; // 导入接口定义

// 定义部门存储模块
export const useDepartmentStore = defineStore('department', () => {
    // 加载状态
    const isLoading = { department: false };

    // 部门列表，使用ref进行响应式管理
    const departments = ref<DepartmenItem[]>([]);

    // 创建部门ID到部门对象的映射
    const getDeptMap = computed(() => new Map(departments.value.map(dept => [dept.id, dept])));

    // 创建父ID到子部门列表的映射
    const getChildMap = computed(() => {
        const map = new Map<string | number, DepartmenItem[]>();
        departments.value.forEach(dept => {
            const parentKey = dept.parentId ?? 'root'; // 如果没有parentId则设为'root'
            if (!map.has(parentKey)) map.set(parentKey, []);
            map.get(parentKey)!.push(dept);
        });
        return map;
    });

    // 构建部门树结构
    const tree = computed(() => {
        const tree: ListNode[] = [];
        const childMap = getChildMap.value;
        // 递归构建树节点
        const buildTree = (node: DepartmenItem, parentArray: ListNode[]) => {
            const treeNode = { ...node, children: [] };
            parentArray.push(treeNode);
            (childMap.get(node.id) || []).forEach(child => buildTree(child, treeNode.children));
        };

        // 从根节点开始构建树
        (childMap.get('root') || []).forEach(root => buildTree(root, tree));
        return tree;
    });

    // 获取目标名称的所有子部门ID
    const getSubIds = computed(() => (targetName: string): (string | number)[] => {
        // const deptMap = getDeptMap.value;
        const childMap = getChildMap.value;
        const result = new Set<string | number>();
        const queue: (string | number)[] = [];

        // 将匹配的目标名称部门ID加入队列
        departments.value
            .filter(dept => dept.name === targetName)
            .forEach(dept => queue.push(dept.id));

        // 广度优先搜索获取所有子部门ID
        while (queue.length > 0) {
            const currentId = queue.shift()!;
            result.add(currentId);
            (childMap.get(currentId) || []).forEach(child => {
                if (!result.has(child.id)) queue.push(child.id);
            });
        }

        return Array.from(result);
    });

    // 获取目标ID的路径
    const getPath = computed(() => (targetId: string | number, str: string = '/'): string => {
        if (!targetId) return '';
        const deptMap = getDeptMap.value;
        const path: string[] = [];
        let currentId: string | number | undefined = targetId;
        const visited = new Set<string | number>();

        // 追溯部门路径
        while (currentId && deptMap.has(currentId as number)) {
            if (visited.has(currentId)) break; // 防止循环引用
            visited.add(currentId);

            const currentDept = deptMap.get(currentId as number)!;
            path.unshift(currentDept.name); // 将当前部门名添加到路径开头
            currentId = currentDept.parentId; // 移动到父部门
        }

        return path.slice(1).join(str); // 返回路径字符串
    });

    // 异步获取部门数据
    const fetchDepartments = async () => {
        if (isLoading.department) return; // 如果正在加载则直接返回
        isLoading.department = true; // 标记为正在加载

        if (!departments.value.length) {
            const res = await api(CONFIG.url.departments) as DepartmenItem[];
            departments.value = res.length ? res : []; // 更新部门列表
        }

        isLoading.department = false; // 加载完成
    };

    // 返回公共方法和属性
    return {
        list: computed(() => departments.value),
        tree,
        getSubIds,
        getPath,
        fetchDepartments,
    };
});