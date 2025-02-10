import { defineStore } from 'pinia';
import api from '@/utils/api';
import { AircraftItem, AirportItem, User } from '@/interface';
import dayjs from 'dayjs';

export const useStore = defineStore('main', {//需要注意的是，defineStore返回的是一个回调方法
    // id:test是该状态管理的唯一标志也可以使用defineStore(id,{});的形式
    state: () => ({
        users: {},
        self: { isInit: true } as User & { isInit?: boolean },
        airports: [] as AirportItem[],
        airportsCode4: {} as Record<string, AirportItem>,
        aircrafts: {} as Record<string, AircraftItem>,
        token: '' as string,
    }),
    getters: {
        testGetters(): string {
            return this.name + '...';//直接利用this便能够获取到里面的内容不需要使用state中间对象
        },
        getSelf(): any {
            return this.self;
        }
    },
    actions: {
        setUsers() {
            // this.users = { 'A00725': { name: '李志伦' } }
        },
        async useSelf() {
            if (this.self.isInit) {
                let self = await api('/user/init') as User;
                console.log('初始化请求user资源',self);
                if (self?.id) {
                    // console.log(self);
                    this.self = self;
                }
                this.self.isInit = false;
            }
            return this.self;
        },
        async useAirports() {
            if (!this.airports.length) {
                this.airports = await api('/airport/list') as AirportItem[];
            }
            return this.airports;
        },
        async useAirportsCode4() {
            if (!this.airportsCode4['ZHCC']) {
                const res = await api('/airport/code4/') as Record<string, AirportItem>;
                this.airportsCode4 = res;
            }
            return this.airportsCode4;
        },
        async useAircrafts() {
            if (!Object.keys(this.aircrafts).length) {
                // const res = await api('/aircraft/list') as Record<string, AircraftItem>;
                const res = await api('/aircraft/list/') as AircraftItem[];
                res.map(aircraft => {
                    aircraft.startDate = dayjs(aircraft.startDate).format('YYYY-MM-DD');
                    aircraft.endDate = aircraft.endDate ? dayjs(aircraft.endDate).format('YYYY-MM-DD') : undefined;
                })
                this.aircrafts = res.reduce((acc, cur) => ({ ...acc, [cur.acReg]: cur }), {})
            }
            return this.aircrafts;
        },
        async useUsers() {
            if (!Object.keys(this.users).length) {
                const res = {}//await api('/user/list/') as Record<string, User>;
                this.users = res;
            }
            return this.users;
        },
        useToken(token?: string) {
            if (token) {
                this.token = token;
            }
            return this.token;
        },
    }
})