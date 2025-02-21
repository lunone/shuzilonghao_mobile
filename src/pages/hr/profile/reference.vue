<template>
    <div class="reference-wrapper">
        <div class="kv id-number">
            <div class="key">身份证</div>
            <div class="value">{{ idCard }}</div>
        </div>
        <div class="kv address">
            <div class="key">地址</div>
            <div class="value">
                {{ district }}{{ address }}
            </div>
        </div>
        <div v-if="!contracts.length" class="no-contracts"> 无联系人信息 </div>
        <div v-else class="contracts">
            <div class="item">
                <div class="name"></div>
                <div class="mobile"></div>
            </div>
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
    contracts: { tyep: Array, default: [] },
});

</script>
<style lang="less" scoped>
@import '@/css/base.less';
@import "@/css/kv.less";

.reference-wrapper {
    .column;
    padding: 10px;
    
    .id-number,
    .address {
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 30rpx;
        align-items: start;
        .row;

        .value {
            white-space: normal;
        }


    }

    // 身份证特殊样式
    // .id-number {
    //     .value {
    //         font-family: monospace; // 等宽字体
    //         letter-spacing: 2rpx; // 增加可读性
    //     }
    // }

    // 地址样式优化
    // .address {
    //     .value {
    //         line-height: 1.6; // 增加行高
    //         font-size: 26rpx; // 稍小字号
    //     }
    // }
}
</style>