import { defineStore } from 'pinia';
import api from '@/utils/api';
import { AircraftItem, AirportItem, UserItem } from '@/interface';
import dayjs from 'dayjs';
import CONFIG from '@/config';

export default defineStore('basis', {
    state: () => ({
        isLoding: { airport: false, aircraft: false },
        airportsCode4: {} as Record<string, AirportItem>,
        aircraftsArr: [] as AircraftItem[],
    }),
    getters: {
        airportsCode3: (state) => {
            const airportsCode4 = state.airportsCode4;
            const airportsCode3 = {}
            for (const code4 in airportsCode4) {
                if (airportsCode4[code4].code3) {
                    airportsCode3[airportsCode4[code4].code3] = airportsCode4[code4];
                }
            }
            return airportsCode3;
        },
        // airports: (state) => state.airportsCode4,
        city: function (state) {
            const that = this;
            return function (code: string, type: string = 'abbr'): string {
                const airportsCode3 = that.airportsCode3;
                const airportsCode4 = state.airportsCode4;
                const src = code.length === 4 ? airportsCode4 : airportsCode3;
                return src[code][type] || code;
            }
        },
        aircraftsObj: (state) => state.aircraftsArr.reduce((acc, cur) => ({ ...acc, [cur.acReg]: cur }), {}),
    },
    actions: {
        async getAirports() {
            if (this.isLoding.airport) return;
            this.isLoding.airport = true;
            if (!this?.airportsCode4['ZHCC']) {
                const res = await api(CONFIG.url.airports) as Record<string, AirportItem>;
                this.airportsCode4 = res;
                this.isLoding.airport = false;
            }
        },

        async getAircrafts() {
            if (this.isLoding.aircraft) return;
            this.isLoding.aircraft = true;
            if (!this.aircraftsArr.length) {
                const res = await api(CONFIG.url.aircrafts) as AircraftItem[];
                const acTypeShortTranslate: Record<string, string> = {
                    B73: 'B737', B74: 'B747', A32: 'A320', A31: 'A319'
                }
                res.map(aircraft => {
                    aircraft.startDate = dayjs(aircraft.startDate).toDate();
                    aircraft.endDate = aircraft.endDate ? dayjs(aircraft.endDate).toDate() : undefined;
                    aircraft.acTypeLong = acTypeShortTranslate[aircraft.acTypeLong] || aircraft.acType;
                })
                this.aircraftsArr = res;
                this.isLoding.aircraft = false;
            }
        },
    }
})