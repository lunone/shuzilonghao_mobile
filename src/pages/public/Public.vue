<template>
    <div class="info-wrapper">
        <div class="intro">
            <div class="title">
                中原龙浩航空有限公司
            </div>
            <div class="section">
                中原龙浩航空有限公司位于郑州航空港经济综合实验区，主营国内外航空货运业务，是河南民航发展投资有限公司控股子公司，注册资本20.14亿人民币，经营国内外航空货物运输业务。
            </div>
            <div class="section">
                国际、国内（含港澳台）航空货邮运输业务：飞机维护、飞机供给、机场候机厅管理服务、航空运输货物打包服务、装卸搬运、道路货物运输代理、国际货运代理、货物检验代理服务等。
            </div>
        </div>
        <activateVue  />
    </div>
</template>
<script lang="ts" setup>
import activateVue from './activate.vue';

// const unRegisted = ref(false);


</script>

<style lang="less" scoped>
@primary-color: #FF0000; // 红色
@secondary-color: #FFFF00; // 黄色
@background-color: #f9f9f9;
@text-color: #333;

.activation-container {
    background-color: @background-color;
    color: @text-color;
    font-family: Arial, sans-serif;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 50px auto;
    text-align: center;
}

.header {
    margin-bottom: 30px;

    h1 {
        font-size: 28px;
        color: @primary-color;
        margin-bottom: 10px;
    }

    p {
        font-size: 18px;
        line-height: 1.5;
    }
}

.message {
    background-color: @secondary-color;
    color: @text-color;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    font-size: 14px;
    line-height: 1.5;
    text-align: left;
}

.activation-form {
    input[type="text"] {
        padding: 12px;
        width: 80%;
        max-width: 300px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 16px;
    }

    button {
        padding: 12px 24px;
        background-color: @primary-color;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: darken(@primary-color, 10%);
        }
    }
}
</style>