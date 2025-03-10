<template>
    <!-- <div class="ac-wrapper">
        <div class="item" v-for="number, acType in stat" :key="acType">
            <span class="title">{{ acType }} </span>
            <span class="value">{{ number }}</span>
            <span class="unit">架</span>
        </div>
    </div> -->
    <!-- 饼图组件 -->
    <ucharts :option="pieOption" :height="250" />
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import useBasisStore from '@/store/basis.store';
import dayjs from 'dayjs';

const store = useBasisStore();

const pieOption = computed(() => {
    const today = dayjs().startOf('day');
    const stat: Record<string, number> = {}
    let all = 0;
    for (let aircraft of store.getAircraftsArr) {
        const startDate = dayjs(aircraft.startDate || -1).startOf('day');
        const endDate = dayjs(aircraft.endDate).startOf('day');
        if (!aircraft.endDate || (startDate.isBefore(today) && endDate.isAfter(today))) {
            if (aircraft.regId.length < 6) {
                // 统计在役飞机,738前面俩字符
                const acType = aircraft.acTypeLong;
                stat[acType] = stat[acType] || 0;
                stat[acType]++;
                all++;
            }
        }
    }
    const data = {}
    for (let acType in stat) {
        const value = stat[acType];
        data[acType] = {
            labelText: `${acType}:${value}架`,
            value
        }
    }
    return {
        type: "ring",
        animation: false,
        rotate: false,
        rotateLock: false,
        padding: [20, 0, 0, 20],
        dataLabel: true,
        series: [{ data: Object.values(data) }],
        title: {
            name: `总计`,
            fontSize: 15,
            color: "#666666"
        },
        subtitle: {
            name: `${all}架`,
            fontSize: 14,
            color: "#7cb5ec"
        },
        extra: {
            ring: {
                ringWidth: 60,
                activeOpacity: 0.5,
                activeRadius: 10,
                offsetAngle: 0,
                labelWidth: 15,
                border: true,
                borderWidth: 3,
                borderColor: "#FFFFFF"
            }
        }
    };
})

// 初始化时获取数据
onMounted(() => {
    store.fetchAircrafts();
});

</script>
<style lang="less" scoped>
@import "@/css/base.less";

.ac-wrapper {
    .row;
    margin: 0 10px;

    .title,
    .value,
    .unit {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
    }

    .title {
        font-weight: bold;
        color: #333;
    }

    .value {
        font-size: 1.1rem;
        color: #4a90e2;
    }

    .unit {
        color: #555;
    }

}
</style>