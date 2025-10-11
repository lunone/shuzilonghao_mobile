<template>
    <div class="staff-section">
        <div class="title">
            <span>值班人员</span>
            <span class="action" @click="modify">修改</span>
        </div>
        <DragList :items="staffList" item-key="userId" @update:items="staffList = $event" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserStore } from '@/store/user.store';
import { useDepartmentStore } from '@/store/department.store';
import { getMateUsers } from '@/utils/user';
import DragList from '@/components/zl/drag.vue';
import type { UserItem } from '@/api/user.api';

const staffList = ref<UserItem[]>([]);

const emit = defineEmits(['modify']);
function modify() {
    emit('modify');
}

</script>

<style scoped lang="less">
.staff-section {
    margin-bottom: 24px;

    .title {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: bold;

        .action {
            margin-left: 12px;
            color: #007aff;
            font-size: 14px;
            cursor: pointer;
            font-weight: normal;

            &:hover {
                color: #0056cc;
                text-decoration: underline;
            }

            &:active {
                color: #004499;
            }
        }
    }
}
</style>