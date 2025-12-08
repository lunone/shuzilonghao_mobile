# 前端要求如下：

## 概述

本文档整理了基于当前mock数据的后端API接口需求，所有接口均为POST请求，返回数据为解包后的实际业务数据。

## 接口分类

### 1. 飞机分析类API

#### 1.1 获取飞机利用率数据
- **请求路径**: `/aircraft/utilization`
- **功能描述**: 获取指定飞机在指定时间区间的利用率统计
- **请求参数**:
  ```json
  {
    "acReg": "string", // 飞机注册号
    "startDate": Date,
    "endDate": Date
  }
  ```
- **返回数据**:
  ```json
  {
    "acReg": "B-1234",
    "utilization": 85.5 ,
    "trend":0.23 // 给定时间段对比前等时长时间段的变化量，可以为空
  }
  ```
- **备注**: 用于替换 `AircraftUtilizationCard.vue` 中的mock数据

### 2. 航班相关API

#### 2.1 获取最近执飞航班列表
- **请求路径**: `/flight/recent-flights`
- **功能描述**: 获取指定飞机执飞航班列表
- **请求参数**:
  ```json
  {
    "acReg": "string", // 飞机注册号
    "startDate": "Date",
    "endDate": "Date"
  }
  ```
- **返回数据**:
```json
[
    {
    "id": 1,
    "flightNo": "CA1831",
    "date": "12月03日",
    "dep": "ZHCC",// 出发地的四字节
    "arr": "ZHYT",// 到达地的四字节
    "std":"Date",
    "etd":"Date",
    "atd":"Date",
    "sta":"Date",
    "eta":"Date",
    "ata":"Date",
    "netWeightCargo": 15000
    }
]

```
- **备注**: 用于替换 `RecentFlightsCard.vue` 中的mock数据

#### 2.2 获取航班详细信息
- **请求路径**: `/flight/detail`
- **功能描述**: 获取指定航班的详细信息
- **请求参数**:
  ```json
  {
    "flightId": "number", // 航班ID
  }
  ```
