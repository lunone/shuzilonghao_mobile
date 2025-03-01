<template>
    <van-divider>电子记录</van-divider>
    <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
        这部分显示员工工作产生的电子记录
        <br>数据目前能接入：FOC,ME,SMS。 接入系统越多显示的越完整。
        <br>功能还没写，目前仅为演示
    </van-notice-bar>
    <div class="record">
        <div class="item">
            <text class="date">2024-10-16</text>
            <text class="content">完成了XXXX工作</text>
            <text class="src"></text>
        </div>
        <div class="item">
            <text class="date">2024-10-19</text>
            <text class="content">飞了GI1234航班</text>
            <text class="src"></text>
        </div>
        <div class="item">
            <text class="date">2024-10-19</text>
            <text class="content">提交了安全事件，事件内容：xxxxxxxxx</text>
            <text class="src"></text>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
</script>