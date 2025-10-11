# 批量类型错误修复计划

本文档详细说明了修复项目中多个TypeScript类型错误的具体步骤。请严格按照文件顺序和内部步骤执行。

---

## 1. `src/pages/staff/stat.vue`

**目标：** 修正组件，使用正确的 `PeriodStats` 类型替换错误的 `StatSingle` 类型，并移除不安全的类型断言。

**具体操作：**

1.  **移除错误的导入:**
    ```typescript
    // 删除这一行
    import { StatSingle } from '@/api/flight.api';
    ```

2.  **添加正确的导入:**
    ```typescript
    // 在 import { getStatPeriod } ... 的同一行或新增一行添加 PeriodStats
    import { getStatPeriod, PeriodStats } from '@/api/statistics.api';
    ```

3.  **更新 `ref` 的类型和初始值:**
    *   **查找并替换以下代码块:**
        ```typescript
        const lastRes: Ref<StatSingle> = ref({ netWeightCargo: 0, counter: 0, hour: 0 });
        const currentRes: Ref<StatSingle> = ref({ netWeightCargo: 0, counter: 0, hour: 0 });
        ```
    *   **替换为:**
        ```typescript
        const lastRes: Ref<PeriodStats> = ref({ totalFlights: 0, totalHours: 0, totalNetWeightCargo: 0, averageLoadFactor: 0 });
        const currentRes: Ref<PeriodStats> = ref({ totalFlights: 0, totalHours: 0, totalNetWeightCargo: 0, averageLoadFactor: 0 });
        ```

4.  **更新 `fields` 对象:**
    *   **查找并替换:**
        ```typescript
        const fields = { counter: '班', netWeightCargo: '吨', hour: '小时' }
        ```
    *   **替换为:**
        ```typescript
        const fields = { totalFlights: '班', totalNetWeightCargo: '吨', totalHours: '小时' }
        ```

5.  **更新 `formater` 函数:**
    *   **查找并替换:**
        ```typescript
        const formater = (src) => ({
            counter: numberByWan(src?.counter ?? 0),
            netWeightCargo: numberByWan(((src?.netWeightCargo ?? 0) / 1e3) | 0),
            hour: numberByWan((src?.hour ?? 0) | 0),
        })
        ```
    *   **替换为:**
        ```typescript
        const formater = (src: PeriodStats) => ({
            totalFlights: numberByWan(src?.totalFlights ?? 0),
            totalNetWeightCargo: numberByWan(((src?.totalNetWeightCargo ?? 0) / 1e3) | 0),
            totalHours: numberByWan((src?.totalHours ?? 0) | 0),
        })
        ```

6.  **更新 `sections` 计算属性:**
    *   **查找并替换:**
        ```typescript
        const sections = computed(() => [
            formater(lastRes.value),
            formater(currentRes.value),
            Object.keys(fields).reduce((acc, key) => ({
                ...acc, [key]: rate(lastRes.value[key] ?? 0, currentRes.value[key] ?? 0)
            }), {} as Record<keyof StatSingle, string>),
        ]);
        ```
    *   **替换为:**
        ```typescript
        const sections = computed(() => [
            formater(lastRes.value),
            formater(currentRes.value),
            Object.keys(fields).reduce((acc, key) => ({
                ...acc, [key]: rate(lastRes.value[key] ?? 0, currentRes.value[key] ?? 0)
            }), {} as Record<keyof typeof fields, string>),
        ]);
        ```

7.  **移除不安全的类型断言:**
    *   **在 `loadData` 函数中，查找并替换:**
        ```typescript
        if (currentResult.status === 'fulfilled') {
            currentRes.value = currentResult.value as StatSingle;
        }
        if (lastResult.status === 'fulfilled') {
            lastRes.value = lastResult.value as StatSingle;
        }
        ```
    *   **替换为 (直接赋值):**
        ```typescript
        if (currentResult.status === 'fulfilled') {
            currentRes.value = currentResult.value;
        }
        if (lastResult.status === 'fulfilled') {
            lastRes.value = lastResult.value;
        }
        ```

