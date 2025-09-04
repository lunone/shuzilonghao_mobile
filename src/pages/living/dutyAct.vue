<template>
    <div class="duty-container">
        <!-- 排班日历 -->
        <div class="calendar-wrapper">
            <calendar :staff-obj="userStore.staffObj" :dutyData="dutyData" @dayClick="handleDayClick"
                :disabled="loading.calendar" />
            <!-- Loading遮罩 -->
            <div v-if="loading.calendar" class="calendar-loading">
                <wd-loading type="outline" />
            </div>
        </div>

        <!-- 排班人员 -->
        <div class="staff-section">
            <div class="title">
                <span>值班人员</span>
                <span class="action" @click="handleModifyDuty" :class="{ disabled: loading.staff }">
                    修改
                </span>
            </div>

            <!-- 值班人员列表 -->
            <div class="staff-list-wrapper">
                <DragList :items="dutyUserIds" item-key="userId" @sort="handleSortChange" :disabled="loading.staff">
                    <template #="{ item }">
                        {{ userStore.staffObj[item]?.name }}
                    </template>
                </DragList>

                <!-- 值班人员列表 Loading 遮罩 -->
                <div v-if="loading.staff" class="staff-loading">
                    <wd-loading type="outline" />
                </div>
            </div>
        </div>

        <DutyDialog v-model:show="showDialog" :options="userOptions" :group="departmentOptions"
            :selected="selectedUserIds" :isSingle="isSingle" @confirm="handleConfirmSelection" />

        <div class="action-section">
            <press-button type="primary" @click="generateDuty"
                :disabled="hasCurrentMonthData || loading.calendar || loading.staff">
                生成本月排班
            </press-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue';
import dayjs from 'dayjs';
import { useUserStore } from '@/store/user.store';
import { useDepartmentStore } from '@/store/department.store';
import calendar from '@/pages/living/paiban/dutyCalendar.vue';
import DutyDialog from '@/pages/living/paiban/dutyDialog.vue';
import DragList from '@/components/zl/drag.vue';
import _ from 'lodash';

interface Option {
    value: string;
    label: string;
    status: boolean;
    disabled: boolean;
    meta?: any;
    department?: string;
}

interface Duty {
    id: number;
    userId: string;
    date: number;
}

// 数据状态
const userStore = useUserStore();
// 排班数据
const dutyData = ref<Duty[]>([]);
const loading = reactive({
    calendar: false,
    staff: false
});
const departmentStore = useDepartmentStore();

// 用户选项数据
const userOptions = ref<Option[]>([]);
const departmentOptions = ref<Option[]>([]);

// 值班人员相关
const dutyUserIds = ref<string[]>([]);     // 当前值班人员ID列表
const defaultUserIds: string[] = [];       // 默认用户ID
const selectedUserIds = ref<string[]>([]); // 当前选中的用户ID

// 对话框相关
const showDialog = ref(false);
const isSingle = ref(true);
const selectedDate = ref<Date | null>(null);
let currentAction = ''; // 当前操作类型 ('calendar' | 'sort')

// 日历点击处理
function handleDayClick(date: Date, userId: string) {
    currentAction = 'calendar';
    selectedUserIds.value = userId ? [userId] : [];
    selectedDate.value = date;
    isSingle.value = true;
    showDialog.value = true;
}

// 修改值班人员
function handleModifyDuty() {
    // 如果正在加载，则不执行操作
    if (loading.staff) return;

    currentAction = 'sort';
    selectedUserIds.value = dutyUserIds.value;
    isSingle.value = false;
    showDialog.value = true;
}

// 确认选择处理 - 调度函数
async function handleConfirmSelection(data: string[]) {
    if (currentAction === 'calendar') {
        console.log('5秒延迟')
        loading.calendar = true;
        // 更新已有排班 - 添加5秒延迟
        await new Promise(resolve => setTimeout(resolve, 5000));
        loading.calendar = false;
        console.log('5秒延迟后')
        handleCalendarSelection(data);
    } else if (currentAction === 'sort') {
        handleSortSelection(data);
    }
}

// 处理日历选择
function handleCalendarSelection(data: string[]) {
    if (!selectedDate.value || !data.length) return;

    loading.calendar = true;

    const date = selectedDate.value.getTime();
    const userId = data[0];

    // 查找是否已有该日期的排班
    const existingIndex = dutyData.value.findIndex(d => d.date === date);
    if (existingIndex >= 0) {
        dutyData.value[existingIndex].userId = userId;
    } else {
        // 新增排班
        const newId = dutyData.value.length > 0
            ? Math.max(...dutyData.value.map(d => d.id)) + 1
            : 1;
        dutyData.value.push({
            id: newId,
            userId,
            date
        });
    }

    loading.calendar = false;
}

