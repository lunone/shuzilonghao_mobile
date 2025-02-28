<template>
    <div class="pilot-wrapper">
        <!-- <rankVue @showMore="showMore" class="rank"/> -->
        <div class="shorcut" v-if="showLink" >
            <div class="item" v-for="item, index in data" :key="index" @click="jump(index)">
                <i :class="`icon zl-icon-${item.class}`" />
                <view class="link"> {{ item.text }} </view>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref } from 'vue';
import rankVue from './rank.vue';
const showLink = ref(true);
const showMore = () => {
    console.log('showMore')
    showLink.value = !showLink.value;
};
const data = ref([
    { url: '/pages/pilot/rank', class: 'analysis', text: '生产排名' },
    { url: '/pages/pilot/portrait', class: 'health', text: '人员画像' },
    { url: '/pages/pilot/analysis', class: 'location', text: '技术分析' },
]) as Ref<{ url: string, class: string, text: string, error?: string }[]>;
function jump(index: number) {
    const { url, error } = data.value[index];
    if (!error) {
        uni.navigateTo({ url });
    } else {
        uni.showToast({ title: error, icon: 'none', mask: true, duration: 2000 })
    }
}
// 组件挂载时初始化
onMounted(() => { });
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.pilot-wrapper {
    .column;
    justify-content: flex-start;
    width: 100%;
    background-color: @color-pilot;

    // padding: 0 10px;
    .rank {
        width: 100%;
    }

    .shorcut {
        width: 100%;
        background-color: #fff;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        padding: 10px;

        .item {
            .row;
            background-color: antiquewhite;
            justify-content: start;
            box-sizing: border-box;
            border-radius: 16px;
            width: 100%;
            padding: 0 10px;
            height: 10vh;

            margin-bottom: 10px;

            &:first-child {
                margin-top: 10px;
            }

            .icon {
                margin-right: 10px;
                font-size: 2rem;
            }

            .link {
                font-size: 1.4rem;
            }
        }
    }



}
</style>