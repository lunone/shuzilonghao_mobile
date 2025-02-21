<template>
    <div class="experience-container">
        <div class="section">
            <div class="item">
                <div class="title">学历：</div>
                <div class="value">{{ education.degree }}</div>
            </div>
            <div class="item">
                <div class="title">毕业院校：</div>
                <div class="value">{{ education.school }}</div>
            </div>
        </div>

        <div class="section">
            <div class="title">教育经历</div>
            <div class="item" v-for="(edu, index) in education.experience" :key="index">
                <div class="period">
                    <span class="start">{{ edu.startDate }}</span>
                    <span class="end">{{ edu.endDate }}</span>
                </div>
                <div class="school">{{ edu.school }}</div>
                <div class="nature">{{ edu.nature }}</div>
            </div>
        </div>

        <div class="section">
            <div class="title">工作经历</div>
            <div class="item" v-for="(job, index) in experience" :key="index">
                <div class="period">
                    <span class="start">{{ job.startDate }}</span>
                    <span class="end">{{ job.endDate }}</span>
                </div>
                <div class="job-title">{{ job.title }}</div>
                <div class="company">{{ job.company }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

// 模拟数据
const education = reactive({
    degree: '本科',
    school: '北京大学',
    experience: [
        {
            startDate: '2018-09',
            endDate: '2022-06',
            school: '北京大学',
            nature: '全日制'
        },
        {
            startDate: '2022-09',
            endDate: '2023-06',
            school: '清华大学',
            nature: '在职'
        }
    ]
});

const experience = ref([
    {
        startDate: '2022-07',
        endDate: '2023-06',
        title: '软件工程师',
        company: '阿里巴巴'
    },
    {
        startDate: '2023-07',
        endDate: '2024-06',
        title: '高级软件工程师',
        company: '腾讯'
    }
]);
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.experience-container {
    padding: 10px;
    overflow-y: auto;


    .section {
        margin-bottom: 20rpx;

        &:last-child {
            margin-bottom: 0;
        }

        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 10rpx;
        }

        .item {
            .row;
            padding: 10rpx 0;
            border-bottom: 1rpx solid #e0e0e0;

            &:last-child {
                border-bottom: none;
            }

            .period {
                font-size: 22rpx;
                color: #8b8b8b;
                flex: 1;

                .start,
                .end {}

                .end {
                    margin-left: 10rpx;
                }
            }

            .school,
            .nature,
            .job-title,
            .company {
                font-size: 28rpx;
                color: #333;
                flex: 1;
                text-align: right;
            }

            .company {
                overflow: hidden;
            }

        }
    }
}
</style>