<template>
    <div class="staff-section">
        <div class="title">可排班人员</div>
        <div class="staff-list">
            <div v-for="(staff, index) in mateUsers" :key="staff.userId" class="staff-item"
                @touchstart="handleTouchStart(index)" @touchmove="handleTouchMove"
                @touchend="handleTouchEnd">
                <press-tag type="primary" size="large">
                    {{ staff.name }}
                </press-tag>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/store/user.store';
import { useDepartmentStore } from '@/store/department.store';
import { getMateUsers } from '@/utils/user';

import type { UserItem } from '@/interface/user.interface';

const props = defineProps<{ staffList: UserItem[] }>();
const emit = defineEmits(['update:staff-list']);

// 触摸相关状态
const touchStartIndex = ref<number | null>(null);
const touchTargetIndex = ref<number | null>(null);
const isDragging = ref(false);

// 移动端触摸事件
const handleTouchStart = (index: number) => {
    touchStartIndex.value = index;
    isDragging.value = true;
};

const handleTouchMove = (e: any) => {
    if (touchStartIndex.value === null) return;

    // 阻止页面滚动
    e.preventDefault();

    // 简单交换逻辑 - 微信小程序环境下无法使用DOM API
    const touch = e.touches[0];
    const currentY = touch.clientY;
    
    // 根据移动方向判断交换位置
    if (currentY > 0 && touchStartIndex.value < mateUsers.value.length - 1) {
        touchTargetIndex.value = touchStartIndex.value + 1;
        handleItemSwap(touchStartIndex.value, touchTargetIndex.value);
        touchStartIndex.value = touchTargetIndex.value;
    } else if (currentY < 0 && touchStartIndex.value > 0) {
        touchTargetIndex.value = touchStartIndex.value - 1;
        handleItemSwap(touchStartIndex.value, touchTargetIndex.value);
        touchStartIndex.value = touchTargetIndex.value;
    }
};

const handleTouchEnd = () => {
    if (touchStartIndex.value !== null && touchTargetIndex.value !== null) {
        handleItemSwap(touchStartIndex.value, touchTargetIndex.value);
    }
    touchStartIndex.value = null;
    touchTargetIndex.value = null;
    isDragging.value = false;
};

// 通用交换函数
const handleItemSwap = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newList = [...props.staffList];
    const draggedItem = newList[fromIndex];
    newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, draggedItem);

    emit('update:staff-list', newList);
};

// 获取用户和部门store
const userStore = useUserStore();
const departmentStore = useDepartmentStore();

const mateUsers = ref<UserItem[]>([]);

// 监听相关数据变化并更新mateUsers
watch(() => [userStore.selfObj, userStore.staffObj, departmentStore.list], async () => {
    console.log('beichufa');
    mateUsers.value = await getMateUsers();
}, { immediate: true });

onMounted(() => { });
</script>

<style scoped lang="less">
.staff-section {
    margin-bottom: 24px;

    .title {
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: bold;
    }

    .staff-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .staff-item {
        cursor: move;
        user-select: none; // 防止拖拽时选择文本

        // 添加拖拽时的视觉反馈
        &.dragging {
            opacity: 0.5;
        }

        // 添加过渡动画
        transition: transform 0.2s ease;
    }
}
</style>
