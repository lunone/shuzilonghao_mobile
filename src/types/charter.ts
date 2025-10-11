// 包租航线相关接口定义

import type { DateRangeQueryDTO } from './common.interface';

// 包租航线DTO
export interface CharterFlightDTO extends DateRangeQueryDTO {
  startDate: Date | string;
  endDate: Date | string;
  airlineId: number;
}

// 包租航线数据响应
export interface CharterFlightData {
  date: string;
  airline: string;
  flightCount: number;
  passengerCount: number;
  cargoWeight: number;
  revenue: number;
}

// 燃油价格DTO
export interface FuelPriceDTO extends DateRangeQueryDTO {
  startDate: Date | string;
  endDate: Date | string;
  airports: string[];
}

// 燃油价格数据响应
export interface FuelPriceData {
  airport: string;
  date: string;
  price: number;
  currency: string;
  supplier?: string;
}
