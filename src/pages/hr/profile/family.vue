<template>
    <view class="emergency-contacts">
        <view class="emergency-title">紧急联系人</view>
        <!-- <view class="contact" v-for="(contact, index) in employee.emergencyContacts" :key="index">
                        <view class="contact-name">姓名：{{ contact.name }}</view>
                        <view class="contact-relationship">关系：{{ contact.relationship }}</view>
                        <view class="contact-address">住址：{{ contact.address }}</view>
                        <view class="contact-workplace">工作单位：{{ contact.workplace }}</view>
                    </view> -->
    </view>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
</script>