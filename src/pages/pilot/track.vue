<template>
    <div class="flight-tracks">
        <van-notice-bar left-icon="volume-o" text="">
            <template #>
                点击 <van-icon class-prefix="zl-icon" :name="`dep`" /> 显示当日航班
            </template>
        </van-notice-bar>
        <van-calendar :first-day-of-week="1" :row-height="30" :poppable="false" :show-confirm="false" :show-mark="true"
            :show-title="false" :show-subtitle="false" :min-date="dateRange[0]" :max-date="dateRange[1]"
            @select="showDate">
            <template #text="{ date, text, type, topInfo, bottomInfo, className }">
                <div class="day">
                    <div class="mark" v-if="flights[dayjs(date).format('YYYY-MM-DD')]">
                        <van-icon class-prefix="zl-icon" :name="`dep`" />
                    </div>
                    <div v-else class="">{{ text }}</div>
                </div>
            </template>
        </van-calendar :first-day-of-week="1">
        <div v-if="dateFlights.length">
            <div class="flight" v-for="flight in dateFlights" :key="flight.id">
                <span class="no">{{ flight.flightNo }}</span>
                <span class="reg">{{ flight.acReg }}</span>
                <span class="route">
                    {{ flight.depName || flight.dep }} - {{ flight.arrName || flight.arr }}
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { AirportItem, FlightItem } from '@/interface';
import usebasisStore from '@/store/basis.store';
import api from '@/utils/api';
import dayjs from 'dayjs';
import CONFIG from '@/config';
import { onMounted, PropType, ref, watch } from 'vue';
const props = defineProps({
    dateRange: {
        type: Array as unknown as PropType<[Date, Date]>,
        default: () => [dayjs().subtract(1, 'month').toDate(), dayjs().toDate()]
    },
    userId: { type: String, default: '' },
});

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

// 定义 airports 数据，用于存储机场信息
const airports = ref<Record<string, AirportItem>>({});
// 定义飞行员轨迹
const selectedDate = ref<Date | null>(null);
const dateFlights = ref<any[]>([]);
const flights = ref<Record<string, FlightItem[]>>({});
const store = usebasisStore();

// 获取飞行员轨迹
const fetchFlightTracks = async (startDate: Date, endDate: Date, userId: string) => {
    try {
        const res = await api(CONFIG.url.crewFlights, { startDate, endDate, userId }) as FlightItem[];
        // 这里给res加上arrName,depName;
        res.map((flight: FlightItem) => {
            flight.arrName = airports.value[flight.arr!]?.city;
            flight.depName = airports.value[flight.dep!]?.city;
        })
        flights.value = res.reduce((acc, flight: FlightItem) => {
            const date = dayjs(flight.atd).format('YYYY-MM-DD');
            return { ...acc, [date]: [...(acc[date] || []), flight] };
        }, {});
        // console.log('轨迹', res);
    } catch (err) {
        error.value = '获取飞行员轨迹失败';
    }
};
watch(() => [props.userId, props.dateRange], (userId) => {
    const startDate = dayjs(props.dateRange[0]).toDate();
    const endDate = dayjs(props.dateRange[1]).toDate();
    fetchFlightTracks(startDate, endDate, props.userId);
}, { deep: true, immediate: true });
// 获取机场信息
const fetchAirports = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await store.fetchAirports ;
        // airports.value = res;
    } catch (err) {
        error.value = '获取机场信息失败';
    } finally {
        loading.value = false;
    }
};


// 飞行员日历点击事件
const showDate = (date: Date) => {
    selectedDate.value = date;
    dateFlights.value = flights.value[dayjs(date).format('YYYY-MM-DD')] ?? []
};

onMounted(() => {
    fetchAirports();
});
</script>
<style lang="less" scoped>
.flight-tracks {
    margin-bottom: 20px;

    .day {
        .mark {
            color: rgb(192, 83, 32);
        }


    }
}

.flight {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 5px auto;

    .no {
        color: #aaa;
    }
}
</style>