<template>

</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { inject } from 'vue';
const props = defineProps<{ data: Record<string, any> }>();
const showProfile = inject('showProfile') as Function;
</script>
<style lang="less" scoped>
@import '@/css/base.less';
@gap: 10px;
@color-background: #fefefe;
@color-ask: #c2e7b0;
@color-answer: #dfdfdf;



.voluntary-wrapper {
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
            align-items: center ;
            width: 40px;
            font-size: 12px;

            .icon {
                color: #ddd;
                font-size: 38px;
            }

            .name {
                color: #666;
                text-align: center;
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
</style>