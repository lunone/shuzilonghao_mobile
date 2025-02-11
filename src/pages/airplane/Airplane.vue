<template>
    <!-- <nav-vue title="机队统计" text="主页" url='/home' /> -->
    <ac-summary-vue class="summary" />
    <zl-tabs v-model:active="activeTab" @change="sortChanged">
        <template v-for="aircraftGroup, groupName in aircraftSorted" :key=" groupName">
            <zl-tab :name="groupName" :title="`${aircraftGroup.name}(${aircraftGroup.aircrafts.length})`"
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
            </zl-tab>
        </template>
    </zl-tabs>
    <!-- 放到前一个的里面会被循环生成多个的 -->
    <zl-tabs v-model:active="infoTab" class="info">
        <zl-tab name="detail" title="飞机参数">
            <detail v-if="selectedAircraft" :aircraft="selectedAircraft" />
        </zl-tab>
        <zl-tab name="mel" :title="`保留单详情(${mels?.length || 0})`">
            <mel-card-vue :acReg="selectedAircraft?.acReg" @get-mel="acRegMelUpdate" />
        </zl-tab>
    </zl-tabs>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, Ref } from 'vue';
import dayjs from 'dayjs';

import { AircraftItem } from '@/interface';
import usebasisStore from '@/store/basis.store';
import AcSummaryVue from './aircraftSummary.vue';
import MelCardVue from '../maintenance/mel/card.vue'; 
import detail from './detail.vue';

const store = usebasisStore();
// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');

// 定义当前激活的 Tab，默认为 'inService'
const activeTab = ref('inService');
const infoTab = ref('detail');
const showMoreFlags = reactive<Record<string, boolean>>({});

// 定义机队数据
const aircrafts = ref<AircraftItem[]>([]);
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
    for (let aircraft of aircrafts.value) {
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
});

// 从store获取航班信息
const fetchAircrafts = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await store.aircrafts();
        aircrafts.value = Object.values(res);
        console.log('飞机', res);
    } catch (err) {
        error.value = '获取飞机信息失败';
    } finally {
        loading.value = false;
    }
};
const sortChanged = (active: any) => {
    console.log('sortChanged', active);
    // 加载完成默认第一个按钮显示
    showInfo(aircraftSorted.value[active].aircrafts[0])
};

const acRegMelUpdate = (acRegMel: any[]) => {
    console.log('acRegMelUpdate', acRegMel);
    mels.value = acRegMel;
    console.warn('++++++++++++++++++mels', mels.value, acRegMel, mels.value?.length)
}
const showInfo = (aircraft: any) => {
    // console.log('showInfo###############', aircraft)
    selectedAircraft.value = aircraft;
};

// 初始化时获取数据
onMounted(async () => {
    await fetchAircrafts();
    // 加载完成默认第一个按钮显示
    showInfo(aircraftSorted.value.inService.aircrafts[0])
});


</script>

<style lang="less" scoped>
.aircrafts {
    display: flex;
    flex-direction: column;

    .buttons {
        display: block;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
        margin-left: 10px;
        width: 100%;

        .button {
            // background-color: #4a90e2;
            border-color: #4a90e2;
            color: #333;
            float: left;
            border-radius: 5px;
            padding: 4px 10px;
            font-size: 0.9rem;
            // transition: background-color 0.3s, border-color 0.3s;
            margin-right: 10px;



        }

        .selected {
            background-color: #357ab8;
            border-color: #357ab8;
        }
    }

    .info {
        width: 100%;
    }

}
</style>