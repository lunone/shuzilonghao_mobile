import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import dayjs from 'dayjs';
import CONFIG from '@/config';
import { AircraftItem, AirportItem } from '@/interface';

export const useAircraftStore = defineStore('aircraft', () => {
    const isLoading = { aircraft: false };
    const aircraftsArr = ref<AircraftItem[]>([]);



    const aircraftsObj = computed(() => {
        return aircraftsArr.value.reduce((acc, cur) => ({ ...acc, [cur.acReg]: cur }), {});
    });

    const aircraftArr = computed(() => aircraftsArr.value);

    const fetchAircrafts = async () => {
        if (isLoading.aircraft) return;
        isLoading.aircraft = true;
        if (!aircraftsArr.value.length) {
            const res = await api(CONFIG.url.aircrafts) as AircraftItem[];
            const acTypeShortTranslate: Record<string, string> = {
                B73: 'B737', B74: 'B747', A32: 'A320', A31: 'A319'
            };
            res.forEach(aircraft => {
                aircraft.startDate = dayjs(aircraft.startDate).toDate();
                aircraft.endDate = aircraft.endDate ? dayjs(aircraft.endDate).toDate() : undefined;
                aircraft.acTypeLong = acTypeShortTranslate[aircraft.acTypeLong] || aircraft.acType;
            });
            aircraftsArr.value = res;
        }
        isLoading.aircraft = false;
    };

    return {
        aircraftArr,
        aircraftsObj,
        fetchAircrafts,
    };
});