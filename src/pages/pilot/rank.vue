<template>
    <div class="pilots">
        <div v-for="pilot in data" class="pilot" :key="pilot.userId" @click="showPilotDetails(pilot)">
            <span class="icon" :class="`no${pilot.rank}`">
                <i :class="`zl-icon zl-icon-no${pilot.rank}`" v-if="pilot.rank < 4" />
                <template v-else> {{ pilot.rank }}</template>
            </span>
            <div class="name">
                {{ pilot.name }}
                <span class="id">{{ pilot.userId }}</span>
            </div>
            <div class="data">
                <div class="total">总<span class="value">{{ `${pilot.totalFlightHours}小时` }}</span></div>
                <div class="avg">日<span class="value">{{ `${pilot.avgFlightHours}小时` }}</span></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, PropType } from 'vue'
const props = defineProps({
    data: { type: Array as PropType<any[]>, default: () => [] },
})
const emits = defineEmits(['select'])
const showPilotDetails = (pilot: any) => {
    emits('select', pilot);
}
</script>
<style lang="less" scoped>
.pilots {
    display: flex;
    flex-direction: column;
    width: 100%;
    // margin: 0 10px 0 10px;
    box-sizing: border-box;

    .pilot {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        text-align: center;
        margin: 4px 10px;
        padding: 4px;
        border-radius:4px;
        background-color: #fafafa;

        .icon {
            font-size: 1rem;
            width: 10vw;
            text-align: center;
            padding-left: -5vw;
            color: red;
            // border: 1px solid #eee;
        }

        .no1 {
            color: #ffd21d;
        }

        .no2 {
            color: #d1cbf3;
        }

        .no3 {
            color: #f59920;
        }

        .name {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            width: 30vw;
            text-align: left;
            font-weight: bold;
            color: #555;

            // border: 1px solid red;
            .id {
                font-weight: normal;
                color: #aaa;
            }
        }

        .data {
            display: flex;
            text-align: right;
            color: #aaa;
            justify-content: space-between;
            flex: 1;

            .value {
                color: #464646;
                // font-weight: bold;
            }
        }
    }
}
</style>