<template>
    <div class="stat-container">
        <!-- loading遮罩层 -->
        <div v-if="loading" class="loading-overlay">
            <uni-load-more status="loading"></uni-load-more>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
            <uni-icons type="info" size="24" color="#ff4d4f"></uni-icons>
            <span>数据加载失败，请稍后重试</span>
        </div>
        <!-- 胶囊样式时间选择器 -->
        <div class="time-range">
            <div v-for="item in timeRanges" :key="item.value"
                :class="['range-item', { active: activeRange === item.value }]" @click=" activeRange = item.value">
                {{ item.label }}
            </div>
        </div>
        <!-- 统计项 -->
        <div class="sum">
            <h3 class='title'>工作量统计</h3>
            <div class="workload-card">
                <div class="workload-header">
                    <span class="date-range">
                        <uni-icons type="calendar" size="16" color="#1890ff"></uni-icons>
                        {{ startDateText }} 至 {{ dayjs().format('YYYY-MM-DD') }}
                    </span>
                    <span class="total-days">
                        共 {{ dayjs().diff(startDateText, 'day') }} 天
                    </span>
                </div>
                <div class="workload-stats">
                    <div class="stat-item">
                        <div class="stat-value">{{ sum.days }}</div>
                        <div class="stat-label">飞行天数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{{ sum.flightHours }}</div>
                        <div class="stat-label">飞行小时</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{{ sum.count }}</div>
                        <div class="stat-label">航班数量</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="item">
            <h3 class='title'>航线分析</h3>
            <div class="chart-container">
                <PieChart :data="siteData" />
            </div>
        </div>

        <div class="item">
            <h3 class='title'>飞行时长分析</h3>
            <div class="chart-container">
                <PieChart :data="flightHourData" />
            </div>
        </div>

        <div class="item">
            <h3 class='title'>起飞时刻分析(24小时分布图)</h3>
            <div class="chart-container">
                <BarChart :data="atdData" />
            </div>
        </div>

        <div class="item mates-container">
            <h3 class='title'>机搭子分析</h3>
            <div class="mates">
                <div v-for="(mate, index) in showMore ? mates : mates.slice(0, 10)" :key="mate.pcode" class="mate"
                    @click="select(mate.pcode)">
                    {{ getName(mate) }}
                    <span class="count">({{ mate.flightCount }}班)</span>
                </div>
                <div v-if="mates.length > 10" class="show-more" :class="{ active: showMore }"
                    @click="showMore = !showMore">
                    {{ showMore ? '收起' : '更多...' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { api } from '@/utils/api'
import { CONFIG } from '@/config'
import { computed, onMounted, ref, watch } from 'vue'
import PieChart from '@/components/ucharts/pie.vue'
import BarChart from '@/components/ucharts/bar.vue'
// import hourChart from '@/pages/pilot/portrait/hour.vue'
import { usePilotStore } from '@/store/pilot.store'
import { useAirportStore } from '@/store/airport.store'
import dayjs from 'dayjs'
import _ from 'lodash'
const { getPilot } = usePilotStore();
const { getCity } = useAirportStore();
const timeRanges = [
    { label: '月', value: '1month' },
    { label: '季', value: '3month' },
    { label: '年', value: '1year' }
]
const props = defineProps({
    pcode: { type: String, default: '' }
})
const activeRange = ref('1month')
const mates = ref([]);
const airlines = ref([]);
const atds = ref([]);
const flightHours = ref([]);
const startDateText = ref('');
const loading = ref(false);
const error = ref(false);
watch([activeRange, () => props.pcode], async ([range]) => {
    if (props.pcode == '') return;

    loading.value = true;
    error.value = false;

    try {
        let startDate, endDate = new Date();
        range.replace(/^(\d+)(\w+)$/, (match, num, unit) => {
            const $startDate = dayjs().subtract(parseInt(num), unit);
            startDate = $startDate.toDate();
            startDateText.value = $startDate.format('YYYY-MM-DD');
            return ''
        })
        const parms = { endDate, startDate, pcode: props.pcode }
        console.log('时间范围切换为:', range, parms)

        await Promise.all([
            api(CONFIG.url.crewMate, parms).then(res => mates.value = res),
            api(CONFIG.url.crewFatigue, parms).then(res => {
                console.log('promise all res:', res);
                airlines.value = res.airlines;
                atds.value = res.atds;
                flightHours.value = res.flightHours;
                sum.value = { count: res.totalCount, flightHours: res.totalFlightHours, days: res.totalDays }
            }),
        ])
    } catch (e) {
        error.value = true;
        uni.showToast({
            title: '数据加载失败',
            icon: 'error'
        });
        console.error('加载数据失败:', e);
    } finally {
        loading.value = false;
    }
}, { immediate: true, deep: true });
const select = (pcode: any) => uni.navigateTo({ url: `/pages/pilot/portrait?pcode=${pcode}` });

function getName(mate: { pcode: string, userId: string, flightCount: number }) {
    const pilot = getPilot(mate.pcode)?.name
    // console.log
    return pilot ? pilot : mate.pcode
}
// const flightHours = ref('120')
const showMore = ref(false)
const sum = ref({ count: 0, flightHours: 0, days: 0 })

const siteData = computed(() => {
    if (!airlines.value) return [];
    const arr = _.cloneDeep(airlines.value);
    const res = arr.map(item => {
        const arr = item.name.split('-');
        const name = `${getCity(arr[0])}-${getCity(arr[1])}(${item.value}班)`;
        return { name, value: item.value }
    });
    return res;
})
const atdData = computed(() => {
    if (!atds.value) return [];
    const arr = _.cloneDeep(atds.value);
    return arr;
})
const flightHourData = computed(() => {
    if (!flightHours.value) return [];
    const arr = _.cloneDeep(flightHours.value);
    const res = arr.map(item => {
        const name = `${item.name}小时(${item.value}班)`;
        return { name, value: item.value }
    });
    return res;
})

onMounted(() => {
    // 初始化获取周数据
})
</script>

<style scoped lang="less">
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.error-message {
    padding: 16px;
    background: #fff2f0;
    border: 1px solid #ffccc7;
    border-radius: 4px;
    color: #ff4d4f;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 16px;
}

.stat-container {
    .mates {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;

        .mate {
            padding: 6px 12px;
            background: #f0f7ff;
            border-radius: 16px;
            color: #1890ff;
            cursor: pointer;
            transition: all 0.2s;
        }
    }

    .time-range {
        display: flex;
        margin: 4px 20% 20px;
        background: #f5f5f5;
        border-radius: 20px;
        padding: 4px;

        .range-item {
            flex: 1;
            text-align: center;
            color: #333;
            padding: 8px 0;
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.3s;

            &.active {
                background: #1890ff;
                color: white;
                font-weight: bold;
            }
        }
    }

    .item {
        margin: 16px 0;

        .title {
            margin: 0 0 16px 16px;
            font-size: 18px;
            color: #333;
            font-weight: bold;
            padding-left: 12px;
            // border-left: 4px solid #1890ff;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: -8px;
                width: 40px;
                height: 2px;
                background: linear-gradient(90deg, #1890ff, transparent);
            }
        }


    }

    .sum {
        margin: 16px 10px;

        .workload-card {
            background: linear-gradient(135deg, #f6faff 0%, #e6f0ff 100%);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
            border: 1px solid rgba(24, 144, 255, 0.1);

            .workload-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 12px;
                border-bottom: 1px dashed rgba(24, 144, 255, 0.3);
                color: #666;
                font-size: 14px;

                .date-range {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #1890ff;
                    font-weight: 500;
                }

                .total-days {
                    background: rgba(24, 144, 255, 0.1);
                    padding: 4px 8px;
                    border-radius: 12px;
                    color: #1890ff;
                }
            }


            .chart-container {
                min-height: 300px;
            }

            .mates-container {
                background: linear-gradient(135deg, #f6faff 0%, #e6f0ff 100%);
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
                border: 1px solid rgba(24, 144, 255, 0.1);

                .subtitle {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .mates {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;

                    .mate {
                        padding: 6px 12px;
                        background: white;
                        border-radius: 4px;
                        color: #1890ff;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 4px;

                        .count {
                            color: #666;
                            font-size: 12px;
                        }


                    }

                    .show-more {
                        padding: 6px 12px;
                        background: white;
                        border-radius: 16px;
                        color: #1890ff;
                        cursor: pointer;
                        transition: all 0.2s;

                        &.active {
                            background: #f0f7ff;
                        }


                    }
                }
            }
        }

        .workload-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            text-align: center;

            .stat-item {
                padding: 12px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                transition: all 0.3s;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
                }

                .stat-value {
                    font-size: 28px;
                    font-weight: bold;
                    color: #1890ff;
                    margin-bottom: 6px;
                    text-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
                }

                .stat-label {
                    font-size: 13px;
                    color: #666;
                    font-weight: 500;
                }
            }
        }

    }
}
</style>
