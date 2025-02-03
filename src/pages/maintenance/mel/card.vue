<template>
    <div v-for="ms, acReg in mels" :key="acReg" class="mels">
        <template v-if="!props.acReg || acReg === props.acReg">
            <div class="section">
                <div v-for="mel in ms" :key="mel.id" class="mel">
                    <div class="mate">
                        <span class="id">{{ mel.id }}</span>
                        <span class="applyer">{{ mel.applyer }}</span>
                    </div>
                    <div class="date">
                        <span class="start">{{ dayjs(mel.startDate).format('YYYY-MM-DD') }}</span>
                        <span class="end">{{ dayjs(mel.endDate).format('YYYY-MM-DD') }}</span>
                    </div>
                    <div class="flag">
                        <span class="type">{{ mel.type.toUpperCase() }} 类</span>
                        <span class="m" :class="mel.m ? `hover` : ``">M </span>
                        <span class="o" :class="mel.o ? `hover` : ``">O </span>
                        <span class="section">{{ mel.section }}</span>
                    </div>
                    <div class="content"> {{ mel.desc }}</div>
                    <div class="reason"> {{ mel.reason }}</div>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import { useStore } from '@/store'
import api from '@/utils/api'
import dayjs from 'dayjs'
import _ from 'lodash'
import { ref, computed, watch, onMounted, PropType, Ref, watchEffect } from 'vue'

// 定义 loading 和 error 状态
const loading = ref(false);
const error = ref('');
const mels: Ref<Record<string, any[]>> = ref({});

const props = defineProps({
    acReg: { type: String, default: '' },
})
const emits = defineEmits(['getMel'])
// 获取 MEL 数据
const fetchMels = async () => {
    try {
        const res = await api('/me/mel/', { date: dayjs().format('YYYY-MM-DD') }) as any[];
        mels.value = _.groupBy(res, 'acReg');

        // console.log('mels', mels.value);
    } catch (err) {
        error.value = '获取 MEL 数据失败';
    }
};

watch(() => props.acReg, (newVal, oldVal) => {
    console.warn('mel acReg changed', oldVal, newVal)
    if (props.acReg) {
        console.log('props.acReg', mels.value[props.acReg]);
        emits('getMel', mels.value[props.acReg])
    }
    // emits('getMel', mels.value);
});

onMounted(() => {
    fetchMels();
})
</script>
<style lang="less" scoped>
.mels {
    // height: 40vh;
    // overflow-y: auto;
    padding: 0 10px;
    background-color: #f9f9f9;

    .section {
        .mel {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            background-color: #fff;
            border-radius: 4px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

            &:last-child {
                border-bottom: none;
            }

            .mate,
            .date,
            .flag {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2px;

                &.mate {
                    background-color: #f0f0f0;
                    padding: 4px;
                    border-radius: 3px;

                    .id {
                        font-weight: bold;
                    }

                    .applyer {
                        color: #555;
                    }
                }

                &.date {
                    color: #777;
                }

                &.flag {
                    color: #666;

                    .m,
                    .o {
                        color: #888;
                        font-size: 0.9rem;

                        &.hover {
                            color: #333;
                        }
                    }

                    .section {
                        color: #666;
                    }
                }
            }

            .content {
                margin-top: 5px;
                color: #333;
                font-size: 0.9rem;
            }

            .reason {
                margin-top: 5px;
                color: #555;
                font-size: 0.9rem;
            }
        }
    }
}
</style>