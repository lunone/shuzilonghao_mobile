<template>
    <view class="grid-container" id="gridContainer" :style="{ height: containerHeight + 'px' }">
        <view class="grid-item" v-for="(item, index) in localItems" :key="`${index}_${forceUpdateKey}`"
            :class="{ 'active': currentIndex === index, 'dragging': isDragging && currentIndex === index }"
            :style="getPositionStyle(index)" @touchstart="handleTouchStart($event, index)"
            @touchmove.stop.prevent="handleTouchMove" @touchend="handleTouchEnd">
            <view class="item-content">
                <slot name="default" :item="item" :index="index">
                    {{ item }}
                </slot>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getContainerWidth } from '@/utils/ui';
import _ from 'lodash';
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{
    items: any[]
    columns?: number
    itemSize?: number
    itemGap?: number
}>(), {
    items: () => [],
    itemSize: 70,
    itemGap: 10
})

const emit = defineEmits(['sort'])

// 网格配置
const columns = ref(props.columns)
const itemSize = ref(props.itemSize)
const itemGap = ref(props.itemGap)
const localItems = ref([...props.items])
const forceUpdateKey = ref(0)
// 拖拽状态
const currentIndex = ref(-1)
const startX = ref(0)
const startY = ref(0)
const isDragging = ref(false)
const dragPosition = ref({ x: 0, y: 0 })
const containerWidth = ref(0)
const containerHeight = ref(0) // 容器高度

// 合并监听 props.itemSize、props.itemGap 和 props.items 的变化
watch([() => props.itemSize, () => props.itemGap, () => props.items], ([newItemSize, newItemGap, newItems]) => {
    itemSize.value = newItemSize
    itemGap.value = newItemGap
    localItems.value = [...newItems]
    nextTick(() => {
        updateContainerHeight()
    })
}, { deep: true })

// 计算列数
const calculateColumns = async () => {
    try {
        const width = await getContainerWidth()
        containerWidth.value = width // 更新容器宽度
        return Math.max(1, Math.floor((width + itemGap.value) / (itemSize.value + itemGap.value)))
    } catch (error) {
        return props.columns || 3
    }
}

// 自动调整列数
const autoAdjustColumns = async () => {
    if (props.columns) {
        columns.value = props.columns
    } else {
        const newColumns = await calculateColumns()
        if (newColumns !== columns.value) {
            columns.value = newColumns
        }
    }
    initPositions()
    updateContainerHeight()
}

// 初始化所有项目的位置
const initPositions = () => {
    // 不再需要维护 positions 数组
}

// 更新容器高度
const updateContainerHeight = () => {
    if (localItems.value.length === 0) {
        containerHeight.value = 0
        return
    }

    // 计算行数
    const rows = Math.ceil(localItems.value.length / columns.value)
    // 计算内容总高度：行数 * 元素高度 + (行数 - 1) * 间隙
    const contentHeight = rows * (itemSize.value / 2) + Math.max(0, (rows - 1) * itemGap.value)
    // 添加上下padding，使内容垂直居中
    const totalHeight = contentHeight + 20
    containerHeight.value = totalHeight
}

// 计算居中对齐的x位置
const calculateCenteredX = (col: number) => {
    const totalItemsWidth = columns.value * itemSize.value + (columns.value - 1) * itemGap.value;

    if (containerWidth.value > 0 && totalItemsWidth < containerWidth.value) {
        // 计算两边的空白距离
        const sidePadding = (containerWidth.value - totalItemsWidth) / 2;
        // 每个元素的x位置 = 两边空白 + 元素和间隙的累积宽度
        return sidePadding + col * (itemSize.value + itemGap.value);
    } else {
        // 如果容器宽度未知或者元素总宽度超过容器宽度，则使用默认计算
        return col * (itemSize.value + itemGap.value);
    }
}

// 计算居中对齐的y位置
const calculateCenteredY = (row: number) => {
    // 计算内容总高度
    const rows = Math.ceil(localItems.value.length / columns.value)
    const contentHeight = rows * (itemSize.value / 2) + Math.max(0, (rows - 1) * itemGap.value)

    // 计算垂直方向的空白
    const verticalPadding = (containerHeight.value - contentHeight - 20) / 2

    // 每个元素的y位置 = 垂直空白 + 元素和间隙的累积高度
    return Math.max(0, verticalPadding) + row * (itemSize.value / 2 + itemGap.value) + 10 // +10 是上padding
}

// 获取项目定位样式
const getPositionStyle = (index: number) => {
    const width = `${itemSize.value}px`
    // 高度为宽度的一半
    const height = `${itemSize.value / 2}px`

    // 如果是当前拖拽的元素，使用临时位置
    if (index === currentIndex.value && isDragging.value) {
        return {
            transform: `translate3d(${dragPosition.value.x}px, ${dragPosition.value.y}px, 0)`,
            width, height, zIndex: 10
        }
    }

    // 否则按正常网格位置排列
    const row = Math.floor(index / columns.value)
    const col = index % columns.value

    // 计算居中对齐的x位置
    const x = calculateCenteredX(col);

    // 计算居中对齐的y位置
    const y = calculateCenteredY(row);

    return {
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width, height, zIndex: 1
    }
}

