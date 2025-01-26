<template>
    <template v-if="userInfo?.userId">
        <van-cell-group inset class="radius">
            <van-field label="工号" :model-value="userInfo.userId" readonly />
            <van-field label="姓名" :model-value="userInfo.name" readonly />
            <van-field label="部门" :model-value="userInfo.topDepartmentName" readonly />
            <van-field label="科室" :model-value="userInfo.departmentName" readonly />
            <van-field label="入职时间" :model-value="userInfo.hireDate" readonly />
            <van-field label="电话" readonly>
                <template #input>
                    <a :href="'tel:' + userInfo.mobile"> {{ userInfo.mobile }}</a></template>
            </van-field>
        </van-cell-group>
        <van-divider>应急信息</van-divider>
        <van-cell-group inset class="radius">

            <van-field label="身份证" :model-value="userInfo.idCard" readonly />
            <van-field label="行政区" :model-value="userInfo.district" readonly />
            <van-field label="地址" :model-value="userInfo.address" readonly />
            <van-field label="联系人" :model-value="userInfo.contract" readonly />
            <van-field label="联系电话" readonly>
                <template #input>
                    <a :href="'tel:' + userInfo.contractMobile"> {{ userInfo.contractMobile }}</a></template>
            </van-field>
        </van-cell-group>
        <van-divider> 疫苗接种信息</van-divider>
        <van-cell-group inset class="radius">
            <van-field label="第一针" :model-value="userInfo.userId" readonly />
            <van-field label="第二针" :model-value="userInfo.userId" readonly />
            <van-field label="第三针" :model-value="userInfo.userId" readonly />
        </van-cell-group>
        <van-divider>健康申报&核酸</van-divider>

        <van-calendar :first-day-of-week="1"  title="日历" @select="select" :formatter="formatter" :poppable="false" :show-confirm="false"
            :min-date="startDate.toDate()" :max-date="endDate.toDate()" :style="{ height: '500px' }" />
        <van-divider>事件记录</van-divider>
    </template>
    <van-empty description="未查到该用户" image="error" v-else />
    <van-dialog v-model:show="show" :show-cancel-button="false" :show-confirm-button="false" closeOnClickOverlay>
        <!-- <DeclarationVue v-for="item in userDeclarations" :declaration="item" /> -->
    </van-dialog>

</template>
<script lang="ts" setup>
import {  User } from '@/interface';
import api from '@/utils/api';
import dayjs from 'dayjs';
import _ from 'lodash';
import { CalendarDayItem, Dialog } from 'vant';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
// 上月初
const startDate = dayjs().add(-1, 'month').set('date', 1);
// 今天
const endDate = dayjs();

const userInfo = ref<User | undefined>();
// const declarations = ref<DeclarationItem[] | undefined>();
// const declarationsGroupByDate = ref<Record<string, DeclarationItem[]>>();
// const userDeclarations = ref<DeclarationItem[]>();
const VanDialog = Dialog.Component;

const show = ref(false);
// 如果用户发生变化，就初始信息
watch(route, async val => {
    // 基本信息
    // 从路由找到工号
    let { userId } = route.params;
    userInfo.value = await api('fangyi/user/profile', { userId }) as User;
    // 健康申报，根据日历选取最近前后60天的。
    const declarationsSrc = await api('fangyi/declaration/list', {
        userId, format: true, startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD')
    }) as any[];
    // declarationsGroupByDate.value = _.groupBy(declarationsSrc, 'date');
    // declarations.value = declarationsSrc;
}, { immediate: true });


const formatter = (day: CalendarDayItem) => {
    const month = day.date!.getMonth() + 1;
    const date = day.date!.getDate();
    const $date = dayjs(day.date).format('YYYY-MM-DD');

    if (dayjs(day.date).isSame(dayjs(), 'day')) {
        day.text = '今天';
    }
    // if (declarationsGroupByDate.value) {
    //     const declarations = declarationsGroupByDate.value![$date];
    //     // todo:大于今天的排除掉
    //     if (declarations) {
    //         day.topInfo = declarations.length + '';
    //     }
    // }
    day.className = 'acid sick';
    // if (day.type === 'start') {
    //     day.bottomInfo = '入住';
    // } else if (day.type === 'end') {
    //     day.bottomInfo = '离店';
    // }

    return day;
};

function select(date: Date) {
    const $date = dayjs(date).format('YYYY-MM-DD');
    // const declarations = declarationsGroupByDate.value![$date];
    // // todo:大于今天的排除掉
    // if (declarations) {
    //     userDeclarations.value = declarations
    //     show.value = true;
    // }
    // console.log(date, userDeclarations.value)
}
</script>
<style lang="less" scoped>
.radius {
    border: solid 1px #ccc;
}

::v-deep {

    // 做核酸了
    .acid {
        // border:solid 1px red;
    }

    // 有航班
    .international {}

    .domestic {}

    // 有异常
    .sick {}
}
</style>
