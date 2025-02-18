<template>
    <div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
            <!-- <van-cell title="点击选择时间段" :value="dateRangeText" @click="showCalendar = true" />
            <van-calendar :first-day-of-week="1"  v-model:show="showCalendar" :min-date="minDate" :max-date="maxDate" type="range"
                :max-range="62" @confirm="dateRangeChange" /> -->

            <div class="summary">
                <span class="counter">{{ summary.participantCount }}</span>人飞了
                <span class="hour">{{ summary.totalFlightHours }}</span>小时
            </div>

            <!-- <VanNoticeBar left-icon="info-o" text="点击下方条目可查看飞行员轨迹" /> -->
            <rank-list-vue :data="pilotsStat" @select="showPilotDetails" />

            <van-dialog v-model:show="showTrack" :title="`${selectedPilot?.name}(${selectedPilot?.userId})`"
                show-cancel-button :showConfirmButton="false">
                <track-vue :data="selectedPilot?.flightTracks" v-if="selectedPilot" :date-range="dateRange"
                    :user-id="selectedPilot?.userId" />
            </van-dialog>
            <van-back-top></van-back-top>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
// import zlNav from '@/components/Nav.vue';
import api from '@/utils/api';
import dayjs from 'dayjs';
import CONFIG from '@/config';
import { AirportItem, FlightItem } from '@/interface';
import usebasisStore from '@/store/basis.store';
import RankListVue from './rank.vue';
import TrackVue from './track.vue';
// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');
// 定义相关状态
const showCalendar = ref(false);
const showTrack = ref(false);

const selectedPilot = ref<any>(null);
// 日历最大选择范围
const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 3));
const maxDate = new Date();

const dateRange = ref<[Date, Date]>([
    dayjs().startOf('month').subtract(1, 'month').toDate(),
    dayjs().startOf('month').subtract(1, 'day').toDate()
]);

const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

const dateRangeText = computed(() => {
    const [start, end] = dateRange.value;
    return `${formatDate(start)} - ${formatDate(end)}`;
});

// 定义统计数据
const summary = ref({
    participantCount: 0,
    totalFlightHours: 0,
    avgFlightHoursPerDay: 0,
});

const pilotsStat = ref<any[]>([]);

// 获取统计数据和飞行员排名
const fetchStatsAndRankings = async (startDate: string, endDate: string) => {
    try {
        const res = await api(CONFIG.url.statCrewFh, { startDate, endDate }) as any[];
        // console.log(res);
        const stat = res.map((pilot: any) => ({
            rank: -1,
            userId: pilot.userId,
            name: pilot.name,
            totalFlightHours: +(pilot.minutes / 60).toFixed(2),
            avgFlightHours: +(pilot.avgMinutes / 60).toFixed(2),
        }));

        const sortStat = stat.sort((a, b) => b.totalFlightHours - a.totalFlightHours);
        sortStat.map((pilot, index) => {
            pilot.rank = index + 1;
        })
        // 计算参与飞行人数、总参与飞行小时和每日人均飞行小时
        summary.value.participantCount = stat.length;
        summary.value.totalFlightHours = parseFloat(stat.reduce((sum, pilot) => sum + pilot.totalFlightHours, 0).toFixed(2));
        // const totalDays = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
        // summary.value.avgFlightHoursPerDay = parseFloat((summary.value.totalFlightHours / (pilotsStat.length  )).toFixed(2));
        pilotsStat.value = sortStat;
        // 排序飞行员
    } catch (err) {
        error.value = '获取统计数据和飞行员排名失败';
    }
};



// 日历选择确认事件
const dateRangeChange = (dates: [Date, Date]) => {
    showCalendar.value = false;
    dateRange.value = dates;
    const startDate = dayjs(dates[0]).format('YYYY-MM-DD');
    const endDate = dayjs(dates[1]).format('YYYY-MM-DD');
    fetchStatsAndRankings(startDate, endDate);
};

// 显示飞行员轨迹
const showPilotDetails = (pilot: any) => {
    selectedPilot.value = pilot;
    showTrack.value = true;
};

// 组件挂载时初始化
onMounted(() => {
    const startDate = dayjs(dateRange.value[0]).format('YYYY-MM-DD');
    const endDate = dayjs(dateRange.value[1]).format('YYYY-MM-DD');
    fetchStatsAndRankings(startDate, endDate);
});
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.loading,
.error {
    text-align: center;
    margin-top: 20px;
}

.summary {
    justify-content: space-around;
    text-align: center;

    .counter {
        font-weight: bold;
    }

    .hour {
        font-weight: bold;
    }
}
</style>