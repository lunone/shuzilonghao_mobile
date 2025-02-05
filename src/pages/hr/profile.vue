<template>
    <view class="employee-profile">
        <van-notice-bar left-icon="info-o" wrapable :scrollable="false">
            该功能尚未完成，暂显示样例，非真实数据
        </van-notice-bar>

        <view class="profile-header">
            <img :src="employee.avatar" alt="Avatar" class="avatar" />
            <view class="profile-info">
                <view class="userId">{{ employee.userId }}</view>
                <view class="name">{{ employee.name }}</view>
                <view class="department">{{ employee.department }}/{{ employee.subDepartment }}</view>
            </view>
        </view>

        <view class="profile-details">

            <view class="join-date">入职日期：{{ employee.joinDate }}</view>
            <view class="leave-date">离职日期：{{ employee.leaveDate }}</view>
            <view class="contract-expiry">合同到期：{{ employee.contractExpiry }}</view>
        </view>

        <view class="basic-info">
            <view class="phone">电话：{{ employee.phone }}</view>
            <view class="address">地址：{{ employee.district }}{{ employee.address }}</view>
        </view>


        <tabs v-model:active="active">
            <tab title="更多信息">
                <view class="education">
                    <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
                        这部分数据在 人力 未上网
                    </van-notice-bar>
                    <view class="id-number">身份证号：{{ employee.idNumber }}</view>
                    <view class="education-title">学历</view>
                    <view class="graduation-school">毕业院校：{{ employee.education.graduationSchool }}</view>
                    <view class="education-experience">
                        <view class="education-item" v-for="(edu, index) in employee.education.experience" :key="index">
                            <view class="education-period">{{ edu.startDate }} - {{ edu.endDate }}</view>
                            <view class="education-school">{{ edu.school }}</view>
                            <view class="education-nature">{{ edu.nature }}</view>
                        </view>
                    </view>
                </view>

                <view class="experience">
                    <view class="experience-title">工作经历</view>
                    <view v-for="(job, index) in employee.workExperience" :key="index">
                        <view class="job-period">
                            <text class="start">{{ job.startDate }}</text>
                            <text class="end">{{ job.endDate }}</text>
                        </view>
                        <view class="job-title">{{ job.title }}</view>
                        <view class="job-company">{{ job.company }}</view>
                    </view>
                </view>

                <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
                    这部分数据在 保卫部 未上网
                </van-notice-bar>
                <view class="emergency-contacts">
                    <view class="emergency-title">紧急联系人</view>
                    <view class="contact" v-for="(contact, index) in employee.emergencyContacts" :key="index">
                        <view class="contact-name">姓名：{{ contact.name }}</view>
                        <view class="contact-relationship">关系：{{ contact.relationship }}</view>
                        <view class="contact-address">住址：{{ contact.address }}</view>
                        <view class="contact-workplace">工作单位：{{ contact.workplace }}</view>
                    </view>
                </view>
            </tab>
            <tab title="薪酬表现">
                <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
                    这部分数据在 人力 未上网
                </van-notice-bar>

                <view class="performance">
                    <p>此处显示最近考核打分</p>
                    <view class="performance-item">
                        <view class="performance-date">2024年3季度</view>
                        <view class="performance-score">C</view>
                    </view>
                    <view class="performance-item">
                        <view class="performance-date">2024年2季度</view>
                        <view class="performance-score">C</view>
                    </view>
                    <view class="performance-item">
                        <view class="performance-date">2024年1季度</view>
                        <view class="performance-score">C</view>
                    </view>
                </view>
                <van-divider>薪酬数据</van-divider>
                普通员工显示薪点，
                <view class="salary">{{ employee.salary }}</view>

                <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
                    这部分数据在系统有简单信息，不知道是否能与线下完全对得上
                </van-notice-bar>
                <view class="level-title">级别:副驾F3</view>

                <van-divider>飞行员额外显示</van-divider>
                <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
                    这部分数据在 财务 未上网
                </van-notice-bar>
                <view class="level">
                    <view class="level-details">
                        <view class="level-item">打包费：{{ employee.level.packingFee }}</view>
                        <view class="level-item">转会费：{{ employee.level.transferFee }}</view>
                        <view class="level-item">安家费：{{ employee.level.settlingFee }}</view>
                    </view>
                </view>
            </tab>
            <tab title="工作记录">
                <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
                    这部分数据需要接入 航投人力资源系统,
                    <br>该功能为实现，仅为展示
                </van-notice-bar>
                如果是行政人员:<b>行政班</b><br>

                如果是维修人员，显示倒班日期:
                <van-calendar :first-day-of-week="1" title="日历" :row-height="25" :poppable="false" :show-confirm="false"
                    :show-mark="true" :show-title="false" :show-subtitle="false" :min-date="dateRange[0]"
                    :max-date="dateRange[1]">
                    <template #text="{ date, text, type, topInfo, bottomInfo, className }">
                        <view class="day">
                            <view class="mark" v-if="Math.random() > 0.7">
                                <i class="icon zl-icon-j5duty" />
                            </view>
                            <view v-else class="">{{ text }}</view>
                        </view>
                    </template>
                </van-calendar :first-day-of-week="1">
                如果是飞行员，显示航班日期:
                <van-calendar :first-day-of-week="1" title="日历" :row-height="25" :poppable="false" :show-confirm="false"
                    :show-mark="true" :show-title="false" :show-subtitle="false" :min-date="dateRange[0]"
                    :max-date="dateRange[1]">
                    <template #text="{ date, text, type, topInfo, bottomInfo, className }">
                        <view class="day">
                            <view class="mark" v-if="Math.random() > 0.7">
                                <i class="icon zl-icon-dep" />
                            </view>
                            <view v-else class="">{{ text }}</view>
                        </view>
                    </template>
                </van-calendar :first-day-of-week="1">
                <van-divider>电子记录</van-divider>
                <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
                    这部分显示员工工作产生的电子记录
                    <br>数据目前能接入：FOC,ME,SMS。 接入系统越多显示的越完整。
                    <br>功能还没写，目前仅为演示
                </van-notice-bar>
                <view class="record">
                    <view class="item">
                        <text class="date">2024-10-16</text>
                        <text class="content">完成了XXXX工作</text>
                        <text class="src"></text>
                    </view>
                    <view class="item">
                        <text class="date">2024-10-19</text>
                        <text class="content">飞了GI1234航班</text>
                        <text class="src"></text>
                    </view>
                    <view class="item">
                        <text class="date">2024-10-19</text>
                        <text class="content">提交了安全事件，事件内容：xxxxxxxxx</text>
                        <text class="src"></text>
                    </view>
                </view>

            </tab>

        </tabs>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import tabs from '@/components/zl/tabs.vue';
