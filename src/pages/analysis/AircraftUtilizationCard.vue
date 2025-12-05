<template>
  <div class="utilization-card">
    <h3 class="section-title">日利用率(7日/30日)</h3>
    <div class="utilization-content">
      <div class="utilization-item">
        <p class="utilization-label">近7日</p>
        <p class="utilization-value">{{ utilizationData.sevenDays }}h</p>
      </div>
      <div class="divider"></div>
      <div class="utilization-item">
        <p class="utilization-label">近30日</p>
        <p class="utilization-value">{{ utilizationData.thirtyDays }}h</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 模拟数据
const utilizationData = ref({
  sevenDays: 9.8,
  thirtyDays: 10.2
});

onMounted(() => {
  // 这里可以后续接入真实API
  console.log('飞机日利用率组件已加载');
});
</script>

<style lang="less" scoped>
.utilization-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #111418;
    margin-bottom: 12px;
  }

  .utilization-content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;

    .utilization-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .utilization-label {
        font-size: 12px;
        color: #617589;
        margin: 0;
      }

      .utilization-value {
        font-size: 24px;
        font-weight: bold;
        color: #137fec;
        margin: 0;
      }
    }

    .divider {
      width: 1px;
      height: 40px;
      background: #e0e0e0;
    }
  }
}
</style>