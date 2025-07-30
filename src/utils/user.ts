// utils/duty.utils.ts
import { useUserStore } from '@/store/user.store';
import { useDepartmentStore } from '@/store/department.store';
import type { UserItem } from '@/interface/user.interface';

const getMateUsers = async (): Promise<UserItem[]> => {
    const userStore = useUserStore();
    const departmentStore = useDepartmentStore();

    // 确保数据加载
    await Promise.all([
        userStore.fetchSelf(),
        userStore.fetchStaff(),
        departmentStore.fetchDepartments()
    ]);

    // 获取当前用户
    const currentUser = userStore.selfObj;
    if (!currentUser || !currentUser.department) {
        return [];
    }

    // 获取部门相关信息并筛选用户
    const ancestorIds = departmentStore.getAncestor(currentUser.department + '');
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