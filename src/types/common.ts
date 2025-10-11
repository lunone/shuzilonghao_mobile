// 通用基础类型定义

// 日期范围查询DTO
export interface DateRangeQueryDTO {
  startDate: Date | string;
  endDate: Date | string;
}

// ID查询DTO
export interface IdDTO {
  id: number;
}

// 用户ID查询DTO
export interface UserIdDTO {
  userId: string;
}

// 通用响应包装
export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 登录响应
export interface LoginResponse {
  token: string;
}

// 分页查询DTO
export interface PaginationQueryDTO {
  page?: number;
  pageSize?: number;
}

// 基础实体字段
export interface BaseEntity {
  id?: number;
  createTime?: Date | string;
  updateTime?: Date | string;
  createBy?: string;
  updateBy?: string;
}

// 激活DTO
export interface WxActivateDTO {
  code: string; // 微信jscode
  regCode: string; // 激活码
}

// 密码登录DTO
export interface PasswordLoginDTO {
  username: string;
  password: string;
}
