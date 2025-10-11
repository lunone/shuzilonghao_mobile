import request from '@/utils/request';
import type { AircraftListResponse, MelQueryDTO, MelItem } from '@/interface/aircraft.interface';

// 获取飞机列表
export const getAircrafts = async (): Promise<AircraftListResponse> => {
    return request({
        url: '/aircraft/list',
    });
};

// 获取MEL事件
export const getMels = async (data: MelQueryDTO): Promise<MelItem[]> => {
    return request({
        url: '/me/mel',
        data,
    });
};