---

## 2. `src/pages/sms/events.vue`

**目标：** 修正分页逻辑错误，并为事件数据添加正确的类型。

**具体操作：**

1.  **添加 `SmsEventItem` 类型导入:**
    ```typescript
    // 在 import { getSmsEvents } ... 的同一行或新增一行添加 SmsEventItem
    import { getSmsEvents, SmsEventItem } from '@/api/sms.api';
    ```

2.  **为 `events` ref 添加强类型:**
    *   **查找并替换:**
        ```typescript
        const events: Ref<any[]> = ref([]);
        ```
    *   **替换为:**
        ```typescript
        const events: Ref<SmsEventItem[]> = ref([]);
        ```

3.  **修正 `fetchData` 函数中的分页逻辑:**
    *   **查找并替换:**
        ```typescript
        finished.value = events.value.length > eventData.total;
        ```
    *   **替换为 (根据返回数组长度判断):**
        ```typescript
        // 如果返回的数组长度小于请求的 size，说明是最后一页
        finished.value = eventData.length < size;
        ```
    *   **注意:** 当前 `getSmsEvents` API 并未实际使用分页参数。此修改可确保在 API 支持分页后逻辑正确。

---

## 3. `src/pages/pilot/track.vue`

**目标：** 修正对 `Promise.allSettled` 返回结果的错误处理。

**具体操作：**

1.  **重写 `fetchData` 函数中的 `try` 代码块:**
    *   **查找并替换整个 `try...catch` 代码块:**
        ```typescript
        try {
            const [trainingResult, dutyResult, absenceResult] = await Promise.allSettled([
                airportStore.fetchAirports(),
                getPilotTraining(data),
                getPilotDuty(data),
                getPilotAbsence(data),
            ]);
            trainings.value = trainingResult.status === 'fulfilled' ? trainingResult.value : [];
            duties.value = dutyResult.status === 'fulfilled' ? dutyResult.value : [];
            absences.value = absenceResult.status === 'fulfilled' ? absenceResult.value : [];
            console.log('获取信息train,duty,absence', [trainingResult, dutyResult, absenceResult]);
        } catch (err) {
            console.warn('错误', err);
        }
        ```
    *   **替换为 (正确解析 `Promise.allSettled` 的结果):**
        ```typescript
        try {
            const [airportResult, trainingResult, dutyResult, absenceResult] = await Promise.allSettled([
                airportStore.fetchAirports(),
                getPilotTraining(data),
                getPilotDuty(data),
                getPilotAbsence(data),
            ]);

            if (airportResult.status === 'rejected') {
                console.error('Failed to fetch airports:', airportResult.reason);
            }

            trainings.value = trainingResult.status === 'fulfilled' ? trainingResult.value : [];
            if (trainingResult.status === 'rejected') {
                console.error('Failed to fetch pilot training:', trainingResult.reason);
            }

            duties.value = dutyResult.status === 'fulfilled' ? dutyResult.value : [];
            if (dutyResult.status === 'rejected') {
                console.error('Failed to fetch pilot duty:', dutyResult.reason);
            }

            absences.value = absenceResult.status === 'fulfilled' ? absenceResult.value : [];
            if (absenceResult.status === 'rejected') {
                console.error('Failed to fetch pilot absence:', absenceResult.reason);
            }

            console.log('获取信息train,duty,absence', { trainingResult, dutyResult, absenceResult });
        } catch (err) {
            console.warn('An unexpected error occurred in fetchData:', err);
        }
        ```

---

## 4. `src/pages/analysis/airlines.vue`

**目标：** 重构组件以正确处理 `getStatByAirline` 返回的 `AirlineStats[]` 数据，而不是错误的 `Res` 对象。这是一个重大重构。

**具体操作：**

