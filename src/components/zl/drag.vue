<template>
    <view class="container">
        <view class="grid-container">
            <view class="grid-item" v-for="(item, index) in items" :key="itemKey ? item[itemKey] : index"
                :class="{ 'active': currentIndex === index }" :style="getPositionStyle(index)"
                @touchstart="handleTouchStart($event, index)" @touchmove.stop.prevent="handleTouchMove($event)"
                @touchend="handleTouchEnd">
                <view class="item-content">
                    <view class="item-icon">
                        <slot name="icon" :item="item" :index="index">
                            <uni-icons :type="item.icon || 'star'" size="24"></uni-icons>
                        </slot>
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
import { ref, onMounted, watch } from 'vue';

const props = withDefaults(defineProps<{
    items: any[];
    itemKey?: string;
    columns?: number;
    itemSize?: number;
    itemGap?: number;
}>(), {
    items: () => [],
    columns: 4,
    itemSize: 80,
    itemGap: 15
});

const emit = defineEmits(['update:items', 'sort-complete']);

// 网格配置
const columns = ref(props.columns);
const itemSize = ref(props.itemSize);
const itemGap = ref(props.itemGap);

// 拖拽状态
const currentIndex = ref(-1); // 当前拖拽的项目索引
const startX = ref(0);       // 触摸开始X坐标
const startY = ref(0);       // 触摸开始Y坐标
// const moveOffsetX = ref(0);  // X轴移动的距离
// const moveOffsetY = ref(0);  // Y轴移动的距离
const positions = ref<any[]>([]);   // 所有项目的位置
const isDragging = ref(false); // 是否正在拖拽

// 监听 props 变化
watch(() => props.columns, (newVal) => {
    columns.value = newVal;
    initPositions();
});

watch(() => props.itemSize, (newVal) => {
    itemSize.value = newVal;
    initPositions();
});

watch(() => props.itemGap, (newVal) => {
    itemGap.value = newVal;
    initPositions();
});

watch(() => props.items, () => {
    initPositions();
}, { deep: true });

// 初始化所有项目的位置
const initPositions = () => {
    positions.value = [];

    props.items.forEach((_, index) => {
        const row = Math.floor(index / columns.value);
        const col = index % columns.value;

        // 计算项目位置
        positions.value.push({
            x: col * (itemSize.value + itemGap.value),
            y: row * (itemSize.value + itemGap.value),
            zIndex: 1
        });
    });
};

// 获取项目定位样式
const getPositionStyle = (index: number) => {
    if (!positions.value[index]) return '';

    const position = positions.value[index];

    return {
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: `${itemSize.value}px`,
        height: `${itemSize.value}px`,
        zIndex: position.zIndex || 1
    };
};

// 处理触摸开始
const handleTouchStart = (event: TouchEvent, index: number) => {
    if (isDragging.value) return;

    const touch = event.touches[0];
    currentIndex.value = index;
    startX.value = touch.clientX;
    startY.value = touch.clientY;
    // moveOffsetX.value = 0;
    // moveOffsetY.value = 0;
    isDragging.value = true;

    // 提升当前项的层级
    if (positions.value[index]) {
        positions.value[index].zIndex = 10;
    }
};

// 处理触摸移动
const handleTouchMove = (event: TouchEvent) => {
    if (currentIndex.value === -1 || !isDragging.value) return;

    const touch = event.touches[0];
    // 计算移动距离
    const deltaX = touch.clientX - startX.value;
    const deltaY = touch.clientY - startY.value;
    console.log('移动距离', deltaX, deltaY, 'yuanyou', JSON.stringify(positions.value[currentIndex.value]))
    // moveOffsetX.value += deltaX;
    // moveOffsetY.value += deltaY;

    // 更新拖拽项的位置
    if (positions.value[currentIndex.value]) {
        positions.value[currentIndex.value].x += deltaX;
        positions.value[currentIndex.value].y += deltaY;
    }

    // 更新开始位置，用于下一次移动计算
    startX.value = touch.clientX;
    startY.value = touch.clientY;

    // 检查是否需要交换位置
    checkForSwap();
};

// 处理触摸结束
const handleTouchEnd = () => {
    if (currentIndex.value === -1) return;

    // 重置拖拽项的层级
    if (positions.value[currentIndex.value]) {
        positions.value[currentIndex.value].zIndex = 1;
    }

    // 将所有项吸附到网格
    snapAllItemsToGrid();

    // 重置拖拽状态
    isDragging.value = false;
    currentIndex.value = -1;
    // moveOffsetX.value = 0;
    // moveOffsetY.value = 0;

    // 触发排序完成事件
    emit('sort-complete', [...props.items]);
    emit('update:items', [...props.items]);
};

// 将所有项吸附到网格
const snapAllItemsToGrid = () => {
    props.items.forEach((_, index) => {
        const row = Math.floor(index / columns.value);
        const col = index % columns.value;

        if (!positions.value[index]) {
            positions.value[index] = { x: 0, y: 0, zIndex: 1 };
        }

        positions.value[index] = {
            x: col * (itemSize.value + itemGap.value),
            y: row * (itemSize.value + itemGap.value),
            zIndex: 1
        };
    });
};

// 检查是否需要交换位置
const checkForSwap = () => {
    if (currentIndex.value === -1) return;

    const currentPos = positions.value[currentIndex.value];
    let closestIndex = -1;
    let minDistance = Number.MAX_VALUE;

    // 找出与当前拖拽项距离最近的项
    positions.value.forEach((pos, index) => {
        if (index !== currentIndex.value) {
            // 计算中心点之间的距离
            const centerX1 = currentPos.x + itemSize.value / 2;
            const centerY1 = currentPos.y + itemSize.value / 2;
            const centerX2 = pos.x + itemSize.value / 2;
            const centerY2 = pos.y + itemSize.value / 2;

            const distance = Math.sqrt(
                Math.pow(centerX1 - centerX2, 2) +
                Math.pow(centerY1 - centerY2, 2)
            );

            // 只考虑距离小于阈值的项
            const threshold = (itemSize.value + itemGap.value) * 0.6;
            if (distance < threshold && distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        }
    });

    // 如果找到了足够近的项，交换位置
    if (closestIndex !== -1) {
        console.log('交换姿势，再来一次')
        swapItems(currentIndex.value, closestIndex);
    }
};

// 交换两个项目
const swapItems = (fromIndex: number, toIndex: number) => {
    // 交换菜单列表中的项
    const newList = [...props.items];
    [newList[fromIndex], newList[toIndex]] = [newList[toIndex], newList[fromIndex]];

    // 更新父组件数据
    emit('update:items', newList);

    // 交换位置信息
    if (positions.value[fromIndex] && positions.value[toIndex]) {
        [positions.value[fromIndex], positions.value[toIndex]] =
            [positions.value[toIndex], positions.value[fromIndex]];
    }

    // 更新当前拖拽的索引
    currentIndex.value = toIndex;
};

onMounted(() => {
    initPositions();
});
</script>

<script lang="ts">
// 兼容选项 API 的写法（如果需要）
export default {
    name: 'DragGrid'
}
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
