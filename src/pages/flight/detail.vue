<template>
  <div class="flight-detail-page">

    <div class="page-content">
      <!-- 航班基本信息卡片 -->
      <div class="flight-info-card">
        <div class="flight-header">
          <h2 class="flight-number">{{ flightData.flightNumber }}</h2>
          <p class="flight-route">{{ flightData.route }}</p>
          <p class="aircraft-info">{{ flightData.aircraftInfo }}</p>
        </div>
        <div class="flight-stats">
          <div class="stat-item">
            <span class="stat-label">登机口</span>
            <span class="stat-value">{{ flightData.gate }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">停机位</span>
            <span class="stat-value">{{ flightData.bay }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">状态</span>
            <span class="stat-value status-on-time">{{ flightData.status }}</span>
          </div>
        </div>
      </div>

      <!-- 时间戳信息 -->
      <div class="timestamps-card">
        <h3 class="section-title">时间信息</h3>
        <div class="timestamps-grid">
          <div class="timestamp-item">
            <p class="timestamp-label">计划起飞</p>
            <p class="timestamp-value">{{ flightData.times.std }}</p>
          </div>
          <div class="timestamp-item">
            <p class="timestamp-label">预计起飞</p>
            <p class="timestamp-value status-warning">{{ flightData.times.etd }}</p>
          </div>
          <div class="timestamp-item">
            <p class="timestamp-label">实际起飞</p>
            <p class="timestamp-value status-success">{{ flightData.times.atd }}</p>
          </div>
          <div class="timestamp-item">
            <p class="timestamp-label">计划到达</p>
            <p class="timestamp-value">{{ flightData.times.sta }}</p>
          </div>
          <div class="timestamp-item">
            <p class="timestamp-label">预计到达</p>
            <p class="timestamp-value status-warning">{{ flightData.times.eta }}</p>
          </div>
          <div class="timestamp-item">
            <p class="timestamp-label">实际到达</p>
            <p class="timestamp-value status-success">{{ flightData.times.ata }}</p>
          </div>
        </div>
        <div class="additional-times">
          <div class="time-pair">
            <span class="time-label">舱门关闭/开启</span>
            <span class="time-value">{{ flightData.times.doorClose }}/{{ flightData.times.doorOpen }}</span>
          </div>
          <div class="time-pair">
            <span class="time-label">滑行开始/结束</span>
            <span class="time-value">{{ flightData.times.blockOff }}/{{ flightData.times.blockOn }}</span>
          </div>
        </div>
      </div>

      <!-- 前后航班信息 -->
      <div class="flights-connection-card">
        <div class="connection-item">
          <div class="connection-info">
            <span class="connection-icon zl-icon-airplane"></span>
            <div class="connection-details">
              <p class="connection-type">前序航班</p>
              <p class="connection-flight">{{ flightData.precedingFlight }}</p>
            </div>
          </div>
          <span class="connection-arrow zl-icon-right"></span>
        </div>
        <div class="connection-item">
          <div class="connection-info">
            <span class="connection-icon zl-icon-airplane"></span>
            <div class="connection-details">
              <p class="connection-type">后续航班</p>
              <p class="connection-flight">{{ flightData.succeedingFlight }}</p>
            </div>
          </div>
          <span class="connection-arrow zl-icon-right"></span>
        </div>
      </div>

      <!-- 机组信息 -->
      <div class="crew-info-card">
        <h3 class="section-title">机组信息</h3>
        <div class="crew-list">
          <div v-for="crew in flightData.crew" :key="crew.id" class="crew-item">
            <div class="crew-avatar">
              <span class="zl-icon-person avatar-icon"></span>
            </div>
            <div class="crew-details">
              <p class="crew-name">{{ crew.name }}</p>
              <p class="crew-position">{{ crew.position }} · ID: {{ crew.id }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import dayjs from 'dayjs';

// Mock航班数据
const flightData = ref({
  flightNumber: 'CA1234',
  route: '北京首都(PEK) → 成都天府(TFU)',
  aircraftInfo: '机号：B-1234 · 机型：A321neo',
  gate: 'C32',
  bay: '214',
  status: '准点',
  times: {
    std: '08:00',
    etd: '08:15',
    atd: '08:10',
    sta: '10:30',
    eta: '10:45',
    ata: '10:40',
    doorClose: '07:55',
    doorOpen: '10:48',
    blockOff: '08:05',
    blockOn: '10:42'
  },
  precedingFlight: 'MU5678 (CTU → PEK)',
  succeedingFlight: 'CA4321 (TFU → CAN)',
  crew: [
    {
      id: '1001',
      name: '张机长',
      position: '机长',
      avatar: 'https://via.placeholder.com/40/137fec/ffffff?text=张'
    },
    {
      id: '1002',
      name: '李副驾驶',
      position: '副驾驶',
      avatar: 'https://via.placeholder.com/40/137fec/ffffff?text=李'
    },
    {
      id: '2001',
      name: '王乘务长',
      position: '乘务长',
      avatar: 'https://via.placeholder.com/40/137fec/ffffff?text=王'
    },
    {
      id: '2002',
      name: '赵乘务员',
      position: '乘务员',
      avatar: 'https://via.placeholder.com/40/137fec/ffffff?text=赵'
    }
  ]
});

// 页面加载
onLoad((options) => {
  // 这里可以后续接入真实API，通过options获取航班号
  console.log('航班详情页加载完成');
});
</script>

<style lang="less" scoped>
.flight-detail-page {
  min-height: 100vh;
  background-color: #f6f7f8;
  padding: 16px;

  .page-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .flight-info-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .flight-header {
      padding: 16px;
      border-bottom: 1px solid #e9ebec;

      .flight-number {
        font-size: 24px;
        font-weight: bold;
        color: #137fec;
        margin: 0 0 8px 0;
      }

      .flight-route {
        font-size: 16px;
        font-weight: 500;
        color: #111418;
        margin: 0 0 4px 0;
      }

      .aircraft-info {
        font-size: 14px;
        color: #617589;
        margin: 0;
      }
    }

    .flight-stats {
      display: flex;

      .stat-item {
        flex: 1;
        padding: 16px 12px;
        text-align: center;
        border-right: 1px solid #e9ebec;

        &:last-child {
          border-right: none;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          color: #617589;
          margin-bottom: 4px;
        }

        .stat-value {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #111418;

          &.status-on-time {
            color: #34C759;
          }
        }
      }
    }
  }

  .timestamps-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #111418;
      margin: 0 0 16px 0;
    }

    .timestamps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 16px;

      .timestamp-item {
        .timestamp-label {
          font-size: 12px;
          color: #617589;
          margin: 0 0 4px 0;
        }

        .timestamp-value {
          font-size: 16px;
          font-weight: 500;
          color: #111418;
          margin: 0;

          &.status-warning {
            color: #FF9500;
          }

          &.status-success {
            color: #34C759;
          }
        }
      }
    }

    .additional-times {
      padding-top: 16px;
      border-top: 1px solid #e9ebec;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .time-pair {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .time-label {
          font-size: 12px;
          color: #617589;
        }

        .time-value {
          font-size: 16px;
          font-weight: 500;
          color: #111418;
        }
      }
    }
  }

  .flights-connection-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .connection-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .connection-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .connection-icon {
          font-size: 20px;
          color: #137fec;
        }

        .connection-details {
          .connection-type {
            font-size: 12px;
            color: #617589;
            margin: 0 0 4px 0;
          }

          .connection-flight {
            font-size: 14px;
            font-weight: 500;
            color: #111418;
            margin: 0;
          }
        }
      }

      .connection-arrow {
        font-size: 16px;
        color: #617589;
      }

      .zl-icon-right {
        color: #617589;
      }
    }
  }

  .crew-info-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #111418;
      margin: 0 0 16px 0;
    }

    .crew-list {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .crew-item {
        display: flex;
        align-items: center;
        gap: 16px;

        .crew-avatar {
          .avatar-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #137fec;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }
        }

        .crew-details {
          flex: 1;

          .crew-name {
            font-size: 14px;
            font-weight: 500;
            color: #111418;
            margin: 0 0 4px 0;
          }

          .crew-position {
            font-size: 12px;
            color: #617589;
            margin: 0;
          }
        }
      }
    }
  }
}
</style>