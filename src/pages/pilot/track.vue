<template>
    <div class="flight-tracks-wrapper">
        <div v-for="day in days" :key="day.index" class="day" :class="day.className" @click="showDetail(day)">
            <i v-if="day.name" :class="`zl-icon-${day.name}`" />
            <span v-else>{{ day.index }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useAirportStore } from '@/store/airport.store';
import { getPilotTraining, getPilotDuty, getPilotAbsence } from '@/api/pilot.api';
import dayjs from 'dayjs';
import { computed, onMounted, PropType, Ref, ref, watch } from 'vue';

const props = defineProps({
    startDate: { type: Date, default: () => dayjs().startOf('day').toDate() },
    endDate: { type: Date, default: () => dayjs().add(14, 'day').toDate() },
    pcode: { type: String, default: '' },
});
const trainings = ref([]) as Ref<{ name: string, startDate: Date, endDate: Date, baseName: string }[]>;
const duties = ref([]) as Ref<{ arr: string, dep: string, flightDate: Date, flightNo: string, flyMinute: number }[]>;
const absences = ref([]) as Ref<{ code: string, ddoCode: string, ddoType: string, startDate: Date, endDate: Date, title: string, detail: string, userId: string }[]>;

const airportStore = useAirportStore();
const absenceReasons = {
    grounded: ['技术资质停飞', '安全停飞', '行政停飞', '其他停飞', '辞职停飞', '身体原因停飞', '停飞'],
    vacation: ['3天非隔离休息', '月假', '陪产假', '疗养假', '事假', '隔离'],
    learn: ['授课', '理论学习', '班组线下培训', '中国民航管理干部学院培训', '安保培训', '飞行员线下培训',
        '差异理论培训', '部门培训', '部门培训补训', '定期地面理论学习', '飞管线下培训', '班组及飞管线下培训'],
    job: ['飞行值班', 'D1', '外站过夜', '出差'],
    meeting: ['会议', '排练'],
    foc: ['分部运行需求-占位', '个人运行需求-占位', '分部运行需求-不占位', '个人运行需求-不占位'],
    hospital: ['体检', '体检复查'],
    more: ['其他活动'],
};

// 日历
const days = computed(() => {
    const arr = [];
    const startDate = dayjs(props.startDate);
    const dayLength = dayjs(props.endDate).diff(startDate, 'day');
    for (let i = 0; i < dayLength; i++) {
        const day = startDate.add(i, 'day').add(1, 'hour');// 加1小时是因为防止边界判断
        let className = '', index = day.format('DD'), name = '';
        const trainingsDay = trainings.value.find(t => day.isSame(t.startDate, 'day') || day.isSame(t.endDate, 'day'));
        const dutyDay = duties.value.filter(t => day.isSame(t.flightDate, 'day'));
        const absenceDay = absences.value.find(t => day.isSame(t.startDate, 'day') || day.isSame(t.endDate, 'day'));

        let data;
        if (trainingsDay) {
            name = 'learn';
            className = 'training';
            data = trainingsDay;
        } else if (dutyDay.length) {
            name = 'dep';
            className = 'duty';
            data = dutyDay;
        } else if (absenceDay) {
            // 在absenceReasons中查找key
            for (let key in absenceReasons) {
                if (absenceReasons[key].includes(absenceDay.title)) {
                    name = key;
                    break;
                }
            }
            // console.log('absenceReasons', absenceReasons, absenceDay)
            // name = '休';
            className = 'absence';
            data = absenceDay;
        }
        // if (day.isSame(dayjs(), 'day')) {
        //     className = 'today';
        // }
        arr.push({ index, name, className, data, day });
    }
    return arr;
})

function showDetail(date: { day: Date, index: string, name: string, className: string, data: any }) {
    const { day, index, name, className, data } = date;
    if (className == 'training') {
        uni.showToast({ title: `${dayjs(day).format('M月DD日')}${data.baseName} : ${data.name}`, icon: 'none', duration: 2e3 })
    } else if (className == 'absence') {
        uni.showToast({ icon: 'none', duration: 2e3, title: `${dayjs(day).format('M月DD日')}` + (data.detail || data.title) })
    } else if (className == 'duty') {
        uni.showToast({
            icon: 'none', duration: 2e3,
            title: `${dayjs(day).format('M月DD日')}` + data.map((d: any) => {
                const time = `${dayjs(d.atd || d.std).format('HH:mm')}-${dayjs(d.ata || d.sta).format('HH:mm')}`;
                const dep = airportStore.getCity(d.dep);
                const arr = airportStore.getCity(d.arr);
                return `${d.flightNo}(${time})${dep} - ${arr}`
            }).join('|')
        })
    }
}

watch(() => props.pcode, () => {
    if (!props.pcode) return;
    const data = { userId: props.pcode, idType: 'pcode', startDate: props.startDate, endDate: props.endDate }
    Promise.allSettled([
        airportStore.fetchAirports(),
        getPilotTraining(data).then(res => trainings.value = res.data.data || []),
        getPilotDuty(data).then(res => duties.value = res.data.data || []),
        getPilotAbsence(data).then(res => absences.value = res.data.data || []),
    ]).then((arr) => console.log('获取信息train,duty,absence', arr))
        .catch(err => console.warn('错误', err));
}, { immediate: true, deep: true })

</script>
<style lang="less" scoped>
@import '@/css/base.less';

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

        &.training {
            background-color: #9ba9fa;
            color: #333;
        }

        &.duty {
            background-color: #fc9c9c;
            color: #333;
        }

        &.absence {
            background-color: #91e28e;
            color: #333;
        }
    }
}
</style>