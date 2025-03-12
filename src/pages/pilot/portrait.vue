<template>
    <div class="portrait-wrapper">
        <!-- 头部信息 -->
        <div class="header-info">
            <img src="https://placehold.co/80x120" alt="用户头像" class="user-avatar">
            <div class="user-details">
                <p>姓名: {{ pilot.name }}</p>
                <p>手机: {{ pilot.mobile }}</p>
                <!-- 其他信息 -->
                <span v-for="tech in techs" :key="tech.acType + tech.techName">
                    {{ tech.acType }}/{{ tech.techName }}
                </span>
            </div>
        </div>

        <!-- 日历 -->
        <div class="calendar">
            <trackVue :pcode="pcode" />
        </div>

        <!-- 基本信息 -->
        <div class="basic-info">
            <h3>基本信息</h3>
            <p>证件号码: {{ pilot.idNo }}</p>
            <p>出生日期: {{ pilot.birthday }}</p>
            <p>籍贯: {{ pilot.nativePlace }}</p>
        </div>

        <!-- 职业信息 -->
        <div class="career-info">
            <h3>职业信息</h3>
            <p>学校: {{ pilot.college }}</p>
            <!-- 其他职业信息 -->
        </div>
    </div>
</template>
<script setup lang="ts">
import CONFIG from '@/config';
import api from '@/utils/api';
import { computed, Ref, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePilotStore } from '@/store/pilot.store';
import trackVue from './track.vue';
const { getTech, fetchPilots } = usePilotStore();

// const userId = ref('');
const pilot = ref({}) as Ref<Record<string, any>>;
const pcode = ref('');
// 技术等级
const techs = computed(() => {
    if (!pcode.value) return;
    const techs = getTech(pcode.value, 'pcode');
    return techs || []
})


onLoad(e => {
    if (!e.pcode) return;
    pcode.value = e.pcode;
    const userData = { userId: e.pcode, idType: 'pcode' }
    Promise.allSettled([
        fetchPilots(),
        api(CONFIG.url.pilotProfile, userData).then(res => pilot.value = res || {}),
    ]).catch(err => console.log('error', err));
});
</script>
<style lang="less" scoped>
@import '@/css/base.less';

.portrait-wrapper {
    padding: 20px;
    font-family: Arial, sans-serif;

    .header-info {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .user-avatar {
            width: 100px;
            height: 100px;
            border-radius: 10%;
        }

        .user-details {
            p {
                margin: 5px 0;
            }
        }
    }



    .basic-info,
    .career-info {
        h3 {
            margin-bottom: 10px;
        }

        p {
            margin: 5px 0;
        }
    }
}
</style>