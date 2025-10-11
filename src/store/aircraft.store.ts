import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getAircrafts } from '@/api/aircraft.api';
import dayjs from 'dayjs';
import { AircraftItem } from '@/api/aircraft.api';

export const useAircraftStore = defineStore('aircraft', () => {
    const isLoading = { aircraft: false };
    const aircraftsArr = ref<AircraftItem[]>([]);

    const acTypeShortTranslate: Record<string, string> = {
        B73: 'B737', B74: 'B747', A32: 'A320', A31: 'A319'
    };

    const aircraftsObj = computed(() => aircraftsArr.value.reduce((acc, cur) => ({ ...acc, [cur.acReg]: cur }), {}));



    const fetchAircrafts = async () => {
        if (isLoading.aircraft) return;
        isLoading.aircraft = true;
        if (!aircraftsArr.value.length) {
            // 目前API只返回飞机注册号列表，暂时注释获取详细数据的逻辑
            // const response = await getAircrafts();
            // const res = response as AircraftItem[];
            // TODO: 需要调用获取飞机详细信息的API
        }
        isLoading.aircraft = false;
    };

    return {
        arr: computed(() => aircraftsArr.value),
        obj: aircraftsObj,
        fetchAircrafts,
    };
});
