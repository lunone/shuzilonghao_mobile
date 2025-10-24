<template>
    <view class="tab-bar">
        <view v-for="(item, index) in list" :key="index" class="tab-bar-item" :class="{ active: current === index }"
            @click="switchTab(item, index)">
            <text :class="item.iconClass" class="tab-icon"></text>
            <text class="tab-text">{{ item.text }}</text>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useTabBarStore } from '@/store/tab-bar.store'

const tabBarStore = useTabBarStore()
const { current, list, isSwitching } = storeToRefs(tabBarStore)

const switchTab = (item: any, index: number) => {
    // 如果已经在切换中，或者点击的是当前激活的tab，则直接返回
    if (isSwitching.value || current.value === index) {
        return
    }
    
    tabBarStore.setSwitching(true)
    tabBarStore.setCurrent(index)
    
    uni.switchTab({
        url: `/${item.pagePath}`,
        success: () => {
            tabBarStore.setSwitching(false)
        },
        fail: () => {
            tabBarStore.setSwitching(false)
            tabBarStore.syncCurrent()
        }
    })
}

onShow(() => {
    tabBarStore.syncCurrent()
})
</script>

<style lang="less" scoped>
@import '@/css/icon.less';

.tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background: #ffffff;
    display: flex;
    border-top: 1rpx solid #e5e5e5;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 999;

    .tab-bar-item {
        flex: 1;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 10rpx 0;

        .tab-icon {
            font-size: 40rpx;
            margin-bottom: 6rpx;
            color: #7A7E83;
        }

        .tab-text {
            font-size: 24rpx;
            color: #7A7E83;
            font-weight: 500;
        }

        &.active {
            .tab-icon {
                color: #3cc51f;
            }

            .tab-text {
                color: #3cc51f;
                font-weight: bold;
            }
        }
    }
}
</style>