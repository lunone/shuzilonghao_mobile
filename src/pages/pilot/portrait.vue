<template>
    <div class="portrait-wrapper">
        <!-- 头部信息 -->
        <div class="header-info">
            <img src="https://placehold.co/80x120" alt="用户头像" class="user-avatar">
            <div class="user-details">
                <p>姓名: {{ pilot.name }}</p>
                <p>手机: {{ pilot.mobile }}</p>
                <!-- 其他信息 -->
                <span v-for="tech in techs" :key="tech.acType + tech.techName">
                    {{ tech.acType }}/{{ tech.techName }}
                </span>
            </div>
        </div>

        <!-- 日历 -->
        <div class="calendar">
            <div v-for="day in days" :key="day.index" class="day" :class="day.className" @click="showDetail(day)">
                <span>{{ day.name }}</span>
            </div>
        </div>

        <!-- 基本信息 -->
        <div class="basic-info">
            <h3>基本信息</h3>
            <p>证件号码: {{ pilot.idNo }}</p>
            <p>出生日期: {{ pilot.birthday }}</p>
            <p>籍贯: {{ pilot.nativePlace }}</p>
        </div>

        <!-- 职业信息 -->
        <div class="career-info">
            <h3>职业信息</h3>
            <p>学校: {{ pilot.college }}</p>
            <!-- 其他职业信息 -->
        </div>
    </div>
</template>

<script setup lang="ts">
import CONFIG from '@/config';
import api from '@/utils/api';
import { computed, Ref, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import dayjs from 'dayjs';
import userStore from '@/store/user.store';
import useBasisStore from '@/store/basis.store';
const store = userStore();
const basisStore = useBasisStore();
// const city = basisStore.city;
const userId = ref('');
const pilot = ref({}) as Ref<Record<string, any>>;
const startDate = dayjs()
const endDate = dayjs().add(15, 'day')
const trainings = ref([]) as Ref<{ name: string, startDate: Date, endDate: Date, baseName: string }[]>;
const duties = ref([]) as Ref<{ arr: string, dep: string, flightDate: Date, flightNo: string, flyMinute: number }[]>;
const absences = ref([]) as Ref<{ code: string, ddoCode: string, ddoType: string, startDate: Date, endDate: Date, title: string, detail: string, userId: string }[]>;
const dayLength = 14;
// 技术等级
const techs = computed(() => {
    if (!userId.value) return;
    const techs = store.getPilots[userId.value]?.techs;
    console.log(techs);
    return techs || []
})
// 日历
const days = computed(() => {
    const arr = [];
    for (let i = 0; i < dayLength; i++) {
        const day = startDate.add(i, 'day').add(1, 'hour');// 加1小时是因为防止边界判断
        let className = '', index = day.format('DD'), name = index;
        const trainingsDay = trainings.value.find(t => day.isAfter(t.startDate) && day.isBefore(t.endDate));
        const dutyDay = duties.value.filter(t => day.isSame(t.flightDate, 'day'));
        const absenceDay = absences.value.find(t => day.isAfter(t.startDate) && day.isBefore(t.endDate));
        let data;
        // console.log('111111111', day.format('YYYY-MM-DD'), absences.value);
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
                const dep = basisStore.getCity(d.dep);
                const arr = basisStore.getCity(d.arr);
                return `${d.flightNo}(${time})${dep} - ${arr}`
            }).join('|')
        })
    }
}

onLoad(e => {
    if (!e.code) return;
    const userData = { userId: e.code, idType: 'code' }
    const dateData = { startDate: startDate.toDate(), endDate: endDate.toDate() }
    Promise.allSettled([
        store.fetchPilots(), basisStore.fetchAirports(),
        api(CONFIG.url.pilotProfile, userData).then(res => pilot.value = res || {}),
        api(CONFIG.url.pilotTraining, { code: e.code, ...dateData }).then(res => trainings.value = res || []),
        api(CONFIG.url.pilotDuty, { ...userData, ...dateData }).then(res => duties.value = res || []),
        api(CONFIG.url.pilotAbsence, { ...userData, ...dateData }).then(res => absences.value = res || []),
    ]).catch(err => console.log('获取信息', err));
});
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.portrait-wrapper {
    padding: 20px;
    font-family: Arial, sans-serif;

    .header-info {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .user-avatar {
            width: 100px;
            height: 100px;
            border-radius: 10%;
        }

        .user-details {
            p {
                margin: 5px 0;
            }
        }
    }

    .calendar {
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

    .basic-info,
    .career-info {
        h3 {
            margin-bottom: 10px;
        }

        p {
            margin: 5px 0;
        }
    }
}
</style>