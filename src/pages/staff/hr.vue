<template>
    <view class="hr-summary">
        <view class="total">
            <i class="icon zl-icon-person" />
            <view class="text">
                {{ stat.all }}人
            </view>
        </view>
        <view class="detail">
            <view class="section">
                <view class="title">飞行</view>
                <view class="value">{{ stat.fx }}</view>
                <view class="unit">人</view>
            </view>
            <view class="section">
                <view class="title">维修</view>
                <view class="value">{{ stat.wx }}</view>
                <view class="unit">人</view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import useUserStore from '@/store/user.store';
import { collectDescendantIds, convertToTree } from '@/utils/tools';
const store = useUserStore();
const stat = ref({ all: 0, wx: 0, fx: 0 })
watch([() => store.departments, () => store.staff], () => {
    const dept = store.departments;
    const staff = store.staff;
    const tree = convertToTree(dept);
    // 找到tree[0].children里面名字叫做维修工程部的id,且他的子孙辈节点的所有id,汇总成一个数组
    const wxIds = collectDescendantIds(tree, '维修工程部');
    const fgIds = collectDescendantIds(tree, '飞行技术管理部');
    const fxIds = collectDescendantIds(tree, '飞行部');
    const temp = { all: 0, wx: 0, fx: 0 };
    for (let userId in staff) {
        const user = staff[userId];
        if (wxIds.includes(+user.department)) {
            temp.wx++;
        }
        if (fgIds.includes(+user.department) || fxIds.includes(+user.department)) {
            temp.fx++;
        }
        if (user.status < 1) {
            temp.all++;
        }
    }
    stat.value = temp;
    console.log('统计', staff, tree, temp);
})

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
            color: #085E7B;
            font-size: 34px;
            margin-bottom: 2px;
        }

        .text {
            color: #085E7B;
            font-size: .9rem;
            font-weight: 500;
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
            padding: 4px;
            margin: 2px 0 0 0;
            border-bottom: dashed 1px #dfdfdf;

            &:last-child {
                border-bottom: 0;
            }

            .title {
                color: #1B4C5C;
                font-size: 0.95rem;
                white-space: nowrap;
                // min-width: 2em; // 保证至少显示2个汉字
            }

            .value {
                color: #C52305;
                font-weight: bold;
                flex: 1;
                text-align: center;
            }

            .unit {
                color: #945F28;
                font-size: 0.85rem;
            }
        }
    }
}
</style>
