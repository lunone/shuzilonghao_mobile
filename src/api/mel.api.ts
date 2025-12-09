import { request } from '@/utils/request';
import type {
    MelQueryDto,
    MelDetailDto,
    MelByAircraftDto,
    MelByUserDto,
    MelByDateRangeDto,
    MelByATADto,
    MelPageResponse,
    MelStatsResponse,
    VMel,
    MelDetailResponse,
    MelQueryBuilder
} from '@/types/mel';

// MEL API服务层 - 基于后端接口文档
export class MelAPIService {
    /**
     * 通用查询接口 - 支持所有查询条件
     */
    static async getMelList(params: MelQueryDto): Promise<MelPageResponse> {
        return request({
            url: '/mel/list',
            data: params,
            showLoading: true
        });
    }

    /**
     * 获取MEL统计数据
     */
    static async getMelStats(params: MelQueryDto): Promise<MelStatsResponse> {
        return request({
            url: '/mel/stats',
            data: params,
            showLoading: true
        });
    }

    /**
     * 获取单个MEL记录详情
     */
    static async getMelDetail(params: MelDetailDto): Promise<MelDetailResponse> {
        return request({
            url: '/mel/detail',
            data: params,
            showLoading: true
        });
    }

    /**
     * 根据飞机号查询
     */
    static async getMelByAircraft(params: MelByAircraftDto): Promise<MelPageResponse> {
        return request({
            url: '/mel/by/aircraft',
            data: params,
            showLoading: true
        });
    }

    /**
     * 根据用户查询
     */
    static async getMelByUser(params: MelByUserDto): Promise<MelPageResponse> {
        return request({
            url: '/mel/by/user',
            data: params,
            showLoading: true
        });
    }

    /**
     * 根据日期范围查询
     */
    static async getMelByDateRange(params: MelByDateRangeDto): Promise<MelPageResponse> {
        return request({
            url: '/mel/by/date-range',
            data: params,
            showLoading: true
        });
    }

    /**
     * 根据ATA章节查询
     */
    static async getMelByATA(params: MelByATADto): Promise<MelPageResponse> {
        return request({
            url: '/mel/by/ata',
            data: params,
            showLoading: true
        });
    }

    /**
     * 获取状态分布统计
     */
    static async getStatusStats(params: MelQueryDto): Promise<MelStatsResponse> {
        return request({
            url: '/mel/stats/status',
            data: params,
            showLoading: true
        });
    }

    /**
     * 获取ATA章节分布统计
     */
    static async getATAStats(params: MelQueryDto): Promise<MelStatsResponse> {
        return request({
            url: '/mel/stats/ata',
            data: params,
            showLoading: true
        });
    }

    /**
     * 获取月度统计
     */
    static async getMonthlyStats(params: MelQueryDto): Promise<MelStatsResponse> {
        return request({
            url: '/mel/stats/monthly',
            data: params,
            showLoading: true
        });
    }
}

// 链式调用查询构建器
export class MelQueryBuilderImpl implements MelQueryBuilder {
    private params: MelQueryDto = {};

    constructor(initialParams?: Partial<MelQueryDto>) {
        this.params = { ...initialParams };
    }

    // 基础筛选条件
    withAircraft(acReg: string): MelQueryBuilder {
        this.params.acReg = acReg;
        return this;
    }

    withDateRange(startDate: string, endDate: string, dateType?: string): MelQueryBuilder {
        this.params.startDate = startDate;
        this.params.endDate = endDate;
        if (dateType) this.params.dateType = dateType;
        return this;
    }

    withUser(userId: string, userIdType: 'inputter' | 'approver' | 'ata'): MelQueryBuilder {
        this.params.userId = userId;
        this.params.userIdType = userIdType;
        return this;
    }

    withMEL(melNo: string): MelQueryBuilder {
        this.params.melNo = melNo;
        return this;
    }

    withDDF(ddfNo: string): MelQueryBuilder {
        this.params.ddfNo = ddfNo;
        return this;
    }

