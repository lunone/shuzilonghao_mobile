<template>
    <div class="wrapper">
        <div class="total">
            <van-icon class-prefix="zl-icon" name="aircraft" :size="50" color="#c52005" />
            <span class="value">{{ Object.values(stat).reduce((acc, value) => acc + value, 0) }}</span>
            <span class="unit">架</span>
        </div>
        <div class="detail">
            <div class="item" v-for="number, acType in stat" :key="acType">
                <span class="title">{{ acTypeShortTranslate[acType] || acType }} </span>
                <span class="value">{{ number }}</span>
                <span class="unit">架</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@/store';
import { AircraftItem } from '@/interface';
import dayjs from 'dayjs';

const store = useStore();
// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');


// 定义机队数据
const aircrafts = ref<AircraftItem[]>([]);
const acTypeShortTranslate: Record<string, string> = {
    B73: 'B737', B74: 'B747', A32: 'A320', A31: 'A319'
}



const stat = computed(() => {
    const today = dayjs().startOf('day');
    const stat: Record<string, number> = {}

    for (let aircraft of aircrafts.value) {
        const startDate = dayjs(aircraft.startDate || -1).startOf('day');
        const endDate = dayjs(aircraft.endDate).startOf('day');
        if (!aircraft.endDate || (startDate.isBefore(today) && endDate.isAfter(today))) {
            if (aircraft.regId.length < 6) {
                // 统计在役飞机,738前面俩字符
                const acType = aircraft.acType.slice(0, 3);
                stat[acType] = stat[acType] || 0;
                stat[acType]++;
            }
        }
    }
    return stat;
})

// 从store获取信息
const fetchAircrafts = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await store.useAircrafts();
        aircrafts.value = Object.values(res);
    } catch (err) {
        error.value = '获取飞机信息失败';
    } finally {
        loading.value = false;
    }
};
// 初始化时获取数据
onMounted(() => {
    fetchAircrafts();
    // fetchMels();
});

</script>
<style lang="less" scoped>
@import "@/base.less";

.wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .total {
        display: flex;
        align-items: center;

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

    .detail {
        display: flex;
        flex-direction: row;
        margin-left: 2rem;

        .item {
            display: flex;
            align-items: center;
            margin-right: 20px;

            .title,
            .value,
            .unit {
                display: inline-block;
                vertical-align: middle;
                margin-right: 5px;
            }

            .title {
                font-weight: bold;
                color: #333;
            }

            .value {
                font-size: 1rem;
                color: #4a90e2;
            }

            .unit {
                color: #555;
            }
        }
    }
}
</style>