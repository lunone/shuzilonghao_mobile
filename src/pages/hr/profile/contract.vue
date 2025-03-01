<template>
    <div class="wrapper">
        <div class="item join-date">
            <div class="title">入职日期：</div>
            <div class="value">{{ joinDate }}</div>
        </div>
        <div class="item leave-date">
            <div class="title">离职日期：</div>
            <div class="value">{{ leaveDate }}</div>
        </div>
        <div class="item contract-expiry">
            <div class="title">合同到期：</div>
            <div class="value">{{ contractExpiry }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
const props = defineProps({
    userId: { type: String, default: '' },
    district: { type: String, default: '' },
    address: { type: String, default: '' },
    idCard: { type: String, default: '' },
    contracts: { type: Array, default: () => [] }, // 修正 tyep 为 type
});

// 示例数据
const joinDate = ref('2023-01-01');
const leaveDate = ref('2024-01-01');
const contractExpiry = ref('2024-12-31');
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.wrapper {

    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10rpx;
        border-bottom: 1rpx solid #e0e0e0;

        &:last-child {
            border-bottom: none;
        }

        .title {
            font-size: 28rpx;
            color: #666;
            text-align: left;
            flex: 1;
        }

        .value {
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
            text-align: right;
            flex: 1;
        }
    }
}
</style>