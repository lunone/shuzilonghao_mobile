// 员工相关接口定义

import type { DateRangeQueryDTO } from './common.interface';

// 员工列表查询DTO
export interface StaffListQueryDTO extends DateRangeQueryDTO {
  departmentId?: number;
  position?: string;
  status?: number;
  name?: string;
}

// 员工档案查询DTO
export interface StaffProfileQueryDTO {
  userId?: string;
  includeInactive?: boolean;
}

// 员工档案响应
export interface StaffProfile {
  id: string;
  userId: string;
  name: string;
  department: string;
  departmentId: number;
  position: string;
  hireDate: Date | string;
  mobile?: string;
  email?: string;
  employeeId: string;
  status: number; // 1: 在职, 0: 离职
  contracts: EmploymentContract[];
  emergencyContacts: EmergencyContact[];
}

// 劳动合同
export interface EmploymentContract {
  type: string;
  signedDate: Date | string;
  startDate: Date | string;
  endDate?: Date | string;
  status: string;
}

// 紧急联系人
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
}

// 今日值班响应
export interface DutyTodayResponse {
  userId: string;
  name: string;
  department: string;
  dutyType: string;
  startTime: string;
  endTime: string;
  location?: string;
}
