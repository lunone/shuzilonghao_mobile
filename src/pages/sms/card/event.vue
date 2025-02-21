<template>
    <div class="event">
        <div class="meta">
            <span class="date">{{ data.date }}</span>
            <span class="flightno">航班号:{{ data.flightNo }}</span>
            <span class="acreg">飞机号:{{ data.acReg }}</span>
            <span class="status">状态:</span>
        </div>
        <div class="title">
            机组 {{ data.crews }} 站点：{{ data.dep || data.arr }}
        </div>
        <div class="desc">
            {{ data.desc }}
        </div>
        <div direction="vertical" :active="data.status.length">
            <div>
                <h3>{{ data.reportDate }}：{{ data.reporter || `神秘人` }}
                    <i class="icon zl-icon-phone" :style="{ marginLeft: '10px' }" @click="call(data.reporterTel)" />
                    <!-- 添加电话图标 -->

                </h3>
                <span>提交事件</span>
            </div>
            <div v-for="(value, key) in data.status" :key="key">
                <h3>{{ value.updateTime }}：{{ value.updater || `神秘人` }} </h3>
                <span v-if="value.reason && value.reason != data.status[key - 1]?.reason">填写了原因：{{
                    value.reason }}</span>
                <span v-if="value.result">填写了结果：{{ value.result }}</span>
                <span v-if="value.reason || value.result">，</span>
                <span v-if="value.deleteFlag"> 关闭了该事件</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { call } from '@/utils/tools';
const props = defineProps<{ data: Record<string, any> }>();
// 拨打电话的方法

</script>
<style lang="less" scoped>
.event {
    border-bottom: solid 1px #eee;
    text-align: left;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .meta {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        background-color: #f0f0f0;
        padding: 10px;
        font-size: 0.9rem;
        border-radius: 5px;
        margin-bottom: 10px;

        .flightno,
        .acreg,
        .status {
            color: #666;
        }

        .date {
            font-weight: bold;
        }
    }

    .title {
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 1rem;
    }

    .desc {
        color: #555;
        font-size: 0.9rem;
        margin-bottom: 10px;
    }

    .divs {
        margin-top: 10px;

        .div {
            .div__circle-container {
                .div__circle {
                    background-color: #4a90e2;
                    border-color: #4a90e2;
                }

                .div__line {
                    background-color: #4a90e2;
                }
            }

            .div__content {
                .div__title {
                    font-size: 0.9rem;
                    color: #333;

                    .van-icon {
                        color: #4a90e2;
                        cursor: pointer;
                    }
                }

                .div__description {
                    font-size: 0.8rem;
                    color: #666;
                }
            }
        }
    }
}
</style>