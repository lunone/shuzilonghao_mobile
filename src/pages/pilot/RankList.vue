<template>
    <div class="ranking">
        <van-cell v-for="pilot in data" :key="pilot.userId" @click="showPilotDetails(pilot)">
            <template #title>
                <div class="pilot-ranking">
                    <span class="icon top" :class="`no-${pilot.rank}`" v-if="pilot.rank < 4">
                        <van-icon class-prefix="zl-icon" :name="`no${pilot.rank}`" />
                    </span>
                    <span class="icon" v-else> {{ pilot.rank }}</span>
                    <div class="name">
                        {{ pilot.name }}
                        <span class="id">{{ pilot.userId }}</span>
                    </div>
                    <div class="data">
                        <div class="total">总<span class="value">{{ `${pilot.totalFlightHours}小时` }}</span></div>
                        <div class="avg">日<span class="value">{{ `${pilot.avgFlightHours}小时` }}</span></div>
                    </div>
                </div>
            </template>
        </van-cell>
        <!-- <van-divider v-if="key == 0">……</van-divider> -->
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
.pilot-ranking {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-align: center;

    .icon {
        font-size: 1rem;
        width: 15vw;
        text-align: center;
        padding-left: -5vw;
        // border: 1px solid #eee;
    }

    .top {
        font-size: 1.5rem;
    }

    .no-1 {
        color: #ffd21d;
    }

    .no-2 {
        color: #d1cbf3;
    }

    .no-3 {
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
</style>