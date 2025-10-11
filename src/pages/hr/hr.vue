<template>
    <!-- <nav-vue title="人员统计" text="主页" url='/home' /> -->


    <div class="wrapper">
        <div class="statistics">
            <div class="title">统计</div>
            <div class="total">
                <text>总人数: </text>
                <text>{{ stat.totalCount }}</text>
            </div>
            <div class="dep">
                <text>部门: </text>
                <text>{{ stat.totalCount }}</text>
            </div>

        </div>
        <div class="departments">
            <div class="item" v-for="users, key in stat.departments" :key="key">
                <text>{{ key }}: </text>
                <text>{{ users.length }}</text>
            </div>
        </div>
        <div class="recent">
            <div class="title">近期活动</div>
            <div class="hires" v-for="users, key in mockData.recent ">
                <div class="subtitle">
                    {{ key == 'leaves' ? '离职' : '入职' }}
                </div>
                <ul>
                    <li v-for="user in users" :key="user.name">
                        <UserCardVue :userId="user.userId" :error="user.name" class="user" />
                        <text class="department">{{ user.department }}</text>
                        <text class="date">{{ user.date }}</text>
                    </li>
                </ul>
            </div>
        </div>
        <div class="intro">
        </div>

    </div>
    <!-- <van-action-sheet v-model:show="show" title="员工信息">
        <profile-vue></profile-vue>
    </van-action-sheet> -->
    <!-- <profile-vue></profile-vue> -->
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
// import NavVue from '@/components/Nav.vue';
import ProfileVue from './profile.vue';
import { UserItem } from '@/api/user.api';

// import router from '@/router';
import UserCardVue from './userCard.vue';
const show = ref(false);
// 定义数据结构
interface HrData {
    // departments: { name: string; counter: string,users:{userId:string,name:string,department:string,date:string}[] }[];
    users: { userId: string; name: string; department: string; departmentId: string; date: Date | string }[];
    recent: {
        hires: { userId: string; name: string; department: string; departmentId: string; date: Date | string }[];
        leaves: { userId: string; name: string; department: string; departmentId: string; date: Date | string }[];
    }
}
// 模拟数据
const mockData: HrData = {
    users: [
        { userId: "A00725", name: '李志伦', department: '技术部', departmentId: `3`, date: '2025-01-15' },
        { userId: "A00147", name: '王五', department: '技术部', departmentId: `3`, date: '2025-1-15' },
        { userId: "A00302", name: '赵六', department: '财务部', departmentId: `3`, date: '2025-1-15' },

    ],
    recent: {
        hires: [
            { userId: "A00725", name: '李志伦', department: '技术部', departmentId: `3`, date: '2025-01-15' },
            { userId: "A00848", name: '张三', department: '市场部', departmentId: `3`, date: '2024-12-15' }
        ],
        leaves: [
            { userId: "A00147", name: '王五', department: '技术部', departmentId: `3`, date: '2025-1-15' },
            { userId: "A00302", name: '赵六', department: '财务部', departmentId: `3`, date: '2025-1-15' }
        ]
    }
};
const users = ref<UserItem[]>([]);
// 定义响应式数据
// const stats = ref<HrData>({
//     users: [],
//     recent: {
//         hires: [],
//         leaves: []
//     }
// });
// 使用模拟数据
// stats.value = mockData;
const stat: Ref<{ totalCount: number, departments: Record<string, UserItem[]> }> = ref({
    totalCount: 0,
    departments: {},
});

watch(users, () => {
    // console.log('stats', stats.value);
    const thisUsers = users.value;

    stat.value = {
        totalCount: thisUsers.length,
        departments: thisUsers.reduce((acc, item) =>
            ({ ...acc, [item.departmentName]: [...(acc[item.departmentName] || []), item] }), {}),
    };

});
// 模拟 API 请求
// onMounted(async () => {
//     try {
//         const response = await api() as HrData;
//         stats.value = response;
//     } catch (error) {
//         console.error('获取HR数据失败', error);
//     }
// });
const jump = (url: string) => {
    console.log('jump', url);
    // router.push(url);
    show.value = true;
}
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.wrapper {
    padding: 20px;
    // background-color: @color-background;
    // border-radius: 8px;
    // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .title {
        color: @color-primary;
        font-size: 20px;
        font-weight: normal;
        margin-bottom: 10px;
    }

    .subtitle {
        color: @color-secondary;
        font-size: 18px;
        font-weight: normal;
        margin-bottom: 5px;
    } 

    .total-count {
        font-size: 16px;
        color: @color-text;
        margin-bottom: 10px;

        span {
            margin-right: 5px;
        }
    }

    .departments {
        .item {
            font-size: 14px;
            color: @color-text;
            margin-bottom: 5px;

            span {
                margin-right: 5px;
            }
        }
    }

    .recent {

        .hires,
        .leaves {
            margin-bottom: 20px;

            ul {
                list-style-type: none;
                padding: 0;

                li {
                    font-size: 14px;
                    color: @color-text;
                    margin-bottom: 5px;

                    span {
                        margin-right: 5px;
                    }
                }
            }
        }
    }

    .sample-info {
        font-size: 16px;
        color: @color-text;
        margin-bottom: 20px;
    }
}
</style>