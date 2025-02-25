<template>
    <div class="sms-wrapper">
        <div class="header">
            <div class="title">安全趋势</div>
            <ucharts :option="pieOption" @select="showTip" :height="200" />
        </div>
        <div class="detail">
            <div class="title">{{ title }} 详情</div>
            <div class="tabs">
                <press-tabs :active="tabCurrent" @change="onClickItem">
                    <press-tab :title="`主动报告(${select.voluntarys})`">
                        <voluntarysVue :range="selectRange" @loading="loading2" />
                    </press-tab>
                    <press-tab :title="`事件(${select.events})`">
                        <eventsVue :range="selectRange" />
                    </press-tab>
                </press-tabs>
            </div>
        </div>
    </div>
    <press-action-sheet :show="showProfile" title="员工信息" @close="showProfile = false">
        <Profile :userId="selectUserId" v-if="showProfile" />
    </press-action-sheet>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref, provide } from 'vue';
// import NavVue from '@/components/Nav.vue';
import api from '@/utils/api';
import dayjs from 'dayjs';
import CONFIG from '@/config';
import ucharts from '@/components/ucharts/ucharts.vue';
import eventsVue from '@/pages/sms/events.vue';
import voluntarysVue from '@/pages/sms/voluntarys.vue';
import Profile from '@/pages/hr/profile.vue';
import color from '@/css/color';
// 定义 loading 和 error 状态
const loading = ref(false);
const showProfile = ref(false);
const selectUserId = ref('');
const subLoading = ref(false);
const error = ref('');
const title = ref(dayjs().format('YY年MM月'));
const pieOption = ref({});

const months = ref([]);
const events = ref([]);
const voluntarys = ref([]);
const select = ref({ events: 0, voluntarys: 0 })
const stats = ref({}) as Ref<Record<string, { events, voluntarys }>>;

const tabCurrent = ref(0);
const onClickItem = e => tabCurrent.value = tabCurrent != e.currentIndex ? e.currentIndex : tabCurrent.value;

const startDate = dayjs().subtract(1, 'year').startOf('month').toDate();
const endDate = dayjs().toDate();

const selectRange = ref([
    dayjs().startOf('month').toDate(),
    dayjs().toDate()
]) as Ref<[Date, Date]>;
const loading2 = status => {
    console.log('loading2', status)
    subLoading.value = status;
    // error.value = '';
    if (status) {
        uni.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 2000
        });
    } else {
        uni.hideToast();
    }
}

provide("showProfile", (userId: string) => {
    console.log('geiwosou', userId)
    if (userId) {
        showProfile.value = true;
        selectUserId.value = userId;
    }
})
const getOption = (res) => {
    months.value = Object.keys(res);
    const events2 = [];
    const voluntarys2 = [];
    let last = { events: 0, voluntarys: 0 }
    for (let month of months.value) {
        events2.push(res[month].events);
        voluntarys2.push(res[month].voluntarys);
        last = { events: res[month].events, voluntarys: res[month].voluntarys }
    }
    select.value = last
    events.value = events2;
    voluntarys.value = voluntarys2;
    // console.log(events2, voluntarys2);
    const step = 2;
    return {
        type: "mix",
        categories: months,
        color: ["#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        series: [
            {
                // color: "#aaaaaa",
                name: "安全事件", type: "column",
                data: events2,
                //  yData.map(value => {
                //     // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
                //     const diff = (value - avgDay) / avgDay;
                //     const color = diff > 0.2 ? '#d48264' : (diff < -0.2) ? '#c4ccd3' : "#91c7ae";
                //     return { color, value }
                // })
                textColor: color.sms.chart.barText,
                color: color.sms.chart.bar,
            }, {
                name: '主动报告', type: "line",
                // 默认太高了,裁掉一节
                data: voluntarys2.map((value, index) => value - 30),
                formatter: val => val + 30,
                textColor: color.sms.chart.lineText,
                color: color.sms.chart.line,
            },
            // { name: '班次', type: "column", data: counters }
        ],
        animation: false,
        // background: "#FFFFFF",
        padding: [15, 0, 10, 0],
        legend: { show: false, },
        xAxis: {
            disableGrid: true,
            // labelCount: 8,// 这个确实会自动控制显示标签数量,但是不显示的标签的val就是''了,没办法formatter
            formatter: (val, index) => index % step != 0 ? '' : val,
            fontColor: color.sms.chart.xText,
        },
        yAxis: {
            disabled: true,
            // disableGrid: true,
            gridColor:color.sms.chart.yGrid,
            data: [{
                min: 0,
                // disabled: true,
            }, {
                disabled: false,
                min: 10, max: 50
            }]
        },
        extra: {
            mix: {
                column: {
                    width: 16
                }
            }
        }
    }
}
// 获取事件列表
const fetchData = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await api(CONFIG.url.smsStat, { startDate, endDate });
        stats.value = res;
        pieOption.value = getOption(res);
    } catch (err) {
        error.value = '获取事件列表失败';
    } finally {
        loading.value = false;
    }
};

function showTip(chart, event) {
    if (subLoading.value) {
        return console.log('子组件还在加载呢');
    }
    const item = chart.getCurrentDataIndex(event);
    const month = months.value[item.index];
    const value = stats.value[month];
    chart.showToolTip(event, {
        textList: [
            { text: `主动报告:${value.voluntarys}`, color: "#1890FF" },
            { text: `安全事件:${value.events}`, color: "#91CB74" }
        ]
    });
    selectRange.value = [
        dayjs(`20${month}/01`).toDate(),
        dayjs(`20${month}/01`).add(1, 'month').subtract(1, 'day').toDate()
    ];
    select.value.events = value.events;
    select.value.voluntarys = value.voluntarys;
    title.value = `${month.replace('/', '年')}月`;
}
// 组件挂载时获取事件列表
onMounted(() => {
    fetchData();
});

</script>

<style lang="less" scoped>
@import '@/css/base.less';


.sms-wrapper {
    background-color: @color-sms;

    .header {
        margin: 0;

        .title {
            margin: 0 10px;
            font-size: 16px;
            color: #fff;
        }
    }

    .detail {
        background-color: #fff;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;

        .title {
            text-align: center;
            margin: 10px auto 0 auto;
            padding: 6px auto;
            font-size: 1.2rem;
        }

        .tabs {
            padding: 10px;
        }
    }
}
</style>