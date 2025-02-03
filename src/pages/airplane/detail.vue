<template>
    <div class="detail">
        <div class="mate">
            <div class="name">
                <span class="id">{{ aircraft.acReg }}</span>
                <span class="type">({{ aircraft.acType }})</span>
            </div>
        </div>
        <div class="items">
            <!-- 退役的飞机要显示退役日期 -->
            <!-- <div v-if="groupName == 'retired'">{{ aircraft.endDate }} 退役</div> -->
            <!-- 默认显示的 -->
            <!-- <template v-for="flag in [true, false]" :key="flag"> -->
            <template v-for="showOBj in aircraftKeysArray" :key="showOBj.key">
                <div class="item">
                    <span class="key">{{ showOBj.name }}</span>
                    <span class="value">
                        {{ _.attempt(showOBj.func || (_ => _),
                            aircraft[showOBj.key]) }}
                        {{ showOBj.unit || '' }}
                    </span>
                </div>
            </template>
            <!-- </template> -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import _ from 'lodash';
import { AircraftItem } from '@/interface';
import { PropType, ref } from 'vue';

const props = defineProps({
    aircraft: { type: Object as PropType<AircraftItem>, default: () => { } },
    height: { type: Number, default: 200 }
})

const showMore = ref(false);

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
    display: flex;
    flex-direction: column;
    margin: 10px;
    padding: 2px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .mate {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px;
        background-color: #e0e0e0;
        border-radius: 5px;

        .id {
            font-weight: bold;
            color: #333;
        }

        .ac-type {
            color: #555;
        }
    }

    .items {
        margin-top: 20px;

        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;

            &.even {
                background-color: #f5f5f5;
            }

            .key {
                font-weight: bold;
                color: #333;
                font-size: 0.9rem;
            }

            .value {
                color: #555;
                font-size: 0.9rem;
            }
        }
    }

    .more {
        display: flex;
        text-align: center;
    }
}
</style>