import { defineStore } from 'pinia';
import api from '@/utils/api';
import { AircraftItem, AirportItem, User } from '@/interface';
import dayjs from 'dayjs';

export default defineStore('basis', {
    state: () => ({
        airports: [] as AirportItem[],
        airportsCode4: {} as Record<string, AirportItem>,
        aircrafts: {} as Record<string, AircraftItem>,
    }),
    getters: {
        getSelf(): any {
            return this.self;
        }
    },
    actions: {

        async airports() {
            if (!this.airports.length) {
                this.airports = await api('/airport/list') as AirportItem[];
            }
            return this.airports;
        },
        async airportsCode4() {
            if (!this.airportsCode4['ZHCC']) {
                const res = await api('/airport/code4/') as Record<string, AirportItem>;
                this.airportsCode4 = res;
            }
            return this.airportsCode4;
        },
        async aircrafts() {
            if (!Object.keys(this.aircrafts).length) {
                const res = await api('/aircraft/list/') as AircraftItem[];
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