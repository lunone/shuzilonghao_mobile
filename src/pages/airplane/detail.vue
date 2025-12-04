<template>
    <div class="detail">
        <!-- 基本尺寸信息 -->
        <div class="detail-group">
            <h4 class="group-title">基本尺寸</h4>
            <div class="items">
                <div class="item" v-for="item in basicDimensions" :key="item.key">
                    <span class="key">{{ item.name }}</span>
                    <span class="value">
                        {{ calac(item.func, aircraft[item.key]) }}
                        {{ item.unit || '' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 发动机信息 -->
        <div class="detail-group">
            <h4 class="group-title">发动机信息</h4>
            <div class="items">
                <div class="item" v-for="item in engineInfo" :key="item.key">
                    <span class="key">{{ item.name }}</span>
                    <span class="value">
                        {{ calac(item.func, aircraft[item.key]) }}
                        {{ item.unit || '' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 重量数据 -->
        <div class="detail-group">
            <h4 class="group-title">重量数据</h4>
            <div class="items">
                <div class="item" v-for="item in weightData" :key="item.key">
                    <span class="key">{{ item.name }}</span>
                    <span class="value">
                        {{ calac(item.func, aircraft[item.key]) }}
                        {{ item.unit || '' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 运营参数 -->
        <div class="detail-group">
            <h4 class="group-title">运营参数</h4>
            <div class="items">
                <div class="item" v-for="item in operationParams" :key="item.key">
                    <span class="key">{{ item.name }}</span>
                    <span class="value">
                        {{ calac(item.func, aircraft[item.key]) }}
                        {{ item.unit || '' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 设备能力 -->
        <div class="detail-group">
            <h4 class="group-title">设备能力</h4>
            <div class="items">
                <div class="item" v-for="item in equipmentCapability" :key="item.key">
                    <span class="key">{{ item.name }}</span>
                    <span class="value">
                        {{ calac(item.func, aircraft[item.key]) }}
                        {{ item.unit || '' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 运营标志 -->
        <div class="detail-group">
            <h4 class="group-title">运营标志</h4>
            <div class="items">
                <div class="item" v-for="item in operationFlags" :key="item.key">
                    <span class="key">{{ item.name }}</span>
                    <span class="value">
                        {{ calac(item.func, aircraft[item.key]) }}
                        {{ item.unit || '' }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { AircraftItem } from '@/api/aircraft.api';
import { PropType, ref } from 'vue';

const props = defineProps({
    aircraft: { type: Object as PropType<AircraftItem>, default: () => { } },
    height: { type: Number, default: 200 }
})

const showMore = ref(false);
function calac(func, val) {
    if (typeof func === 'function') {
        try {
            return func(val)
        } catch (error) {
            return 'error';
        }
    }
    return val;
}
// 基本尺寸信息
const basicDimensions: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'totalLength', name: '长度', unit: '米' },
    { key: 'totalHeight', name: '高度', unit: '米' },
    { key: 'wingSpan', name: '翼展', func: (v: number) => v.toFixed(1), unit: '米' },
    { key: 'winglet', name: '翼尖小翼' },
];

// 发动机信息
const engineInfo: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'engineModel', name: '发动机' },
    { key: 'engPower', name: '推力', unit: '千瓦' },
    { key: 'toga', name: '起飞全发TOGA推力', unit: '千瓦' },
    { key: 'togaInvalid', name: '起飞一发失效TOGA推力', unit: '千瓦' },
];

// 重量数据
const weightData: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'oew', name: '空机重', unit: '公斤' },
    { key: 'bew', name: '基本空机重量', unit: '公斤' },
    { key: 'maxDepartWeight', name: '最大起飞重量', unit: '公斤' },
    { key: 'maxLandfallWeight', name: '最大着陆重量', unit: '公斤' },
    { key: 'maxNoOilWeight', name: '最大无油重量', unit: '公斤' },
    { key: 'maxTakeOffWeight', name: '最大起飞重量', unit: '公斤' },
    { key: 'maxLandWeight', name: '最大着陆重量', unit: '公斤' },
    { key: 'maxZerofuelWeight', name: '最大无油重量', unit: '公斤' },
];

// 运营参数
const operationParams: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'availableSeatNum', name: '可用座位数' },
    { key: 'maxPayload', name: '最大载荷', unit: '公斤' },
    { key: 'availableLoad', name: '可用载荷', unit: '公斤' },
    { key: 'maxTaxiWt', name: '最大滑行重量', unit: '公斤' },
    { key: 'limitTkofWt', name: '最大起飞限制重量', unit: '公斤' },
    { key: 'limitLndWt', name: '最大着陆限制重量', unit: '公斤' },
];

// 设备能力
const equipmentCapability: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'iscat2', name: '是否CAT II' },
    { key: 'rvsmYn', name: 'RVSM 标志' },
    { key: 'rnpApchYn', name: 'RNP APCH 标志' },
    { key: 'rnpArYn', name: 'RNP AR 标志' },
    { key: 'oxygenTime', name: '供氧时长', unit: '分钟' },
    { key: 'plateauYn', name: '高原标志' },
    { key: 'cat2Yn', name: 'CAT2 标志' },
    { key: 'overwaterFlag', name: '跨水标识' },
    { key: 'extOverwaterFlag', name: '扩展跨水标志' },
    { key: 'hightPalteauFlag', name: '高高原标志' },
    { key: 'etops', name: 'ETOPS 分钟数', unit: '分钟' },
    { key: 'isHf', name: '是否有HF' },
    { key: 'isSatelliteTelephone', name: '便捷式或固定式卫星电话' },
];

// 运营标志
const operationFlags: { key: keyof AircraftItem, name: string, unit?: string, func?: (...args: any[]) => unknown }[] = [
    { key: 'validFlag', name: '有效标志' },
    { key: 'startDate', name: '初次服役' },
    { key: 'pOrC', name: '客货标志' },
    { key: 'carrier', name: '承运人' },
    { key: 'layout', name: '布局' },
    { key: 'class', name: '飞机分类' },
    { key: 'restGrade', name: '该飞机休息设施等级' },
    { key: 'oewIdx', name: '空机重量指数' },
    { key: 'oewGc', name: '空机重量 GC' },
    { key: 'callFreq', name: '呼叫频率', unit: '赫兹' },
    { key: 'modS', name: 'MOD S' },
    { key: 'telNo', name: '电话号码' },
    { key: 'fltStartDate', name: '飞行开始日期' },
    { key: 'fltEndDate', name: '飞行结束日期' },
    { key: 'rmk', name: 'RMK项' },
    { key: 'regId', name: '飞机ID' },
];

const aircraftKeysArray: { key: keyof AircraftItem, name: string, unit?: string, default: boolean, func?: (...args: any[]) => unknown }[] = [
    { key: 'totalLength', name: '长度', default: true, unit: '米' },
    { key: 'totalHeight', name: '高度', default: true, unit: '米' },
    { key: 'wingSpan', name: '翼展', default: true, func: (v: number) => v.toFixed(1), unit: '米' },
    { key: 'winglet', name: '翼尖小翼', default: true },
    { key: 'startDate', name: '初次服役', default: true },
    { key: 'engineModel', name: '发动机', default: true },
    { key: 'engPower', name: '推力', default: true, unit: '千瓦' },
    { key: 'oew', name: '空机重', default: true, unit: '公斤' },
    { key: 'bew', name: '基本空机重量', default: false, unit: '公斤' },
    { key: 'maxDepartWeight', name: '最大起飞重量', default: true, unit: '公斤' },
    { key: 'maxLandfallWeight', name: '最大着陆重量', default: true, unit: '公斤' },
    { key: 'maxNoOilWeight', name: '最大无油重量', default: true, unit: '公斤' },
    // { key: 'restYn', name: '保留标志', default: false },
    // { key: 'dow', name: '基本重量-近程', default: false, unit: '公斤' },
    // { key: 'doi', name: '空重指数-近程', default: false },
    // { key: 'flyDevice', name: '飞机飞行设备', default: false },
    { key: 'validFlag', name: '有效标志', default: false },
    // { key: 'dowL', name: '基本重量-远程', default: false, unit: '公斤' },
    // { key: 'doiL', name: '空重指数-远程', default: false },
    // { key: 'oper', name: '操作人', default: false },
    // { key: 'opTime', name: '操作时间', default: false },
    // { key: 'remarks', name: '备注', default: false },
    // { key: 'operIp', name: '操作员 IP', default: false },
    // { key: 'operHost', name: '操作员主机', default: false },
    { key: 'iscat2', name: '是否CAT II', default: false },
    // { key: 'typeSon', name: '乘务机型', default: false },
    // { key: 'restEquipmentLevel', name: '休息设施等级维护', default: false },
    // { key: 'barycenter', name: '空机重心', default: false, unit: '米' },
    { key: 'regId', name: '飞机ID', default: false },
    // { key: 'typeId', name: '机型ID', default: false },
    { key: 'pOrC', name: '客货标志', default: false },
    { key: 'carrier', name: '承运人', default: false },
    { key: 'layout', name: '布局', default: false },
    { key: 'class', name: '飞机分类', default: false },
    // { key: 'maxSeatNum', name: '总座位数', default: false },
    { key: 'availableSeatNum', name: '可用座位数', default: false },
    { key: 'oewIdx', name: '空机重量指数', default: false },
    { key: 'oewGc', name: '空机重量 GC', default: false },
    { key: 'maxTaxiWt', name: '最大滑行重量', default: false, unit: '公斤' },
    { key: 'limitTkofWt', name: '最大起飞限制重量', default: false, unit: '公斤' },
    { key: 'limitLndWt', name: '最大着陆限制重量', default: false, unit: '公斤' },
    { key: 'maxPayload', name: '最大载荷', default: false, unit: '公斤' },
    { key: 'availableLoad', name: '可用载荷', default: false, unit: '公斤' },
    { key: 'callFreq', name: '呼叫频率', default: false, unit: '赫兹' },
    { key: 'modS', name: 'MOD S', default: false },
    { key: 'telNo', name: '电话号码', default: false },
    { key: 'fltStartDate', name: '飞行开始日期', default: false },
    { key: 'fltEndDate', name: '飞行结束日期', default: false },
    { key: 'rvsmYn', name: 'RVSM 标志', default: false },
    { key: 'rnpApchYn', name: 'RNP APCH 标志', default: false },
    { key: 'rnpArYn', name: 'RNP AR 标志', default: false },
    { key: 'oxygenTime', name: '供氧时长', default: false, unit: '分钟' },
    { key: 'plateauYn', name: '高原标志', default: false },
    { key: 'cat2Yn', name: 'CAT2 标志', default: false },
    { key: 'rmk', name: 'RMK项', default: false },
    { key: 'overwaterFlag', name: '跨水标识', default: false },
    { key: 'extOverwaterFlag', name: '扩展跨水标志', default: false },
    { key: 'hightPalteauFlag', name: '高高原标志', default: false },
    { key: 'etops', name: 'ETOPS 分钟数', default: false, unit: '分钟' },
    { key: 'dCode', name: '飞机的D字码', default: false },
    { key: 'restGrade', name: '该飞机休息设施等级', default: false },
    { key: 'cabinCount', name: '客舱乘务员配备最低数量', default: false },
    { key: 'seatings', name: '乘务员座位数', default: false },
    { key: 'invalidstart', name: '机上休息等级失效开始日期', default: false },
    { key: 'invalidend', name: '机上休息等级失效结束日期', default: false },
    { key: 'takelandGroupActype', name: '长机型', default: false },
    { key: 'phone', name: '卫星电话', default: false },
    { key: 'acTypeFtb', name: '任务书打印长机型', default: false },
    { key: 'acTypeFpl', name: 'FPL中使用的机型', default: false },
    { key: 'msn', name: 'MSN号', default: false },
    { key: 'toga', name: '起飞全发TOGA推力', default: false, unit: '千瓦' },
    { key: 'togaInvalid', name: '起飞一发失效TOGA推力', default: false, unit: '千瓦' },
    { key: 'oxygenType', name: '氧气类型', default: false },
    { key: 'oxygenCapacity', name: '氧气能力', default: false, unit: '升' },
    { key: 'tankWeight', name: '油箱容量/重量', default: false, unit: '公斤' },
    { key: 'taxiingConsumption', name: '滑行油耗', default: false, unit: '升/小时' },
    { key: 'apuConsumption', name: 'APU油耗', default: false, unit: '升/小时' },
    { key: 'consumption', name: '小时耗油率', default: false, unit: '升/小时' },
    { key: 'tora', name: 'TORA', default: false, unit: '米' },
    { key: 'asda', name: 'ASDA', default: false, unit: '米' },
    { key: 'isCbp', name: '是否有无碳刹车配件', default: false },
    { key: 'isFpa', name: '是否场压机场', default: false },
    { key: 'isOsa', name: '是否是运行规范中机场', default: false },
    { key: 'storeVolume', name: '货仓容积', default: false, unit: '立方米' },
    { key: 'extOverWaterFlagTemp', name: '临时延伸跨水标识', default: false },
    { key: 'extOverWaterFlag', name: '固化延伸跨水标识', default: false },
    { key: 'maxTakeOffWeight', name: '最大起飞重量', default: true, unit: '公斤' },
    { key: 'maxLandWeight', name: '最大着陆重量', default: true, unit: '公斤' },
    { key: 'maxZerofuelWeight', name: '最大无油重量', default: true, unit: '公斤' },
    { key: 'typeLong', name: '长机型', default: false },
    { key: 'units', name: '巡航方式', default: false },
    { key: 'isHf', name: '是否有HF', default: false },
    { key: 'isSatelliteTelephone', name: '便捷式或固定式卫星电话', default: false },
    { key: 'eighteenItem19', name: '补充情报第19项编组', default: false },
];
</script>
<style lang="less" scoped>
.detail {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .detail-group {
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
            border-bottom: none;
        }

        .group-title {
            font-size: 16px;
            font-weight: bold;
            color: #111418;
            padding: 16px 16px 8px;
            margin: 0;
            background-color: #f8f9fa;
        }

        .items {
            .item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid #f9f9f9;

                &:last-child {
                    border-bottom: none;
                }

                &.even {
                    background-color: #f5f5f5;
                }

                .key {
                    font-weight: 500;
                    color: #333;
                    font-size: 14px;
                }

                .value {
                    color: #555;
                    font-size: 14px;
                    text-align: right;
                    flex: 1;
                    margin-left: 16px;
                }
            }
        }
    }
}
</style>