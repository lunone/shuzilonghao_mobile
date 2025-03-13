<template>
    <div class="item">
        <div class="fromto">
            <span class="city dep">
                {{ dep }}
            </span>
            <span class="city arr">
                {{ arr }}
            </span>
        </div>
        <div class="acregs">
            <span class="title">飞机:</span>
            <span v-for="val, acReg in stats" :key="`${dep}-${arr}-${acReg}`" class="acreg"
                :class="acReg == selectAcReg ? `hover` : ``" @click="acRegChange(acReg)">
                {{ acReg == 'total' ? '全部' : acReg }}
            </span>
        </div>
        <div class="summary">
            <span class="title">总计:</span>
            <span class="count">
                {{ toFixed(stats[selectAcReg].counter as unknown as number) }}班
            </span>
            <span class="weight">
                {{ toFixed(stats[selectAcReg].netWeightCargo.total) }}吨
            </span>
            <span class="hour">
                平均空时: {{ toFixed(stats[selectAcReg].hour.avg * 60) }}分钟
            </span>
        </div>
        <div class="weight">
            <span class="title">运量:</span>
            <span class="avg">
                平均{{ toFixed(stats[selectAcReg].netWeightCargo.avg) }}吨
            </span>
            <span class="min">
                最少{{ toFixed(stats[selectAcReg].netWeightCargo.min) }}吨
            </span>
            <span class="max">
                最多{{ toFixed(stats[selectAcReg].netWeightCargo.max) }}吨
            </span>
        </div>
    </div>

</template>
<script setup lang="ts">
import { StatMulti } from '@/interface/flight.interface';
import { onMounted, PropType, ref, watch } from 'vue';
const props = defineProps({
    dep: { type: String, default: '', },
    arr: { type: String, default: '', },
    stats: { type: Object as PropType<Record<string, StatMulti>>, default: () => { }, },
})
const selectAcReg = ref('total');
watch(() => props, () => {
    selectAcReg.value = 'total';
}, { deep: true, immediate: true })
const acRegChange = (acReg: string) => selectAcReg.value = acReg
function toFixed(num: number) {
    return +num.toFixed(1);
}
</script>
<style lang="less" scoped>
.item {
    border-radius: 5px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border: solid 1px #eee;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .fromto {
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #b3d4f5;
        padding: 4px 4px;
        // border-radius: 6px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;

        // border-bottom: 2px solid #d1d5db; // 增加底部边框

        .city {
            font-weight: bold;
            color: #333;
        }
    }

    .acregs {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 4px;
        padding: 4px;

        .title {
            font-weight: bold;
            color: #444;
            margin-right: 10px; // 添加标题和飞机编号之间的间距
        }

        .acreg {
            flex: 0 0 5ch; // 设置每个飞机编号的宽度为5个字符的宽度
            text-align: center;
            margin-right: 10px; // 添加飞机编号之间的间距
            padding: 4px 2px; // 添加内边距
            border-radius: 5px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;

            &.hover {
                background-color: #f5bebe;
            }
        }

    }

    .summary {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 4px;
        padding: 4px;
        align-items: center;

        .title {
            font-weight: bold;
            color: #444;
        }

        .count,
        .weight,
        .hour {
            color: #555;
        }
    }

    .weight {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding: 4px;

        .title {
            font-weight: bold;
            color: #444;
        }

        .avg,
        .min,
        .max {
            color: #555;
        }
    }
}
</style>