    withATA(ata1: string, ata2?: string): MelQueryBuilder {
        this.params.ata1 = ata1;
        if (ata2) this.params.ata2 = ata2;
        return this;
    }

    withAircraftType(acType: string): MelQueryBuilder {
        this.params.acType = acType;
        return this;
    }

    withDeferralType(deffer: string): MelQueryBuilder {
        this.params.deffer = deffer;
        return this;
    }

    withType(type: string): MelQueryBuilder {
        this.params.type = type;
        return this;
    }

    withStatus(status: string): MelQueryBuilder {
        this.params.status = status;
        return this;
    }

    // 分页设置
    withPage(page: number): MelQueryBuilder {
        this.params.page = page;
        return this;
    }

    withSize(size: number): MelQueryBuilder {
        this.params.size = size;
        return this;
    }

    // 执行查询
    async list(): Promise<MelPageResponse> {
        return MelAPIService.getMelList(this.params);
    }

    async stats(): Promise<MelStatsResponse> {
        return MelAPIService.getMelStats(this.params);
    }

    async detail(id: number, source: string): Promise<MelDetailResponse> {
        return MelAPIService.getMelDetail({ id, source });
    }

    // 专用查询方法
    async byAircraft(): Promise<MelPageResponse> {
        if (!this.params.acReg) {
            throw new Error('飞机注册号是必填项');
        }
        return MelAPIService.getMelByAircraft({
            acReg: this.params.acReg,
            page: this.params.page,
            size: this.params.size
        });
    }

    async byUser(): Promise<MelPageResponse> {
        if (!this.params.userId || !this.params.userIdType) {
            throw new Error('用户ID和用户类型是必填项');
        }
        return MelAPIService.getMelByUser({
            userId: this.params.userId,
            userIdType: this.params.userIdType,
            page: this.params.page,
            size: this.params.size
        });
    }

    async byDateRange(): Promise<MelPageResponse> {
        return MelAPIService.getMelByDateRange({
            startDate: this.params.startDate,
            endDate: this.params.endDate,
            dateType: this.params.dateType,
            page: this.params.page,
            size: this.params.size
        });
    }

    async byATA(): Promise<MelPageResponse> {
        return MelAPIService.getMelByATA({
            ata1: this.params.ata1,
            ata2: this.params.ata2,
            page: this.params.page,
            size: this.params.size
        });
    }

    async statusStats(): Promise<MelStatsResponse> {
        return MelAPIService.getStatusStats(this.params);
    }

    async ataStats(): Promise<MelStatsResponse> {
        return MelAPIService.getATAStats(this.params);
    }

    async monthlyStats(): Promise<MelStatsResponse> {
        return MelAPIService.getMonthlyStats(this.params);
    }
}

// 便捷方法：创建查询构建器
export const createMelQuery = (initialParams?: Partial<MelQueryDto>): MelQueryBuilder => {
    return new MelQueryBuilderImpl(initialParams);
};

// 默认查询：最近一个月的MEL数据
export const getDefaultMelQuery = (): MelQueryBuilder => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    return new MelQueryBuilderImpl({
        startDate: oneMonthAgo.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
        dateType: 'inputterDate',
        page: 1,
        size: 20
    });
};

// 兼容性：保持与现有API的兼容
export const getMels = (data: { startDate: string; endDate: string; acReg?: string }) => {
    if (data.acReg) {
        // 如果有飞机注册号，使用通用查询接口
        return MelAPIService.getMelList({
            startDate: data.startDate,
            endDate: data.endDate,
            dateType: 'inputterDate',
            acReg: data.acReg,
            page: 1,
            size: 20
        }).then(response => response.records);
    } else {
        // 如果没有飞机注册号，使用日期范围查询
        return MelAPIService.getMelByDateRange({
            startDate: data.startDate,
            endDate: data.endDate,
            dateType: 'inputterDate',
            page: 1,
            size: 20
        }).then(response => response.records);
    }
};