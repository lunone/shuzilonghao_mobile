<template>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
        <press-collapse :value="activeNames" @change="airplaneClick">
            <press-collapse-item :name="acReg" v-for="airplane, acReg in airplanesWithDetail" :key="acReg">
                <template #title>
                    <div class="ac">
                        <span class="acreg">{{ acReg }}</span>
                        <span class="actype">({{ aircrafts[acReg].acType }})</span>
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
                            <span class="value">
                                {{ airplane.stat.avgNetWeightCargo }}
                            </span>
                            <span class="unit"> 吨</span>

                        </div>
                        <div class="rate">
                            <span class="title"></span>
                            <span class="value">
                                <!-- {{ airplane.stat.weightRate }} -->
                            </span>
                            <span class="unit"> %</span>
                        </div>
                    </div>
                </div>
            </press-collapse-item>
        </press-collapse>

    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, Ref } from 'vue';
import { AircraftItem, AirportItem, FlightItem } from '@/interface';
import dayjs from 'dayjs';
import CONFIG from '@/config';
import useBasisStore from '@/store/basis.store';
import api from '@/utils/api';
// 定义 props 来接收外部传入的航班数据数组
const props = defineProps<{ data: FlightItem[], dateRange: [string, string] }>();

// 折叠面板的 activeNames 数组，用于控制面板的展开和折叠
const activeNames: Ref<string[]> = ref([]);

const store = useBasisStore();
// 定义 airports 数据，用于存储机场信息
const airports = ref<Record<string, AirportItem>>({});
const aircrafts = ref<Record<string, AircraftItem>>({});
const acRegs = ref<string[]>([]);


// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

// 定义 airplanesWithDetail 数组，用于存储带有详细信息的飞机
const airplanesWithDetail = ref({}) as Ref<Res>



// 获取机场信息
const fetchAirports = async () => {
    const res = await store.getAirports();
    const res2 = await store.getAircrafts();
    airports.value = res;
    aircrafts.value = res2;
};
type statItem = {
    avgFlightTime: number
    avgNetWeightCargo: number
    totalFlightTime: number
    totalNetWeightCargo: number
}
type Res = Record<string, { stations: string[], stat: statItem }>
// 从store获取航班信息
const fetchData = async () => {
    loading.value = true;
    error.value = '';
    const startDate = dayjs('2025-02-09').toDate();
    const endDate = dayjs('2025-02-18').toDate();
    try {
        const res = await api(CONFIG.url.statByAircraft, { startDate, endDate }) as Res;
        console.log('飞机', res);
        acRegs.value = Object.keys(res);
        airplanesWithDetail.value = res;
    } catch (err) {
        error.value = '获取飞机信息失败';
    } finally {
        loading.value = false;
    }
};
// 组件挂载时获取机场信息
onMounted(() => {
    console.log('组件挂载时获取机场信息');
    fetchAirports();
    fetchData();
});

// 处理点击面板的事件
const airplaneClick = (names: string[]) => {
    activeNames.value = names
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