import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
    VMel,
    MelQueryDto,
    MelStatsResponse,
    MelQueryBuilder,
    MelPageResponse,
    MelDetailResponse
} from '@/types/mel';
import {
    MelAPIService,
    createMelQuery,
    getDefaultMelQuery
} from '@/api/mel.api';

export const useMelStore = defineStore('mel', () => {
    // === 状态定义 ===
    
    // 数据状态
    const melList = ref<VMel[]>([]);
    const melDetail = ref<MelDetailResponse | null>(null);
    const statsData = ref<MelStatsResponse | null>(null);
    
    // 查询状态
    const loading = ref({
        list: false,
        detail: false,
        stats: false,
        aircraft: false,
        user: false,
        dateRange: false,
        ata: false
    });
    
    // 查询参数缓存
    const lastQueryParams = ref<MelQueryDto | null>(null);
    
    // 分页信息
    const pagination = ref({
        currentPage: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
    });
    
    // 错误状态
    const error = ref<string | null>(null);
    
    // === 计算属性 ===
    
    const hasData = computed(() => melList.value.length > 0);
    const isLoadingAny = computed(() => Object.values(loading.value).some(isLoading => isLoading));
    const currentQueryBuilder = computed(() => {
        return lastQueryParams.value ? createMelQuery(lastQueryParams.value) : getDefaultMelQuery();
    });
    
    // === 基础数据操作 ===
    
    /**
     * 清除所有数据
     */
    const clearData = () => {
        melList.value = [];
        melDetail.value = null;
        statsData.value = null;
        error.value = null;
    };
    
    /**
     * 清除错误
     */
    const clearError = () => {
        error.value = null;
    };
    
    /**
     * 设置错误
     */
    const setError = (message: string) => {
        error.value = message;
    };
    
    /**
     * 更新分页信息
     */
    const updatePagination = (pageResponse: MelPageResponse) => {
        pagination.value = {
            currentPage: pageResponse.page,
            pageSize: pageResponse.size,
            total: pageResponse.total,
            totalPages: pageResponse.totalPages
        };
    };
    
    // === API调用方法 ===
    
    /**
     * 通用查询 - 使用链式调用
     */
    const queryWithBuilder = async (builder: MelQueryBuilder) => {
        loading.value.list = true;
        clearError();
        
        try {
            const response = await builder.list();
            melList.value = response.records;
            updatePagination(response);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || '查询MEL数据失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.list = false;
        }
    };
    
    /**
     * 获取统计信息
     */
    const fetchStats = async (builder: MelQueryBuilder) => {
        loading.value.stats = true;
        clearError();
        
        try {
            const response = await builder.stats();
            statsData.value = response;
            return response;
        } catch (err: any) {
            const errorMessage = err.message || '获取MEL统计数据失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.stats = false;
        }
    };
    
    /**
     * 获取MEL详情
     */
    const fetchDetail = async (id: number, source?: string) => {
        loading.value.detail = true;
        clearError();
        
        try {
            const response = await MelAPIService.getMelDetail({ id, source });
            melDetail.value = response;
            return response;
        } catch (err: any) {
            const errorMessage = err.message || '获取MEL详情失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.detail = false;
        }
    };
    
    // === 专用查询方法 ===
    
    /**
     * 根据飞机查询
     */
    const queryByAircraft = async (acReg: string, page = 1, size = 20) => {
        loading.value.aircraft = true;
        clearError();
        
        try {
            const builder = createMelQuery().withAircraft(acReg).withPage(page).withSize(size);
            lastQueryParams.value = { acReg, page, size };
            
            const response = await builder.byAircraft();
            melList.value = response.records;
            updatePagination(response);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || '查询飞机MEL数据失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.aircraft = false;
        }
    };
    
    /**
     * 根据用户查询
     */
    const queryByUser = async (userId: string, userIdType: 'inputter' | 'approver' | 'ata', page = 1, size = 20) => {
        loading.value.user = true;
        clearError();
        
        try {
            const builder = createMelQuery().withUser(userId, userIdType).withPage(page).withSize(size);
            lastQueryParams.value = { userId, userIdType, page, size };
            
            const response = await builder.byUser();
            melList.value = response.records;
            updatePagination(response);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || '查询用户MEL数据失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.user = false;
        }
    };
    
    /**
     * 根据日期范围查询
     */
    const queryByDateRange = async (startDate: string, endDate: string, dateType = 'inputterDate', page = 1, size = 20) => {
        loading.value.dateRange = true;
        clearError();
        
        try {
            const builder = createMelQuery().withDateRange(startDate, endDate, dateType).withPage(page).withSize(size);
            lastQueryParams.value = { startDate, endDate, dateType, page, size };
            
            const response = await builder.byDateRange();
            melList.value = response.records;
            updatePagination(response);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || '查询日期范围MEL数据失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.dateRange = false;
        }
    };
    
    /**
     * 根据ATA章节查询
     */
    const queryByATA = async (ata1: string, ata2?: string, page = 1, size = 20) => {
        loading.value.ata = true;
        clearError();
        
        try {
            const builder = createMelQuery().withATA(ata1, ata2).withPage(page).withSize(size);
            lastQueryParams.value = { ata1, ata2, page, size };
            
            const response = await builder.byATA();
            melList.value = response.records;
            updatePagination(response);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || '查询ATA章节MEL数据失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.ata = false;
        }
    };
    
    /**
     * 获取状态分布统计
     */
    const fetchStatusStats = async (params?: Partial<MelQueryDto>) => {
        loading.value.stats = true;
        clearError();
        
        try {
            const builder = params ? createMelQuery(params) : getDefaultMelQuery();
            const response = await builder.statusStats();
            statsData.value = response;
            return response;
        } catch (err: any) {
            const errorMessage = err.message || '获取状态分布统计失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.stats = false;
        }
    };
    
    /**
     * 获取ATA分布统计
     */
    const fetchATAStats = async (params?: Partial<MelQueryDto>) => {
        loading.value.stats = true;
        clearError();
        
        try {
            const builder = params ? createMelQuery(params) : getDefaultMelQuery();
            const response = await builder.ataStats();
            statsData.value = response;
            return response;
        } catch (err: any) {
            const errorMessage = err.message || '获取ATA分布统计失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.stats = false;
        }
    };
    
    /**
     * 获取月度统计
     */
    const fetchMonthlyStats = async (params?: Partial<MelQueryDto>) => {
        loading.value.stats = true;
        clearError();
        
        try {
            const builder = params ? createMelQuery(params) : getDefaultMelQuery();
            const response = await builder.monthlyStats();
            statsData.value = response;
            return response;
        } catch (err: any) {
            const errorMessage = err.message || '获取月度统计失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.stats = false;
        }
    };
    
    // === 便捷方法 ===
    
    /**
     * 获取默认查询（最近一个月）
     */
    const fetchDefaultData = async () => {
        const builder = getDefaultMelQuery();
        return queryWithBuilder(builder);
    };
    
    /**
     * 复合查询：同时获取数据和统计
     */
    const fetchWithStats = async (builder: MelQueryBuilder) => {
        loading.value.list = true;
        loading.value.stats = true;
        clearError();
        
        try {
            // 并行执行查询和统计
            const [listResponse, statsResponse] = await Promise.all([
                builder.list(),
                builder.stats()
            ]);
            
            melList.value = listResponse.records;
            updatePagination(listResponse);
            statsData.value = statsResponse;
            
            return { listResponse, statsResponse };
        } catch (err: any) {
            const errorMessage = err.message || '查询MEL数据和统计失败';
            setError(errorMessage);
            throw err;
        } finally {
            loading.value.list = false;
            loading.value.stats = false;
        }
    };
    
    // === 返回值 ===
    
    return {
        // 状态
        melList: computed(() => melList.value),
        melDetail: computed(() => melDetail.value),
        statsData: computed(() => statsData.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        pagination: computed(() => pagination.value),
        hasData,
        isLoadingAny,
        currentQueryBuilder,
        
        // 基础操作
        clearData,
        clearError,
        setError,
        
        // 核心查询
        queryWithBuilder,
        fetchStats,
        fetchDetail,
        fetchDefaultData,
        fetchWithStats,
        
        // 专用查询
        queryByAircraft,
        queryByUser,
        queryByDateRange,
        queryByATA,
        
        // 统计查询
        fetchStatusStats,
        fetchATAStats,
        fetchMonthlyStats
    };
});