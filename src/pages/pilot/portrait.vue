<template>
    <div class="portrait-wrapper">
        <Card :pilot="pilot" class="header" />
        <div class="detail">
            <press-tabs :active="tabCurrent" @change="onClickItem">
                <press-tab title="基本信息">
                    <BasicInfo :pcode="pcode" :pilot="pilot" />
                </press-tab>
                <press-tab title="技术能力">
                    <Technical :pilot="pilot" />
                </press-tab>
                <press-tab title="疲劳分析">
                    <div class="track">
                        <h3 class="title"><i class="zl-icon-dep" />近期日程</h3>
                        <div class="body">
                            <trackVue :pcode="pcode" />
                        </div>
                    </div>
                    <Fatigue :pcode="pcode" />
                </press-tab>
            </press-tabs>
        </div>
    </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { CONFIG } from '@/config';
import { getPilotProfile } from '@/api/pilot.api';
import { computed, Ref, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePilotStore } from '@/store/pilot.store';
import trackVue from '@/pages/pilot/track.vue';
import Fatigue from '@/pages/pilot/portrait/fatigue.vue';
import Card from '@/pages/pilot/portrait/card.vue';
import BasicInfo from '@/pages/pilot/portrait/basicInfo.vue';
import Technical from '@/pages/pilot/portrait/technical.vue';
const { getTech, fetchPilots, getPilot } = usePilotStore();

const pilot = ref({}) as Ref<Record<string, any>>;
const pcode = ref('');
const formatDate = (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '';

const tabCurrent = ref(0);
const onClickItem = e => tabCurrent.value = tabCurrent != e.currentIndex ? e.currentIndex : tabCurrent.value;

onLoad(e => {
    console.log('onLoad', e)
    if (!e.pcode) return;
    pcode.value = e.pcode;
    const pilot2 = getPilot(e.pcode)
    if (pilot2?.userId) {
        pilot.value = { userId: pilot2.userId, name: pilot2.name, }
    }
    Promise.allSettled([
        fetchPilots(), getPilotProfile({ userId: e.pcode, idType: 'pcode' }).then(res => pilot.value = res.data.data || {}),
    ])
        .then(res => { console.log('allSettled:', res) })
        .catch(err => console.log('error', err));
});
</script>
<style lang="less" scoped>
@import '@/css/base.less';

.portrait-wrapper {
    background-color: #D13419;

    .header {}

    .detail {
        border-radius: 10px 10px 0 0;
        background-color: #fff;
        overflow: hidden;

        .track {
            padding: 10px;

            .title {
                display: flex;
                align-items: center;
                gap: 5px;
            }
        }
    }
}
</style>