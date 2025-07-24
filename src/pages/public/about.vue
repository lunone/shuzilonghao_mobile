<template>
    <div class="intro-wrapper">
        <!-- <div class="title">
            中原龙浩航空有限公司
        </div> -->
        <div class="section company">
            <text
                class="name">中原龙浩航空有限公司</text>位于郑州航空港经济综合实验区，主营国内外航空货运业务，是河南民航发展投资有限公司控股子公司，注册资本20.14亿人民币，经营国内外航空货物运输业务。
        </div>
        <div class="section">
            国际、国内（含港澳台）航空货邮运输业务：飞机维护、飞机供给、机场候机厅管理服务、航空运输货物打包服务、装卸搬运、道路货物运输代理、国际货运代理、货物检验代理服务等。
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';

// onLoad(() => {
//     uni.setNavigationBarTitle({
//         title: '关于龙浩'
//     })
// })
</script>

<style lang="less" scoped>
@primary-color: #007bff; // 蓝色
@secondary-color: #6c757d; // 灰色
@background-color: #f8f9fa;
@text-color: #495057;

.intro-wrapper {
    text-align: center;
    margin: 0;
    color: @text-color;
    background: url('https://app.airlonghao.com/logo.jpg');
    background-repeat: no-repeat;
    background-position: top left;
    /* 靠顶部靠左 */
    background-size: 100% auto;
    /* 横向适应屏幕大小，竖向按比例缩放 */
    padding-top: 100px;

    .title {
        font-size: 22px;
        color: @primary-color;
        margin: 0 20px;

    }

    .section {
        margin: 10px;
        text-align: justify;
    }

    .company {
        .name {
            font-weight: bold;
        }
    }
}
</style>
