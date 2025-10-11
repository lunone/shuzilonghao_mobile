import { request } from '@/utils/request';
import type { DateRangeQueryDTO } from '@/types/common';
import type { CrewCrewMateStats, CrewFatigueStatsResponse } from '@/api/statistics.api';

// 飞行员相关接口定义 (从 pilot.interface.ts 移动而来)

// 飞行员列表查询DTO
export interface PilotListQueryDTO extends DateRangeQueryDTO {
  departmentId?: number;
  status?: number;
  name?: string;
  code?: string;
}

// 飞行员档案查询DTO
export interface PilotProfileQueryDTO {
  userId?: string;
  idType?: 'userId' | 'code'; // 默认 userId
}

// 用户ID或代码和日期范围查询DTO
export interface UserIdOrCodeAndDateRangeQueryDTO extends DateRangeQueryDTO {
  userId?: string;
  code?: string;
}

// 飞行员档案响应
export interface PilotProfile {
  id: string;
  userId: string;
  name: string;
  code: string;
  department: string;
  position: string;
  licenseType: string;
  licenseNumber: string;
  issuingAuthority: string;
  validFrom: Date | string;
  validTo: Date | string;
  ratings: PilotRating[];
  medicalCertificates: MedicalCertificate[];
  experience: PilotExperience[];
  trainingRecords: TrainingRecord[];
}

// 飞行员等级
export interface PilotRating {
  type: string; // 等级类型 (CAPT, FO, SO等)
  aircraftType: string; // 机型
  validFrom: Date | string;
  validTo: Date | string;
  status: string;
}

// 体检证书
export interface MedicalCertificate {
  class: string; // 体检等级
  validFrom: Date | string;
  validTo: Date | string;
  issuingAuthority: string;
  limitations?: string;
}

// 飞行员经验
export interface PilotExperience {
  aircraftType: string;
  totalHours: number;
  captainHours: number;
  coPilotHours: number;
  lastFlight: Date | string;
}

// 培训记录
export interface TrainingRecord {
  trainingType: string;
  trainingDate: Date | string;
  location: string;
  instructor: string;
  result: string;
  validTo: Date | string;
}

// 值班记录响应
export type PilotDutyResponse = PilotDutyRecord[];

// 值班记录
export interface PilotDutyRecord {
  id: number;
  userId: string;
  dutyDate: Date | string;
  dutyType: string; // 值班类型
  startTime: string;
  endTime: string;
  location: string;
  remarks?: string;
}

// 飞行员列表响应
export interface PilotListResponse {
  total: number;
  list: PilotProfile[];
}

// 多飞行员统计响应
export interface PilotMultiStats {
  totalPilots: number;
  activePilots: number;
  avgHoursPerPilot: number;
  topPerformers: PilotProfile[];
}

// 获取飞行员列表
export const getPilots = async (data?: PilotListQueryDTO): Promise<PilotListResponse> => {
    return request('/pilot/list', data);
};

// 获取飞行员信息
export const getPilotProfile = async (data: PilotProfileQueryDTO): Promise<PilotProfile> => {
    return request('/pilot/profile', data);
};

// 获取飞行员值班信息
export const getPilotDuty = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<PilotDutyResponse> => {
    return request('/pilot/duty', data);
};

// 获取飞行员缺勤信息
export const getPilotAbsence = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<any[]> => {
    return request('/pilot/absence', data);
};

// 获取飞行员培训信息
export const getPilotTraining = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<any[]> => {
    return request('/pilot/training', data);
};

// 获取飞行员机搭子信息
export const getPilotCrewMate = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<CrewCrewMateStats[]> => {
    return request('/stat/crew/mate', data);
};

// 获取飞行员疲劳信息响应
export interface PilotFatigueResponse {
  airlines: Array<{ name: string; value: number }>;
  atds: Array<{ name: string; value: number }>;
  flightHours: Array<{ name: string; value: number }>;
  totalCount: number;
  totalFlightHours: number;
  totalDays: number;
}

// 获取飞行员疲劳信息
export const getPilotFatigue = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<PilotFatigueResponse> => {
    return request('/stat/crew/fatigue', data);
};
