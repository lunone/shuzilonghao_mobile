<template>
    <div class="login-wrapper">
        <div class="intro">
            hi~朋友:<br>
            本程序属于内部数据,需要小组人员身份才能访问,<br>
            进行访问要求身份绑定后才能使用,绑定只需要一次,后续你会自动跳过本界面.<br>
            如果你通过邀请链接绑定身份,本页会自动跳过.如果你能看到这段文字,说明你未从邀请链接进入<br>
            如果你拥有激活码,输入激活码,如果你没有激活码,既然你都看到这个程序了,你知道找谁申请的<br>
        </div>
        <div class="action">
            <input type="text" v-model="activationCode" placeholder="请输入激活码">
            <button @click="activate">激活</button>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';

const activate = () => {
    console.log('activate', activationCode.value);
};

const activationCode = ref('');
</script>

<style lang="less" scoped>
@primary-color: #FF0000; // 红色
@secondary-color: #FFFF00; // 黄色
@background-color: #f9f9f9;
@text-color: #333;

.info-wrapper {
    background-color: @background-color;
    color: @text-color;
    font-family: Arial, sans-serif;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 0 auto;
}

.intro {
    margin-bottom: 20px;

    .title {
        font-size: 24px;
        color: @primary-color;
        margin-bottom: 10px;
        text-align: center;
    }

    .section {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 15px;
        text-align: justify;
    }
}

.message {
    background-color: @secondary-color;
    color: @text-color;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.5;
}

.action {
    text-align: center;

    input[type="text"] {
        padding: 10px;
        width: 80%;
        max-width: 300px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 10px 20px;
        background-color: @primary-color;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;

        &:hover {
            background-color: darken(@primary-color, 10%);
        }
    }
}
</style>