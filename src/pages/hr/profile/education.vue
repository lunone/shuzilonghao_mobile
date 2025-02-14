<template>
    <van-notice-bar wrapable :scrollable="false" left-icon="info-o">
        这部分数据在 人力 未上网
    </van-notice-bar>
  
    <view class="education-title">学历</view>
    <view class="graduation-school">毕业院校：{{ }}</view>
    <!-- <view class="education-experience">
                        <view class="education-item" v-for="(edu, index) in employee.education.experience" :key="index">
                            <view class="education-period">{{ edu.startDate }} - {{ edu.endDate }}</view>
                            <view class="education-school">{{ edu.school }}</view>
                            <view class="education-nature">{{ edu.nature }}</view>
                        </view>
                    </view> -->
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
</script>