- **返回数据**:
  ```json
  {
    "id": 1234,
    "date": "2024-09-03",
    "bay": "A1",
    "flightNo": "CA1234",
    "carrier": "中国国航",
    "acReg": "B-1234",
    "acType": "B737",
    "flightKind": "客运正班",
    "std": "08:00", // 计划起飞时间
    "etd": "08:05", // 预计起飞时间
    "atd": "08:03", // 实际起飞时间
    "sta": "10:30", // 计划到达时间
    "eta": "10:35", // 预计到达时间
    "ata": "10:32", // 实际到达时间
    "dep": "PEK",
    "arr": "SHA",
    "isAltn": false, // 是否备降
    "isCancle": false, // 是否取消
    "isDelay": false, // 是否延误
    "netWeightCargo": 15000 // 载重（公斤）
  }

### 3. 航线统计类API

#### 3.1 获取航线统计数据
- **请求路径**: `/analysis/route-statistics`
- **功能描述**: 获取指定航线的飞机和货量统计信息
- **请求参数**:
  ```json
  {
    "route": "PEK-SHA", // 航线代码
    "startDate": "2024-01-01", // 开始日期
    "endDate": "2024-12-31", // 结束日期
    "carrier": "string" // 承运人（可选）
  }
  ```
- **返回数据**:
  ```json
  {
    "route": "PEK-SHA",
    "routeName": "北京首都 → 上海虹桥",
    "total": {
      "netWeightCargo": {
        "total": 1250.5 // 总货量（吨）
      },
      "hour": {
        "total": 258.5 // 总飞行小时
      },
      "counter": 156 // 总航班班次
    },
    "aircrafts": [
      {
        "acReg": "B-1234",
        "acType": "B737",
        "stats": {
          "netWeightCargo": {
            "total": 350.8
          },
          "hour": {
            "total": 75.2
          },
          "counter": 45
        }
      }
    ]
  }
  ```
- **备注**: 用于替换 `airlineStat.vue` 中的页面参数数据

### 4. 飞机详情类API

#### 4.1 获取飞机详细信息
- **请求路径**: `/aircraft/detail`
- **功能描述**: 获取飞机的完整详细信息
- **请求参数**:
  ```json
  {
    "acReg": "string" // 飞机注册号
  }
  ```
- **返回数据**:
  ```json
  {
    "acReg": "B-1234",
    "acType": "B737-800",
    "startDate": "2018-05-15",
    "endDate": null,
    "regId": "123",
    // 基本尺寸信息
    "totalLength": 39.5,
    "totalHeight": 12.3,
    "wingSpan": 35.8,
    "winglet": true,
    // 发动机信息
    "engineModel": "CFM56-7B",
    "engPower": 117000,
    "toga": 117000,
    "togaInvalid": 97000,
    // 重量数据
    "oew": 41150,
    "bew": 41413,
    "maxDepartWeight": 70535,
    "maxLandfallWeight": 66300,
    "maxNoOilWeight": 60630,
    // 运营参数
    "availableSeatNum": 162,
    "maxPayload": 19135,
    "availableLoad": 19000,
    "maxTaxiWt": 71498,
    "limitTkofWt": 70535,
    "limitLndWt": 66300,
    // 设备能力
    "iscat2": false,
    "rvsmYn": "Y",
    "rnpApchYn": "Y",
    "rnpArYn": "N",
    "oxygenTime": 50,
    "plateauYn": "N",
    "cat2Yn": "N",
    "overwaterFlag": "N",
    "extOverwaterFlag": "N",
    "hightPalteauFlag": "N",
    "etops": 0,
    "isHf": false,
    "isSatelliteTelephone": "N",
    // 运营标志
    "validFlag": "Y",
    "pOrC": "C",
    "carrier": "中国国航",
    "layout": "Y162",
    // 更多，数据库里其他字段
｝
## 接口统一要求


## 备注

- 所有时间格式都返回js Date格式
  
---

**文档生成时间**: 2025-12-08 00:50:08
**涉及文件**:
- `src/pages/analysis/AircraftUtilizationCard.vue`
- `src/pages/flight/RecentFlightsCard.vue`
- `src/pages/flight/flightDetail.vue`
- `src/pages/analysis/airlineStat.vue`
- `src/pages/airplane/airplaneDetail.vue`
    "class": "3C",
    "restGrade": "C",
    "oewIdx": 42.3,
    "oewGc": 41.8,
    "callFreq": "131.950",
    "modS": "A",
    "telNo": "010-12345678",
    "fltStartDate": "2018-05-15",
    "fltEndDate": null,
    "rmk": ""
  }
  ```
- **备注**: 用于补充 `airplaneDetail.vue` 中的飞机详细信息
  ```
- **备注**: 用于替换 `flightDetail.vue` 中的mock数据




# 后端实现如下：

## 1. 最近执飞航班列表

**接口路径:** `/flight/recent-flights`  
**请求方法:** POST  
**请求Body:**
```json
{
  "acReg": "飞机注册号",
  "startDate": "开始日期",
  "endDate": "结束日期"
}
```
**Controller返回:** 
```typescript
return this.flightService.getRecentFlights(acReg, startDate, endDate);
```

---

## 2. 航班详细信息

**接口路径:** `/flight/detail`  
**请求方法:** POST  
**请求Body:**
```json
{
  "flightId": "航班ID"
}
```
**Controller返回:** 
```typescript
return this.flightService.getFlightDetail(flightId);
```

---

## 3. 航线统计数据

**接口路径:** `/analysis/route-statistics`  
**请求方法:** POST  
**请求Body:**
```json
{
  "route": "航线",
  "startDate": "开始日期",
  "endDate": "结束日期",
  "carrier": "承运人"
}
```
**Controller返回:** 
```typescript
return this.statService.getRouteStatistics(route, startDate, endDate, carrier);
```

---

## 4. 飞机详细信息

**接口路径:** `/aircraft/detail`  
**请求方法:** POST  
**请求Body:**
```json
{
  "acReg": "飞机注册号"
}
```
**Controller返回:** 
```typescript
return this.aircraftService.getAircraftDetail(acReg);
```

---

## 说明

- 日期格式请使用标准日期格式（如：2024-01-01）
- acReg参数为飞机注册号（如：B-1234）
- flightId为航班唯一标识符
- route参数为航线信息（如：PEK-SHA）