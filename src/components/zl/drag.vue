<template>
    <view class="container">
        <view class="grid-container" id="gridContainer">
            <view class="grid-item" v-for="(item, index) in localItems" :key="`${index}_${forceUpdateKey}`"
                :class="{ 'active': currentIndex === index }" :style="getPositionStyle(index)"
                @touchstart="handleTouchStart($event, index)" @touchmove.stop.prevent="handleTouchMove"
                @touchend="handleTouchEnd">
                <view class="item-content">
                    <view class="item-icon">
                        <slot name="icon" :item="item" :index="index" />
                    </view>
                    <view class="item-name">
                        <slot name="name" :item="item" :index="index">
                            {{ item.name }}
                        </slot>
                    </view>
                </view>
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
    // itemKey?: string
    columns?: number
    itemSize?: number
    itemGap?: number
}>(), {
    items: () => [],
    itemSize: 60
})

const emit = defineEmits(['update:items', 'sort-complete'])

// 网格配置
const columns = ref(props.columns)
const itemSize = ref(props.itemSize)
const itemGap = ref(props.itemGap)
const localItems = ref([...props.items])

// 拖拽状态
const currentIndex = ref(-1)
const startX = ref(0)
const startY = ref(0)
const isDragging = ref(false)
const dragPosition = ref({ x: 0, y: 0 })
const containerWidth = ref(0)

watch(() => props.itemSize, (newVal) => {
    itemSize.value = newVal
    initPositions()
})

watch(() => props.itemGap, (newVal) => {
    itemGap.value = newVal
    initPositions()
})

watch(() => props.items, (newItems) => {
    localItems.value = [...newItems]
    initPositions()
}, { deep: true })

// 居中对齐函数
// const centerItems = () => {
//     if (columns.value <= 0 || itemSize.value <= 0) return

//     // 计算总项目宽度（包括间隙）
//     const totalItemsWidth = columns.value * itemSize.value + (columns.value - 1) * itemGap.value

//     // 如果总宽度大于容器宽度，则不进行居中处理
//     if (totalItemsWidth >= containerWidth.value) {
//         return
//     }

//     // 计算均匀分布的间隔
//     const availableSpace = containerWidth.value - (columns.value * itemSize.value)
//     const distributedGap = columns.value > 1 ? availableSpace / (columns.value - 1) : 0

//     // 重新计算每个项目的位置（仅用于居中对齐显示）
//     localItems.value.forEach((_, index) => {
//         const row = Math.floor(index / columns.value)
//         const col = index % columns.value
//         // 这里不再更新 positions 数组，仅用于计算居中显示
//     })
// }

// 计算列数
const calculateColumns = async () => {
    try {
        const containerWidth = await getContainerWidth()
        return Math.max(1, Math.floor((containerWidth + itemGap.value) / (itemSize.value + itemGap.value)))
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
}

// 初始化所有项目的位置
const initPositions = () => {
    // 不再需要维护 positions 数组
    // centerItems()
}
const forceUpdateKey = ref(0);
// 为每个项目生成唯一 key

// 获取项目定位样式
const getPositionStyle = (index: number) => {
    const width = `${itemSize.value}px`,
        height = `${itemSize.value}px`

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

    // 计算均匀分布的间隔（用于居中对齐）
    let x = col * (itemSize.value + itemGap.value);
    let y = row * (itemSize.value + itemGap.value)
    // x位置修正
    const totalItemsWidth = columns.value * itemSize.value + (columns.value - 1) * itemGap.value
    if (totalItemsWidth < containerWidth.value) {
        const availableSpace = containerWidth.value - (columns.value * itemSize.value)
        const distributedGap = columns.value > 1 ? availableSpace / (columns.value - 1) : 0
        x = col * (itemSize.value + distributedGap)
    }
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

    // 记录初始位置
    const row = Math.floor(index / columns.value)
    const col = index % columns.value
    dragPosition.value = {
        x: col * (itemSize.value + itemGap.value),
        y: row * (itemSize.value + itemGap.value)
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
    // 这部分是平滑移动，每次都移动微小距离。
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
        console.log('排序结束', _.map(localItems.value, 'name'))
        emit('update:items', newList)
    }

    // 强制触发更新
    forceUpdateKey.value++
    emit('sort-complete', [...localItems.value])

}

// 计算新索引位置
const calculateNewIndex = () => {
    // 根据拖拽元素的当前位置计算应该插入的位置
    const centerX = dragPosition.value.x + itemSize.value / 2
    const centerY = dragPosition.value.y + itemSize.value / 2

    // 计算当前行列
    const col = Math.max(0, Math.min(columns.value - 1, Math.floor(centerX / (itemSize.value + itemGap.value))))
    const row = Math.max(0, Math.floor(centerY / (itemSize.value + itemGap.value)))

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

<style scoped>
.container {
    padding: 20rpx;
    background-color: #f7f7f7;
}

.grid-container {
    position: relative;
    width: 100%;
    min-height: 500rpx;
    overflow: hidden;
}

.grid-item {
    position: absolute;
    left: 0;
    top: 0;
    transition: transform 0.3s ease;
    will-change: transform;
}

.grid-item.active {
    transition: none;
    transform: scale(1.05);
    z-index: 10;
}

.item-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.item-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10rpx;
}

.item-name {
    font-size: 24rpx;
    color: #333;
    text-align: center;
}
</style>