<template>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
        <press-collapse :value="activeNames" @change="stationClick">
            <press-collapse-item :title="station.city" :name="station.key" v-for="station in stationsWithDetail"
                :key="station.key">
                <div class="way">
                    <div class="dep" :class="isDep[station.key] ? '' : 'hover'">出港</div>
                    <switch @change="isDep[station.key] = !isDep[station.key]" :size="20" />
                    <div class="arr" :class="isDep[station.key] ? 'hover' : ''">进港</div>
                </div>
                <div class="airlines">
                    <div v-for="code4 in station[isDep[station.key] ? 'dep' : 'arr'].flights" class="item" :key="code4">
                        <div class="fromto">
                            <span class="city dep">
                                {{ isDep[station.key] ? airports[code4].city || code4 : station.city }}
                            </span>
                            <!-- todo:这里有个报错airports[code4]不存在 -->
                            <span class="city arr">
                                <!-- {{ !isDep[station.key] ? airports[code4].city || code4 : station.city }} -->
                            </span>
                        </div>
                        <div class="summary">
                            <span class="title">总计:</span>
                            <span class="count">
                                {{ station[isDep[station.key] ? 'dep' : 'arr'].stat[code4].flightCount }}班
                            </span>
                            <span class="weight">
                                {{ station[isDep[station.key] ? 'dep' :
                                    'arr'].stat[code4].netWeightCargo
                                }}吨
                            </span>
                            <span class="hour">
                                平均空时: {{ station[isDep[station.key] ? 'dep' : 'arr'].stat[code4].avgFlightTime }}分钟
                            </span>
                        </div>
                        <div class="weight">
                            <span class="title">运量:</span>
                            <span class="avg">
                                平均{{ station[isDep[station.key] ? 'dep' : 'arr'].stat[code4].avgFlightWeight }}吨
                            </span>
                            <span class="min">
                                最少{{ station[isDep[station.key] ? 'dep' : 'arr'].stat[code4].minFlightWeight }}吨
                            </span>
                            <span class="max">
                                最多{{ station[isDep[station.key] ? 'dep' : 'arr'].stat[code4].maxFlightWeight }}吨
                            </span>
                        </div>
                    </div>
                </div>
            </press-collapse-item>
        </press-collapse>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, Ref } from 'vue';
import { FlightItem } from '@/interface';
import dayjs from 'dayjs';
import usebasisStore from '@/store/basis.store';

// 定义 props 来接收外部传入的航班数据数组
const props = defineProps<{ data: FlightItem[], dateRange: [string, string] }>();
// 折叠面板的 activeNames 数组，用于控制面板的展开和折叠
const activeNames: Ref<string[]> = ref([]);
// 定义 stations 数组，用于存储 dep 和 arr 的汇总,也是从watch接收props变更到computed触发页面刷写的中间变量
const stations = ref<string[]>([]);
// 定义 airports 数据，用于存储机场信息
const airports = ref<Record<string, any>>({});

