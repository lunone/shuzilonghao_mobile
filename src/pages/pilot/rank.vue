<template>
    <div class="rank-wrapper">
        <div class="top">
            <div class="date">
                <div class="left" @click="clac(-1)">-</div>
                <div class="date">{{ dateRange[0] }}年{{ dateRange[1] }}月</div>
                <div class="right" @click="clac(1)">+</div>
            </div>

            <div class="title">飞行排行榜</div>
            <div class="summary">
                <span class="counter">{{ summary.participantCount }}</span>人飞了
                <span class="hour">{{ summary.totalFlightHours }}</span>小时
            </div>
            <div class="top3">
                <template v-for="pilot of [second, first, third]" :key="pilot?.name">
                    <div class="pai second" v-if="pilot?.name" :style="`margin-top: ${pilot.rank * 6}px`">
                        <div class="ser">TOP.{{ pilot.rank }}</div>
                        <userCardVue :userId="pilot.userId" :error="pilot.name" />
                        <div class="data">
                            <div class="total" @click="showPilotDetails(pilot)">
                                总<span class="value">{{ `${pilot.totalFlightHours}小时` }} </span>
                            </div>
                            <div class="avg">
                                日<span class="value">{{ `${pilot.avgFlightHours}小时` }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="normal">
            <div v-for="pilot in data" class="pilot" :key="pilot.userId">
                <span class="icon" :class="`no${pilot.rank}`">
                    <template> {{ pilot.rank }}</template>
                </span>
                <div class="name">
                    <userCardVue :userId="pilot.userId" :error="pilot.name" />
                </div>
                <div class="data">
                    <div class="total" @click="showPilotDetails(pilot)">
                        总<span class="value">{{ `${pilot.totalFlightHours}小时` }} </span>
                    </div>
                    <div class="avg">
                        日<span class="value">{{ `${pilot.avgFlightHours}小时` }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted, PropType, Ref } from 'vue'
import userCardVue from '../hr/userCard.vue';
import dayjs from 'dayjs';
import api from '@/utils/api';
import CONFIG from '@/config';

type PilotStat = { rank: number, userId: string, name: string, totalFlightHours: number, avgFlightHours: number }
// const props = defineProps({
//     data: { type: Array as PropType<PilotStat[]>, default: () => [] },
// })
const data = ref([]) as Ref<PilotStat[]>;
const dateRange = ref<[string, string]>([dayjs().format('YYYY'), dayjs().format('MM')]);
// const dateStr = ref('');
const first = ref({}) as Ref<PilotStat>;
const second = ref({}) as Ref<PilotStat>;
const third = ref({}) as Ref<PilotStat>;

// 定义统计数据
const summary = ref({
    participantCount: 0,
    totalFlightHours: 0,
    avgFlightHoursPerDay: 0,
});
const emits = defineEmits(['select'])
// const value1 = ref(1)
// const option1 = ref([
//     { text: '全部商品', value: 0 },
//     { text: '新款商品', value: 1 },
//     { text: '活动商品', value: 2 },
// ])
// const showMonth = (e) => {
//     console.log('month', e);
// }
function clac(num: number) {
    const old = dayjs(dateRange.value.join('-') + '-01');
    const newDate = old.add(num, 'month');
    dateRange.value = [newDate.format('YY'), newDate.format('MM')];
}
// 获取统计数据和飞行员排名
watch(() => dateRange, async () => {
    try {
        const startDate = dayjs(dateRange.value.join('-') + '-01').toDate();
        const endDate = dayjs(dateRange.value.join('-') + '-31').toDate();

        const res = await api(CONFIG.url.statCrewFh, { startDate, endDate }) as any[];
        console.log('飞行小时', res, startDate, endDate);
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
       
        first.value = sortStat.shift();
        second.value = sortStat.shift();
        third.value = sortStat.shift();
        data.value = sortStat;
        // 排序飞行员
    } catch (err) {
        // error.value = '获取统计数据和飞行员排名失败';
    }
}, { immediate: true, deep: true })

const showPilotDetails = (pilot: any) => {
    emits('select', pilot);
}

onMounted(() => {
})
</script>
<style lang="less" scoped>
@import '@/css/base.less';

.top {
    .column;
    height: 40vh;
    width: 100%;
    background-color: #e24f4f;
    justify-content: space-around;
    background: linear-gradient(to bottom right, @color-primary, @color-secondary);

    .date {
        .row;
        justify-content: flex-end;
    }

    .title {
        font-size: 1.2rem;
    }

    .top3 {
        .row;
        flex-grow: 1;
        justify-content: space-between;
        width: 100%;
        padding: 20px;
        margin-bottom: 4vw;
        padding: 10px;
        /* margin: 0 1vw; */
        box-sizing: border-box;

        .pai {
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            color: #464646;
            background-color: #ddd;
            position: relative;
            display: inline-block;
            width: 30vw;
            font-size: .8rem;
            text-align: center;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);

            &::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 0;
                border-width: 15vw;
                border-style: solid;
                border-color: #ddd transparent transparent transparent;
            }

            .name {
                font-size: 1.1rem;
                font-weight: bold;
            }
        }
    }
}

// .bubble {

//   background-color: #4CAF50;
//   color: white;
//   padding: 10px 20px;
//   border-radius: 5px;
// }


.normal {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
    box-sizing: border-box;

    .pilot {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        text-align: center;
        margin: 4px 10px;
        padding: 4px;
        border-radius: 4px;
        background-color: #fafafa;

        .icon {
            font-size: 1rem;
            width: 10vw;
            text-align: center;
            padding-left: -5vw;
            color: red;
            // border: 1px solid #eee;
        }



        .name {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            width: 20vw;
            text-align: left;
            font-weight: bold;
            color: #555;

            // border: 1px solid red;
            .id {
                font-weight: normal;
                color: #aaa;
            }
        }

        .data {
            display: flex;
            text-align: right;
            color: #aaa;
            justify-content: space-between;
            flex: 1;

            .value {
                color: #464646;
                // font-weight: bold;
            }
        }
    }
}
</style>