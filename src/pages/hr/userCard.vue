<template>
    <view class="user-card" @click="toggleProfile">
        <view class="user-info">
            <slot name="icon" v-if="showIcon">
                <i class="icon zl-icon zl-icon-user" :class="genderClass" />
            </slot>
            <slot name="name">
                <text class="name">{{ userName }}</text>
            </slot>
            <slot name="userId" v-if="showId">
                <text class="user-id">{{ userId }}</text>
            </slot>
        </view>
        <!-- 	<view class="user-details" v-if="showInfo && showProfile">
			<slot>
				<van-action-sheet v-if="!isLink" v-model:show="" title="员工档案">
					<Profile :userId="userId" />
				</van-action-sheet>
			</slot>
		</view> -->
        <actionSheet v-model="showProfile">
            <Profile :userId="userId" v-if="showProfile" />
        </actionSheet>

    </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, Ref } from 'vue';
import Profile from '@/pages/hr/profile.vue';
import { User } from '@/interface';
import { useStore } from '@/store';
import actionSheet from '@/components/actionSheet.vue';
const store = useStore();
const props = defineProps({
    name: { type: String, default: '' },
    userId: { type: String, required: true },
    showIcon: { type: Boolean, default: true },
    showId: { type: Boolean, default: false },
    showInfo: { type: Boolean, default: true },
    isLink: { type: Boolean, default: false },
    gender: { type: Number, default: 2 },
});

const users: Ref<Record<string, User>> = ref({});
const userName = ref(props.name);
// const gender = ref(props.gender); 

onMounted(() => {
    if (props.userId && users.value[props.userId]) {
        userName.value = users.value[props.userId].name || '';
        // gender.value = users.value[props.userId].gender || 2;
    }
});

// const userIcon = computed(() => `user-${gender.value}`);
const genderClass = computed(() => {
    if (props.gender === 0) return 'woman';
    if (props.gender === 1) return 'man';
    return '';
});


const showProfile = ref(false);
// 从store获取信息
const fetchUsers = async () => {
    // loading.value = true;
    // error.value = '';
    try {
        const res = await store.useUsers();
        users.value = res;
    } catch (err) {
        // error.value = '获取飞机信息失败';
    } finally {
        // loading.value = false;
    }
};
const toggleProfile = () => {
    if (!props.isLink) {
        showProfile.value = !showProfile.value;
    } else {
        // router.push(`/user/${props.userId}`);
    }
};


onMounted(() => {
    fetchUsers();
    // console.log(message);
});
</script>

<style lang="less" scoped>
@import "@/base.less";



.user-info {
    display: inline-block;
    white-space: nowrap;
    border-bottom: dotted 1px #ddd;

    .icon {
        &.woman {
            color: #ff69b4; // 粉色表示女性
        }

        &.man {
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