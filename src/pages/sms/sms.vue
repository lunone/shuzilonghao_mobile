<template>
    <div class="sms-wrapper">
        <div class="header">
            <div class="title">
                <div class="left">安全走势</div>
                <div class="mid">点击月份切换</div>
            </div>
            <ucharts :option="pieOption" @select="showTip" :height="200" class="chart" />
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
import { CONFIG } from '@/config';
import ucharts from '@/components/ucharts/ucharts.vue';
import eventsVue from '@/pages/sms/events.vue';
import voluntarysVue from '@/pages/sms/voluntarys.vue';
import Profile from '@/pages/hr/profile.vue';
import color from '@/css/color';
import { useUserStore } from '@/store/user.store';
const userStore = useUserStore();
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

provide("showProfile", (userName: string, type = 'name') => {
    console.log('显示人员信息', userName)
    let userId = type == 'userId' ? userName : userStore.getStaff(userName, 'name')?.userId;
    if (userId) {
        showProfile.value = true;
        selectUserId.value = userId;
    }
})
const getOption = (res) => {
    months.value = Object.keys(res);
    const events2 = [];
    const voluntarys2 = [];
    let last = { events: 0, voluntarys: 0 };

    // 提取原始数据并保留副本
    const voluntarysOriginal = [];
    for (let month of months.value) {
        const val = res[month];
        events2.push(val.events);
        voluntarys2.push(val.voluntarys);
        voluntarysOriginal.push(val.voluntarys); // 存储原始值
        last = { events: val.events, voluntarys: val.voluntarys };
    }
    select.value = last;

    // 动态调整算法
    const adjustedVoluntarys = voluntarys2.map((value, index) => {
        const currentEvent = Math.max(1, events2[index]);
        const ratio = Math.sqrt(value / currentEvent);
        return Math.max(value * ratio, currentEvent + 2);
    });

    const step = 2;
    return {
        type: "mix",
        categories: months,
        color: ["#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        series: [
            {
                name: "安全事件",
                type: "column",
                data: events2,
                textColor: color.sms.chart.barText,
                color: color.sms.chart.bar,
            },
            {
                name: '主动报告',
                type: "line",
                style: "curve",
                data: adjustedVoluntarys,
                formatter: (val, index) => voluntarysOriginal[index], // 直接返回原始值
                textColor: color.sms.chart.lineText,
                color: color.sms.chart.line,

            }
        ],
        animation: false,
        padding: [0, 10, 2, 2],
        legend: {
            show: true,
            position: 'top',
            float: 'center'
        },
        xAxis: {
            disableGrid: true,
            formatter: (val, index) => index % step != 0 ? '' : val,
            fontColor: color.sms.chart.xText,
        },
        yAxis: {
            disabled: true,
            gridColor: color.sms.chart.yGrid,
            data: [{
                min: 0,
            }, {
                disabled: false,
                min: 10,
                max: Math.max(...adjustedVoluntarys) * 1.1
            }]
        },
        extra: {
            mix: {
                column: {
                    width: 16
                },
            }
        }
    };
};// 获取事件列表
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
    // padding: 10px;

    .header {
        margin: 0;
        width: 100%;
        box-sizing: border-box;
        // border-radius: 8px;
        // box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        .title {
            .row;
            margin: 0;
            overflow: hidden;
            // background-color: #eee;
            padding: 5px 10px;
            // border-top-left-radius: 8px;
            // border-top-right-radius: 8px;


            .mid {
                color: #aaa;
                font-size: .8rem;
            }
        }

        .chart {
            background: #aaa;
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