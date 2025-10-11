import request from '@/utils/request';
import type {
  PilotListQueryDTO,
  PilotProfileQueryDTO,
  UserIdOrCodeAndDateRangeQueryDTO,
  PilotProfile,
  PilotDutyResponse,
  PilotListResponse
} from '@/interface/pilot.interface';
import type { CrewCrewMateStats, CrewFatigueStatsResponse } from '@/interface/stat.interface';

// 获取飞行员列表
export const getPilots = async (data?: PilotListQueryDTO): Promise<PilotListResponse> => {
    return request({
        url: '/pilot/list',
        data,
    });
};

// 获取飞行员信息
export const getPilotProfile = async (data: PilotProfileQueryDTO): Promise<PilotProfile> => {
    return request({
        url: '/pilot/profile',
        data,
    });
};

// 获取飞行员值班信息
export const getPilotDuty = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<PilotDutyResponse> => {
    return request({
        url: '/pilot/duty',
        data,
    });
};

// 获取飞行员缺勤信息
export const getPilotAbsence = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<any[]> => {
    return request({
        url: '/pilot/absence',
        data,
    });
};

// 获取飞行员培训信息
export const getPilotTraining = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<any[]> => {
    return request({
        url: '/pilot/training',
        data,
    });
};

// 获取飞行员机搭子信息
export const getPilotCrewMate = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<CrewCrewMateStats[]> => {
    return request({
        url: '/stat/crew/mate',
        data,
    });
};

// 获取飞行员疲劳信息
export const getPilotFatigue = async (data: UserIdOrCodeAndDateRangeQueryDTO): Promise<CrewFatigueStatsResponse[]> => {
    return request({
        url: '/stat/crew/fatigue',
        data,
    });
};
