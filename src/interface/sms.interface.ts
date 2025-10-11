// SMS相关接口定义

// SMS事件项
export interface SmsEventItem {
  id: number;
  eventType: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: Date | string;
  occurredAt: Date | string;
  location: string;
  aircraft?: string;
  status: 'open' | 'investigating' | 'closed' | 'action_taken';
  actions?: string[];
  followUp?: string;
}

// SMS自愿报告项
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

// SMS统计响应 (按月统计对象)
export interface SmsStatsResponse {
  year: number;
  month: number;
  totalEvents: number;
  totalVoluntary: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  resolutionRate: number;
}
