<template>
    <view class="hr-summary">
        <view class="total">
            <!-- <van-icon class-prefix="zl-icon" name="person" class="icon" :size="40" /> -->
			<i class="icon zl-icon-person" />
            <view class="text">
                <view class="title">XX人</view>
                <!-- <view class="value"></view> -->
            </view>
        </view>
        <view class="detail">
            <view class="section" v-for="(item, index) in sections" :key="index">
                <!-- <van-icon class-prefix="zl-icon" :name="item.icon"  class="icon" /> -->
                <!-- <view class="text"> -->
                <!-- <span class="title">{{ acTypeShortTranslate[acType] || acType }} </span> -->
                <view class="title">{{ item.title }}</view>
                <view class="value">{{ item.value }}</view>
                <view class="unit">人</view>
                <!-- </view> -->
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const sections = ref([
    // { icon: 'person', title: '总人数', value: 'xx' },
    { icon: 'j5', title: '维修', value: 'xx' },
    { icon: 'pilot', title: '飞行', value: 'xx' }
]);
</script>

<style lang="less" scoped>
@import "@/base.less";

.hr-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .total {
        display: flex;
        align-items: center;
        flex-direction: column;

        .icon {
            size: 50px;
            color: #3f3f3f;
        }

        .text {

            .value,
            .unit {
                display: inline-block;
                vertical-align: middle;
            }



            .value {
                font-size: 1.1rem;
                color: #4a90e2;
            }

            .unit {
                color: #555;
            }
        }
    }

    .detail {
        display: flex;
        flex-direction: column;
        margin-left: 2rem;

        .section {
            display: flex;
            align-items: center;
            margin-right: 20px;

            display: flex;
            flex-direction: row;
            align-items: center;
            flex: 1;
            margin: 0 10px;

            .title {
                // font-weight: bold;
                color: #333;
            }

            .value {
                font-size: 1rem;
                color: #4a90e2;
            }

            .unit {
                color: @text-color;
            }
        }
    }
}
</style>