import tab from '@/components/zl/tab.vue';
const props = defineProps({
    userId: { type: String, default: '' }
});

const active = ref(0);
const dateRange = ref([new Date(2024, 11, 1), new Date(2024, 11, 30)]);
const employee = ref({
    avatar: 'https://app.airlonghao.com/public/3fweewwexcqww2ewe.jpg',
    name: '李志伦',
    department: '信息技术部',
    subDepartment: 'IT架构与大数据处',
    idNumber: '41092819810721xxxx',
    joinDate: '2020年4月1日',
    leaveDate: '2023年10月1日', // 新增离职日期
    contractExpiry: '无期限',
    phone: '13140041314',
    address: '河南郑州金水区金水路201号',
    district: '金水区', // 新增区
    userId: 'A00725',
    salary: 500,
    workExperience: [
        {
            startDate: '2020-04',
            endDate: '2020-04',
            period: '2020-04–至今',
            title: '经理',
            company: '中原龙浩'
        },
        {
            startDate: '2005-07',
            endDate: '2019-07',
            title: '顾问',
            company: '深圳航空'
        }
    ],
    emergencyContacts: [ // 新增紧急联系人
        {
            name: '张三',
            relationship: '父亲',
            address: '河南郑州金水区金水路202号',
            workplace: '某公司'
        },
        {
            name: '李四',
            relationship: '母亲',
            address: '河南郑州金水区金水路203号',
            workplace: '某学校'
        }
    ],
    education: { // 新增学历信息
        graduationSchool: '东北大学',
        experience: [
            {
                startDate: '2001-09',
                endDate: '2005-07',
                school: '东北大学',
                nature: '本科'
            },
            {
                startDate: '1998-09',
                endDate: '2001-07',
                school: 'xx高中',
                nature: ''
            }
        ]
    },
    level: { // 新增级别信息
        packingFee: '5,000,000.00',
        transferFee: '4,500,000.00',
        settlingFee: '500,000.00'
    }
});
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.employee-profile {
    padding: 20px;
    background-color: @background-color;
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
            border: solid 1px @border-color;
        }

        .profile-info {
            .userId {
                font-size: 14px;
                color: @text-color;
            }

            .name {
                font-size: 20px;
                font-weight: bold;
                margin-top: 5px;
            }

            .department {
                margin-top: 5px;
                color: @text-color;
            }
        }
    }

    .profile-details {
        margin-top: 20px;
        border-top: 1px solid @border-color;
        padding-top: 10px;

        .id-number,
        .join-date,
        .leave-date,
        .contract-expiry,
        .district {
            margin-bottom: 10px;
            color: @text-color;
        }
    }

    .basic-info {
        margin-top: 20px;
        border-top: 1px solid @border-color;
        padding-top: 10px;

        .phone,
        .address,
        .district {
            margin-bottom: 10px;
            color: @text-color;
        }
    }

    .emergency-contacts {
        margin-top: 20px;
        border-top: 1px solid @border-color;
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
                color: @text-color;
            }
        }
    }

    .education {
        margin-top: 20px;
        border-top: 1px solid @border-color;
        padding-top: 10px;

        .education-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .graduation-school {
            margin-bottom: 10px;
            color: @text-color;
        }

        .education-experience {
            .education-item {
                margin-bottom: 10px;

                .education-period,
                .education-school,
                .education-nature {
                    margin-bottom: 5px;
                    color: @text-color;
                }
            }
        }
    }

    .level {
        margin-top: 20px;
        border-top: 1px solid @border-color;
        padding-top: 10px;

        .level-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .level-details {
            .level-item {
                margin-bottom: 5px;
                color: @text-color;
            }
        }
    }

    .experience {
        margin-top: 20px;
        border-top: 1px solid @border-color;
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
            color: @text-color;
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