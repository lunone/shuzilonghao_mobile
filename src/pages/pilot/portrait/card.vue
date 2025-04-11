<template>
    <div class="portrait-wrapper">
        <!-- 头部信息 -->
        <div class="header">
            <div class="avatar-container">
                <!-- <img src="https://placehold.co/80x120" alt="用户头像" class="avatar"> -->
                <div class="avatar">照片</div>
            </div>
            <div class="details">
                <h3 class="name">{{ pilot.name }}</h3>
                <div class="contact">
                    <span class="phone" @click="call(pilot.phone)">
                        <uni-icons type="phone" size="16"></uni-icons>
                        {{ pilot.phone }}
                    </span>
                    <span class="mobile" v-if="pilot.phone != pilot.mobile" @click="call(pilot.mobile)">
                        <uni-icons type="mobile" size="16"></uni-icons>
                        {{ pilot.mobile }}
                    </span>
                </div>
                <div class="tech-levels">
                    <span v-for="tech in techs" :key="tech.acType + tech.techName" class="tech-badge">
                        {{ tech.acType }}/{{ tech.techName }}
                    </span>
                </div>
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
    padding: 16px;
    // background: linear-gradient(135deg, #f6faff 0%, #e6f0ff 100%);
    // box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
    // border-radius: 4px;
    margin-bottom: 16px;
    // border: 1px solid rgba(24, 144, 255, 0.1);

    .avatar-container {
        margin-right: 30px;

        .avatar {
            width: 80px;
            height: 120px;
            border-radius: 4px;
            border: 1px solid #f0f0f0;
            color: #7a2112;
        }
    }

    .details {
        flex: 1;

        .name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #000;
            padding-left: 8px;
            border-left: 3px solid #000;
        }

        .contact {
            display: flex;
            gap: 16px;
            margin-bottom: 12px;

            span {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 14px;
                color: #666;
                cursor: pointer;

                &:hover {
                    color: #1890ff;
                }
            }
        }

        .tech-levels {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .tech-badge {
                padding: 4px 8px;
                background: #444;
                color: #fff;
                font-size: 12px;
                border-radius: 2px;
            }
        }
    }
}
</style>
