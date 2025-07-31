<template>
    <wd-popup v-model="localShow" position="bottom" closable custom-style="height: 60vh;" @close="handleClose">
        <!-- 部门筛选区 -->
        <view class="filter-container">
            <view class="filter-tabs">
                <view class="filter-tab all" :class="{ active: filterType === 'all' }"
                    @click="filterType = 'all'; activeDept = ''">
                    全部
                </view>
                <template v-if="!isSingle">
                    <view class="filter-tab selected" :class="{ active: filterType === 'selected' }"
                        @click="filterType = 'selected'">
                        已选择
                    </view>
                    <view class="filter-tab unselected" :class="{ active: filterType === 'unselected' }"
                        @click="filterType = 'unselected'">
                        未选择
                    </view>
                </template>
                <view v-for="dept in departmentOptions" :key="dept.value" class="filter-tab dept"
                    :class="{ active: activeDept === dept.value }" @click="activeDept = dept.value">
                    {{ dept.label }}
                </view>
            </view>
        </view>

        <!-- 员工列表区 -->
        <view class="staff-list" :style="{ height: '35vh' }">
            <view v-for="staff in filteredStaff" :key="staff.value" class="staff-item" :class="{
                selected: staff.status, unselected: !staff.status, disabled: staff.disabled
            }" @click="toggleStaff(staff)">
                <div>{{ staff.label }}</div>
                <div>{{ staff.status ? '√' : '' }}</div>
            </view>
        </view>

        <!-- 确定按钮 -->
        <view v-if="!isSingle" class="confirm-btn-container">
            <wd-button type="primary" custom-style="width: 89%;" @click="handleConfirm">
                确定
            </wd-button>
        </view>
    </wd-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { UserItem } from '@/interface/user.interface';
import { useUserStore } from '@/store/user.store';
import { useDepartmentStore } from '@/store/department.store';

interface DutyItem {
    id: number;
    userId: string;
    start: number;
    end: number;
}

interface StaffItem {
    value: string;
    label: string;
    status: boolean;
    disabled: boolean;
    department: string;
}

const props = withDefaults(defineProps<{
    show: boolean;
    // selectedDate: Date | null;
    // dutyData: DutyItem[];
    // staffList: UserItem[];
    isSingle?: boolean;
}>(), {
    isSingle: true
});

const emit = defineEmits(['update:show', 'confirm']);
const localShow = ref(props.show);
const filterType = ref<'all' | 'selected' | 'unselected'>('all');
const activeDept = ref('');

watch(localShow, newVal => emit('update:show', newVal));
watch(() => props.show, newVal => localShow.value = newVal);

const userStore = useUserStore();
const departmentStore = useDepartmentStore();
const mateUsers = ref<UserItem[]>([]);

// 将 staffOptions 改为响应式引用
const staffOptions = ref<StaffItem[]>([]);

// 新增一个初始化函数
function initStaffOptions() {
    const result: StaffItem[] = [];

    for (const user of mateUsers.value) {
        const temp = {
            value: user.userId,
            label: user.name,
            status: false,
            disabled: false, // 默认不禁用
            department: user.department + ''
        };

        // 如果是单选模式，且当前用户已在 dutyData 中，则标记为已选中并禁用
        // && props.dutyData.some(item => item.userId === user.userId)
        if (props.isSingle) {
            temp.disabled = true;
            temp.status = true;
        }

        result.push(temp);
    }

    staffOptions.value = result;
}

// 在 mateUsers 更新时初始化 staffOptions
watch(mateUsers, () => {
    initStaffOptions();
}, { immediate: true });



// 筛选后的员工列表
const filteredStaff = computed(() => {
    let result = staffOptions.value;

    // 按状态筛选
    if (filterType.value === 'selected') {
        result = result.filter(staff => staff.status);
    } else if (filterType.value === 'unselected') {
        result = result.filter(staff => !staff.status);
    }

    // 按部门筛选（当有选中部门时）
    if (activeDept.value) {
        result = result.filter(staff => staff.department === activeDept.value);
    }

    return result;
});

// 切换员工选中状态
function toggleStaff(staff: StaffItem) {
    // 如果是禁用状态，不能切换
    if (staff.disabled) return;

    staff.status = !staff.status;

    if (props.isSingle) {
        // 单选模式下，取消其他所有选项的选中状态
        staffOptions.value.forEach(item => {
            // console.log(item.label, item.label, item.status)
            if (item !== staff) {
                item.status = false;
            }
        });
    }
    emit('confirm', staff.value);
}

// 多选模式确认
function handleConfirm() {
    const selectedStaff = staffOptions.value.filter(staff => staff.status);
    if (selectedStaff.length === 0) return;

    emit('confirm', {
        // timestamp,
        userIds: selectedStaff.map(staff => staff.value)
    });

    localShow.value = false;
}

// 原有store和mateUsers逻辑
watch(() => [userStore.selfObj, userStore.staffObj, departmentStore.list], updateMateUsers, { immediate: true });

function updateMateUsers() {
    const currentUser = userStore.selfObj;
    if (!currentUser || !currentUser.department) {
        mateUsers.value = [];
        return;
    }

    const ancestorIds = departmentStore.getAncestor(currentUser.department + '');
    if (!ancestorIds.length) {
        mateUsers.value = [];
        return;
    }

    const ancestorId = ancestorIds[2];
    const subIds = departmentStore.getSubIdsById(ancestorId);
    const allUsers = Object.values(userStore.staffObj);
    mateUsers.value = allUsers.filter(user =>
        user.department && subIds.includes(+user.department)
    );
}

const departmentOptions = computed(() => {
    const depts = new Set<string>();
    mateUsers.value.forEach(user => depts.add(user.department + ''));

    return Array.from(depts).map(deptId => ({
        value: deptId,
        label: departmentStore.list.find(d => d.id === +deptId)?.name || '未知部门'
    }));
});

function handleClose() {
    localShow.value = false;
}
</script>

<style lang="less" scoped>
// 选中状态颜色
@selected-color: #409eff;
@selected-bg-color: #e6f7ff;
// 未选中状态颜色
@unselected-color: #666;
@unselected-bg-color: #fafafa;

.filter-container {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;

    .filter-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .filter-tab {
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            background-color: #f0f0f0;

            &.selected {
                background-color: @selected-bg-color;
                color: @selected-color;
            }

            &.unselected {
                background-color: @unselected-bg-color;
                color: @unselected-color;
            }

            &.active {
                font-weight: bold;
            }
        }
    }
}

.staff-list {
    padding: 0 16px;
    overflow: hidden;

    .staff-item {
        display: flex;
        flex-direction: row;
        padding: 6px 10px;
        border-radius: 4px;
        float: left;
        margin: 0 8px 8px 0;
        max-width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.selected {
            background-color: @selected-bg-color;
            color: @selected-color;
        }

        &.unselected {
            background-color: @unselected-bg-color;
            color: @unselected-color;
        }
    }
}

.confirm-btn-container {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
}
</style>
