<template>
    <div class="rank-wrapper">
        <div class="top">
            <div class="title">月度排行</div>
            <div class="date">
                <div class="left" :class="isEnable.left ? '' : 'disable'" @click="clac(-1)">
                    <i class="zl-icon-left" />
                </div>
                <div class="str">{{ dateRange[0] }}年{{ dateRange[1] }}月</div>
                <div class="right" :class="isEnable.right ? '' : 'disable'" @click="clac(1)">
                    <i class="zl-icon-right" />
                </div>
            </div>

            <!-- <div class="summary">
                <span class="counter">{{ summary.participantCount }}</span>人飞了
                <span class="hour">{{ summary.totalFlightHours }}</span>小时
            </div> -->
            <div class="top3">
                <template v-for="pilot, index of [second, first, third]" :key="dateRange.join('-')+index+pilot?.name">
                    <div class="pai" v-if="pilot?.name" :class="`no${pilot.rank}`"
                        :style="`margin-top: ${pilot.rank * 6}px;`">
                        <div class="ser">TOP.{{ pilot.rank }}</div>
                        <!-- {{ dateRange.join('-') + pilot?.name }} -->
                        <!-- <userCardVue :userId="pilot.userId" :error="pilot.name" /> -->
                        <div class="name">{{ pilot.name }}</div>
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
                    <!-- <userCardVue :userId="pilot.userId" :error="pilot.name" /> -->
                    {{ pilot.name }}
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
import { ref, watch, onMounted, PropType, Ref, computed } from 'vue'
import userCardVue from '../hr/userCard.vue';
import dayjs from 'dayjs';
import api from '@/utils/api';
import CONFIG from '@/config';

type PilotStat = { rank: number, userId: string, name: string, totalFlightHours: number, avgFlightHours: number }
// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');
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
const isEnable = computed(() => {
    const old = dayjs(dateRange.value.join('-') + '-01');
    return {
        left: dayjs().add(-1, 'year').diff(old, 'month') <= 0,
        right: dayjs().diff(old, 'month') > 0,
    }
})
function clac(num: number) {
    if (loading.value) {
        return
    }
    const old = dayjs(dateRange.value.join('-') + '-01');
    console.log('----', old.format('YYYY-MM-DD'), dayjs().diff(old, 'month'), dayjs().add(-1, 'year').diff(old, 'month'))
    // old 和当前月份的月差值不能小于0,也和一年前不能大于0
    if (num > 0 && dayjs().diff(old, 'month') < 1) {
        return
    }
    if (dayjs().add(-1, 'year').diff(old, 'month') >= 0 && num < 0) {
        return;
    }
    const newDate = old.add(num, 'month').format('YYYY-MM');
    console.log('new', newDate, newDate.split('-'));
    dateRange.value = newDate.split('-') as [string, string];
}
// 获取统计数据和飞行员排名
watch(() => dateRange, async () => {
    try {
        loading.value = true;
        uni.showToast({ title: '加载中...', icon: 'loading', mask: true, duration: 33000 })
        const startDate = dayjs(dateRange.value.join('-') + '-01').toDate();
        const endDate = dayjs(startDate).endOf('month').toDate();

        // console.log('old', dayjs(startDate).format('YYYY-MM-DD'), endDate);
        const res = await api(CONFIG.url.statCrewFh, { startDate, endDate }) as any[];
        // console.log('飞行小时', res, dateRange.value.join('-') + '-01', startDate, endDate);
        const stat = res.map((pilot: any) => ({
            rank: -1,
            userId: pilot.userId,
            name: pilot.name,
            totalFlightHours: +(pilot.totalMinutes / 60).toFixed(2),
            avgFlightHours: +(pilot.avgMinutes / 60).toFixed(2),
        }));
        // 按照总飞行小时排序飞行员
        const sortStat = stat.sort((a, b) => b.totalFlightHours - a.totalFlightHours);
        sortStat.map((pilot, index) => {
            pilot.rank = index + 1;
        })
        // 计算参与飞行人数、总参与飞行小时和每日人均飞行小时
        summary.value.participantCount = stat.length;
        summary.value.totalFlightHours = parseFloat(stat.reduce((sum, pilot) => sum + pilot.totalFlightHours, 0).toFixed(2));
        // console.log('sortStat---', sortStat[0].name, sortStat[1].name, sortStat[2].name);
        first.value = sortStat.shift();
        second.value = sortStat.shift();
        third.value = sortStat.shift();
        data.value = sortStat;
        // 排序飞行员
    } catch (err) {
        error.value = '获取统计数据和飞行员排名失败';
    } finally {
        loading.value = false;
        uni.hideToast();
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

.loading {
    text-align: center;
}

// 定义生成气泡底部箭头的mixin
.arrow-effect(@color) {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    color: #464646;
    background-color: @color;
    position: relative;
    display: inline-block;
    width: 30vw;
    font-size: .8rem;
    height: 100px;
    text-align: center;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);

    .name {
        font-size: 1.1rem;
        font-weight: bold;
    }

    .ser {
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        background-color: lighten(@color, 10%)
    }

    &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 0;
        border-width: 15vw;
        border-style: solid;
        border-color: @color transparent transparent transparent;
    }
}

.rank-wrapper {
    background-color: #f8f8f8;
    // background-color: #e24f4f;
    // background: linear-gradient(to bottom right, @color-primary, @color-secondary);

    .top {
        .column;
        height: 40vh;
        width: 100%;
        justify-content: space-around;

        .title {
            font-size: 2rem;
            font-weight: bold;
        }

        .date {
            .row;
            justify-content: space-around;

            .left,
            .right {
                font-size: 1.6rem;
                color: #ffb2b2;
            }

            .left {
                margin-right: 2rem;
            }

            .right {
                margin-left: 2rem;
            }

            .disable {
                color: #cfcfcf;
            }
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
            align-items: start;


            .no1 {
                .arrow-effect(#FAC900);
            }

            .no2 {
                .arrow-effect(#C9C9C9);
            }

            .no3 {
                .arrow-effect(#FFA722);
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
        background-color: #ccc;

        .pilot {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
            margin: 4px 10px;
            padding: 4px;
            border-radius: 4px;


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
}
</style>