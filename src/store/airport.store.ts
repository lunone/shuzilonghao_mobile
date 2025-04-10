import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/utils/api';
import { CONFIG } from '@/config';
import { AirportItem } from '@/interface/airport.interface';


export const useAirportStore = defineStore('airport', () => {
    const isLoading = { airport: false };
    const airportsCode4 = ref<Record<string, AirportItem>>({});

    const code3 = computed(() => Object.fromEntries(
        Object.values(airportsCode4.value)
            .filter(airport => airport.code3)
            .map(airport => [airport.code3, airport])
    ));

    /**
     * 获取机场名称
     * @param code 机场代码
     * @param type 类型，默认为 'city'，可选 'name'
     * @returns 机场名称
     * @example getCity('ZHE') // '珠海'
     * @example getCity('ZHE', 'name') // '珠海国际机场'
     * @example getCity('ZHE', 'code3') // 'ZHE'
     * @example getCity('ZHE', 'code4') // 'ZHEZ'
     * */
    const getCity = computed(() => {
        return (code: string, type: string = 'city'): string => {
            const src = code?.length === 4 ? airportsCode4.value : code3.value;
            return src[code]?.[type] || code;
        };
    });

    const fetchAirports = async () => {
        if (isLoading.airport) return;
        isLoading.airport = true;
        if (!airportsCode4.value['ZHCC']) {
            const res = await api(CONFIG.url.airports) as Record<string, AirportItem>;
            airportsCode4.value = res;
        }
        isLoading.airport = false;
    };


    return {
        getCity,
        code3,
        code4: computed(() => airportsCode4.value),
        fetchAirports,
    };
});