<template>
    <!-- <nav-vue title="机队统计" text="主页" url='/home' /> -->
    <div class="airplane-wrapper">
        <div class="top">
            <ac-summary-vue class="summary" />
        </div>
        <div class="detail">
            <div class="title"></div>
            <press-tabs :active="activeTab" @change="onSortTabClick">
                <template v-for="aircraftGroup, groupName in aircraftSorted" :key=" groupName">
                    <press-tab :name="groupName" :title="`${aircraftGroup.name}(${aircraftGroup.aircrafts.length})`"
                        v-if="aircraftGroup.aircrafts.length > 0">
                        <div class="aircrafts">
                            <div class="buttons">
                                <div v-for="aircraft in aircraftGroup.aircrafts" :key="aircraft.acReg" class="button"
                                    :class="aircraft?.acReg === selectedAircraft?.acReg ? 'selected' : ''"
                                    @click="showInfo(aircraft)">
                                    {{ aircraft.acReg }}
                                </div>
                            </div>
                        </div>
                    </press-tab>
                </template>
            </press-tabs>

            <!-- 放到前一个的里面会被循环生成多个的 -->
            <press-tabs :active="infoTab" @change="onInfoTabClick" class="info">
                <press-tab name="detail" title="飞机参数">
                    <detail v-if="selectedAircraft" :aircraft="selectedAircraft" />
                </press-tab>
                <press-tab name="mel" :title="`保留单详情(${mels?.length || 0})`">
                    <mel-card-vue :acReg="selectedAircraft?.acReg" @get-mel="acRegMelUpdate" />
                </press-tab>
            </press-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, computed, onMounted, reactive, Ref } from 'vue';
import dayjs from 'dayjs';

import { AircraftItem } from '@/interface';
import { useAircraftStore } from '@/store/aircarft.store';
import AcSummaryVue from './summary.vue';
import MelCardVue from '../maintenance/mel/card.vue';
import detail from './detail.vue';

const aircarftStore = useAircraftStore();
// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

// 定义当前激活的 Tab，默认为 'inService'
const activeTab = ref('inService');
const infoTab = ref('detail');
const showInfo = (aircraft: any) => selectedAircraft.value = aircraft;
const onInfoTabClick = e => infoTab.value = infoTab != e.name ? e.name : infoTab.value;
const onSortTabClick = e => {
    const { name } = e;
    if (activeTab.value != name) {
        activeTab.value = name
        showInfo(aircraftSorted.value[name].aircrafts[0])
    }
}

const showMoreFlags = reactive<Record<string, boolean>>({});

// 定义机队数据
// const aircrafts = ref<AircraftItem[]>([]);
const mels = ref<any[]>([]);
const selectedAircraft = ref<AircraftItem | null>(null);

// 定义筛选后的机队数据
const aircraftSorted = computed(() => {
    const today = dayjs().startOf('day');
    const result: Record<string, { name: string, aircrafts: AircraftItem[] }> = {
        inService: { name: '在役', aircrafts: [] },
        retired: { name: '退役', aircrafts: [] },
        introduced: { name: '引进中', aircrafts: [] },
    };
    for (let aircraft of aircarftStore.aircraftArr) {
        const startDate = dayjs(aircraft.startDate || -1).startOf('day');
        const endDate = dayjs(aircraft.endDate).startOf('day');
        if (!aircraft.endDate || (startDate.isBefore(today) && endDate.isAfter(today))) {
            if (aircraft.regId.length < 6) {
                result.inService.aircrafts.push(aircraft);
            } else {
                result.introduced.aircrafts.push(aircraft);
            }
        } else {
            result.retired.aircrafts.push(aircraft);
        }
    }
    return result;
})



const acRegMelUpdate = (acRegMel: any[]) => {
    // console.log('acRegMelUpdate', acRegMel);
    mels.value = acRegMel;
    console.warn('++++++++++++++++++mels', mels.value, acRegMel, mels.value?.length)
}
// 初始化时获取数据
onMounted(async () => {// 加载完成默认第一个按钮显示
    aircarftStore.fetchAircrafts().then(() => showInfo(aircraftSorted.value[activeTab.value].aircrafts[0]));
});


</script>
<style lang="less" scoped>
@import '@/css/base.less';

.airplane-wrapper {
    background-color: @color-airplane;

    .top {
        height: 270px;
    }

    .detail {
        background-color: #fff;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;

        .title {
            height: 20px;
            overflow: hidden;
        }

        .aircrafts {
            display: flex;
            flex-direction: column;

            .buttons {
                display: block;
                flex-wrap: wrap;
                gap: 10px;
                margin: 10px;
                width: 100%;

                .button {
                    color: @color-airplane-button-text;
                    float: left;
                    border-radius: 2px;
                    padding: 6px 10px;
                    font-size: 0.9rem;
                    margin-right: 10px;

                }

                .selected {
                    background-color: @color-airplane-button-select;
                }
            }

            .info {
                width: 100%;
            }

        }
    }
}
</style>