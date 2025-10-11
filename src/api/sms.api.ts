import request from '@/utils/request';
import type { DateRangeQueryDTO } from '@/interface/common.interface';
import type { SmsStatsResponse, SmsEventItem, SmsVoluntaryItem } from '@/interface/sms.interface';

// 获取SMS统计
export const getSmsStat = async (data: DateRangeQueryDTO): Promise<SmsStatsResponse> => {
    return request({
        url: '/sms/stat',
        data,
    });
};

// 获取SMS事件列表
export const getSmsEvents = async (data: DateRangeQueryDTO): Promise<SmsEventItem[]> => {
    return request({
        url: '/sms/event/list',
        data,
    });
};

// 获取SMS自愿报告列表
export const getSmsVoluntarys = async (data: DateRangeQueryDTO): Promise<SmsVoluntaryItem[]> => {
    return request({
        url: '/sms/voluntary/list',
        data,
    });
};