// 处理触摸开始
const handleTouchStart = (event: TouchEvent, index: number) => {
    if (isDragging.value) return

    // #ifdef MP-WEIXIN
    const touch = event.changedTouches[0]
    // #endif
    // #ifdef H5
    // const touch = event.touches[0]
    // #endif

    currentIndex.value = index
    startX.value = touch.clientX
    startY.value = touch.clientY
    isDragging.value = true

    // 设备振动反馈
    // #ifdef MP-WEIXIN
    uni.vibrateShort()
    // #endif
    // #ifdef H5
    // H5端没有振动API，可以忽略或者使用其他反馈方式
    // #endif

    // 记录初始位置
    const row = Math.floor(index / columns.value)
    const col = index % columns.value
    // 使用居中对齐的x位置和y位置
    dragPosition.value = {
        x: calculateCenteredX(col),
        y: calculateCenteredY(row)
    }
}

// 处理触摸移动
const handleTouchMove = (event: TouchEvent) => {
    if (currentIndex.value === -1 || !isDragging.value) return

    // #ifdef MP-WEIXIN
    const touch = event.changedTouches[0]
    // #endif
    // #ifdef H5
    // const touch = event.touches[0]
    // #endif

    // 计算移动距离
    const deltaX = touch.clientX - startX.value
    const deltaY = touch.clientY - startY.value

    // 更新拖拽元素的位置
    dragPosition.value.x += deltaX
    dragPosition.value.y += deltaY
    // 重置开始位置
    startX.value = touch.clientX
    startY.value = touch.clientY
}

// 处理触摸结束
const handleTouchEnd = () => {
    if (currentIndex.value === -1) return

    // 保存当前索引用于后续处理
    const oldIndex = currentIndex.value

    // 计算拖拽元素应该插入的新位置
    const newIndex = calculateNewIndex()
    // 先重置拖拽状态
    isDragging.value = false
    currentIndex.value = -1

    // 然后更新数据
    if (newIndex !== oldIndex) {
        const newList = [...localItems.value]
        const [movedItem] = newList.splice(oldIndex, 1)
        newList.splice(newIndex, 0, movedItem)

        localItems.value = newList
        emit('sort', newList)
        // 强制触发更新
        forceUpdateKey.value++

    }
}

// 计算新索引位置
const calculateNewIndex = () => {
    // 根据拖拽元素的当前位置计算应该插入的位置
    const centerX = dragPosition.value.x + itemSize.value / 2
    // 高度为宽度的一半
    const centerY = dragPosition.value.y + itemSize.value / 4

    // 计算当前行列
    let col = Math.max(0, Math.min(columns.value - 1, Math.floor((centerX - (containerWidth.value > 0 ?
        (containerWidth.value - (columns.value * itemSize.value + (columns.value - 1) * itemGap.value)) / 2 : 0))
        / (itemSize.value + itemGap.value))))

    // 计算垂直居中对齐的行
    const rows = Math.ceil(localItems.value.length / columns.value)
    const contentHeight = rows * (itemSize.value / 2) + Math.max(0, (rows - 1) * itemGap.value)
    const verticalPadding = (containerHeight.value - contentHeight - 20) / 2
    const adjustedCenterY = centerY - Math.max(0, verticalPadding) - 10 // 减去padding

    // 行高为宽度的一半加上间距
    const row = Math.max(0, Math.floor(adjustedCenterY / (itemSize.value / 2 + itemGap.value)))

    // 计算索引
    let newIndex = row * columns.value + col

    // 确保不超过数组长度
    newIndex = Math.max(0, Math.min(localItems.value.length - 1, newIndex))

    return newIndex
}

// 窗口尺寸变化处理
let resizeTimer: number | null = null
const handleResize = () => {
    if (resizeTimer) {
        clearTimeout(resizeTimer)
    }
    resizeTimer = setTimeout(() => {
        autoAdjustColumns()
    }, 300) as any
}

onMounted(() => {
    autoAdjustColumns()

    // #ifdef H5
    window.addEventListener('resize', handleResize)
    // #endif

    // #ifdef MP-WEIXIN
    uni.onWindowResize(handleResize)
    // #endif
})

onUnmounted(() => {
    // #ifdef H5
    window.removeEventListener('resize', handleResize)
    // #endif

    // #ifdef MP-WEIXIN
    uni.offWindowResize(handleResize)
    // #endif

    if (resizeTimer) {
        clearTimeout(resizeTimer)
    }
})
</script>

<style lang="less" scoped>
.grid-container {
    position: relative;
    width: 100%;
    min-height: 10rpx;
    height: auto;
    border-radius: 8rpx;
    border: solid 1rpx #d8d8d8;
    overflow: hidden;
    // padding: 10rpx; // 这个 padding 可能导致左边有空白
    background-color: #e0e0e0;

    // 添加 box-sizing 确保 padding 正确计算
    box-sizing: border-box;

    .grid-item {
        position: absolute;
        left: 0;
        top: 0;
        transition: transform 0.2s ease;
        will-change: transform;
        border-radius: 6px;
        overflow: hidden;
        // &.active {
        //     transition: none;
        //     transform: scale(1.02);
        //     z-index: 10;
        // }

        // 拖拽中的元素样式
        &.dragging {
            // transform: scale(1.05);
            z-index: 20;
            // box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);

            .item-content {
                background-color: #e3f2fd; // 蓝色背景表示正在拖拽
                font-size: 1.2rem;
                color: #777;
                // border: 2rpx dashed #2196f3;
                // box-shadow: 0 4rpx 12rpx rgba(33, 150, 243, 0.3);
            }
        }

        .item-content {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            // background-color: #ffffff;
            border-radius: 6rpx;
            // box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
            padding: 0;
            color: #333;
            text-align: center;
            line-height: 1.1;
            font-size: 1rem;
            // 超出显示省略号……
            white-space: nowrap; // 不换行
            overflow: hidden; // 超出部分隐藏
            text-overflow: ellipsis; // 超出显示省略号

        }
    }
}
</style>