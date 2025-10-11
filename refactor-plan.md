# 重构计划：权限系统现代化

## 目标

将项目的权限管理逻辑完全内聚到 `user.store.ts` 中，移除过时的 `utils/permission.ts`，并以 `initUser` 接口返回的树形权限为唯一数据源。

---

## 第一步：更新 API 类型定义

**文件**: `src/api/permission.api.ts`

**操作**: 在文件末尾（或任何合适的类型定义区域）**添加** `PermissionTree` 接口。

```typescript
// src/api/permission.api.ts

// ... (文件现有内容)

// ADD: 在文件末尾添加以下接口定义
export interface PermissionTree {
  id: number;
  code: string;
  name: string;
  type: 'API' | 'MENU' | 'ROUTE' | 'BUTTON' | 'PAGE';
  parentId?: number;
  path: string | null;
  method: string | null;
  component: string | null;
  icon: string | null;
  description: string | null;
  orderNum: number;
  meta: Record<string, any> | null;
  extra: Record<string, any> | null;
  enabled: boolean;
  children?: PermissionTree[];
}
```

**文件**: `src/api/user.api.ts`

**操作**: **修改** `UserInitResponse` 接口，使其使用我们刚刚定义的 `PermissionTree` 类型。

```typescript
// src/api/user.api.ts

import { PermissionTree } from './permission.api'; // <--- ADD THIS IMPORT

// ...

// REPLACE: 找到 UserInitResponse 接口
interface UserInitResponse {
  user: UserItem;
  permissionTree: any[]; // <--- THIS LINE
}
// WITH:
interface UserInitResponse {
  user: UserItem;
  permissionTree: PermissionTree[]; // <--- BECOMES THIS
}
```

---

## 第二步：重构 `user.store.ts`

**文件**: `src/store/user.store.ts`

**操作**: **用以下完整代码替换整个文件的内容**。这将完成核心的逻辑重构。

```typescript
// src/store/user.store.ts (New Content)

import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import { initUser, getStaffList } from '@/api/user.api';
import type { UserItem } from '@/api/user.api';
import type { UserPermission, PermissionTree } from '@/api/permission.api';
import { ROLE_CODES } from '@/api/permission.api';

export const useUserStore = defineStore('user', () => {
    // --- STATE ---
    const isLoading = { staff: false, self: false };
    const staff = ref<Record<string, UserItem>>({});
    const self = ref({}) as Ref<UserItem>;
    const token = ref('');
    const userPermissions = ref<UserPermission | null>(null);

    // --- GETTERS ---
    const staffObj = computed(() => staff.value);
    const permissions = computed(() => userPermissions.value);

    // --- ACTIONS ---

    /**
     * 递归扁平化权限树，提取所有权限代码
     */
    const flattenPermissionTree = (tree: PermissionTree[]): string[] => {
        let codes: string[] = [];
        for (const node of tree) {
            if (node.code) {
                codes.push(node.code);
            }
            if (node.children && node.children.length > 0) {
                codes = codes.concat(flattenPermissionTree(node.children));
            }
        }
        return codes;
    };

    const setToken = (newToken?: string) => {
        if (newToken) {
            token.value = newToken;
        }
    };

    /**
     * 获取当前用户信息和权限，内置防止并发请求的逻辑
     */
    const fetchSelf = async (forceRefresh = false) => {
        // 如果已存在用户信息且不强制刷新，则直接返回
        if (self.value?.id && !forceRefresh) {
            return self.value;
        }
        // 如果正在请求中，则直接返回
        if (isLoading.self) {
            return;
        }

        try {
            isLoading.self = true;
            const response = await initUser();
            const { user, permissionTree } = response;

            if (user?.id) {
                self.value = user;

                // 处理权限
                const flattenedPermissions = flattenPermissionTree(permissionTree);
                userPermissions.value = {
                    roles: user.roles || [],
                    permissions: flattenedPermissions,
                };
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
            // 清理状态
            self.value = {} as UserItem;
            userPermissions.value = null;
        } finally {
            isLoading.self = false;
        }
        return self.value;
    };

    const fetchStaff = async () => {
        if (isLoading.staff) return;
        isLoading.staff = true;
        if (!Object.keys(staff.value).length) {
            const response = await getStaffList();
            const res = response as UserItem[];
            const obj: Record<string, UserItem> = {};
            if (res.length) {
                for (let user of res) {
                    obj[user.userId] = user;
                }
            }
            staff.value = obj;
        }
        isLoading.staff = false;
    };

    // --- PERMISSION CHECKERS ---

    const hasPermission = (permissionCode: string): boolean => {
        if (!userPermissions.value) return false;
        return userPermissions.value.permissions.includes(permissionCode);
    };

    const hasRole = (roleCode: string): boolean => {
        if (!userPermissions.value) return false;
        return userPermissions.value.roles.includes(roleCode);
    };

    const isAdmin = (): boolean => {
        return hasRole(ROLE_CODES.ADMIN);
    };

    // --- RETURN ---
    return {
        // State & Getters
        staffObj,
        token: computed(() => token.value),
        selfObj: computed(() => self.value),
        staff: computed(() => Object.values(staff.value)),
        staffRaw: staff,
        permissions,

        // Actions
        fetchSelf,
        fetchStaff,
        setToken,

        // Permission Checkers
        hasPermission,
        hasRole,
        isAdmin,
        // 可根据需要从旧的 utils/permission.ts 中迁移更多检查器 (isManager, isPilot, etc.)
    };
});
```

---

## 第三步：全局替换权限检查逻辑

**操作**: 在整个项目 (`src/` 目录下) 中进行搜索和替换。

1.  **搜索**: `import permission from '@/utils/permission';`
2.  **替换**:
    *   在找到的每个文件中，**删除**这一行。
    *   **添加** `import { useUserStore } from '@/store/user.store';`。
    *   在文件的 `<script setup>` 或 `setup()` 方法的顶层，**添加** `const userStore = useUserStore();`。
    *   将所有 `permission.hasPermission(...)` 替换为 `userStore.hasPermission(...)`。
    *   将所有 `permission.hasRole(...)` 替换为 `userStore.hasRole(...)`。
    *   将所有 `permission.isAdmin()` 替换为 `userStore.isAdmin()`。
    *   (以此类推，替换所有其他权限检查函数)。

---

## 第四步：删除过时文件

**操作**: 在完成第三步并确认所有引用都已更新后，**删除**以下文件：

*   `src/utils/permission.ts`

---

## 第五步：修复入口页面逻辑

**文件**: `src/pages/index.vue`

**操作**: **替换** 第 46 行的代码，以正确调用数据获取 action。

```diff
// src/pages/index.vue in onLoad hook

<<<<<<< SEARCH
:start_line:46
-------
        const res = await store.selfObj;
=======
        const res = await store.fetchSelf();
>>>>>>> REPLACE