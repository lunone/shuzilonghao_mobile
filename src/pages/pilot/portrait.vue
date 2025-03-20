<template>
    <div class="portrait-wrapper">
        <!-- 头部信息 -->
        <div class="header">
            <img src="https://placehold.co/80x120" alt="用户头像" class="avatar">
            <div class="details">
                <p>姓名: {{ pilot.name }}</p>
                <p class="phone">
                    <span @click="call(pilot.phone)">{{ pilot.phone }}</span>
                    <span @click="call(pilot.mobile)">{{ pilot.mobile }}</span>
                </p>
                <span v-for="tech in techs" :key="tech.acType + tech.techName">
                    {{ tech.acType }}/{{ tech.techName }}
                </span>
            </div>
        </div>

        <!-- 日历 -->
        <div class="track card">
            <h3 class="title"><i class="zl-icon-dep" />近期日程</h3>
            <div class="body">
                <trackVue :pcode="pcode" />
            </div>
        </div>

        <!-- 个人信息 -->
        <div class="card">
            <h3 class="title"><i class="zl-icon-dep" />基本信息</h3>
            <div class="body info">
                <div class="info-item">
                    <label class="cert-label">性别</label>
                    <span class="cert-value">{{ pilot.gender === 'M' ? '男' : '女' }}</span>
                </div>
                <div class="info-item">
                    <label class="cert-label">出生日期</label>
                    <span class="cert-value">{{ formatDate(pilot.birthDate) }}</span>
                </div>
                <div class="info-item">
                    <label class="cert-label">籍贯</label>
                    <span class="cert-value">{{ pilot.bornIn }}</span>
                </div>

                <div class="info-item">
                    <label class="cert-label">政治面貌</label>
                    <span class="cert-value">{{ pilot.party }}</span>
                </div>

                <div class="info-item">
                    <label class="cert-label">在职状态</label>
                    <span class="cert-value">{{ pilot.status }}</span>
                </div>

                <div class="info-item">
                    <label class="cert-label">住址</label>
                    <span class="cert-value">{{ pilot.address }}</span>
                </div>

            </div>
        </div>

        <div class="card">
            <h3 class="title"><i class="zl-icon-dep" />学历</h3>
            <div class="body info">
                <div class="info-item">
                    <label class="cert-label">毕业院校</label>
                    <span class="cert-value">{{ pilot.college }}</span>
                </div>
                <div class="info-item">
                    <label class="cert-label">学位</label>
                    <span class="cert-value">{{ pilot.culture }}</span>
                </div>
                <div class="cert-item">
                    <div class="cert-label">毕业时间</div>
                    <div class="cert-value">{{ formatDate(pilot.graduateDate) }}</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h3 class="title"><i class="zl-icon-dep" />基本信息</h3>
            <div class="body info">
                <div class="info-item">
                    <label class="cert-label">身份证</label>
                    <span class="cert-value">{{ pilot.idNo }}</span>
                </div>
                <div class="info-item">
                    <label class="cert-label">空管号</label>
                    <span class="cert-value">{{ pilot.kgNo }}</span>
                </div>
                <div class="info-item">
                    <label class="cert-label">执照号</label>
                    <span class="cert-value">{{ pilot.licenseNo }}</span>
                </div>
                <div class="info-item">
                    <label class="cert-label">记录号</label>
                    <span class="cert-value">{{ pilot.recordNo }}</span>
                </div>
            </div>
        </div>

        <div class="card">
            <h3 class="title"><i class="zl-icon-dep" />能力标识</h3>
            <div class="body info">
                <div class="info-item" v-for="title, key of marks" :key="key">
                    <label class="cert-label">{{ title }}</label>
                    <span class="cert-value">{{ pilot[key] }}</span>
                </div>
            </div>
        </div>
        <div class="card">
            <h3 class="title"><i class="zl-icon-dep" />计划限制</h3>
            <div class="body info">
                <div class="info-item" v-for="title, key of limit" :key="key">
                    <label class="cert-label">{{ title }}</label>
                    <span class="cert-value">{{ pilot[key] || '无限制' }}</span>
                </div>
            </div>
        </div>

        <!-- 资质证书 -->
        <div class="card">
            <h3 class="title"><i class="zl-icon-dep" /> 资质认证</h3>
            <div class="body cert">

                <div class="cert-item">
                    <div class="cert-label">ICAO等级</div>
                    <div class="cert-value">Level {{ pilot.icaoClass }}</div>
                </div>
                <div class="cert-item">
                    <div class="cert-label">ICAO有效期</div>
                    <div class="cert-value">{{ formatDate(pilot.icaoValidDate) }}</div>
                </div>
                <div class="cert-item">
                    <div class="cert-label">电台</div>
                    <div class="cert-value">{{ pilot.vor }}</div>
                </div>

            </div>
        </div>

        <!-- 工作履历 -->
        <div class="card">
            <h3 class="title"><i class="zl-icon-dep" /> 工作信息</h3>
            <div class="body timeline">
                <div class="timeline-item">
                    <div class="timeline-date">{{ formatDate(pilot.workDate) }}</div>
                    <div class="timeline-content">
                        <h4>参加工作</h4>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-date">{{ formatDate(pilot.flyDate) }}</div>
                    <div class="timeline-content">
                        <h4>初始飞行</h4>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-date">{{ formatDate(pilot.enterDate) }}</div>
                    <div class="timeline-content">
                        <h4>入职我司</h4>
                        <p>入职前小时:{{ pilot.beforeMinute || '无数据' }}</p>
                        <p>入职前机型:{{ pilot.beforeAcType || '无数据' }}</p>
                        <p>所属基地：{{ pilot.base }} </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { CONFIG } from '@/config';
import { api } from '@/utils/api';
import { computed, Ref, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePilotStore } from '@/store/pilot.store';
import trackVue from './track.vue';
import dayjs from 'dayjs';
import { call } from '@/utils/tools';
const { getTech, fetchPilots } = usePilotStore();

const pilot = ref({}) as Ref<Record<string, any>>;
const pcode = ref('');
const formatDate = (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '';

// 技术等级
const techs = computed(() => {
    if (!pcode.value) return;
    const techs = getTech(pcode.value, 'pcode');
    return techs || []
})

const marks = {
    isAjc: "空保转乘务", isBack: "isBack", isDuty: "是否可执勤", isLeader: "是否领导", isMate: "isMate", isModule: "isModule",
    isNewfly: "是否新飞", isNight: "是否可执行夜航", isPower: "实力", isSmoke: "抽烟", isValid: "有效", isWith: "伴飞"
}
const limit = { yearMax: '年度最大', month3Max: '3月最大', monthMax: '月最大', monthMin: '月最小', weekMax: '周最大', }
onLoad(e => {
    if (!e.pcode) return;
    pcode.value = e.pcode;
    const userData = { userId: e.pcode, idType: 'pcode' }
    Promise.allSettled([
        fetchPilots(), api(CONFIG.url.pilotProfile, userData).then(res => pilot.value = res || {}),
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