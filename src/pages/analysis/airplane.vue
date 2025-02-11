<template>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
        <uni-collapse v-model="activeNames" @change="airplaneClick">
            <uni-collapse-item :name="airplane.acReg" v-for="airplane in airplanesWithDetail" :key="airplane.acReg">
                <template #title>
                    <div class="ac">
                        <span class="acreg">{{ airplane.acReg }}</span>
                        <span class="actype">({{ airplane.acType }})</span>
                    </div>
                </template>
                <div class="content">
                    <div class="station">
                        <span class="title">航迹:</span>
                        <span class="item" v-for="station in airplane.stations" :key="station">
                            {{ airports[station]?.city }},
                        </span>

                    </div>
                    <div class="hour">
                        <span class="title">日均:</span>
                        <span class="value">
                            {{ airplane.stat.avgFlightTime }}
                        </span>
                        <span class="unit"> 小时</span>

                    </div>
                    <div class="weight">
                        <div class="total">
                            <span class="title">总重:</span>
                            <span class="value">
                                {{ airplane.stat.totalNetWeightCargo }}
                            </span>
                            <span class="unit"> 吨</span>

                        </div>
                        <div class="avg">
                            <span class="title">班均:</span>
                            <!-- {{ airplane.stat.totalNetWeightCargo }} -->
                            <span class="value">
                                {{ airplane.stat.avgNetWeightCargo }}
                            </span>
                            <span class="unit"> 吨</span>

                        </div>
                        <div class="rate">
                            <span class="title"></span>
                            <span class="value">
                                {{ airplane.stat.weightRate }}
                            </span>
                            <span class="unit"> %</span>
                        </div>
                    </div>
                </div>
            </uni-collapse-item>
        </uni-collapse>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref } from 'vue';
import api from '@/utils/api';
import { AircraftItem, AirportItem, FlightItem } from '@/interface';
import dayjs from 'dayjs';

import usebasisStore from '@/store/basis.store';
// 定义 props 来接收外部传入的航班数据数组
const props = defineProps<{ data: FlightItem[], dateRange: [string, string] }>();

// 折叠面板的 activeNames 数组，用于控制面板的展开和折叠
const activeNames: Ref<string[]> = ref([]);

// 定义 airports 数据，用于存储机场信息
const airports = ref<Record<string, AirportItem>>({});
const aircrafts = ref<Record<string, AircraftItem>>({});

const store = usebasisStore();

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

// 定义 airplanesWithDetail 数组，用于存储带有详细信息的飞机
const airplanesWithDetail = computed(() => {
    // 定义 airplaneData 对象，包含每个飞机的航班信息
    const airplaneData: Record<string, {
        acReg: string, acType: string, flights: FlightItem[], stations: string[], stat: Record<string, any>
    }> = {};
    const dayLength = dayjs(props.dateRange[1]).diff(dayjs(props.dateRange[0]), 'day');
    // console.log(props.dateRange, dayLength);
    // 遍历 props.data 中的每个航班
    for (let flight of props.data) {
        // 获取飞机的注册号
        const acReg = flight.acReg!;
        const acType = flight.acType!;
        // 初始化 airplaneData 中的飞机数据
        airplaneData[acReg] = airplaneData[acReg] ?? {
            acReg,
            acType,
            // acReg: acReg,
            flights: [], // 存储该飞机的所有航班
            stations: [], // 存储该飞机的所有机场
            stat: {} // 存储该飞机的统计信息
        };

        // 添加航班到 airplaneData 中的相应飞机
        airplaneData[acReg].flights.push(flight);
        const depName = flight.dep;
        // 添加机场到 airplaneData 中的相应飞机
        if (!airplaneData[acReg].stations.includes(depName)) {
            airplaneData[acReg].stations.push(depName);
        }
    }

    // 计算每个飞机的统计信息
    for (let acReg in airplaneData) {
        const flights = airplaneData[acReg].flights;

        // 计算飞行时间,计算每班运送重量
        let totalFlightTime = 0, totalNetWeightCargo = 0, counter = 0;

        for (let flight of flights) {
            counter++;
            const flightTime = dayjs(flight.ata).diff(dayjs(flight.atd), 'minute');

            totalFlightTime += dayjs(flight.ata).diff(dayjs(flight.atd), 'minute');
            totalNetWeightCargo += flight.netWeightCargo || 0;
        }
        // console.log(totalFlightTime, dayLength);
        if (isNaN(totalFlightTime)) {
            console.log(acReg, flights);
        }

        const weightRate = (totalNetWeightCargo / counter / aircrafts.value[acReg]?.maxPayload * 100).toFixed(2)
        // console.log()
        // 更新统计信息
        airplaneData[acReg].stat = {
            totalFlightTime: (totalFlightTime / 60).toFixed(2),
            avgFlightTime: (totalFlightTime / dayLength / 60).toFixed(2),
            totalNetWeightCargo: (totalNetWeightCargo / 1e3).toFixed(2),
            avgNetWeightCargo: (totalNetWeightCargo / 1e3 / counter).toFixed(2),
            weightRate
        };
    }

    // 返回处理后的飞机详细信息
    return Object.values(airplaneData);
});



// 获取机场信息
const fetchAirports = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await store.airports();
        airports.value = res;
    } catch (err) {
        error.value = '获取机场信息失败';
    } finally {
        loading.value = false;
    }
};
// 从store获取航班信息
const fetchAircrafts = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await store.aircrafts();
        aircrafts.value = res;
        // console.log('飞机', res);
    } catch (err) {
        error.value = '获取飞机信息失败';
    } finally {
        loading.value = false;
    }
};
// 组件挂载时获取机场信息
onMounted(() => {
    fetchAirports();
    fetchAircrafts();
});

// 处理点击面板的事件
const airplaneClick = (name: string) => {
    console.log('点击了面板', name);
};
</script>

<style lang="less" scoped>
.loading,
.error {
    text-align: center;
    margin-top: 20px;
}

.flight {
    padding-bottom: 2px;
    border-bottom: dashed 1px #eee;
}

.ac {
    display: flex;
    align-items: center;
    // background-color: #f9f9f9;

    .acreg {
        // font-weight: bold;
        font-size: 1rem;
        margin-right: 10px;
    }

    .actype {
        color: #999;
    }
}

.content {
    padding: 4px;
    // 
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    // margin-bottom: 20px;


    .station,
    .hour,
    .weight {
        margin-bottom: 4px;
    }

    .station {
        .title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .item {
            display: inline-block;
            margin-right: 5px;
            color: #555;
        }
    }

    .hour {
        .title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .value {
            font-size: 1.1rem;
            color: #4a90e2;
        }

        .unit {
            color: #555;
        }
    }

    .weight {
        display: flex;
        align-items: center;

        .total,
        .avg,
        .rate {
            display: flex;
            align-items: center;
            margin-right: 20px;

            .title {
                font-weight: bold;
                color: #333;
                margin-right: 5px;
            }

            .value {
                font-size: .8rem;
                color: #4a90e2;
                margin-right: 5px;
            }

            .unit {
                color: #555;
            }
        }
    }
}
</style>