1.  **添加 `AirlineStats` 类型导入:**
    ```typescript
    // 在 import { getStatByAirline } ... 的同一行或新增一行添加 AirlineStats
    import { getStatByAirline, AirlineStats } from '@/api/statistics.api';
    ```

2.  **删除并替换旧的类型和状态定义:**
    *   **查找并删除以下两行:**
        ```typescript
        type Res = Record<string, Record<string, StatMulti>>
        const airlineStats = ref({}) as Ref<Res>;
        ```
    *   **在原位置添加新的状态定义:**
        ```typescript
        const airlineStats: Ref<AirlineStats[]> = ref([]);
        ```

3.  **简化 `fetchData` 函数:**
    *   **查找并替换:**
        ```typescript
        airlineStats.value = data;
        stationClick(stations.value[0]);
        ```
    *   **替换为 (由于数据模型改变，不再需要 stationClick):**
        ```typescript
        airlineStats.value = data;
        ```

4.  **重写计算属性和UI逻辑 (这是核心变更):**
    *   **查找并替换 `stations` 和 `filterStation` 计算属性:**
        ```typescript
        const stations = computed(() => {
            if (!airlineStats.value) return [];
            return [...new Set(Object.keys(airlineStats.value).reduce((acc, cur) => [...acc, ...cur.split('-')], []))];
        })
        const filterStation = computed(() => {
            const temp = {} as Record<string, Record<string, StatMulti>>;
            for (let key in airlineStats.value) {
                const [dep, arr] = key.split('-');
                let selectStation = isDep.value ? dep : arr;
                let otherStation = isDep.value ? arr : dep;
                if (selectStation === currentStation.value) {
                    temp[otherStation] = airlineStats.value[key];
                }
            }
            return temp;
        });
        ```
    *   **替换为 (新的逻辑是直接展示航空公司列表，不再需要按站点过滤):**
        ```typescript
        // stations 和 filterStation 的旧逻辑已不再适用，可以直接移除或注释掉。
        // stationClick 函数和 currentStation, isDep 状态也可以一并移除。
        ```

5.  **更新模板 `<template>`:**
    *   **移除所有与站点过滤相关的UI元素:**
        ```html
        <!-- 删除或注释掉以下整个 block -->
        <div class="button-group">
            <span class="btn" :class="currentStation == code4 ? `hover` : ``" v-for="code4 in stations" :key="code4"
                @click="stationClick(code4)">
                {{ getCity(code4) }}
            </span>
        </div>
        <div class="way">
            <div class="arr">进港</div>
            <switch @change="isDep = !isDep" :size="20" />
            <div class="dep">出港</div>
        </div>
        ```
    *   **修改 `v-for` 循环以渲染新的数据结构:**
        *   **查找并替换:**
            ```html
            <div class="airlines">
                <airline v-for="(stats, code4) in filterStation" :key="code4" :stats="stats"
                    :dep="getCity(isDep ? currentStation : code4)" :arr="getCity(!isDep ? currentStation : code4)" />
            </div>
            ```
        *   **替换为 (假设 `airline` 子组件可以接收单个 `AirlineStats` 对象):**
            ```html
            <div class="airlines">
                <!-- 
                  注意: 这里需要修改子组件 airline.vue 以接收 airlineStat prop，
                  或者在此处创建一个新的简单布局来展示航空公司数据。
                  以下是一个简化的示例布局。
                -->
                <div v-for="stat in airlineStats" :key="stat.airlineCode" class="airline-card">
                    <h4>{{ stat.airlineName }} ({{ stat.airlineCode }})</h4>
                    <p>航班数: {{ stat.flightCount }}</p>
                    <p>总小时: {{ stat.totalHours }}</p>
                    <p>市场份额: {{ (stat.marketShare * 100).toFixed(2) }}%</p>
                </div>
            </div>
            ```
    *   **注意:** 对 `airlines.vue` 的修改最大，因为它涉及UI和逻辑的根本性变更。可能需要进一步调整子组件 `airlines/airline.vue` 或在当前组件内直接渲染数据。

---

请将此文件交给下一个执行者。