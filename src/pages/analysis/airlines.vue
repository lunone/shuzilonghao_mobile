<template>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
        <van-button v-for="(value, key) in groupedFlights" :key="key" type="primary" @click="handleGroupClick(key)"
            class="flight-button">
            {{ value.arrName }} - {{ value.depName }}
        </van-button>
    </div>
    <van-toast id="van-toast" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import api from '@/utils/api';
import { showToast } from 'vant';
import _ from 'lodash';

// 定义 props 来接收外部传入的航班数据数组
const props = defineProps<{ data: { dep: string; arr: string }[] }>();

// 定义 airports 数据，用于存储机场信息
const airports = ref<Record<string, any>>({});

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

// 定义 groupedFlights 对象，用于存储分组后的航班信息
const groupedFlights = computed(() => {
    const flightsGroupByDepArr = _.groupBy(props.data, flight => `${flight.arr}-${flight.dep}`);
    console.log(flightsGroupByDepArr);
    const data: Record<string, any> = {}
    for (const key in flightsGroupByDepArr) {
        const group = flightsGroupByDepArr[key];
        const [arr, dep] = key.split('-');

        const arrName = airports.value[arr]?.city;
        const depName = airports.value[dep]?.city;
        const arrCode = airports.value[arr]?.code;
        const depCode = airports.value[dep]?.code;
        console.log(arr, dep, airports.value, arrName, depName);
        data[key] = {
            arrName,
            depName,
            arrCode,
            depCode,
            // arrFlights:group.filter(flight=>flight.arr===arrCode),
            // depFlights:group.filter(flight=>flight.dep===depCode),
        }
    }
    return data;
    // return _(props.data).groupBy(flight => `${flight.arr}-${flight.dep}`).mapValues(group => {
    //     return group.map(flight => ({
    //         ...flight,
    //         arrCity: airports.value[flight.arr]?.city || '未知',
    //         depCity: airports.value[flight.dep]?.city || '未知'
    //     })).values();
    // });
});

// 获取机场信息
const fetchAirports = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await api('/airport/code4/', {}) as any;
        airports.value = res;
    } catch (err) {
        error.value = '获取机场信息失败';
    } finally {
        loading.value = false;
    }
};

// 处理分组点击事件
const handleGroupClick = (key: string) => {
    showToast(`${key} 被点击了`);
};

// 组件挂载时获取机场信息
onMounted(() => {
    fetchAirports();
});
</script>

<style lang="less" scoped>
.loading,
.error {
    text-align: center;
    margin-top: 20px;
}

.flight-button {
    margin: 5px;
}
</style>