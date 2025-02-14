import { defineStore } from 'pinia';
import api from '@/utils/api';
import { AircraftItem, AirportItem, UserItem } from '@/interface';
import dayjs from 'dayjs';
import CONFIG from '@/config';

export default defineStore('basis', {
    state: () => ({
        airports: [] as AirportItem[],
        airportsCode4: {} as Record<string, AirportItem>,
        aircrafts: {} as Record<string, AircraftItem>,
    }),
    getters: {
    },
    actions: {
        async airports() {
            if (!this.airportsCode4['ZHCC']) {
                const res = await api(CONFIG.url.airports) as Record<string, AirportItem>;
                this.airportsCode4 = res;
            }
            return this.airportsCode4;
        },
        async aircrafts() {
            if (!Object.keys(this.aircrafts).length) {
                const res = await api(CONFIG.url.aircrafts) as AircraftItem[];
                res.map(aircraft => {
                    aircraft.startDate = dayjs(aircraft.startDate).format('YYYY-MM-DD');
                    aircraft.endDate = aircraft.endDate ? dayjs(aircraft.endDate).format('YYYY-MM-DD') : undefined;
                })
                this.aircrafts = res.reduce((acc, cur) => ({ ...acc, [cur.acReg]: cur }), {})
            }
            return this.aircrafts;
        },
    }
})