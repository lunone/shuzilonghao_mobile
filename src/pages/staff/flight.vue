<template>
    <div class="flight-wrapper">
        <div class="section summary">
            <div class="item">
                <div class="title">执行/计划</div>
                <div class="value">
                    <span class="executed"> {{ flightStats.executed }} </span>
                    <span class="separator"> / </span>
                    <span class="total"> {{ flightStats.total }} </span>
                </div>
            </div>
        </div>
        <div class="section today">今日</div>
        <div class="section detail">
            <div class="item" :class="key" v-for="(value, key) in flightStats.unnormal" @click="showDetail(key)"
                :key="key">
                <text class="title">{{ names[key] }}</text>
                <text class="value" :class="value ? 'hover' : ''">{{ value }}</text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref } from 'vue';
import api from '@/utils/api';
import CONFIG from '@/config';
import dayjs from 'dayjs';
import { FlightItem } from '@/interface';

const flights = ref<FlightItem[]>([]);
const fetchFlights = async () => {
    const startDate = dayjs().startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();
    try {
        const res = await api(CONFIG.url.flightsDate, { startDate, endDate }) as FlightItem[];
        console.log(res, startDate, endDate);
        flights.value = res;
    } catch (err) {
        console.error('获取航班信息失败', err);
    }
};
const names = {
    cancle: '取消',
    altn: '备降',
    delay: '延误',
    return: '返航',
}
const flightStats = computed(() => {
    let total = 0;
    let executed = 0;
    // let normal = 0;
    const unnormal = {
        cancle: 0,
        altn: 0,
        delay: 0,
        return: 0,
    };

    for (let flight of flights.value) {
        // FLG_PATCH 是否返航/备降新增段// 新增字段不处理，只处理旧有的航段
        if (flight.isPatch) {
            continue;
        }

        if (flight.atd) {// 已执行
            executed++;
        }

        if (flight.isDelay) {// 延误
            unnormal.delay++
        }

        if (flight.isReturn) {// 返回
            unnormal.return++;
        }

        if (flight.isAltn) {// 备降
            unnormal.altn++;
        }
        if (flight.isCancle) {
            unnormal.cancle++;
        }
        total++;
    };

    return { total, executed, unnormal };
});

const executionRate: Ref<number> = ref(0);
// watch(flights, () => {
//     executionRate.value = flightStats.value.executed / flightStats.value.total * 100;
// });
function showDetail(key) {
    // 这里弹出框
}
onMounted(() => {
    fetchFlights();
});
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.flight-wrapper {
    .row;
    padding: 0 auto;

    .section {
        .row;

        .item {
            .column;

            .title {
                font-size: .8rem;
                color: @color-staff-flight-secion-title;
            }

            .value {
                padding: 2px 4px;
                font-size: 1.4rem;
                color: @color-staff-flight-secion-value;

                &.hover {
                    color: @color-staff-flight-secion-hover;
                }
            }
        }
    }

    .summary {
        width: 120px;

        .separator {
            color: @color-staff-flight-separator;
        }

        .value {
            font-weight: bold;
            color: @color-staff-flight-summary;

            .total {
                color: @color-staff-flight-summary-total;
            }
        }
    }

    .today {
        writing-mode: vertical-lr;
        padding: 10px 8px;
        font-size: 0.7rem;
        color: @color-staff-flight-today;
        background-color: @color-staff-flight-today-bg;
        border-radius: 8px;
        overflow: hidden;
    }

    .detail {
        flex-grow: 1;
    }
}
</style>