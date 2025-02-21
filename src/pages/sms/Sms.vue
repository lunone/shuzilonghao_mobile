<template>
    <!-- <nav-vue title="安全管理" text="主页" url='/home' /> -->
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="error" class="error">{{ error }}</view>
    <view v-else>
        <div class="title">安全趋势</div>
        <ucharts :option="pieOption" @select="showTip" :height="200" />
        <press-divider contentPosition="center">{{ title }}详情</press-divider>
        <press-tabs :active="tabCurrent" @change="onClickItem">
            <press-tab :title="`主动报告(${select.voluntarys})`">
                <voluntarysVue :start-date="selectStartDate" :end-date="selectEndDate" />
            </press-tab>
            <press-tab :title="`事件(${select.events})`">
                <eventsVue :start-date="selectStartDate" :end-date="selectEndDate" />
            </press-tab>

        </press-tabs>

    </view>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref } from 'vue';
// import NavVue from '@/components/Nav.vue';
import api from '@/utils/api';
import dayjs from 'dayjs';
import CONFIG from '@/config';
import ucharts from '@/components/ucharts/ucharts.vue';
import eventsVue from '@/pages/sms/events.vue';
import voluntarysVue from './voluntarys.vue';

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');
const title = ref(dayjs().format('YY/MM'));
const pieOption = ref({});

const months = ref([]);
const events = ref([]);
const voluntarys = ref([]);
const select = ref({ events: 0, voluntarys: 0 })
const stats = ref({}) as Ref<Record<string, { events, voluntarys }>>;

const tabCurrent = ref(0);
const onClickItem = e => tabCurrent.value = tabCurrent != e.currentIndex ? e.currentIndex : tabCurrent.value;

const startDate = dayjs().subtract(1, 'year').startOf('month').format('YYYY-MM-DD');
const endDate = dayjs().format('YYYY-MM-DD');

const selectStartDate = ref(dayjs().startOf('month').format('YYYY-MM-DD'));
const selectEndDate = ref(dayjs().format('YYYY-MM-DD'));
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
        color: ["#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        series: [
            {
                color: "#aaaaaa",
                name: "安全事件", type: "column",
                data: events2
                //  yData.map(value => {
                //     // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
                //     const diff = (value - avgDay) / avgDay;
                //     const color = diff > 0.2 ? '#d48264' : (diff < -0.2) ? '#c4ccd3' : "#91c7ae";
                //     return { color, value }
                // })
            }, {
                name: '主动报告', type: "line",
                data: voluntarys2
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
        },
        yAxis: {
            disabled: true,
            // disableGrid: true,
            data: [{
                min: 0,
                // disabled: true,
            }, {
                disabled: false,
                min: 10, max: 50,
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
        console.log('事件列表', res);
        stats.value = res;
        pieOption.value = getOption(res);
    } catch (err) {
        error.value = '获取事件列表失败';
    } finally {
        loading.value = false;
    }
};

function showTip(chart, event) {
    const item = chart.getCurrentDataIndex(event);
    const month = months.value[item.index];
    const value = stats.value[month];
    chart.showToolTip(event, {
        textList: [
            { text: `主动报告:${value.voluntarys}`, color: "#1890FF" },
            { text: `安全事件:${value.events}`, color: "#91CB74" }
        ]
    });
    selectStartDate.value = dayjs(`20${month}/01`).format('YYYY-MM-DD');
    selectEndDate.value = dayjs(`20${month}/01`).add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD');
    select.value.events = value.events;
    select.value.voluntarys = value.voluntarys;
    title.value = `${month}`;
    console.log('激活下面的俩小baby', item, selectEndDate.value, selectStartDate.value);
}
// 组件挂载时获取事件列表
onMounted(() => {
    fetchData();
});

</script>

<style lang="less" scoped>
.loading,
.error {
    text-align: center;
    margin-top: 20px;
}

.title {
    margin: 10px;
    font-size: 16px;
    color: #888;
}

.summary {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
}

.van-cell {
    padding: 10px;
    border-bottom: 1px solid #eee;
}



.report-list {
    padding: 16px;


}

/* 添加这段样式后  */
:root:root {
    --van-step-line-color: red;
}
</style>