<template>
    <div class="rank-wrapper">
        <div class="top">
            <!-- <div class="show-more" @click="showDetail">
                显示所有
            </div> -->
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
            <div class="top3">
                <template v-for="pilot, index of [second, first, third]" :key="dateRange.join('-')+index+pilot?.name">
                    <div class="pai" v-if="pilot?.name" :class="`no${pilot.rank}`"
                        :style="`margin-top: ${pilot.rank * 6}px;`">
                        <div class="ser">TOP.{{ pilot.rank }}</div>
                        <!-- {{ dateRange.join('-') + pilot?.name }} -->
                        <!-- <userCardVue :userId="pilot.userId" :error="pilot.name" /> -->
                        <div class="name" @click="showPilotProfile(pilot.userId)">{{ pilot.name }}
                            <span v-for="tech of techName(pilot.userId)"
                                :key="pilot.userId + tech.acType + tech.techName" class="tech" :class="tech.techName">
                                {{ tech.techName }}
                            </span>
                        </div>
                        <div class="data">
                            <div class="total">
                                总<span class="value">{{ `${pilot.totalFlightHours}小时` }} </span>
                            </div>
                            <div class="avg">
                                日<span class="value">{{ `${pilot.avgFlightHours}小时` }}</span>
                            </div>
                            <i class="zl-icon-magnifier" @click="jump(pilot.userId)" />
                        </div>
                    </div>
                </template>
            </div>

        </div>
        <div class="normal" v-if="showNormal">
            <div v-for="pilot in data" class="pilot" :key="pilot.userId">
                <span class="icon" :class="`no${pilot.rank}`">
                    <template> {{ pilot.rank }}</template>
                </span>
                <div class="name" @click="showPilotProfile(pilot.userId)">
                    {{ pilot.name }}
                    <span v-for="tech of techName(pilot.userId)" :key="pilot.userId + tech.acType + tech.techName"
                        class="tech" :class="tech.techName">
                        {{ tech.techName }}
                    </span>
                </div>
                <div class="data">
                    <div class="total">
                        总<span class="value">{{ `${pilot.totalFlightHours}小时` }} </span>
                    </div>
                    <div class="avg">
                        日<span class="value">{{ `${pilot.avgFlightHours}小时` }}</span>
                    </div>
                    <i class="zl-icon-magnifier" @click="jump(pilot.userId)" />
                </div>
            </div>
        </div>
        <press-action-sheet :show="showProfile" title="员工信息" @close="showProfile = false">
            <Profile :userId="selectUserId" v-if="showProfile" />
        </press-action-sheet>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted, PropType, Ref, computed } from 'vue'
import dayjs from 'dayjs';
import api from '@/utils/api';
import CONFIG from '@/config';
import Profile from '@/pages/hr/profile.vue';
import useUserStore from '@/store/user.store';
const store = useUserStore();
type PilotStat = { rank: number, userId: string, name: string, totalFlightHours: number, avgFlightHours: number }

// const props = defineProps({
//     showMore: { type: Boolean, default: false }
// })
const emits = defineEmits(['showMore', 'select']);

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');
const showProfile = ref(false);
const showNormal = ref(true);
const selectUserId = ref('');
function showPilotProfile(userId: string) {
    console.log('showPilotProfile', userId)
    if (userId) {
        selectUserId.value = userId;
        showProfile.value = true;
    }
}
function jump(userId: string) {
    // console.log('showDetail', showNormal.value)
    if (userId) {
        uni.navigateTo({ url: `/pages/pilot/portrait?${userId}` });
    }
    // showNormal.value = !showNormal.value;
    // emits('showMore')
}
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
function techName(userId: string) {
    const pilots = store.pilots;
    const pilot = pilots[userId];
    const techs = pilot?.techs;

    if (!techs) return [];
    const oreder = ["F0", "FR", "F1", "F2", "F3", "F4", "F5", "F6", "C0", "C1", "C2", "C3", "TA", "TB", "TC"];
    const sorted = [...techs].sort((a, b) => oreder.indexOf(b.techName) - oreder.indexOf(a.techName));

    // 去重并保留最高优先级
    const res = [];
    const seen = new Set();
    for (const tech of sorted) {
        const key = tech.acType.slice(0, 2);
        if (!seen.has(key)) {
            seen.add(key);
            res.push({
                acType: tech.acType,
                techName: tech.techName,
            });
        }
    }
    return res;
}

// 获取统计数据和飞行员排名
watch(() => dateRange, async () => {
    try {
        loading.value = true;
        uni.showToast({ title: '加载中...', icon: 'loading', mask: true, duration: 33000 })
        const startDate = dayjs(dateRange.value.join('-') + '-01').toDate();
        const endDate = dayjs(startDate).endOf('month').toDate();
        const res = await api(CONFIG.url.statCrewFh, { startDate, endDate }) as any[];
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

onMounted(() => {
    store.getPilots();
})
</script>
<style lang="less" scoped>
@import '@/css/base.less';
@color-pilot-serial: #1890FF;

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
        align-items: flex-start
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
    background-color: @color-pilot;
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
                color: lighten(@color-pilot, 40%)
            }

            .left {
                margin-right: 2rem;
            }

            .right {
                margin-left: 2rem;
            }

            .disable {
                color: lighten(@color-pilot, 5%);
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
                .arrow-effect(@color-no1);
            }

            .no2 {
                .arrow-effect(@color-no2);
            }

            .no3 {
                .arrow-effect(@color-no3);
            }
        }

        .show-more {
            border-radius: 4px;
            margin: 10px;
            border: solid 1px #464646;
            background-color: #fff;
        }
    }

    .normal {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-top: 10px;
        border-top-left-radius: 14px;
        border-top-right-radius: 14px;
        box-sizing: border-box;
        background-color: #fff;

        .info {
            color: #999;
            text-align: center;
            overflow: hidden;
            margin: 4px auto;
            padding: 4px 10px;
            width: 100%;
            box-sizing: border-box;
            font-size: .9rem;
        }

        .pilot {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
            margin: 4px 10px;
            padding: 4px;
            border-radius: 4px;

            // 斑马纹效果
            &:nth-child(even) {
                background-color: #f5f5f599; // 浅灰色半透明
            }

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

// 添加在样式文件顶部
@color-tech-begin: #1890ff; // 起始颜色
@color-tech-end: #ff0000; // 结束颜色

.tech {
    // border: solid 1px #eee;
    // background-color: #eee;
    // border: auto 1px;
    // border-radius: 2px;
    font-size: .8rem;

    // 循环生成颜色类（修改参数格式）
    .tech-color-loop(@tech-list, @index: 0) when (@index < length(@tech-list)) {
        @tech: extract(@tech-list, @index + 1);
        // 添加括号明确除法运算
        @mix-ratio: percentage((@index / (length(@tech-list) - 1)));

        &.@{tech} {
            color: mix(@color-tech-end, @color-tech-begin, @mix-ratio);
        }

        .tech-color-loop(@tech-list, @index + 1);
    }

    @tech-list: F0, FR, F1, F2, F3, F4, F5, F6, C0, C1, C2, C3, TA, TB, TC;
    .tech-color-loop(@tech-list);
}
</style>