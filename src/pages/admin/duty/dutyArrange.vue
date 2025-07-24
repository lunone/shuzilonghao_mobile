<template>
  <div class="staff-section">
    <div class="title">可排班人员</div>
    <div class="staff-list">
      <div v-for="(staff, index) in staffList" :key="staff.userId" class="staff-item" 
        draggable="true" @dragstart="handleDragStart(index)" 
        @dragover.prevent="handleDragOver(index)" @drop="handleDrop(index)">
        <!-- <press-tag type="primary" size="large">
          {{ staff.name }}
        </press-tag> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"> 
import { ref } from 'vue';

import type { UserItem } from '@/interface/user.interface';

const props = defineProps<{
  staffList: UserItem[];
}>(); 

const emit = defineEmits(['update:staff-list']);

const dragItemIndex = ref<number | null>(null);

const handleDragStart = (index: number) => {
  dragItemIndex.value = index;
};

const handleDragOver = (index: number) => {
  if (dragItemIndex.value === null) return;
  if (dragItemIndex.value !== index) {
    const newList = [...props.staffList];
    const draggedItem = newList[dragItemIndex.value];
    newList.splice(dragItemIndex.value, 1);
    newList.splice(index, 0, draggedItem);
    dragItemIndex.value = index;
    emit('update:staff-list', newList);
  }
};

const handleDrop = (index: number) => {
  dragItemIndex.value = null;
};
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
  }
}
</style>
