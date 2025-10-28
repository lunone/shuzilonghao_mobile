<template>
    <view class="flight-card-wrapper" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
        :style="{ transform: `translateX(${translateX}px)` }">
        <view class="flight-card" :class="flightStatusClasses">
            <view class="flight-row-1">
                <text class="airport">
                    <text class="city">{{ getCityName(flight.dep) }}</text><text class="code">{{ flight.dep }}</text>
                </text>
                <text class="flight-no">{{ flight.flightNo }}</text>
                <text class="airport">
                    <text class="code">{{ flight.arr }}</text><text class="city">{{ getCityName(flight.arr) }}</text>
                </text>
            </view>
            <view class="flight-row-2">
                <text class="time-group">
                    <text class="time-prefix" :style="{ color: 'black' }">{{ departureTimeInfo.prefix }}</text>
                    <text class="time departure-time" :class="departureTimeInfo.class">{{ departureTimeInfo.time }}</text>
                </text>
                <text class="aircraft-info">{{ flight.acReg }} ({{ flight.acType }})</text>
                <text class="time-group">
                    <text class="time-prefix" :style="{ color: 'black' }">{{ arrivalTimeInfo.prefix }}</text>
                    <text class="time arrival-time" :class="arrivalTimeInfo.class">{{ arrivalTimeInfo.time }}</text>
                </text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import type { FlightItem } from '@/api/flight.api';
import { useAirportStore } from '@/store/airport.store';
import dayjs from 'dayjs';
import { computed, ref } from 'vue';

const timePrefixMap: { [key: string]: string } = {
    A: '实',
    E: '预',
    S: '计',
};

// Touch slide state
const startX = ref(0);
const currentX = ref(0);
const translateX = ref(0);
const isSwiping = ref(false);

// Props
interface Props {
    flight: FlightItem;
}
const props = defineProps<Props>();

const airportStore = useAirportStore();

const getCityName = (code: string) => {
    return airportStore.getCity(code, 'city') || code;
};

const getAirportCode = (code: string) => {
    return airportStore.getCity(code, 'code3') || code;
};

const formatTime = (time: string | Date) => {
    if (!time) return '--';
    return dayjs(time).format('HH:mm');
};

const departureTimeInfo = computed(() => {
    const f = props.flight;
    if (f.atd) return { time: formatTime(f.atd), class: 'time-atd', prefix: timePrefixMap['A'] };
    if (f.etd) return { time: formatTime(f.etd), class: 'time-etd', prefix: timePrefixMap['E'] };
    return { time: formatTime(f.std), class: 'time-std', prefix: timePrefixMap['S'] };
});

const arrivalTimeInfo = computed(() => {
    const f = props.flight;
    if (f.ata) return { time: formatTime(f.ata), class: 'time-ata', prefix: timePrefixMap['A'] };
    if (f.eta) return { time: formatTime(f.eta), class: 'time-eta', prefix: timePrefixMap['E'] };
    return { time: formatTime(f.sta), class: 'time-sta', prefix: timePrefixMap['S'] };
});

const flightStatusClasses = computed(() => {
    const f = props.flight;
    const classes = [];
    if (f.isCancle) {
        classes.push('status-cancelled');
    } else if (f.ata) {
        classes.push('status-arrived');
    } else if (f.atd) {
        classes.push('status-departed');
    } else {
        classes.push('status-planned');
    }

    if (f.isDelay) {
        classes.push('status-delayed');
    }
    return classes;
});

const getStatusText = (flight: FlightItem) => {
    if (flight.isCancle) return '取消';
    if (flight.ata) return '到达';
    if (flight.atd) return '起飞';
    if (flight.isDelay) return '延误';
    return '计划';
};

const getStatusClass = (flight: FlightItem) => {
    if (flight.isCancle) return 'cancelled';
    if (flight.ata) return 'arrived';
    if (flight.atd) return 'departed';
    if (flight.isDelay) return 'delayed';
    return 'planned';
};

// Swipe actions
const handleTouchStart = (e: TouchEvent) => {
    startX.value = e.touches[0].clientX;
    currentX.value = startX.value;
    isSwiping.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping.value) return;
    currentX.value = e.touches[0].clientX;
    const diff = currentX.value - startX.value;
    // Limit swipe distance
    if (Math.abs(diff) < 150) {
        translateX.value = diff;
    }
};

