<template>
    <div class="portrait-wrapper">
        <Card :pilot="pilot" />
        <press-tabs :active="tabCurrent" @change="onClickItem">
            <press-tab title="基本信息">
                <BasicInfo :pcode="pcode" :pilot="pilot" />
            </press-tab>
            <press-tab title="技术能力">
                <Technical :pilot="pilot" />
            </press-tab>
            <press-tab title="疲劳分析">
                <div class="track card">
                    <h3 class="title"><i class="zl-icon-dep" />近期日程</h3>
                    <div class="body">
                        <trackVue :pcode="pcode" />
                    </div>
                </div>
                <Fatigue :pcode="pcode" />
            </press-tab>
        </press-tabs>
    </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { CONFIG } from '@/config';
import { api } from '@/utils/api';
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
        fetchPilots(), api(CONFIG.url.pilotProfile, { userId: e.pcode, idType: 'pcode' }).then(res => pilot.value = res || {}),
    ])
        .then(res => { console.log('allSettled:', res) })
        .catch(err => console.log('error', err));
});
</script>
<style lang="less" scoped>
@import '@/css/base.less';

.portrait-wrapper {
    padding: 10px; // 减少整体内边距

    .header {
        display: flex;
        align-items: center;
        margin-bottom: 5px;

        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 10px;
        }

        .details {
            p {
                margin: 3px 0;
                font-size: 0.9em;
            }

            span {
                display: block;
                margin: 3px 0;
                font-size: 0.85em;
            }
        }

        .phone {
            span {
                margin: 0 10px;
            }
        }
    }

    .card {
        .column;
        border-radius: 8px; // 减小圆角
        margin-bottom: 10px; // 减少间距
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 减小阴影
        padding: 10px;
        width: 100%;

        .title {
            width: 100%;
            padding: 10px; // 减少内边距
            margin: 0;
            font-size: 1em; // 减小字体
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            gap: 5px; // 减少间距
        }

        .body {
            width: 100%;
        }
    }

    .info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px; // 减少间距
        padding: 10px; // 减少内边距

        .info-item {
            padding: 5px; // 减少内边距
            border-bottom: 1px solid #f0f0f0;

            label {
                display: block;
                font-size: 0.85em; // 减小字体
                color: #666;
                margin-bottom: 3px; // 减少间距
            }

            span {
                font-weight: 500;
                color: #333;
            }
        }

        .full-width {
            grid-column: span 2;
        }
    }

    .cert {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); // 减小最小宽度
        gap: 8px; // 减少间距
        padding: 10px; // 减少内边距

        .cert-item {
            text-align: center;
            padding: 8px; // 减少内边距
            border-radius: 6px; // 减小圆角

            .cert-label {
                font-size: 0.8em; // 减小字体
                color: #666;
                margin-bottom: 3px; // 减少间距
            }

            .cert-value {
                font-weight: bold;
                color: #111;
            }
        }
    }

    .timeline {
        padding: 10px; // 减少内边距
        position: relative;

        .timeline-item {
            display: flex;
            gap: 10px; // 减少间距
            padding: 8px 0; // 减少内边距
            position: relative;

            .timeline-date {
                width: 120px; // 减小宽度
                font-weight: 500;
                color: #3498db;
            }

            .timeline-content {
                flex: 1;
                padding-left: 10px; // 减少间距
                border-left: 1px solid #3498db;

                h4 {
                    margin: 0;
                    font-size: 0.9em; // 减小字体
                }

                p {
                    margin: 3px 0; // 减少间距
                    font-size: 0.85em; // 减小字体
                }
            }
        }
    }

    // &.contact card {
    //     .contact-buttons {
    //         display: grid;
    //         gap: 8px; // 减少间距
    //         padding: 10px; // 减少内边距

    //         .contact-btn {
    //             display: flex;
    //             align-items: center;
    //             gap: 5px; // 减少间距
    //             padding: 8px; // 减少内边距
    //             border-radius: 6px; // 减小圆角
    //             text-decoration: none;
    //             color: #333;
    //             transition: background 0.2s;

    //             &:hover {
    //                 background: #e9ecef;
    //             }
    //         }
    //     }
    // }


    // @media (max-width: 480px) {
    //     .info-grid {
    //         grid-template-columns: 1fr;

    //         .info-item {
    //             .full-width {
    //                 grid-column: span 1;
    //             }
    //         }
    //     }

    //     .timeline-date {
    //         width: 50px; // 进一步减小宽度
    //     }
    // }
}
</style>