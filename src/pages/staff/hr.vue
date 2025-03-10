<template>
    <div class="hr-summary">
        <div class="total">
            <i class="icon zl-icon-person" />
            <div class="text">
                {{ stat.all }}人
            </div>
        </div>
        <div class="detail">
            <div class="section" @click="showDetail('fx')">
                <div class="title">飞行</div>
                <div class="value">{{ stat.fx + stat.fg }}</div>
                <div class="unit">人</div>
            </div>
            <div class="section" @click="showDetail('wx')">
                <div class="title">维修</div>
                <div class="value">{{ stat.wx }}</div>
                <div class="unit">人</div>
            </div>
            <div class="section" @click="showDetail('yk')">
                <div class="title">运控</div>
                <div class="value">{{ stat.yk }}</div>
                <div class="unit">人</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import useUserStore from '@/store/user.store';
// import { collectDescendantIds } from '@/utils/tools';
const store = useUserStore();
const stat = computed(() => {
    const staff = store.staff;
    const temp = { all: 0, wx: 0, fx: 0, fg: 0, yk: 0 };
    const ids = {}
    const map = { wx: '维修工程部', fx: '飞行部', fg: '飞行技术管理部', yk: '运行控制部' }
    for (let key in map) {
        ids[key] = store.departmentSubIds(map[key]);
    }
    for (let userId in staff) {
        const user = staff[userId];
        for (let key in map) {
            if (ids[key].includes(+user.department)) {
                temp[key]++;
            }
        }
        if (user.status < 1) {
            temp.all++;
        }
    }
    return temp;
})
function showDetail(type: string) {
    if (type === 'wx') {
        uni.showToast({ title: `维修${stat.value.wx}`, icon: 'none', mask: true, duration: 2000 });
    } else if (type === 'fx') {
        uni.showToast({ title: `飞行:${stat.value.fx},飞管:${stat.value.fg}`, icon: 'none', mask: true, duration: 2000 });
    } else if (type === 'yk') {
        uni.showToast({ title: `运控:${stat.value.yk}`, icon: 'none', mask: true, duration: 2000 });
    }
}
onMounted(() => {
    store.getDepartments()
    store.getStaff()
})
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.hr-summary {
    display: flex;
    align-items: stretch;
    background: #fff;


    .total {
        flex: 0 0 35%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-right: 2px;

        .icon {
            color: @color-staff-hr-text;
            font-size: 34px;
            margin-bottom: 2px;
        }

        .text {
            color: @color-staff-hr-text;
            font-size: .9rem;
            margin-top: -5px;
            white-space: nowrap;
        }
    }

    .detail {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 2px;

        .section {
            display: flex;
            align-items: center;
            padding: 0 4px;
            margin: 0;
            border-bottom: dashed 1px @color-staff-hr-border;

            &:last-child {
                border-bottom: 0;
            }

            .title {
                color: @color-staff-hr-text;
                font-size: 0.95rem;
                white-space: nowrap;
                // min-width: 2em; // 保证至少显示2个汉字
            }

            .value {
                flex: 1;
                color: @color-staff-hr-value;
                font-weight: bold;
                text-align: center;
            }

            .unit {
                color: @color-staff-hr-unit;
                font-size: 0.85rem;
            }
        }
    }
}
</style>
