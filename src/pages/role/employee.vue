<template>
    <div class="main-container">


        <!-- 使用 v-if 和 hasPermission 控制显示 -->
        <div v-if="userStore.hasPermission('jingying:yuedu')" class="section overview">
            <StatVue class="day" :range="`day`" />
            <StatVue class="year" />
            <!-- 权限管理入口 -->
        </div>
        <!-- <Manage />   -->
        <div class="section permission-section">
            <!-- <div class="" v-if="canManageSystem"> -->
            <div class="permission-card" @click="goToPermissionManage">
                <div class="permission-icon">🔐</div>
                <div class="permission-content">
                    <h3 class="permission-title">权限管理</h3>
                    <p>管理系统用户权限和角色分配。</p>
                </div>
                <div class="permission-arrow">→</div>
            </div>
            <!-- </div> -->
        </div>
        <!-- <DutyAct /> -->
        <div v-if="userStore.hasPermission('hr:read')" class="section duty">
            <Duty />
        </div>
        <div v-if="userStore.hasPermission('flight:read')" class="section">
            <Flight />
        </div>
    </div>
</template>

<script lang="ts" setup>

import { computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user.store'
import StatVue from '@/pages/staff/stat.vue';
import Duty from '../staff/duty.vue';
import Flight from '../flight/flight.vue';
import DutyAct from '@/pages/living/dutyAct.vue'
import manage from './manage.vue';
import Manage from './manage.vue';


// 使用 userStore
const userStore = useUserStore()

// 权限检查
const canManageSystem = computed(() => userStore.isAdmin())


const goToPermissionManage = () => {
    uni.navigateTo({
        url: '/pages/role/manage'
    })
}

// 输出当前用户权限信息到控制台
onMounted(async () => {
    // 等待用户信息加载完
    await userStore.fetchMe()
    console.log('=== 当前用户权限信息 ===')
    console.log('用户角色:', userStore.permissions?.roles || [])
    console.log('用户权限列表:', userStore.permissions?.permissions || [])

    // 检查具体权限
    console.log('jingying:yuedu 权限:', userStore.hasPermission('jingying:yuedu'))
    console.log('hr:read 权限:', userStore.hasPermission('hr:read'))
    console.log('flight:read 权限:', userStore.hasPermission('flight:read'))
    console.log('system:manage 权限:', userStore.isAdmin())
    console.log('========================')
})

</script>
<style lang="less" scoped>
@import "@/css/base.less";

.main-container {
    background-color: #f3f3f3;
    display: flex;
    flex-direction: column;

    &>.section {
        padding: @padding-page;
        border-radius: @radius-base;
        background-color: @color-block;
        margin: 5px @margin-page;
        box-sizing: border-box;
        box-shadow: @shadow-base;
    }

    &>.overview {
        // background-color: #f9f9f9;
        border-radius: @radius-base;
        margin: 0 @margin-page;
        // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        /* 添加渐变背景 */
        // background: linear-gradient(to bottom right, #c52005, #fa5430);
        background: linear-gradient(to bottom right, @color-primary, @color-secondary);

        .day {
            position: relative;
            padding-bottom: 10px;
            margin-bottom: 10px;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 10%;
                right: 10%;
                height: 2px;
                background-color: #f55b5b;
                /* 更浅的颜色 */
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
                /* 更浅的内阴影 */
            }
        }

        .year {
            margin-top: 2px;
        }
    }

    &>.duty {}

    &>.permission-section {
        .permission-card {
            display: flex;
            align-items: center;
            padding: 20px;
            background: white;
            border-radius: @radius-base;
            box-shadow: @shadow-base;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }

            .permission-icon {
                font-size: 32px;
                margin-right: 15px;
                color: @color-primary;
            }

            .permission-content {
                flex: 1;

                .permission-title {
                    margin: 0 0 5px 0;
                    color: @color-text;
                    font-size: 18px;
                }

                // p {
                //     margin: 0;
                //     color: #666;
                //     font-size: 14px;
                // }
            }

            .permission-arrow {
                font-size: 20px;
                color: #999;
                margin-left: 15px;
            }
        }
    }
}
</style>