const handleTouchEnd = () => {
    if (!isSwiping.value) return;
    isSwiping.value = false;
    const diff = currentX.value - startX.value;

    if (diff > 50) {
        console.log('Swiped Right on flight:', props.flight.flightNo);
        // Keep it open for demo or snap back
    } else if (diff < -50) {
        console.log('Swiped Left on flight:', props.flight.flightNo);
        // Keep it open for demo or snap back
    }

    // Snap back animation
    translateX.value = 0;
};


const getTimeClass = (actual: string, planned: string) => {
    if (!actual || !planned) return '';
    const actualTime = new Date(`2024/01/01 ${actual}`);
    const plannedTime = new Date(`2024/01/01 ${planned}`);
    if (isNaN(actualTime.getTime()) || isNaN(plannedTime.getTime())) {
        return '';
    }
    const diff = (actualTime.getTime() - plannedTime.getTime()) / (1000 * 60); // 分钟差
    if (diff > 15) return 'delayed';
    if (diff < -5) return 'early';
    return 'ontime';
};
</script>

<style lang="less" scoped>
.flight-card-wrapper {
    padding: 4px 0;
    position: relative;
    transition: transform 0.2s ease-out;
}

.flight-card {
    box-sizing: border-box;
    background: #fff;
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    border: 1rpx solid #e6e6e6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    transition: all 0.2s ease-in-out;

    &.status-planned {
        background-color: #f8f9fa;
    }
    &.status-departed {
        background-color: #feeeee;
    }
    &.status-arrived {
        background-color: #f5fff0;
    }
    &.status-cancelled {
        background-color: #f1f1f1;
        opacity: 0.6;
    }
    &.status-delayed {
        border: 1px solid #e67e7a;
        padding: 7px 11px; // adjust padding to account for border
    }


    .flight-row-1,
    .flight-row-2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .flight-row-1 {
        margin-bottom: 8px;

        .airport {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            font-weight: bold;
            color: #333;

            &:first-child {
                text-align: left;
            }

            &:last-child {
                text-align: right;
            }

            .city {
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }

            .code {
                font-size: 14px;
                color: #999;
            }
        }

        .flight-no {
            font-size: 14px;
            color: #555;
            background-color: #f0f0f0;
            padding: 2px 6px;
            border-radius: 4px;
            flex-shrink: 0;
            margin: 0 8px;
            text-align: center;
        }
    }

    .flight-row-2 {
        .time-group {
            flex: 1;
            display: flex;
            align-items: center;
            overflow: hidden;
            white-space: nowrap;

            &:first-child {
                justify-content: flex-start;
            }

            &:last-child {
                justify-content: flex-end;
            }

            .time-prefix {
                font-size: 12rpx;
                font-weight: bold;
                color: #f5f5f5;
                background-color: rgb(220, 220, 220);
                padding: 1px 4px;
                border-radius: 3px;
                // margin-right: 4px;
            }

            .time {
                font-size: 16px;
                font-weight: 500;
                margin-left: 2px;
            }

           .departure-time {
               &.time-atd { color: #c9302c; }
               &.time-etd { color: #d9534f; }
               &.time-std { color: #e67e7a; }
           }

           .arrival-time {
               &.time-ata { color: #4cae4c; }
               &.time-eta { color: #5cb85c; }
               &.time-sta { color: #82c982; }
           }

           &.departure-time-group {
               .time-atd + .time-prefix { background-color: #c9302c; }
               .time-etd + .time-prefix { background-color: #d9534f; }
               .time-std + .time-prefix { background-color: #e67e7a; }
           }

           &.arrival-time-group {
               .time-ata + .time-prefix { background-color: #4cae4c; }
               .time-eta + .time-prefix { background-color: #5cb85c; }
               .time-sta + .time-prefix { background-color: #82c982; }
           }
        }

        .aircraft-info {
            flex-shrink: 0;
            margin: 0 8px;
            font-size: 12px;
            color: #888;
            text-align: center;
        }
    }
}
</style>
