<template>
    <div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
            <!-- <van-cell title="点击选择时间段" :value="dateRangeText" @click="showCalendar = true" />
            <van-calendar :first-day-of-week="1"  v-model:show="showCalendar" :min-date="minDate" :max-date="maxDate" type="range"
                :max-range="62" @confirm="dateRangeChange" /> -->

          

            <!-- <VanNoticeBar left-icon="info-o" text="点击下方条目可查看飞行员轨迹" /> -->
            <rank-list-vue   />

            <van-dialog v-model:show="showTrack" :title="`${selectedPilot?.name}(${selectedPilot?.userId})`"
                show-cancel-button :showConfirmButton="false">
                <track-vue :data="selectedPilot?.flightTracks" v-if="selectedPilot"  
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

// const dateRange = ref<[Date, Date]>([
//     dayjs().startOf('month').subtract(1, 'month').toDate(),
//     dayjs().startOf('month').subtract(1, 'day').toDate()
// ]);

// const formatDate = (date: Date) => {
//     return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
// };

// const dateRangeText = computed(() => {
//     const [start, end] = dateRange.value;
//     return `${formatDate(start)} - ${formatDate(end)}`;
// });


// const pilotsStat = ref<any[]>([]);




// // 日历选择确认事件
// const dateRangeChange = (dates: [Date, Date]) => {
//     showCalendar.value = false;
//     dateRange.value = dates;
// };

// // 显示飞行员轨迹
// const showPilotDetails = (pilot: any) => {
//     selectedPilot.value = pilot;
//     showTrack.value = true;
// };

// 组件挂载时初始化
onMounted(() => {

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