import request from '@/utils/request';
import type { AirportCode4Response } from '@/interface/airport.interface';

// 获取机场列表
export const getAirports = async (): Promise<AirportCode4Response> => {
    return request({
        url: '/airport/code4',
    });
};
