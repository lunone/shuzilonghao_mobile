import { request } from '@/utils/request';
import type { DutyAllResponse, DutyGroup, DutyNote, UserDutyGroup } from '@/types/duty';

/**
 * @description 获取一段时间内所有人的排班情况
 * @param {object} data - 请求参数
 * @param {string} data.startDate - YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {string} data.endDate - YYYY-MM-DDTHH:mm:ss.sssZ
 * @returns {Promise<DutyAllResponse>}
 */
export const getDutyAll = (data: { startDate: string; endDate: string }): Promise<DutyAllResponse> => {
    return request({ url: '/duty/all', data, defaultValue: {} });
};

/**
 * @description 获取排班组列表
 * @param {object} data - 请求参数
 * @param {number} data.pageSize - 建议设置一个较大的值以获取所有组
 * @returns {Promise<DutyGroup[]>}
 */
export const getDutyGroups = (data: { pageSize: number }): Promise<DutyGroup[]> => {
    return request({ url: '/duty/group/list', data, defaultValue: [] });
};

/**
 * @description 获取指定值班组的交接日志列表
 * @param {object} data - 请求参数
 * @param {string} data.startDate - YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {string} data.endDate - YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {number} data.groupId - 要查询的排班组ID
 * @returns {Promise<DutyNote[]>}
 */
export const getDutyNotes = (data: { startDate: string; endDate: string; groupId: number }): Promise<DutyNote[]> => {
    return request({ url: '/duty/note/list', data, defaultValue: [] });
};

/**
 * @description 获取当前用户有权限的排班组
 * @returns {Promise<UserDutyGroup[]>}
 */
export const getUserPermittedDutyGroups = (): Promise<UserDutyGroup[]> => {
    return request({ url: '/duty/groups', defaultValue: [] });
};

/**
 * @description 获取当前用户的交接日志列表
 * @param {object} data - 请求参数
 * @param {string} data.startDate - YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {string} data.endDate - YYYY-MM-DDTHH:mm:ss.sssZ
 * @returns {Promise<DutyNote[]>}
 */
export const getMyDutyNotes = (data: { startDate: string; endDate: string }): Promise<DutyNote[]> => {
    return request({ url: '/duty/note/list', data, defaultValue: [] });
};