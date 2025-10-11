import { request } from '@/utils/request';

// 机场相关接口定义 (从 airport.interface.ts 移动而来)

// 机场信息
export interface AirportInfo {
  code4: string; // 4位代码
  code3?: string; // 3位代码
  name: string; // 机场名称
  city?: string; // 城市
  province?: string; // 省份
  country?: string; // 国家
  latitude?: number; // 纬度
  longitude?: number; // 经度
  elevation?: number; // 海拔高度
  runwayLength?: number; // 跑道长度
  iata?: string; // IATA代码
  icao?: string; // ICAO代码
  timezone?: string; // 时区
  isActive?: boolean; // 是否有效
}

// 机场项 (兼容现有代码)
export type AirportItem = AirportInfo;

// 机场code4响应
export type AirportCode4Response = Record<string, AirportInfo>;

// 获取机场列表
export const getAirports = async (): Promise<AirportCode4Response> => {
    return request('/airport/code4');
};