const store = usebasisStore();
// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');
const isDep: Ref<Record<string, boolean>> = ref({});
// const depOrArr: Ref<'dep' | 'arr'> = computed(_ => isDep.value[ station.key ] ? 'dep' : 'arr');
type FlightItemWithStationName = FlightItem & {
    arrName: string;
    depName: string;
};
// 定义 stationsWithCity 数组，用于存储带有城市名称的 stations
const stationsWithDetail = computed(() => {
    // 定义一个对象 flightData，包含 arr 和 dep 两个属性
    // 每个属性包含 flights 和 stat 两个对象
    const flightData: Record<string, { flights: Record<string, FlightItemWithStationName[]>, stat: Record<string, any> }> = {
        arr: {
            flights: {} as Record<string, FlightItemWithStationName[]>, // 存储到达航班
            stat: {} as Record<string, any> // 存储到达航班的统计信息
        },
        dep: {
            flights: {} as Record<string, FlightItemWithStationName[]>, // 存储出发航班
            stat: {} as Record<string, any> // 存储出发航班的统计信息
        }
    };

    // 遍历 props.data 中的每个航班
    for (let flight of props.data) {
        // 获取航班的到达城市名称或机场代码
        const arrName = airports.value[flight.arr!]?.city || flight.arr;
        // 获取航班的出发城市名称或机场代码
        const depName = airports.value[flight.dep!]?.city || flight.dep;

        // 如果到达机场和出发机场不同，则处理该航班
        if (flight.arr != flight.dep) {
            // 添加到达航班到 flightData.arr.flights
            flightData.arr.flights[flight.arr!] = flightData.arr.flights[flight.arr!] ?? [];
            flightData.arr.flights[flight.arr!].push({ ...flight, arrName, depName });

            // 添加出发航班到 flightData.dep.flights
            flightData.dep.flights[flight.dep!] = flightData.dep.flights[flight.dep!] ?? [];
            flightData.dep.flights[flight.dep!].push({ ...flight, arrName, depName });

            // 初始化 depStat 和 stat[depOrArr]
            flightData.dep.stat[flight.dep!] = flightData.dep.stat[flight.dep!] ?? {};
            flightData.arr.stat[flight.arr!] = flightData.arr.stat[flight.arr!] ?? {};
        }
    }

    // 统计 arrFlights 和 depFlights
    ['arr', 'dep'].forEach(type => {
        // 遍历每个机场的航班
        for (let station in flightData[type].flights) {
            // 获取当前机场的所有航班
            const flights = flightData[type].flights[station];
            // 按照到达或出发机场分组
            const groupedFlights = flights.reduce((acc, flight) => {
                const key = flight[type === 'arr' ? 'dep' : 'arr'];
                return { ...acc, [key]: [...(acc[key] || []), flight] };
            }, {});
            // 遍历每个分组的航班
            for (let otherStation in groupedFlights) {
                // 获取分组后的航班
                const flights = groupedFlights[otherStation];
                // 计算净重量货物总和（单位：吨）
                const netWeightCargo = (flights.reduce((acc, flight) => acc + flight.netWeightCargo!, 0) / 1e3).toFixed(1);
                // 计算航班个数
                const flightCount = flights.length;
                // 计算平均空中时长（单位：分钟）
                const avgFlightTime = (flights.reduce((acc, flight) => acc + dayjs(flight.ata).diff(flight.atd, 'minute'), 0) / flightCount).toFixed(1);
                // 计算平均航班重量（单位：吨）
                const avgFlightWeight = (+netWeightCargo / flightCount).toFixed(1);
                // 计算最大航班重量（单位：吨）
                const maxFlightWeight = (flights.reduce((acc, flight) => Math.max(acc, flight.netWeightCargo!), 0) / 1e3).toFixed(1);
                // 计算最小航班重量（单位：吨）
                const minFlightWeight = (flights.reduce((acc, flight) => Math.min(acc, flight.netWeightCargo!), Number.MAX_SAFE_INTEGER) / 1e3).toFixed(1);
                // 初始化 stat 对象
                flightData[type].stat[station] = flightData[type].stat[station] ?? {};
                // 存储统计信息
                flightData[type].stat[station][otherStation] = { netWeightCargo, flightCount, avgFlightTime, avgFlightWeight, maxFlightWeight, minFlightWeight };
            }
        }
    });
    // 返回处理后的站点详细信息
    return stations.value.map(station => ({
        key: station, // 站点键
        city: airports.value[station]?.city || station, // 站点城市名称或机场代码
        arr: {
            flights: Object.keys(flightData.arr.flights[station]?.reduce((acc, flight) => {
                acc[flight.dep] = [...(acc[flight.dep] || []), flight];
                return acc;
            }, {}) || {}), // 到达航班的出发机场列表
            stat: flightData.arr.stat[station], // 到达航班的统计信息
        },
        dep: {
            flights: Object.keys(flightData.dep.flights[station]?.reduce((acc, flight) => {
                acc[flight.arr] = [...(acc[flight.arr] || []), flight];
                return acc;
            }, {}) || {}), // 出发航班的到达机场列表
            stat: flightData.dep.stat[station] // 出发航班的统计信息
        },

    }));
});

// 初始化 stations 数组
watch(() => props.data, (newFlights) => {
    const newStations = new Set<string>();
    const flightCountMap: Record<string, number> = {};

    newFlights.forEach(flight => {
        if (flight.dep) {
            newStations.add(flight.dep);
            flightCountMap[flight.dep] = (flightCountMap[flight.dep] || 0) + 1;
        }
        if (flight.arr) {
            newStations.add(flight.arr);
            flightCountMap[flight.arr] = (flightCountMap[flight.arr] || 0) + 1;
        }
    });

    // 将 newStations 转换为数组并根据航班个数排序
    const sortedStations = Array.from(newStations).sort((a, b) => {
        return (flightCountMap[b] || 0) - (flightCountMap[a] || 0);
    });

    stations.value = sortedStations;
}, { immediate: true });

// 获取机场信息
const fetchAirports = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await store.getAirports();
        airports.value = res;
    } catch (err) {
        error.value = '获取机场信息失败';
    } finally {
        loading.value = false;
    }
};


// 组件挂载时获取机场信息
onMounted(() => {
    fetchAirports();
});

const stationClick = (name: string[]) => {
    activeNames.value = name
}
</script>

<style lang="less" scoped>
.loading,
.error {
    text-align: center;
    margin-top: 20px;
}

.way {
    display: flex;
    justify-content: center;
    /* 使子元素水平居中 */
    align-items: center;
    margin-bottom: 6px;
    /* 添加底部间距 */

    border-radius: 5px;



    .dep,
    .arr {
        font-weight: bold;
        color: #999;
        margin: 0 10px;
        /* 子元素之间的间距 */
    }

    .hover {
        color: #333;
    }
}

.airlines {
    border-radius: 8px;
    margin-bottom: 20px;

    .item {
        border-radius: 5px;
        margin-bottom: 10px;
        border: solid 1px #eee;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

        .fromto {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #e9e9f5;
            margin-bottom: 4px;

            .city {
                font-weight: bold;
                color: #333;
            }
        }

        .summary {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 10px;

            .title {
                font-weight: bold;
                color: #444;
            }

            .count,
            .weight,
            .hour {
                color: #555;
            }
        }

        .weight {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;

            .title {
                font-weight: bold;
                color: #444;
            }

            .avg,
            .min,
            .max {
                color: #555;
            }
        }
    }
}
</style>