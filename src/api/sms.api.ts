import { request } from '@/utils/request';
import type { DateRangeQueryDTO } from '@/types/common';

// SMS相关接口定义 (从 sms.interface.ts 移动而来)

export interface SmsEventItem {
  id: number;
  eventType: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: Date | string;
  occurredAt: Date | string;
  location: string;
  dep?: string;
  arr?: string;
  acReg?: string;
  crews?: string | string[];
  aircraft?: string;
  status: 'open' | 'investigating' | 'closed' | 'action_taken';
  actions?: string[];
  followUp?: string;
}

export interface SmsVoluntaryItem {
  id: number;
  reportType: string;
  description: string;
  anonymous: boolean;
  reporter: string;
  reportedAt: Date | string;
  category: string;
  recommendations?: string;
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  feedback?: string;
}

export interface SmsMonthlyStat {
  events: number;
  voluntarys: number;
}
export type SmsStatResponse = Record<string, SmsMonthlyStat>;

// 获取SMS统计
export const getSmsStat = async (data: DateRangeQueryDTO): Promise<SmsStatResponse> => {
    return request({ url: '/sms/stat', data });
};

// 获取SMS事件列表
export const getSmsEvents = async (data: DateRangeQueryDTO): Promise<SmsEventItem[]> => {
    return request({ url: '/sms/event/list', data });
};

// 获取SMS自愿报告列表
export const getSmsVoluntarys = async (data: DateRangeQueryDTO): Promise<SmsVoluntaryItem[]> => {
    return request({ url: '/sms/voluntary/list', data });
};
