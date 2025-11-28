<template>
  <div class="main-container">
    <div class="profile-header">
      <div class="avatar">
        <image :src="userStore.me?.avatar || '/static/default-avatar.png'" class="avatar-img" />
      </div>
      <div class="user-info">
        <div class="username">{{ userStore.me?.name || '未知用户' }}</div>
        <div class="user-role">{{ getRoleText() }}</div>
      </div>
    </div>

    <div class="menu-section">
      <div class="menu-item" @click="goToProfile">
        <div class="menu-icon">👤</div>
        <div class="menu-text">个人资料</div>
        <div class="menu-arrow">></div>
      </div>

      <div class="menu-item" @click="handleScanCode">
        <div class="menu-icon">📷</div>
        <div class="menu-text">扫一扫</div>
        <div class="menu-arrow">></div>
      </div>
      
      <div class="menu-item" @click="goToSettings">
        <div class="menu-icon">⚙️</div>
        <div class="menu-text">设置</div>
        <div class="menu-arrow">></div>
      </div>

      <div v-if="userStore.isAdmin()" class="menu-item" @click="goToPermissionManage">
        <div class="menu-icon">🔐</div>
        <div class="menu-text">权限管理</div>
        <div class="menu-arrow">></div>
      </div>

      <div class="menu-item" @click="logout">
        <div class="menu-icon">🚪</div>
        <div class="menu-text">退出登录</div>
        <div class="menu-arrow">></div>
      </div>
    </div>
  </div>
  <!-- 引入 custom-tab-bar 组件 -->
  <CustomTabBar />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user.store'
// 引入 custom-tab-bar 组件
import CustomTabBar from '@/components/zl/tabbar.vue';

// 使用 userStore
const userStore = useUserStore()

// 获取角色文本
const getRoleText = () => {
  const permissions = userStore.permissions
  if (!permissions || permissions.length === 0) return '未分配角色'
  
  const roleMap: Record<string, string> = {
    'admin': '管理员',
    'manager': '管理者',
    'staff': '员工',
    'pilot': '飞行员',
    'agent': '供应商'
  }
  
  // 从权限中提取角色信息
  const roles = permissions.filter(perm => Object.keys(roleMap).includes(perm))
  
  if (roles.length === 0) {
    // 如果没有找到角色，显示用户类型
    return userStore.me?.type || '用户'
  }
  
  return roles.map(role => roleMap[role] || role).join('、')
}

// 扫码
const handleScanCode = () => {
  uni.scanCode({
    onlyFromCamera: true,
    success: (res) => {
      console.log('扫码成功：', res);
      // 微信小程序码, res.path 是解码后的地址, e.g., pages/auth/scan?scene=xxx
      // 普通二维码, res.result 是二维码内容, e.g., https://example.com?scene=xxx
      const scanResult = res.path || res.result;
      let ticketId = null;

      if (scanResult) {
        const sceneReg = /[?&]scene=([^&]+)/;
        const match = scanResult.match(sceneReg);
        if (match) {
          ticketId = match;
        }
      }

      if (ticketId) {
        uni.navigateTo({
          url: `/pages/auth/scan?scene=${encodeURIComponent(ticketId)}`,
        });
      } else {
        console.error('二维码内容解析失败: 未找到scene参数');
        uni.showToast({
          title: '无效的二维码',
          icon: 'none',
        });
      }
    },
    fail: (err) => {
      console.error('扫码失败：', err);
      uni.showToast({
        title: '扫码失败',
        icon: 'none',
      });
    },
  });
};

// 跳转到个人资料
const goToProfile = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 跳转到设置
const goToSettings = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 跳转到权限管理
const goToPermissionManage = () => {
  uni.navigateTo({
    url: '/pages/role/manage'
  })
}

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除用户信息
        userStore.$reset()
        // 跳转到首页
        uni.reLaunch({
          url: '/pages/index'
        })
      }
    }
  })
}

// 输出当前用户权限信息到控制台
onMounted(async () => {
  // 等待用户信息加载完
  await userStore.fetchMe()
})
</script>

<style lang="less" scoped>
@import "@/css/base.less";

.main-container {
  background-color: #f3f3f3;
  display: flex;
  flex-direction: column;
  padding-bottom: 120rpx; // 为tabbar留出空间
}

.profile-header {
  background: linear-gradient(to bottom right, @color-primary, @color-secondary);
  padding: 60rpx @margin-page 40rpx;
  display: flex;
  align-items: center;
  color: white;

  .avatar {
    margin-right: 30rpx;

    .avatar-img {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
    }
  }

  .user-info {
    flex: 1;

    .username {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .user-role {
      font-size: 28rpx;
      opacity: 0.8;
    }
  }
}

.menu-section {
  margin-top: 20rpx;
  background: white;
  border-radius: @radius-base;
  margin: 20rpx @margin-page;
  box-shadow: @shadow-base;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx @padding-page;
    border-bottom: 1rpx solid #f5f5f5;
    transition: background-color 0.2s;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background-color: #f9f9f9;
    }

    .menu-icon {
      font-size: 40rpx;
      margin-right: 30rpx;
      width: 40rpx;
      text-align: center;
    }

    .menu-text {
      flex: 1;
      font-size: 32rpx;
      color: @color-text;
    }

    .menu-arrow {
      font-size: 28rpx;
      color: #ccc;
    }
  }
}
</style>