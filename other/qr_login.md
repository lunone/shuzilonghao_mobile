# 移动端（微信小程序）扫码登录对接指南

本文档用于指导微信小程序前端开发人员，完成与后端扫码登录功能的对接。

## 场景描述

用户在桌面 Web 端看到一个登录二维码。当用户使用已登录的微信小程序扫描该二维码时，小程序会跳转到一个特定的授权页面。用户在该页面点击“确认登录”后，桌面 Web 端将自动完成登录。

## 核心流程

1.  **扫码跳转**：用户扫码后，小程序根据二维码携带的参数跳转到授权页面。
2.  **获取参数**：在授权页面的 `onLoad` 生命周期函数中，获取到二维码中包含的 `ticketId`。
3.  **发送确认**：用户点击“确认登录”按钮后，小程序携带自身的 **JWT Token** 和从二维码中获取的 `ticketId`，向后端发送一个确认请求。
4.  **处理结果**：根据后端的返回结果，向用户显示“授权成功”或“授权失败”的提示。

---

## 技术实现细节

### 1. 目标页面

后端生成的二维码中，预设的跳转页面路径为 `pages/auth/scan`。请确保小程序中存在此页面。

### 2. 获取 `ticketId`

在 `pages/auth/scan.js` 文件的 `onLoad` 方法中，可以从 `options.scene` 中获取到后端生成的 `ticketId`。

**示例代码 (`pages/auth/scan.js`):**

```javascript
Page({
  data: {
    ticketId: null,
    loading: false,
    error: ''
  },

  onLoad: function(options) {
    if (options.scene) {
      // scene 中直接就是 ticketId 字符串
      const scene = decodeURIComponent(options.scene);
      console.log('获取到的 ticketId:', scene);
      this.setData({
        ticketId: scene
      });
    } else {
      console.error('未在启动参数中找到 scene');
      this.setData({
        error: '无效的二维码'
      });
      // 建议提示用户后，自动返回上一页或首页
    }
  },

  // ...
});
```

### 3. 用户确认登录

页面上需要提供一个“确认登录”的按钮，并绑定一个点击事件处理函数，例如 `handleConfirmLogin`。

**示例代码 (`pages/auth/scan.wxml`):**

```xml
<view class="container">
  <view wx:if="{{!ticketId}}">
    <text>{{error}}</text>
  </view>
  <view wx:else>
    <image class="logo" src="/path/to/your/desktop_icon.png"></image>
    <text class="title">授权登录桌面应用</text>
    <button type="primary" bindtap="handleConfirmLogin" loading="{{loading}}">
      确认登录
    </button>
  </view>
</view>
```

### 4. 发送确认请求

在 `handleConfirmLogin` 方法中，调用 `wx.request` 向后端发送确认请求。

**核心要点**：

*   **接口地址**：`/qr-login/confirm`
*   **请求方法**：`POST`
*   **请求头 (Header)**：必须包含 `Authorization` 字段，其值为小程序当前的有效 JWT Token。
*   **请求体 (Body)**：包含从 `scene` 中获取的 `ticketId`。

**示例代码 (`pages/auth/scan.js`):**

```javascript
// ... (接上面的 onLoad)

  handleConfirmLogin: function() {
    if (!this.data.ticketId) {
      wx.showToast({ title: '无效的操作', icon: 'none' });
      return;
    }

    // 从全局存储或状态管理中获取当前用户的 JWT Token
    const token = wx.getStorageSync('token'); 
    if (!token) {
      wx.showToast({ title: '登录状态失效，请重新登录', icon: 'none' });
      // 引导用户重新登录
      return;
    }

    this.setData({ loading: true });

    wx.request({
      url: 'https://您的后端地址/qr-login/confirm',
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}` // 携带JWT Token
      },
      data: {
        ticketId: this.data.ticketId
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          wx.showToast({
            title: '授权成功！',
            icon: 'success',
            duration: 2000,
            complete: () => {
              // 授权成功后，可以关闭当前页面或跳转到小程序首页
              setTimeout(() => {
                wx.navigateBack(); // 或 wx.switchTab({ url: '/pages/index/index' })
              }, 2000);
            }
          });
        } else {
          // 处理后端返回的错误信息
          this.setData({ error: res.data.message || '授权失败' });
          wx.showToast({ title: res.data.message || '授权失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('确认登录请求失败', err);
        wx.showToast({ title: '网络错误，请稍后再试', icon: 'none' });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  }
```

---

## 总结

移动端的核心任务就是**获取二维码中的 `ticketId`**，然后**携带自己的 `Token`** 将这个 `ticketId` 发送给后端完成确认。整个流程中，小程序端不关心桌面端的状态，只需完成确认操作即可。