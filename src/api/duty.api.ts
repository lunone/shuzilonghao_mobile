import { request, get, post, del } from '@/utils/request';
import type { DutyAllResponse, DutyGroup, DutyNote, UserDutyGroup, CreateDutyNotePayload } from '@/types/duty';

/**
 * @description 获取一段时间内所有人的排班情况
 * @param {object} data - 请求参数
 * @param {string} data.startDate - YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {string} data.endDate - YYYY-MM-DDTHH:mm:ss.sssZ
 * @returns {Promise<DutyAllResponse>}
 */
export const getDutyAll = (data: { startDate: string; endDate: string }): Promise<DutyAllResponse> => {
    return get({ url: '/duties/all', data, defaultValue: {} });
};

/**
 * @description 获取排班组列表
 * @param {object} data - 请求参数
 * @param {number} data.pageSize - 建议设置一个较大的值以获取所有组
 * @returns {Promise<DutyGroup[]>}
 */
export const getDutyGroups = (data: { pageSize: number }): Promise<DutyGroup[]> => {
    return get({ url: '/system/duty-groups', data, defaultValue: [] });
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
    return get({ url: '/duties/notes', data, defaultValue: [] });
};

/**
 * @description 获取当前用户有权限的排班组
 * @returns {Promise<UserDutyGroup[]>}
 */
export const getUserPermittedDutyGroups = (): Promise<UserDutyGroup[]> => {
    return get({ url: '/duties/groups/all', defaultValue: [] });
};

/**
 * @description 获取当前用户的交接日志列表
 * @param {object} data - 请求参数
 * @param {string} data.startDate - YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {string} data.endDate - YYYY-MM-DDTHH:mm:ss.sssZ
 * @returns {Promise<DutyNote[]>}
 */
export const getMyDutyNotes = (data: { startDate: string; endDate: string }): Promise<DutyNote[]> => {
    return get({ url: '/duties/notes', data, defaultValue: [] });
};

/**
 * @description 创建新的交接日志
 * @param {CreateDutyNotePayload} data - 日志内容
 * @returns {Promise<DutyNote>}
 */
export const createDutyNote = (data: CreateDutyNotePayload): Promise<DutyNote> => {
    return post({ url: '/duties/notes', data });
};

/**
 * @description 删除指定的交接日志
 * @param {number} id - 日志ID
 * @returns {Promise<boolean>}
 */
export const deleteDutyNote = (id: number): Promise<boolean> => {
    return del({ url: `/duties/notes/${id}`, defaultValue: false });
};