// 处理值班人员列表修改
function handleSortSelection(data: string[]) {
    // 设置加载状态
    loading.staff = true;

    // 找出新增的人员（在新数据中但不在原数据中）
    const addedUsers = _.difference(data, dutyUserIds.value);

    // 找出被移除的人员（在原数据中但不在新数据中）
    const removedUsers = _.difference(dutyUserIds.value, data);

    // 如果有新增人员，添加到末尾
    // 如果有移除人员，从原数组中移除
    if (addedUsers.length > 0 || removedUsers.length > 0) {
        // 移除被删除的人员
        let updatedList = _.difference(dutyUserIds.value, removedUsers);
        // 添加新增的人员到末尾
        updatedList = [...updatedList, ...addedUsers];

        dutyUserIds.value = updatedList;
    } else {
        // 如果没有新增也没有移除，保持原有顺序但按新选择的顺序排列
        dutyUserIds.value = data;
    }

    // 取消加载状态
    loading.staff = false;
}

// 排序变化处理
function handleSortChange(data: string[]) {
    console.log('排序更新:', data);
}

// 检查当月是否有数据
const hasCurrentMonthData = computed(() => {
    const now = new Date();
    return false; // 根据实际业务逻辑实现
});

// 生成排班
function generateDuty() {
    console.log('生成本月排班');
}

// 监听用户和部门数据变化
watch(() => [userStore.selfObj, userStore.staffObj, departmentStore.list],
    () => {
        // 没有用户就返回空数组
        const currentUser = userStore.selfObj;
        if (!currentUser || !currentUser.department ||
            !Object.keys(userStore.staffObj).length || !departmentStore.list) {
            userOptions.value = [];
            departmentOptions.value = [];
            return;
        }

        // 没有部门数据也停止运算
        const ancestorIds = departmentStore.getAncestor(currentUser.department + '');
        if (!ancestorIds.length) {
            userOptions.value = [];
            departmentOptions.value = [];
            return;
        }

        // 计算子部门
        const ancestorId = ancestorIds[2];
        const subIds = departmentStore.getSubIdsById(ancestorId);
        departmentOptions.value = subIds.map(deptId => ({
            value: deptId + '',
            status: true,
            disabled: false,
            label: departmentStore.list.find(d => d.id === +deptId)?.name || '未知部门',
        }));

        // 子部门所有用户
        const allUsers = Object.values(userStore.staffObj).filter(user =>
            user.department && subIds.includes(+user.department)
        );

        const allOptions: Option[] = [];
        for (const user of allUsers) {
            let disabled = false, status = false;
            // 如果是单选模式，且当前用户已在 dutyData 中，则标记为已选中并禁用
            if (isSingle.value) {
                disabled = defaultUserIds[0] == user.userId;
            }
            // 如果用户在默认列表里面，则是选中状态
            if (defaultUserIds.indexOf(user.userId) !== -1) {
                status = true;
            }
            allOptions.push({
                value: user.userId,
                label: user.name,
                status,
                disabled,
                meta: user,
                department: user.department + ''
            });
        }
        userOptions.value = allOptions;
    },
    { immediate: true, deep: true }
);

onMounted(async () => {
    await userStore.fetchStaff();
    // loading.value = false;
    defaultUserIds.push('A00725', 'A00479');
    dutyUserIds.value = [...defaultUserIds];

    // 模拟排班数据
    await setTimeout(() => {
        dutyData.value = [
            { id: 1, userId: 'A00725', date: new Date(2025, 7, 28).getTime() },
            { id: 2, userId: 'A00732', date: new Date(2025, 7, 29).getTime() },
        ];
    }, 1e3);
});
</script>

<style scoped lang="less">
.calendar-wrapper {
    position: relative;
    margin-bottom: 24px;

    .calendar-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: var(--calendar-height, 500px);
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }
}

.staff-section {
    margin-bottom: 24px;

    .title {
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: bold;

        .action {
            cursor: pointer;

            &.disabled {
                color: #ccc;
                cursor: not-allowed;
            }
        }
    }

    .staff-list-wrapper {
        position: relative;

        .staff-loading {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }
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

.calendar-section {
    margin-bottom: 24px;

    .calendar {
        --calendar-height: 500px;

        /* 日期文字变小 */
        :deep(.van-calendar__day) {
            font-size: 12px;
        }

        /* bottomInfo字体变大且颜色加深 */
        :deep(.van-calendar__bottom-info) {
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }
    }
}

.action-section {
    display: flex;
    justify-content: center;
}
</style>