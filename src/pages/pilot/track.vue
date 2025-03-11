<template>
    <div class="flight-tracks-wrapper">
        <div v-for="day in days" :key="day.index" class="day" :class="day.className" @click="showDetail(day)">
            <span>{{ day.name }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useAirportStore } from '@/store/airport.store';
import api from '@/utils/api';
import dayjs from 'dayjs';
import CONFIG from '@/config';
import { computed, onMounted, PropType, Ref, ref, watch } from 'vue';

const props = defineProps({
    startDate: { type: Date, default: () => dayjs().startOf('day').toDate() },
    endDate: { type: Date, default: () => dayjs().add(14, 'day').toDate() },
    pcode: { type: String, default: '' },
});
const trainings = ref([]) as Ref<{ name: string, startDate: Date, endDate: Date, baseName: string }[]>;
const duties = ref([]) as Ref<{ arr: string, dep: string, flightDate: Date, flightNo: string, flyMinute: number }[]>;
const absences = ref([]) as Ref<{ code: string, ddoCode: string, ddoType: string, startDate: Date, endDate: Date, title: string, detail: string, userId: string }[]>;

const { getCity, fetchAirports } = useAirportStore();

// 日历
const days = computed(() => {
    const arr = [];
    const startDate = dayjs(props.startDate);
    const dayLength = dayjs(props.endDate).diff(startDate, 'day');
    // console.log('00000000000', dayLength);
    for (let i = 0; i < dayLength; i++) {
        const day = startDate.add(i, 'day').add(1, 'hour');// 加1小时是因为防止边界判断
        let className = '', index = day.format('DD'), name = index;
        const trainingsDay = trainings.value.find(t => day.isAfter(t.startDate) && day.isBefore(t.endDate));
        const dutyDay = duties.value.filter(t => day.isSame(t.flightDate, 'day'));
        const absenceDay = absences.value.find(t => day.isAfter(t.startDate) && day.isBefore(t.endDate));
        let data;
        if (trainingsDay) {
            name = '培';
            className = 'training';
            data = trainingsDay;
        } else if (dutyDay.length) {
            name = '飞';
            className = 'duty';
            data = dutyDay;
        } else if (absenceDay) {
            name = '休';
            className = 'absence';
            data = absenceDay;
        }
        if (day.isSame(dayjs(), 'day')) {
            className += ' today';
        }
        arr.push({ index, name, className, data });
    }
    return arr;
})

function showDetail(day: { name: string, className: string, data: any }) {
    if (day.className == 'training') {
        uni.showToast({ title: `${day.data.baseName} : ${day.data.name}`, icon: 'none', duration: 2e3 })
    } else if (day.className == 'absence') {
        uni.showToast({ icon: 'none', duration: 2e3, title: day.data.detail || day.data.title })
    } else if (day.className == 'duty') {
        uni.showToast({
            icon: 'none', duration: 2e3,
            title: day.data.map((d: any) => {
                const time = `${dayjs(d.atd || d.std).format('HH:mm')}-${dayjs(d.ata || d.sta).format('HH:mm')}`;
                const dep = getCity(d.dep);
                const arr = getCity(d.arr);
                return `${d.flightNo}(${time})${dep} - ${arr}`
            }).join('|')
        })
    }
}
watch(() => props.pcode, () => {
    if (!props.pcode) return;
    const userData = { userId: props.pcode, idType: 'pcode' }
    const dateData = { startDate: props.startDate, endDate: props.endDate }
    Promise.allSettled([
        fetchAirports(),
        api(CONFIG.url.pilotTraining, { ...userData, ...dateData }).then(res => trainings.value = res || []),
        api(CONFIG.url.pilotDuty, { ...userData, ...dateData }).then(res => duties.value = res || []),
        api(CONFIG.url.pilotAbsence, { ...userData, ...dateData }).then(res => absences.value = res || []),
    ]).then((arr) => {
        console.log('获取信息', arr, trainings.value, duties.value, absences.value);
    }).catch(err => console.log('获取信息', err));
})


</script>
<style lang="less" scoped>
.flight-tracks-wrapper {

    display: grid;
    grid-template-columns: repeat(7, 1fr);
    /* 每行显示 7 个 .day */
    gap: 8px;
    /* 设置单元格之间的间距 */
    margin-bottom: 10px;
    border: solid 1px #ccc;
    border-radius: 10px;
    padding: 10px;
    // background-color: #ccc;

    .day {
        padding: 10px;
        background-color: #f0f0f0;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        /* 文字居中对齐 */
        // font-size: 14px;
        /* 调整字体大小 */
        color: #333;
        /* 调整文字颜色 */

        &.today {
            border: solid 1px red;
        }
    }
}


// .flight {
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     padding: 5px auto;

//     .no {
//         color: #aaa;
//     }
// }</style>