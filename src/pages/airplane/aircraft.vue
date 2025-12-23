<template>
    <div class="flight-wrapper">
        <div class="total">
            <i class="icon zl-icon-aircraft" />
            <div class="text">
                {{Object.values(stat).reduce((acc, cur) => acc + cur, 0)}} 架
            </div>
        </div>
        <div class="detail">
            <div class="section" v-for="number, acTypeLong in stat" :key="acTypeLong">
                <text class="title">{{ acTypeLong }} </text>
                <text class="value">{{ number }}</text>
                <text class="unit">架</text>
            </div>
        </div>
    </div>
    
    <!-- 飞机利用率卡片 -->
    <div class="utilization-section">
        <AircraftUtilizationCard
            v-if="selectedAircraft"
            :ac-reg="selectedAircraft"
            title="飞机利用率"
            avg-label="30天平均"
            :compact-mode="true"
            :chart-height="80"
        />
        <div v-else class="no-selection">
            <p class="no-selection-text">请选择一架飞机查看利用率</p>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useAircraftStore } from '@/store/aircraft.store';
import dayjs from 'dayjs';
import AircraftUtilizationCard from '@/components/AircraftUtilizationCard.vue';

const store = useAircraftStore();
const selectedAircraft = ref('');

const stat = computed(() => {// todo:页面变更飞机变0
    const today = dayjs().startOf('day');
    const stat: Record<string, number> = {}
    if (!store.arr.length) return stat;
    for (let aircraft of store.arr) {
        const startDate = dayjs(aircraft.startDate || -1).startOf('day');
        const endDate = dayjs(aircraft.endDate).startOf('day');
        if (!aircraft.endDate || (startDate.isBefore(today) && endDate.isAfter(today))) {
            if (aircraft.regId.length < 6) {
                const acTypeLong = aircraft.acTypeLong || aircraft.acType || '未知机型';
                stat[acTypeLong] = stat[acTypeLong] || 0;
                stat[acTypeLong]++;
            }
        }
    }
    return stat;
})

onMounted(() => {
    store.fetchAircrafts();
});

// 选择飞机的方法
const selectAircraft = (acReg: string) => {
    selectedAircraft.value = acReg;
};

// 暴露方法给父组件调用
defineExpose({
    selectAircraft
});

// 监听外部传入的飞机注册号
const props = defineProps<{
    acReg?: string;
}>();

// 如果外部传入了飞机注册号，则使用它
watch(() => props.acReg, (newAcReg) => {
    if (newAcReg) {
        selectedAircraft.value = newAcReg;
    }
}, { immediate: true });

</script>
<style lang="less" scoped>
@import "@/css/base.less";

.flight-wrapper {
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
            color: @color-staff-hr-text;
            font-size: 34px;
            margin-bottom: 2px;
        }

        .text {
            color: @color-staff-hr-text;
            font-size: .9rem;
            margin-top: -5px;
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
            padding: 0 4px;
            margin: 0;
            border-bottom: dashed 1px @color-staff-hr-border;

            &:last-child {
                border-bottom: 0;
            }

            .title {
                color: @color-staff-hr-text;
                font-size: 0.95rem;
                white-space: nowrap;
                // min-width: 2em; // 保证至少显示2个汉字
            }

            .value {
                flex: 1;
                color: @color-staff-hr-value;
                font-weight: bold;
                text-align: center;
            }

            .unit {
                color: @color-staff-hr-unit;
                font-size: 0.85rem;
            }
        }
    }
}

.utilization-section {
    margin-top: 12px;
    
    .no-selection {
        background: white;
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        
        .no-selection-text {
            font-size: 14px;
            color: #8e8e93;
            margin: 0;
        }
    }
}
</style>