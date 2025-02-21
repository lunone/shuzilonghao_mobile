<template>
    <div class="event-wrapper">
        <div class="meta">
            <span class="date">{{ data.date }}</span>
            <span class="flightno">航班号:{{ data.flightNo }}</span>
            <span class="acreg">飞机号:{{ data.acReg }}</span>
            <span class="way">{{ data.dep }} - {{ data.arr }}</span>
        </div>
        <div class="crews">
            <div class="title">机组</div>
            <div class="value">
                <template v-for="crew in data.crews" :key="crew.name">
                    <UserCardVue :userId="crew.userId" :name="crew.name" class="name" v-if="crew.userId"
                        :show-icon="false" />
                    <div class="name" v-else>{{ crew.name }}</div>
                </template>
            </div>
        </div>
        <!-- <div class="station">
            <div class="title">站点</div>
            <div class="value">{{ data.dep || data.arr }}</div>
        </div> -->
        <div class="desc">
            {{ data.desc }}
        </div>
        <div direction="vertical" :active="data.status.length">
            <div>
                <div class="time-name">
                    <div class="time">{{ data.reportDate }}</div>
                    <UserCardVue :userId="data.reporter" name="dd" class="name" v-if="/A/.test(data.reporter)"
                        :show-icon="false" />
                    <span class="name" v-else>{{ data.reporter || `神秘人` }}</span>
                    <!-- {{ data.reporter || `神秘人` }}
                    <i class="icon zl-icon-phone" :style="{ marginLeft: '10px' }" @click="call(data.reporterTel)" /> -->
                    <!-- 添加电话图标 -->
                </div>
                <span>提交事件</span>
            </div>
            <div class="step" v-for="(value, key) in data.status" :key="key">
                <div class="time-name">
                    <div class="time">{{ value.updateTime }}</div>
                    <template>
                        <UserCardVue :userId="value.updater" name="dd" class="name" v-if="/A/.test(value.updater)"
                            :show-icon="false" />
                        <span class="name" v-else>{{ value.updater || `神秘人` }}</span>
                    </template>
                </div>
                <span v-if="value.reason && value.reason != data.status[key - 1]?.reason">
                    填写了原因：{{ value.reason }}
                </span>
                <span v-if="value.result">
                    填写了结果：{{ value.result }}
                </span>
                <span v-if="value.reason || value.result">，</span>
                <span v-if="value.deleteFlag">
                    关闭了该事件
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import UserCardVue from '@/pages/hr/userCard.vue';
import { call } from '@/utils/tools';
const props = defineProps<{ data: Record<string, any> }>();
// 拨打电话的方法

</script>
<style lang="less" scoped>
.event-wrapper {
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
        .way {
            color: #666;
        }

        .date {
            font-weight: bold;
        }
    }

    .crews {
        .title {}

        .value {
            display: flex;
            flex-direction: row;

            .name {
                margin: auto 10px;
            }
        }
    }

    .station {
        .title {}

        .value {}
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


}
</style>