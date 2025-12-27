import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getDutyAll, getDutyGroups, getDutyNotes, getUserPermittedDutyGroups, getAccessibleDutyGroups, getMyDutyNotes, createDutyNote, deleteDutyNote } from '@/api/duty.api';
import type { DutyAllResponse, DutyGroup, DutyNote, CreateDutyNotePayload } from '@/types/duty';
import dayjs from 'dayjs';

export const useDutyStore = defineStore('duty', () => {
    // --- STATE ---
    const dutyGroups = ref<Record<string, DutyGroup>>({});
    const dutySchedule = ref<DutyAllResponse>({});
    const dutyNotes = ref<DutyNote[]>([]);
    const userDutyGroups = ref<DutyGroup[]>([]);
    const isLoading = ref({
        groups: false,
        schedule: false,
        notes: false,
        userGroups: false,
    });

    // --- GETTERS ---
    const dutyGroupsList = computed(() => Object.values(dutyGroups.value));

    // --- ACTIONS ---

    /**
     * @description 获取所有值班组信息
     */
    const fetchDutyGroups = async (forceRefresh = false) => {
        if (isLoading.value.groups) return;
        if (!forceRefresh && Object.keys(dutyGroups.value).length > 0) return;

        isLoading.value.groups = true;
        try {
            const response = await getDutyGroups({ pageSize: 100 });
            const groups: Record<string, DutyGroup> = {};
            if (response) {
                response.forEach(group => {
                    groups[group.id] = group;
                });
            }
            dutyGroups.value = groups;
        } catch (error) {
            console.error('Failed to fetch duty groups:', error);
        } finally {
            isLoading.value.groups = false;
        }
    };

    /**
     * @description 获取指定日期范围的排班数据
     * @param {Date} startDate
     * @param {Date} endDate
     */
    const fetchDutySchedule = async (startDate: Date, endDate: Date) => {
        if (isLoading.value.schedule) return;
        isLoading.value.schedule = true;
        try {
            const response = await getDutyAll({
                startDate: dayjs(startDate).toISOString(),
                endDate: dayjs(endDate).toISOString(),
            });
            dutySchedule.value = response;
        } catch (error) {
            console.error('Failed to fetch duty schedule:', error);
        } finally {
            isLoading.value.schedule = false;
        }
    };

    /**
     * @description 获取指定组和日期范围的交接日志
     */
    const fetchDutyNotes = async (groupId: number, startDate: Date, endDate: Date) => {
        if (isLoading.value.notes) return;
        isLoading.value.notes = true;
        try {
            const response = await getDutyNotes({
                groupId,
                startDate: dayjs(startDate).toISOString(),
                endDate: dayjs(endDate).toISOString(),
            });
            dutyNotes.value = response;
        } catch (error) {
            console.error('Failed to fetch duty notes:', error);
            dutyNotes.value = [];
        } finally {
            isLoading.value.notes = false;
        }
    };

    /**
     * @description 获取当前用户在指定日期范围内的交接日志
     */
    const fetchMyDutyNotes = async (startDate: Date, endDate: Date) => {
        if (isLoading.value.notes) return;
        isLoading.value.notes = true;
        try {
            const response = await getMyDutyNotes({
                startDate: dayjs(startDate).toISOString(),
                endDate: dayjs(endDate).toISOString(),
            });
            dutyNotes.value = response;
        } catch (error) {
            console.error('Failed to fetch my duty notes:', error);
            dutyNotes.value = [];
        } finally {
            isLoading.value.notes = false;
        }
    };
    
    /**
     * @description 获取当前用户有权限的值班组（详细信息）
     */
    const fetchUserDutyGroups = async (forceRefresh = false) => {
        if (isLoading.value.userGroups) return;
        if (!forceRefresh && userDutyGroups.value.length > 0) return;

        isLoading.value.userGroups = true;
        try {
            const response = await getAccessibleDutyGroups();
            userDutyGroups.value = response || [];
        } catch (error) {
            console.error('Failed to fetch user duty groups:', error);
        } finally {
            isLoading.value.userGroups = false;
        }
    };

    /**
     * @description 创建交接日志
     */
    const addDutyNote = async (payload: CreateDutyNotePayload) => {
        try {
            const newNote = await createDutyNote(payload);
            if (newNote) {
                // 将新日志添加到列表开头，并按创建日期重新排序
                // Add the new note and re-sort by date
                dutyNotes.value.push(newNote);
                dutyNotes.value.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
            }
            return newNote;
        } catch (error) {
            console.error('Failed to create duty note:', error);
            return null;
        }
    };

    /**
     * @description 删除交接日志
     */
    const removeDutyNote = async (noteId: number) => {
        try {
            const success = await deleteDutyNote(noteId);
            if (success) {
                // 从列表中移除对应的日志
                const index = dutyNotes.value.findIndex(note => note.id === noteId);
                if (index > -1) {
                    dutyNotes.value.splice(index, 1);
                }
            }
            return success;
        } catch (error) {
            console.error('Failed to delete duty note:', error);
            return false;
        }
    };

    return {
        // State
        dutyGroups,
        dutySchedule,
        dutyNotes,
        userDutyGroups,
        isLoading,

        // Getters
        dutyGroupsList,

        // Actions
        fetchDutyGroups,
        fetchDutySchedule,
        fetchDutyNotes,
        fetchMyDutyNotes,
        fetchUserDutyGroups,
        addDutyNote,
        removeDutyNote,
    };
});