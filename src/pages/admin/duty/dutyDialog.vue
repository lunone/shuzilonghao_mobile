<template>
    <wd-popup v-model="localShow" position="bottom" closable custom-style="height: 200px;" @close="handleClose">
        <wd-picker-view :columns="columns" v-model="value" :column-change="onChangeDistrict" />
    </wd-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { UserItem } from '@/interface/user.interface';


interface DutyItem {
    id: number;
    userId: string;
    start: number;
    end: number;
}

const props = defineProps<{
    show: boolean;
    selectedDate: Date | null;
    dutyData: DutyItem[];
    staffList: UserItem[];
}>();

const emit = defineEmits(['update:show', 'confirm']);
const localShow = ref(props.show)
watch(localShow, newVal => emit('update:show', newVal))
watch(() => props.show, newVal => localShow.value = newVal)


const district = {
    '0': [{ label: '北京', value: '110000' }, { label: '广东省', value: '440000' }],
    '110000': [{ label: '北京', value: '110100' }],
    '440000': [{ label: '广州市', value: '440100' }, { label: '韶关市', value: '440200' }, { label: '深圳市', value: '440300' }, { label: '珠海市', value: '440400' }, { label: '汕头市', value: '440500' }],
    '110100': [{ label: '东城区', value: '110101' }, { label: '西城区', value: '110102' }, { label: '朝阳区', value: '110105' }, { label: '丰台区', value: '110106' }, { label: '石景山区', value: '110107' }],
    '440100': [{ label: '荔湾区', value: '440103' }, { label: '越秀区', value: '440104' }, { label: '海珠区', value: '440105' }],
    '440200': [{ label: '武江区', value: '440203' }],
    '440300': [{ label: '罗湖区', value: '440303' }, { label: '福田区', value: '440304' }],
    '440400': [{ label: '香洲区', value: '440402' }, { label: '斗门区', value: '440403' }, { label: '金湾区', value: '440404' }],
    '440500': [{ label: '龙湖区', value: '440507' }, { label: '金平区', value: '440511' }]
}

const value = ref(['110000', '110100', '110102'])
const columns = ref([district[0], district[district[0][0].value], district[district[district[0][0].value][0].value]])


const onChangeDistrict = (pickerView, value, columnIndex, resolve) => {
    const item = value[columnIndex]
    if (columnIndex === 0) {
        pickerView.setColumnData(1, district[item.value])
        pickerView.setColumnData(2, district[district[item.value][0].value])
    } else if (columnIndex === 1) {
        pickerView.setColumnData(2, district[item.value])
    }
    resolve()
}

function handleClose() {
    console.log('close')
}

</script>
