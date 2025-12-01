export interface Duty {
    id: number;
    userId: string;
    date: number;
}

export interface DutyResponse {
    departmentId: string;
    userId: string;
}

// Based on /duty/all response
export interface DutySchedule {
  groupId: number;
  userId: string;
}

export type DutyAllResponse = Record<string, DutySchedule[]>;

// Based on /duty/group/list response
export interface DutyGroup {
  id: number;
  name: string;
  abbr: string;
}

// Based on /duty/note/list response
export interface DutyNote {
  id: number;
  date: string; // YYYY-MM-DD or ISO Date String
  createDate: string; // ISO Date String
  content: string;
  level: number;
  userId: string;
  groupId: number; // Add groupId to align with data structure
}

// Based on /duty/groups response
export interface UserDutyGroup {
    id: number;
    name: string;
    members: string[];
}


// 新增: 用于创建交接日志的请求体类型
export interface CreateDutyNotePayload {
  date: string; // YYYY-MM-DD or ISO Date String
  content: string;
  level: number;
  groupId: number;
}
