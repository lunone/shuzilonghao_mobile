// utils/duty.utils.ts
import { useUserStore } from '@/store/user.store';
import { useDepartmentStore } from '@/store/department.store';
import type { UserItem } from '@/api/user.api';

const getMateUsers = async (): Promise<UserItem[]> => {
    const userStore = useUserStore();
    const departmentStore = useDepartmentStore();

    // 确保数据加载
    await Promise.all([
        userStore.fetchMe(),
        userStore.fetchStaff(),
        departmentStore.fetchDepartments()
    ]);

    if (!userStore.me?.id || !userStore.me?.department || !departmentStore.list.length || !userStore.staff.length) {
        // console.log('尚缺条件', userStore.selfObj, departmentStore.list.length, userStore.staff)
        return []
    }

    // 获取部门相关信息并筛选用户
    const ancestorIds = departmentStore.getAncestor(userStore.me.department + '');
    if (!ancestorIds.length) {
        return [];
    }

    const ancestorId = ancestorIds[2];
    const subIds = departmentStore.getSubIdsById(ancestorId);

    const allUsers = Object.values(userStore.staffObj);
    return allUsers.filter(user =>
        user.department && subIds.includes(+user.department)
    );
};

export { getMateUsers }