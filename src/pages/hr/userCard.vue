<template>
    <div class="user-card" @click="toggleProfile">
        <div class="user-info">
            <slot name="icon" v-if="showIcon">
                <i class="icon zl-icon-user" :class="genderClass" />
            </slot>
            <slot name="name">
                <text class="name">{{ userName }}</text>
            </slot>
            <slot name="userId" v-if="showId">
                <text class="user-id">{{ userId }}</text>
            </slot>
        </div>
    </div>

    <press-action-sheet :show="showProfile" title="员工信息" @close="showProfile = false">
        <!-- 加个 v-if="showProfile"防止暗戳戳的渲染一堆 -->
        <Profile :userId="userId" v-if="showProfile" />
    </press-action-sheet>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, Ref, watch } from 'vue';
import Profile from '@/pages/hr/profile.vue';
import { UserItem } from '@/interface/flight.interface';
import { useUserStore } from '@/store/user.store';

const userStore = useUserStore();
const props = defineProps({
    userId: { type: String, require: true, default: '' },
    // error是如果系统内没有该用户的话的占位名
    error: { type: String, default: '' },
    showIcon: { type: Boolean, default: false },
    showId: { type: Boolean, default: false },
    showInfo: { type: Boolean, default: true },
    isLink: { type: Boolean, default: false },
    gender: { type: Number, default: 2 },
});

const user = ref({}) as Ref<UserItem>;
const userName = ref('');

const genderClass = computed(() => {
    if (props.gender === 0) return 'woman';
    if (props.gender === 1) return 'man';
    return '';
});

const showProfile = ref(false);
const toggleProfile = () => {
    if (!props.isLink) {
        if (user.value.userId) {
            showProfile.value = !showProfile.value;
        } else {
            uni.showToast({ title: `暂无${props.userId}信息`, icon: 'none' });
        }
    } else {
        // router.push(`/user/${props.userId}`);
    }
};


watch([() => props.userId, () => props.error, () => userStore.staffObj], async () => {
    // 订阅store.staff变化
    const users = userStore.staffObj;
    // 优先id的name,如果没有就是props.name,最后实在不行就是工号
    userName.value = users[props.userId]?.name || props.error || props.userId || '未知';
    if (users[props.userId]) {
        user.value = users[props.userId];
    }
}, { immediate: true, deep: true });

onMounted(() => {
    userStore.fetchStaff();
});
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.user-info {
    display: inline-block;
    white-space: nowrap;
    border-bottom: dotted 1px #ddd;

    .icon {
        .woman {
            color: #ff69b4; // 粉色表示女性
        }

        .man {
            color: #00bfff; // 天蓝色表示男性
        }
    }

    .name {
        // color: #333;
    }

    .user-id {
        // color: #999;
    }
}
</style>