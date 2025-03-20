import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
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