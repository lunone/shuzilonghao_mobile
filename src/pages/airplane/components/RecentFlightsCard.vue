<template>
  <div class="recent-flights-card">
    <h3 class="section-title">近7天执飞航班列表</h3>
    <div class="flights-list">
      <div 
        v-for="flight in recentFlights" 
        :key="flight.id" 
        class="flight-item"
        @click="goToFlightDetail(flight)"
      >
        <div class="flight-info">
          <p class="flight-date">{{ flight.date }}</p>
          <p class="flight-route">{{ flight.route }}</p>
        </div>
        <div class="flight-duration">
          <p class="duration-label">执飞时长</p>
          <p class="duration-value">{{ flight.duration }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';

// 模拟数据
const recentFlights = ref([
  {
    id: 1,
    date: '12月03日',
    route: 'CA1831 PEK-SHA',
    duration: '2h 15m'
  },
  {
    id: 2,
    date: '12月02日', 
    route: 'CA1501 PEK-CTU',
    duration: '2h 40m'
  },
  {
    id: 3,
    date: '12月01日',
    route: 'MU5103 SHA-PEK', 
    duration: '2h 05m'
  },
  {
    id: 4,
    date: '11月30日',
    route: 'CZ3101 CAN-PEK',
    duration: '3h 10m'
  }
]);

onMounted(() => {
  // 这里可以后续接入真实API
  console.log('最近飞行航班组件已加载');
});

// 跳转到航班详情页
const goToFlightDetail = (flight: any) => {
  uni.navigateTo({
    url: `/pages/flight/detail?flightNumber=${flight.route.split(' ')[0]}&flightDate=${flight.date}&route=${flight.route}&duration=${flight.duration}`
  });
};
</script>

<style lang="less" scoped>
.recent-flights-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #111418;
    padding: 16px 16px 8px;
    margin: 0;
  }

  .flights-list {
    .flight-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background-color: #f5f5f5;
      }

      &:hover {
        background-color: #fafafa;
      }

      .flight-info {
        flex: 1;

        .flight-date {
          font-size: 12px;
          color: #617589;
          margin: 0 0 4px 0;
        }

        .flight-route {
          font-size: 14px;
          font-weight: 500;
          color: #111418;
          margin: 0;
        }
      }

      .flight-duration {
        text-align: right;

        .duration-label {
          font-size: 12px;
          color: #617589;
          margin: 0 0 4px 0;
        }

        .duration-value {
          font-size: 14px;
          font-weight: 500;
          color: #111418;
          margin: 0;
        }
      }
    }
  }
}
</style>