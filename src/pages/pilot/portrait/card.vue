<template>
    <div class="portrait-wrapper">
        <!-- 头部信息 -->
        <div class="header">
            <img src="https://placehold.co/80x120" alt="用户头像" class="avatar">
            <div class="details">
                <p>姓名: {{ pilot.name }}</p>
                <p class="phone">
                    <span @click="call(pilot.phone)">{{ pilot.phone }}</span>
                    <span @click="call(pilot.mobile)">{{ pilot.mobile }}</span>
                </p>
                <span v-for="tech in techs" :key="tech.acType + tech.techName">
                    {{ tech.acType }}/{{ tech.techName }}
                </span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { call } from '@/utils/tools';
import { usePilotStore } from '@/store/pilot.store';
const { getTech, fetchPilots } = usePilotStore();
const props = defineProps({
    // pcode: { type: String, required: true },
    pilot: { type: Object, required: true }
});
// 技术等级
const techs = computed(() => {
    if (!props?.pilot?.pcode) return;
    const techs = getTech(props?.pilot?.pcode, 'pcode');
    return techs || []
})

</script>
<style scoped lang="less">
.header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    .avatar {
        width: 80px;
        height: 80px;
        border-radius: 10px;
    }

    .details {
        p {
            margin: 3px 0;
            font-size: 0.9em;
        }

        span {
            display: block;
            margin: 3px 0;
            font-size: 0.85em;
        }
    }

    .phone {
        span {
            margin: 0 10px;
        }
    }
}
</style>