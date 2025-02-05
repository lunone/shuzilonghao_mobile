<template>
    <nav-vue title="维修活动" text="主页" url='/home' />
    <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
        该功能时间原因未完成。非真实数据，仅做演示。
    </van-notice-bar>
    <div class="maintenance-container">
        <div class="statistics">
            <div class="title">运行统计</div>
            <div class="stat-item">

                <span>航班不正常率为1.03%，同比降低25%；</span>
            </div>
            <div class="stat-item">
                <span>全年机械原因396事件万架次率为6.6每万架次，同比下降68%，</span>
            </div>
            <bar-chart :option="barOption" />
        </div>
        <van-divider>工作部分</van-divider>
        <div class="recent-activities">
            <div class="title">最近工作</div>
            <div class="activity-item" v-for="activity in recentActivities" :key="activity.date">
                <span>{{ activity.date }}</span>
                <span>{{ activity.aircraft }}</span>
                <span>{{ activity.workName }}</span>
                <span>{{ activity.worker }}</span>
            </div>
        </div>
        <van-divider>库房部分</van-divider>
        <div class="warehouse">
            <div class="title">库房</div>
            <div class="warehouse-statistics">
                <div class="stat-item">
                    <span>库房价值变动：</span>
                    <span>昨日{{ warehouse.yesterdayValue }}万元，今日{{ warehouse.todayValue }}万元，</span>
                </div>
            </div>
            <div class="warehouse-outbound">
                <div class="subtitle">出库</div>
                <ul>
                    <li v-for="item in warehouse.outbound" :key="item.partNumber">
                        <span>{{ item.partNumber }}</span>
                        <span>{{ item.name }}</span>
                        <span>{{ item.price ? item.price + '万元' : '无' }}</span>
                        <span>{{ item.destination }}</span>
                    </li>
                </ul>
            </div>
            <div class="warehouse-inbound">
                <div class="subtitle">入库</div>
                <ul>
                    <li v-for="item in warehouse.inbound" :key="item.partNumber">
                        <span>{{ item.partNumber }}</span>
                        <span>{{ item.name }}</span>
                        <span>{{ item.price ? item.price + '万元' : '无' }}</span>
                        <span>{{ item.destination }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import NavVue from '@/components/Nav.vue';
import BarChart from '@/components/chart/BarChart.vue';
import { computed } from 'vue';

// 模拟数据
const recentActivities = [
    { date: '3月08号', aircraft: 'B1234', workName: '工作名1', worker: '工作者2' },
    { date: '3月03号', aircraft: 'B5234', workName: '工作名2', worker: '工作者1' },
    { date: '3月11号', aircraft: 'B2234', workName: '工作名3', worker: '工作者3' }
];

const warehouse = {
    yesterdayValue: 100,
    todayValue: 110,
    outbound: [
        { partNumber: '件号1', name: '名称1', price: null, destination: '装机B1234' },
        { partNumber: '件号1', name: '名称1', price: 1000, destination: '装机B1234' },
        { partNumber: '件号1', name: '名称1', price: 399, destination: '装机B1234' }
    ],
    inbound: [
        { partNumber: '件号1', name: '名称1', price: 500, destination: '拆机不可用' },
        { partNumber: '件号1', name: '名称1', price: null, destination: '送修入库' },
        { partNumber: '件号1', name: '名称1', price: 4000, destination: '购买' }
    ]
};

const chartData = [
    { month: '1月', value: 13.32 },
    { month: '2月', value: 27.93 },
    { month: '3月', value: 0 },
    { month: '4月', value: 0 },
    { month: '5月', value: 10.92 },
    { month: '6月', value: 0 },
    { month: '7月', value: 22.71 },
    { month: '8月', value: 0 },
    { month: '9月', value: 9.94 },
    { month: '10月', value: 0 },
    { month: '11月', value: 10.44 },
    { month: '12月', value: 0 }
];
const barOption = computed(() => {
    const xData = Object.keys(chartData);
    const yData = Object.values(chartData);
    return {
        title: {
            text: '维修活动统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLabel: {
                // rotate: 90, // 旋转角度，可以根据需要调整
                // interval: 0, // 强制显示所有标签
                // margin: 10 // 标签与轴线之间的距离
            }
        },
        yAxis: {
            type: 'value'
        },
        grid: {
            top: '20px',    // 顶部刻度消失
            // left: '-25px',// 让y轴不显示刻度的空白消失
            // right: '-3px',// 让y轴最后不显示多的那一点
            bottom: '0',
            containLabel: true
        },
        series: [
            {
                name: '停场率',
                data: yData,
                type: 'bar',
                itemStyle: { color: '#5470c6' }
            },
            {
                name: '停2率',
                data: yData,
                type: 'line',
                itemStyle: { color: '#91cc75' }
            },
        ]

    }
})
</script>

<style lang="less">
@import "@/css/base.less";

.maintenance-container {
    padding: 20px;
    background-color: @background-color;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .title {
        color: @primary-color;
        font-size: 20px;
        font-weight: normal;
        margin-bottom: 10px;
        border-bottom: 2px solid @border-color;
        padding-bottom: 5px;
    }

    .subtitle {
        color: @secondary-color;
        font-size: 18px;
        font-weight: normal;
        margin-bottom: 5px;
        border-bottom: 1px solid @border-color;
        padding-bottom: 3px;
    }

    .stat-item {
        font-size: 14px;
        color: @text-color;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;

        .stat-label {
            flex: 1;
        }

        .stat-value {
            flex: 1;
            text-align: right;
        }
    }

    .activity-item {
        font-size: 14px;
        color: @text-color;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;

        .activity-date {
            flex: 1;
        }

        .activity-aircraft {
            flex: 1;
        }

        .activity-work-name {
            flex: 1;
        }

        .activity-worker {
            flex: 1;
        }
    }

    .warehouse-statistics {
        margin-bottom: 20px;
    }

    .warehouse-outbound,
    .warehouse-inbound {
        margin-bottom: 20px;

        ul {
            list-style-type: none;
            padding: 0;

            .warehouse-item {
                font-size: 14px;
                color: @text-color;
                margin-bottom: 5px;
                display: flex;
                justify-content: space-between;

                .warehouse-part-number {
                    flex: 1;
                }

                .warehouse-name {
                    flex: 1;
                }

                .warehouse-price {
                    flex: 1;
                    text-align: right;
                }

                .warehouse-destination {
                    flex: 1;
                }
            }
        }
    }
}
</style>