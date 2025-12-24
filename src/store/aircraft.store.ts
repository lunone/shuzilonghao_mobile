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
            try {
                // 调用API获取飞机列表数据
                const response = await getAircrafts();
                // console.log('飞机列表API响应:', response);
                
                // 直接使用API返回的飞机数据
                aircraftsArr.value = response;
                // console.log('飞机数据加载完成:', aircraftsArr.value.length, '架飞机');
            } catch (error) {
                console.error('获取飞机列表失败:', error);
            }
        }
        isLoading.aircraft = false;
    };

    return {
        arr: computed(() => aircraftsArr.value),
        obj: aircraftsObj,
        fetchAircrafts,
    };
});
