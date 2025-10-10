<template>
    <div class="voluntary-wrapper">
        <div class="voluntary" v-for="(voluntary, index) in voluntarys" :key="index">
            <div class="ask">
                <div class="user" @click="showProfile(voluntary.userName)">
                    <i class="icon zl-icon-user" />
                    <div class="name">{{ voluntary.userName || '匿名' }}</div>
                </div>
                <div class="content">
                    <div class="desc">{{ voluntary.content }}</div>
                    <div class="date">{{ dayjs(voluntary.date).format('M月D日') }}</div>
                </div>
            </div>
            <template v-if="voluntary.answers.length">
                <div class="answer" v-for="(answer, index) of voluntary.answers" :key="answer.id">
                    <div class="content">
                        <div class="desc" :class="answer.content ? '' : 'blank'">
                            {{ answer.content || `系统提示：用户未录入有效内容` }}
                        </div>
                        <div class="date">{{ dayjs(answer.date).format('M月D日') }}</div>
                    </div>
                    <div class="user" @click="showProfile(answer.userName)">
                        <i class="icon zl-icon-user" />
                        <div class="name">{{ answer.userName || '匿名' }}</div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { getSmsVoluntarys } from '@/api/sms.api';
import { inject, onMounted, PropType, ref, Ref, watch } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
    range: {
        type: Object as PropType<[Date, Date]>, default: () => [
            dayjs().add(-11, 'day').toDate(),
            dayjs().add(-1, 'day').toDate(),
        ]
    }
});
const showProfile = inject('showProfile') as Function;
const emits = defineEmits(['loading', 'finished'])
const voluntarys: Ref<any[]> = ref([]);
const page = ref(1);

// 获取事件列表
const fetchData = async (currentPage: number = 1) => {
    emits('loading', true);
    try {
        const [startDate, endDate] = props.range;
        const resVoluntary = await getSmsVoluntarys({ startDate, endDate });
        console.log(`resVoluntary`, resVoluntary)

        voluntarys.value = voluntarys.value.concat(resVoluntary.data.data);
    } catch (err) {
        console.error('获取事件列表失败', err);
    } finally {
        emits('loading', false);
    }
};

// 加载更多数据
const loadMore = () => {
    console.log('loadmore');
    fetchData(page.value);
}

watch(() => props, (old, newVal) => {
    console.log('组件change表', JSON.stringify(old), JSON.stringify(newVal))
    // console.log('组件挂载时获取事件列表', page.value, props);
    fetchData(page.value);
    voluntarys.value = [];
    // page.value = 1;
}, { immediate: true, deep: true })
// 组件挂载时获取事件列表
onMounted(() => { });
</script>
<style lang="less" scoped>
@import '@/css/base.less';

@gap: 10px;
@color-background: #fefefe;
@color-ask: #c2e7b0;
@color-answer: #dfdfdf;

.voluntary-wrapper {
    .voluntary {
        display: flex;
        flex-direction: column;
        background-color: @color-background;
        border: 1px solid #eeeeee;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 10px;

        // 
        .answer,
        .ask {
            display: flex;
            flex-direction: row;
            margin-bottom: 16px;
            align-items: flex-start;

            .anonymous {
                .icon {
                    color: #eee;
                }
            }

            .user {
                .column;
                align-self: flex-start;
                align-items: center;
                width: 40px;
                font-size: 12px;

                .icon {
                    color: #ddd;
                    font-size: 30px;
                }

                .name {
                    color: #666;
                    text-align: center;
                    margin-top: -4px;
                }
            }

            .content {
                display: flex;
                flex-direction: column;
                flex: 1;

                .desc {
                    border-radius: 8px;
                    padding: 8px;
                    position: relative;
                    min-width: 2rem;

                    &::before,
                    &::after {
                        top: 10px;
                        position: absolute;
                        border-width: 5px;
                        border-style: solid;
                    }
                }

                .blank {
                    color: #4834ff;
                }

                .date {
                    font-size: 12px;
                    color: #999;
                    margin-top: 4px;
                }
            }
        }

        .ask {
            .user {
                margin-right: @gap;
            }

            .content {
                .desc {
                    background-color: @color-ask;
                    border: 1px solid @color-ask;


                    &::before {
                        content: '';
                        left: -10px;
                        border-color: transparent @color-ask transparent transparent;
                    }
                }
            }
        }


        .answer {
            .content {
                .desc {
                    background-color: @color-answer; // 更亮一点的颜色
                    border: 1px solid @color-answer;

                    &::after {
                        content: '';
                        right: -10px;
                        border-color: transparent transparent transparent @color-answer;
                    }
                }

                .date {
                    align-self: flex-end;
                }
            }

            .user {
                margin-left: @gap;
            }
        }
    }
}
</style>