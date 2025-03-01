import { ListNode, TreeNode } from "@/interface";

export const call = (phoneNumber: string) => {
    uni.makePhoneCall({ phoneNumber });
};


/**
 * 获取部门路径字符串
 * 该函数通过部门ID列表构建部门路径，用于直观展示部门的层级关系
 * 
 * @param departments 部门列表，每个部门包含ID和父ID，形成树状结构
 * @param targetId 目标部门的ID，函数将构建该部门的路径
 * @param str 用于连接部门名称的字符串，默认为 '/'
 * @returns 返回构建的部门路径字符串
 */
export const getDepartmentPath = (departments: ListNode[], targetId: string | number, str: string = '/'): string => {
    // 创建哈希映射提升查询效率
    const deptMap = new Map<string | number, ListNode>();
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

/**
 * 将扁平的部门列表转换为树形结构
 * 
 * @param departments 部门列表，每个部门包含ID、名称和父ID
 * @returns 树形结构的部门数组
 */
export const convertToTree = (departments: ListNode[]): ListNode[] => {
    const deptMap = new Map<string | number, ListNode>();
    const tree: ListNode[] = [];

    // 初始化deptMap
    departments.forEach(dept => {
        dept.children = []; // 初始化子节点数组
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
};
/**
 * 递归收集指定名称节点及其所有子孙节点的ID
 * 
 * @param tree 树形结构的部门数组
 * @param targetName 目标部门名称
 * @returns 包含目标部门及其所有子孙节点ID的数组
 */
export const collectDescendantIds = (tree: ListNode[], targetName: string): (string | number)[] => {
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

    traverse(tree);
    return [...new Set(result)]; // 去重处理
};