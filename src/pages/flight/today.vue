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
                <text class="title">{{ unnormals[key] }}</text>
                <text class="value" :class="value ? 'hover' : ''">{{ value }}</text>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref } from 'vue';
import { getFlightsByDate } from '@/api/flight.api';
import dayjs from 'dayjs';
import { FlightItem } from '@/interface/flight.interface';

const flights = ref<FlightItem[]>([]);

const unnormals = { isCancle: '取消', isAltn: '备降', isDelay: '延误', isReturn: '返航', }
// 当前循环方式可改为更高效的reduce
const flightStats = computed(() => {
    return flights.value.reduce((acc, flight) => {
        if (flight.isPatch) return acc

        acc.total++
        if (flight.atd) acc.executed++

        Object.keys(unnormals).forEach(key => acc.unnormal[key] += flight[key] ? 1 : 0)

        return acc
    }, { total: 0, executed: 0, unnormal: Object.fromEntries(Object.keys(unnormals).map(k => [k, 0])) })
})


function showDetail(key) {
    // 这里弹出框
}
onMounted(async () => {
    flights.value = await getFlightsByDate({ startDate: dayjs().startOf('day').toDate(), endDate: dayjs().endOf('day').toDate() }) as FlightItem[];
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
        padding: 10px 4px;
        font-size: 0.7rem;
        color: @color-staff-flight-today;
        background-color: @color-staff-flight-today-bg;
        border-radius: 4px;
        overflow: hidden;
    }

    .detail {
        flex-grow: 1;
    }
}
</style>
