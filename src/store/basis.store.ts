import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import dayjs from 'dayjs';
import CONFIG from '@/config';
import { AircraftItem, AirportItem } from '@/interface';

export default defineStore('basis', () => {
    const isLoding = { airport: false, aircraft: false };
    const airportsCode4 = ref<Record<string, AirportItem>>({});
    const getAircraftsArr = ref<AircraftItem[]>([]);

    const getAirportsCode3 = computed(() => {
        const airportsCode4Value = airportsCode4.value;
        const airportsCode3: Record<string, AirportItem> = {};
        for (const code4 in airportsCode4Value) {
            if (airportsCode4Value[code4].code3) {
                airportsCode3[airportsCode4Value[code4].code3] = airportsCode4Value[code4];
            }
        }
        return airportsCode3;
    });
    const getAirportsCode4 = computed(() => airportsCode4.value);

    const getCity = computed(() => {
        return (code: string, type: string = 'abbr'): string => {
            const airportsCode3Value = getAirportsCode3.value;
            const airportsCode4Value = airportsCode4.value;
            const src = code.length === 4 ? airportsCode4Value : airportsCode3Value;
            return src[code]?.[type] || code;
        };
    });

    const getAircraftsObj = computed(() => {
        return getAircraftsArr.value.reduce((acc, cur) => ({ ...acc, [cur.acReg]: cur }), {});
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

    const fetchAircrafts = async () => {
        if (isLoding.aircraft) return;
        isLoding.aircraft = true;
        if (!getAircraftsArr.value.length) {
            const res = await api(CONFIG.url.aircrafts) as AircraftItem[];
            const acTypeShortTranslate: Record<string, string> = {
                B73: 'B737', B74: 'B747', A32: 'A320', A31: 'A319'
            };
            res.forEach(aircraft => {
                aircraft.startDate = dayjs(aircraft.startDate).toDate();
                aircraft.endDate = aircraft.endDate ? dayjs(aircraft.endDate).toDate() : undefined;
                aircraft.acTypeLong = acTypeShortTranslate[aircraft.acTypeLong] || aircraft.acType;
            });
            getAircraftsArr.value = res;
        }
        isLoding.aircraft = false;
    };

    return {
        getCity,
        getAirportsCode3,
        getAirportsCode4,
        getAircraftsArr,
        getAircraftsObj,
        fetchAirports,
        fetchAircrafts,
    };
});