<template>
    <view class="tab-bar">
        <view v-for="(item, index) in tabList" :key="index" class="tab-bar-item" :class="{ active: current === index }"
            @click="switchTab(item, index)">
            <text :class="item.icon" class="tab-icon"></text>
            <text class="tab-text">{{ item.text }}</text>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
/**
 * 本页面显示自定义 tabbar 组件，原生的tabBar被隐藏，然显示了本组件
 * 本组件下下面的tabList的存在项目必须是在pages.json中配置的tabBar.list中的项目.
 * 对于原生的tabBar,是由本组件的CSS被盖住了。
 */
// 接受传参的 tabList，默认使用现有数据
const props = defineProps<{
    tabList?: Array<{
        path: string
        text: string
        icon: string
    }>
}>()

// Tab 列表数据，从 props 或默认值
const tabList = ref(props.tabList || [
    {
        path: "pages/staff/home",
        text: "主页",
        icon: "zl-icon-user"
    },
    {
        path: "pages/index/workspace",
        text: "航班",
        icon: "zl-icon-airplane"
    },
    {
        path: "pages/index/module",
        text: "功能",
        icon: "zl-icon-duty"
    },
    {
        path: "pages/index/profile",
        text: "我",
        icon: "zl-icon-person"
    }
])

// 当前激活的 tab 索引
const current = ref(0)
// 是否正在切换中（防止重复点击）
const isSwitching = ref(false)

// 切换 tab
const switchTab = (item: any, index: number) => {
    // 如果已经在切换中，或者点击的是当前激活的tab，则直接返回
    if (isSwitching.value || current.value === index) {
        return
    }

    isSwitching.value = true
    current.value = index

    uni.switchTab({
        url: `/${item.path}`,
        success: () => {
            isSwitching.value = false
        },
        fail: () => {
            isSwitching.value = false
            syncCurrent()
        }
    })
}

// 同步当前页面对应的 tab 索引
const syncCurrent = () => {
    const pages = getCurrentPages()
    if (pages.length === 0) return

    const currentPage = pages[pages.length - 1]
    const route = currentPage.route

    const currentIndex = tabList.value.findIndex(item => item.path === route)
    if (currentIndex !== -1) {
        current.value = currentIndex
    }
}

onShow(() => {
    syncCurrent()
})
</script>

<style lang="less" scoped>
@import '@/css/icon.less';

.tab-bar {
    // 这是自定义tabbar的样式，原生的tabBar被隐藏，然显示了本组件
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
