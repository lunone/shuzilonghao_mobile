# Duty Watch & Duty User 页面合并项目交接文档

## 1. 项目目标

本项目旨在将功能重叠的 `src/pages/staff/dutyWatch.vue` 和 `src/pages/staff/dutyUser.vue` 两个页面合并为一个统一的、功能增强的值班视图页面。新的页面以 `dutyWatch.vue` 为基础进行扩展。

## 2. 核心需求

1.  **保留 `dutyWatch` 基础**：保留原有的周/月视图日历和日期切换功能。
2.  **整合 `dutyUser` 功能**：将 `dutyUser` 页面的交接日志（`dutyNote`）列表功能集成到新页面的下半部分。
3.  **区分人员显示**：
    *   值班信息区分“本组值班”和“其他组值班”。
    *   日历上方的区域只显示“其他组”的值班人员。
    *   “本组值班”人员信息显示在日历下方、日志列表上方。
4.  **日志功能调整**：
    *   原有的“新增日志”页面跳转功能，改为在当前页面弹出一个模态窗口来提交日志。
    *   为每条日志增加“删除”功能。
5.  **UI/UX 优化**：
    *   在本组值班和日志列表之间用一条虚线隔开。
    *   如果当天值班人员包含当前登录用户，在日历的对应日期下方显示一个小圆点标记。

## 3. 已知信息与后端API

根据用户提供的信息，以下是本项目所需的全部后端API，均已实现：

| 功能 | 请求地址 | 请求参数 | 状态 |
| :--- | :--- | :--- | :--- |
| 获取时段内所有排班 | `/duty/all` | `{ startDate: string, endDate: string }` | ✅ 已实现 |
| 获取所有值班组列表 | `/duty/group/list` | (无) | ✅ 已实现 |
| 获取当前用户权限组 | `/duty/groups` | (无) | ✅ 已实现 |
| 获取指定组交接日志 | `/duty/note/list`| `{ startDate: string, endDate: string, groupId: number }` | ✅ 已实现 |
| 创建交接日志 | `/duty/note/create` | `{ scheduleDate: string, content: string, level: number, groupId: number }` | ✅ 已实现 |
| 更新交接日志 | `/duty/note/update` | `{ id: number, content: string, level: number }` | ✅ 已实现 |
| 删除交接日志 | `/duty/note/delete` | `{ id: number }` | ✅ 已实现 |

## 4. 项目进度

### 已完成的任务 ✅

1.  **API层与状态管理更新**：
    *   在 `src/api/duty.api.ts` 中添加了 `createDutyNote` 和 `deleteDutyNote` 的接口函数。
    *   在 `src/store/duty.store.ts` 中添加了相应的 `addDutyNote` 和 `removeDutyNote` actions 来管理状态。

2.  **数据加载逻辑增强**：
    *   在 `dutyWatch.vue` 的 `onMounted` 中添加了 `fetchUserDutyGroups` 的调用。
    *   添加了 `watch` 监听器，用于在日期或用户组变化时自动获取交接日志。

3.  **重构值班人员显示**：
    *   在 `dutyWatch.vue` 中，已将值班人员的显示逻辑拆分为 `userGroupDuties` 和 `otherGroupDuties`。
    *   模板（template）已更新，以分别渲染“本组值班”和“其他组值班”两个区块。

4.  **集成带删除功能的日志列表**：
    *   日志列表的时间线视图已添加到 `dutyWatch.vue` 模板中。
    *   每条日志的删除按钮及其确认对话框和调用 `store` action 的逻辑已实现。

5.  **实现“添加日志”弹窗**：
    *   “添加日志”的模态弹窗UI及其相关的表单元素（日志级别、内容输入框）已添加到 `dutyWatch.vue`。
    *   控制弹窗显示/隐藏、收集用户输入以及调用 `store` action 提交新日志的逻辑已实现。

### 未完成/存在问题的任务 ⚠️

1.  **一个持续存在的关键BUG**：
    *   **问题描述**：在 `src/pages/staff/dutyWatch.vue` 文件中，计算属性 `userGroupId` 的实现存在一个持续的类型错误。
    *   **错误代码**：`const userGroupId = computed(() => dutyStore.userDutyGroups?.id);`
    *   **错误原因**：`dutyStore.userDutyGroups` 是一个数组（`UserDutyGroup[]`），而不是一个对象。因此，不能直接访问 `.id` 属性。
    *   **正确实现应为**：`const userGroupId = computed(() => dutyStore.userDutyGroups[0]?.id);` （假设一个用户只属于一个值班组，取第一个即可）。
    *   **当前状态**：尽管多次尝试修复，但由于未知的文件写入问题或操作失误，此错误**仍未被成功修正**，导致所有依赖此计算属性的功能（如日志加载、日志提交、人员分组）都无法正常工作。**这是接手后需要解决的首要问题。**

2.  **实现当前用户值班标记** (未开始)：
    *   需要在日历的 `day-cell` 中添加逻辑，检查当天的值班人员列表 (`day.users`) 是否包含当前登录用户的ID。如果包含，则显示一个小圆点。

3.  **代码清理** (未开始)：
    *   在所有功能稳定运行后，需要删除 `src/pages/staff/dutyUser.vue` 文件。
    *   从 `src/pages.json` 中移除 `dutyUser` 页面的路由配置。

## 5. 交接建议

1.  **首要任务**：请立即修正 `src/pages/staff/dutyWatch.vue` 中关于 `userGroupId` 的类型错误。这是解锁后续所有功能的前提。
2.  在修复BUG后，请全面测试已实现的功能，包括：人员分组显示是否正确、日志列表是否按日期筛选、删除日志功能是否正常、添加日志弹窗能否成功提交。
3.  继续完成剩余的两个任务：日历标记和代码清理。

对于我工作中出现的失误，我再次表示诚挚的歉意。希望这份文档能帮助下一位开发者顺利完成项目。