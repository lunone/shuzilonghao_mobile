<template>
    <div class="top">
        <div class="date">
            <div class="start">2025-01-22</div>
            <div class="end">2025-02-22</div>
        </div>
        <div class="title">飞行排行榜</div>
        <div class="top3">
            <template v-for="pilot of [second, first, third]" :key="pilot?.name">
                <div class="item second" v-if="pilot?.name" :style="`margin-top: ${pilot.rank * 6}px`">
                    <div class="ser">TOP.{{ pilot.rank }}</div>
                    <userCardVue :userId="pilot.userId" :error="pilot.name" class="name" />
                    <div class="data">
                        <div class="total" @click="showPilotDetails(pilot)">
                            总<span class="value">{{ `${pilot.totalFlightHours}小时` }} </span>
                        </div>
                        <div class="avg">
                            日<span class="value">{{ `${pilot.avgFlightHours}小时` }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <div class="pilots">

        <div v-for="pilot in data" class="pilot" :key="pilot.userId">
            <span class="icon" :class="`no${pilot.rank}`">
                <!-- <i :class="`zl-icon-no${pilot.rank}`" v-if="pilot.rank < 4" /> -->
                <template> {{ pilot.rank }}</template>
            </span>
            <div class="name">
                <userCardVue :userId="pilot.userId" :error="pilot.name" class="name" />
            </div>
            <div class="data">
                <div class="total" @click="showPilotDetails(pilot)">
                    总<span class="value">{{ `${pilot.totalFlightHours}小时` }} </span>
                </div>
                <div class="avg">
                    日<span class="value">{{ `${pilot.avgFlightHours}小时` }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted, PropType } from 'vue'
import userCardVue from '../hr/userCard.vue';

const props = defineProps({
    data: { type: Array as PropType<any[]>, default: () => [] },
})
const first = ref({});
const second = ref({});
const third = ref({});
const emits = defineEmits(['select'])
const showPilotDetails = (pilot: any) => {
    emits('select', pilot);
}
watch(() => props.data, (newVal, oldVal) => {
    first.value = props.data.shift();
    second.value = props.data.shift();
    third.value = props.data.shift();
    console.log('pilotRank mounted', first.value, second.value, third.value);
})
onMounted(() => {
    // first.value = props.data.shift();
    // second.value = props.data.shift();
    // third.value = props.data.shift();
})
</script>
<style lang="less" scoped>
@import '@/css/base.less';

.top {
    .column;
    height: 40vh;
    width: 100%;
    background-color: #e24f4f;
    justify-content: space-around;
    background: linear-gradient(to bottom right, @color-primary, @color-secondary);

    .date {
        .row;
        justify-content: flex-end;
    }

    .title {
        font-size: 1.2rem;
    }

    .top3 {
        .row;
        flex-grow: 1;
        justify-content: space-between;
        width: 100%;
        padding: 20px;
        margin-bottom: 4vw;
        padding: 10px;
        /* margin: 0 1vw; */
        box-sizing: border-box;

        .item {
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            color: #464646;
            background-color: #ddd;
            position: relative;
            display: inline-block;
            width: 30vw;
            font-size: .8rem;
            text-align: center;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);

            &::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 0;
                border-width: 15vw;
                border-style: solid;
                border-color: #ddd transparent transparent transparent;
            }

            .name {
                font-size: 1.1rem;
                font-weight: bold;
            }
        }
    }
}

// .bubble {

//   background-color: #4CAF50;
//   color: white;
//   padding: 10px 20px;
//   border-radius: 5px;
// }


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
        border-radius: 4px;
        background-color: #fafafa;

        .icon {
            font-size: 1rem;
            width: 10vw;
            text-align: center;
            padding-left: -5vw;
            color: red;
            // border: 1px solid #eee;
        }



        .name {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            width: 20vw;
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