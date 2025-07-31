<template>
    <div class="staff-section">
        <div class="title">可排班人员</div>
        <DragList 
            :items="staffList" 
            item-key="userId" 
            :columns="6"
            :item-size="70"
            :item-gap="10"
            @update:items="staffList = $event"
        >
            <!-- <template #icon="{ item }">
                <div style="padding: 8px 12px; background-color: #409eff; color: white; border-radius: 4px; font-size: 14px;">
                    {{ item.name }}
                </div>
            </template> -->
        </DragList>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserStore } from '@/store/user.store';
import { useDepartmentStore } from '@/store/department.store';
import { getMateUsers } from '@/utils/user';
import DragList from '@/components/zl/drag.vue';
import type { UserItem } from '@/interface/user.interface';

const staffList = ref<UserItem[]>([]);

// 获取用户和部门store
const userStore = useUserStore();
const departmentStore = useDepartmentStore();

watch(() => [userStore.selfObj, userStore.staffObj, departmentStore.list], async () => {
    staffList.value = await getMateUsers();
}, { immediate: true });
</script>

<style scoped lang="less">
.staff-section {
    margin-bottom: 24px;

    .title {
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: bold;
    }
}
</style>