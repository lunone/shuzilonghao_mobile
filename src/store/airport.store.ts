import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import dayjs from 'dayjs';
import CONFIG from '@/config';
import { AircraftItem, AirportItem } from '@/interface';

export const useAirportStore = defineStore('airport', () => {
    const isLoding = { airport: false  };
    const airportsCode4 = ref<Record<string, AirportItem>>({});

    const getCode3 = computed(() => {
        const airportsCode4Value = airportsCode4.value;
        const airportsCode3: Record<string, AirportItem> = {};
        for (const code4 in airportsCode4Value) {
            if (airportsCode4Value[code4].code3) {
                airportsCode3[airportsCode4Value[code4].code3] = airportsCode4Value[code4];
            }
        }
        return airportsCode3;
    });
    const getCode4 = computed(() => airportsCode4.value);

    const getCity = computed(() => {
        return (code: string, type: string = 'city'): string => {
            const airportsCode3Value = getCode3.value;
            const airportsCode4Value = airportsCode4.value;
            const src = code.length === 4 ? airportsCode4Value : airportsCode3Value;
            return src[code]?.[type] || code;
        };
    });
    const fetchAirports = async () => {
        if (isLoding.airport) return;
        isLoding.airport = true;
        if (!airportsCode4.value['ZHCC']) {
            const res = await api(CONFIG.url.airports) as Record<string, AirportItem>;
            airportsCode4.value = res;
        }
        isLoding.airport = false;
    };


    return {
        getCity,
        getCode3,
        getCode4,
        fetchAirports,
    };
});