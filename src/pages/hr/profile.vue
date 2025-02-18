<template>
    <view class="employee-profile">
        <view class="profile-header">
            <img :src="employee2?.avatar" alt="Avatar" class="avatar" />
            <view class="profile-info">
                <view class="userId">{{ employee2?.userId }}</view>
                <view class="name">{{ employee2?.name }}</view>
                <!-- <view class="department">{{ employee.department }}/{{ employee.subDepartment }}</view> -->
            </view>
        </view>

        <view class="basic-info">
            <view class="phone">电话：{{ employee2?.mobile }}</view>
            <view class="address">地址：{{ employee2?.district }}{{ employee2?.address }}</view>
        </view>
        <view class="id-number">身份证号：{{ employee2?.idCard }}</view>
        <press-tabs :active="current" @change="onClickItem">
            <press-tab title="联系人">
                <Contract />
            </press-tab>
            <press-tab title="培训工作">
                <Education />
                <Experience />
            </press-tab>
            <press-tab title="绩效分析">
                <Salary />
            </press-tab>
            <press-tab title="工作轨迹">
                <Job />
            </press-tab>
        </press-tabs>

    </view>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import CONFIG from '@/config';
import api from '@/utils/api';
import { UserItem } from '@/interface';
import useUserStore from '@/store/user.store';
import Salary from './profile/salary.vue';
import Experience from './profile/experience.vue';
import Job from './profile/job.vue';
import Contract from './profile/contract.vue';
import Education from './profile/education.vue';

const props = defineProps({
    userId: { type: String, default: '' }
});

const store = useUserStore();
const active = ref(0);
const employee2: Ref<UserItem> = ref();
const fetchEmployee = async () => {
    const res = await api(CONFIG.url.userProfile, { userId: props.userId });
    // const departments = await store.departments();
    employee2.value = res;
};
const items = ref(['更多信息', '薪酬表现', '工作记录']);
const current = ref(0);
const onClickItem = (e) => {
    if (current != e.currentIndex) {
        current.value = e.currentIndex;
    }
}
onMounted(() => {
    fetchEmployee();
});
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.employee-profile {
    padding: 20px;
    background-color: @color-background;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    min-height: 40vh;
    max-height: 60vh;
    overflow-y: scroll;

    .profile-header {
        display: flex;
        align-items: center;

        .avatar {
            width: 100px;
            height: 100px;
            border-radius: 3px;
            margin-right: 20px;
            border: solid 1px @color-border;
        }

        .profile-info {
            .userId {
                font-size: 14px;
                color: @color-text;
            }

            .name {
                font-size: 20px;
                font-weight: bold;
                margin-top: 5px;
            }

            .department {
                margin-top: 5px;
                color: @color-text;
            }
        }
    }

    .profile-details {
        margin-top: 20px;
        border-top: 1px solid @color-border;
        padding-top: 10px;

        .id-number,
        .join-date,
        .leave-date,
        .contract-expiry,
        .district {
            margin-bottom: 10px;
            color: @color-text;
        }
    }

    .basic-info {
        margin-top: 20px;
        border-top: 1px solid @color-border;
        padding-top: 10px;

        .phone,
        .address,
        .district {
            margin-bottom: 10px;
            color: @color-text;
        }
    }

    .emergency-contacts {
        margin-top: 20px;
        border-top: 1px solid @color-border;
        padding-top: 10px;

        .emergency-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .contact {
            margin-bottom: 10px;

            .contact-name,
            .contact-relationship,
            .contact-address,
            .contact-workplace {
                margin-bottom: 5px;
                color: @color-text;
            }
        }
    }

    .education {
        margin-top: 20px;
        border-top: 1px solid @color-border;
        padding-top: 10px;

        .education-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .graduation-school {
            margin-bottom: 10px;
            color: @color-text;
        }

        .education-experience {
            .education-item {
                margin-bottom: 10px;

                .education-period,
                .education-school,
                .education-nature {
                    margin-bottom: 5px;
                    color: @color-text;
                }
            }
        }
    }

    .level {
        margin-top: 20px;
        border-top: 1px solid @color-border;
        padding-top: 10px;

        .level-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .level-details {
            .level-item {
                margin-bottom: 5px;
                color: @color-text;
            }
        }
    }

    .experience {
        margin-top: 20px;
        border-top: 1px solid @color-border;
        padding-top: 10px;

        .experience-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .job-period,
        .job-title,
        .job-company {
            margin-bottom: 5px;
            color: @color-text;
        }

        .job-period {
            display: block;

            .start,
            .end {
                font-size: 14px;
                margin-right: 3rem;
            }
        }
    }
}
</style>