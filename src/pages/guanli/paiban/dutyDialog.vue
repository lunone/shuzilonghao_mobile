<template>
    <wd-popup v-model="show" position="bottom" closable custom-style="height: 60vh;">
        <!-- 筛选条件区 -->
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
        <view class="options">
            <view v-for="option in filteredOptions" :key="option.value" class="option" :class="{
                selected: option.status, unselected: !option.status, disabled: option.disabled
            }" @click="toggle(option)">
                <slot name="default" :item="option">
                    <div>{{ option.label }}</div>
                </slot>
                <div>{{ option.status ? '√' : '' }}</div>
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
import { useUserStore } from '@/store/user.store';
import { useDepartmentStore } from '@/store/department.store';
import _ from 'lodash';



interface Option {
    value: string;
    label: string;
    status: boolean;
    disabled: boolean;
    meta?: any;
    department?: string;
}
const props = withDefaults(defineProps<{
    show: boolean;
    options: Option[];
    selected: string[]
    isSingle?: boolean;
    group: Option[]
}>(), {
    isSingle: true
});

const emit = defineEmits(['update:show', 'confirm']);
// 可以合并为一个双向绑定的 watch
const show = computed({
    get: () => props.show,
    set: val => emit('update:show', val)
});
const filterType = ref<'all' | 'selected' | 'unselected'>('all');
const activeDept = ref('');
const departmentOptions = computed(() => {
    return props.group
})

// 筛选后的员工列表
const filteredOptions = computed(() => {
    // 按状态筛选
    if (filterType.value === 'selected') {
        return localOptions.value.filter(staff => staff.status);
    } else if (filterType.value === 'unselected') {
        return localOptions.value.filter(staff => !staff.status);
    }
    // 按部门筛选（当有选中部门时）
    if (activeDept.value) {
        return localOptions.value.filter(staff => staff.department === activeDept.value);
    }
    // 未筛选状态返回全部
    return localOptions.value;
});

// 提交数据
function handleConfirm() {
    const result = localOptions.value.filter(staff => staff.status).map(staff => staff.value)
    console.log(result, localOptions.value.filter(staff => staff.status))
    emit('confirm', result);
    show.value = false;
}
// 切换员工选中状态
function toggle(selectedOption: Option) {
    // 如果是禁用状态，不能切换
    if (selectedOption.disabled) return;
    // 状态置反
    selectedOption.status = !selectedOption.status;
    // 单选模式下，提交
    if (props.isSingle) {
        // 单选模式下，取消其他所有选项的选中状态
        localOptions.value.forEach(option => {
            if (option.value !== selectedOption.value) {
                option.status = false;
            }
        });
        handleConfirm()
    }
}

// 创建本地选项副本
const localOptions = ref<Option[]>([]);

// 监听 props.options 的变化
watch(() => props.options, (newOptions) => {
    localOptions.value = _.cloneDeep(newOptions); // 使用 lodash 深拷贝
    // 更新状态
    updateStatus();
}, { immediate: true, deep: true });

// 监听 selected 的变化
watch(() => props.selected, () => {
    updateStatus();
}, { immediate: true });

// 更新选项状态的函数
function updateStatus() {
    localOptions.value.forEach(option => {
        option.status = props.selected.includes(option.value);
    });
}

// 然后在模板和其他地方使用 localOptions 而不是 props.options

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

.options {
    padding: 0 16px;
    overflow: hidden;
    height: 35vh;

    .option {
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
