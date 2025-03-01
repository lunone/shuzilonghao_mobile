<template>
    <div class="profile-wrapper">
        <div class="header">
            <div class="avatar">
                <img :src="employee?.avatar" alt="Avatar" />
            </div>
            <div class="info">
                <div class="kv name">
                    {{ name }}({{ userId }})
                    <span class="status">{{ employee?.status == 2 ? '已离职' : '' }}</span>
                </div>
                <div class="ietm department">{{ depName }}</div>
                <div class="kv position">
                    <div class="key">岗位</div>
                    <div class="value">{{ employee?.position }}</div>
                </div>
                <div class="kv phone" @click="call(employee?.mobile)">
                    <div class="key">电话</div>
                    <div class="value"> {{ employee?.mobile }}</div>
                </div>
            </div>
        </div>
        <div class="details">
            <press-tabs :active="current">
                <press-tab title="背景信息">
                    <referenceVue :district="employee?.district" :address="employee?.address"
                        :idCard="employee?.idCard" />
                </press-tab>
                <press-tab title="个人经历">
                    <div class="exp">
                        <experienceVue />
                    </div>
                </press-tab>
                <press-tab title="人资信息">
                    <div class="hr">
                        <Contract />
                        <Performance />
                        <Salary />
                    </div>
                </press-tab>
                <press-tab title="工作轨迹">
                    <div class="duty">
                        <dutyVue />
                    </div>
                </press-tab>
            </press-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from 'vue';
import CONFIG from '@/config';
import api from '@/utils/api';
import { UserItem } from '@/interface';
import useUserStore from '@/store/user.store';
import Salary from './profile/salary.vue';
import experienceVue from './profile/experience.vue';
import dutyVue from './profile/duty.vue';
import referenceVue from './profile/reference.vue';
import education from './profile/education.vue';
import { call, getDepartmentPath } from '@/utils/tools';
import Performance from './profile/performance.vue';
import Contract from './profile/contract.vue';
const store = useUserStore();

const props = defineProps({
    userId: { type: String, default: '' }
});

const active = ref(0);
const employee: Ref<UserItem> = ref();
let departments = ref([]);
const depName = ref('');
const fetchEmployee = async () => {
    store.getDepartments();
    employee.value = await api(CONFIG.url.userProfile, { userId: props.userId });
};
// watch
watch([() => store.departments, () => employee], () => {
    departments.value = store.departments;
    if (departments.value.length && employee.value.department) {
        depName.value = getDepartmentPath(departments.value, +employee.value.department);
    }
}, { deep: true })
const name = computed(() => {
    return employee.value?.name || store.staff[props.userId]?.name || '';
});
const current = ref(0);
const onClickkv = (e) => {
    if (current != e.currentIndex) {
        current.value = e.currentIndex;
    }
}
onMounted(async () => {
    fetchEmployee();
});
interface Department {
    id: string | number;
    parentId?: string | number | null;
    name: string;
}


</script>

<style lang="less" scoped>
@import "@/css/base.less";
@import "@/css/kv.less";

.profile-wrapper {
    padding: 20px;
    height: 40vh;
    overflow-y: scroll;
    font-size: 1rem;

    .header {
        display: flex;
        align-items: flex-start;

        .avatar {
            width: 90px;
            height: 120px;
            border-radius: 3px;
            margin-right: 20px;
            border: solid 1px @color-border;
            border-radius: 10px;
            background: url('https://app.airlonghao.com/picph.jpg');
        }

        .info {
            .column;
            width: 100%;
            align-items: flex-start;
            height: 90px;

            .name {
                font-size: 20px;
                font-weight: bold;

                .status {
                    color: #ccc;
                }
            }

            .department {
                color: @color-text;
            }

            .position {}

            .phone {}
        }
    }

    .details {
        margin-top: 20px;
        border-top: 1px solid @color-border;
        padding-top: 10px;

        .hr,
        .duty,
        .exp {
            .sample;
        }
    }


}
</style>