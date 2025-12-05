<template>
  <div class="mel-retention-card">
    <h3 class="section-title">MEL保留单列表</h3>
    <div class="mel-list" v-if="melData.length > 0">
      <div v-for="mel in melData" :key="mel.id" class="mel-item">
        <div class="mel-header">
          <span class="mel-id">{{ mel.melCode }}</span>
          <span class="mel-category">{{ mel.category }}</span>
        </div>
        <div class="mel-dates">
          <span class="rectification-date">{{ mel.rectificationDate ? dayjs(mel.rectificationDate).format('YYYY-MM-DD') : '未设置' }}</span>
          <span class="status">{{ mel.status }}</span>
        </div>
        <div class="mel-flags">
          <span class="deferral-class">{{ mel.deferralClass }} 类</span>
        </div>
        <div class="mel-content">{{ mel.description }}</div>
        <div class="mel-times">
          <small>创建时间: {{ dayjs(mel.createdAt).format('YYYY-MM-DD HH:mm') }}</small>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      <p>暂无MEL保留单数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getMels, MelItem } from '@/api/aircraft.api';
import dayjs from 'dayjs';

const props = defineProps<{
  acReg?: string;
}>();

const melData = ref<MelItem[]>([]);
const loading = ref(false);
const error = ref('');

const fetchMelData = async () => {
  if (!props.acReg) return;
  
  try {
    loading.value = true;
    const res = await getMels({ 
      startDate: dayjs().format('YYYY-MM-DD'), 
      endDate: dayjs().format('YYYY-MM-DD') 
    }) as MelItem[];
    
    // 筛选当前飞机的MEL数据
    melData.value = res.filter(mel => mel.acReg === props.acReg);
  } catch (err) {
    error.value = '获取MEL数据失败';
    console.error('获取MEL数据失败:', err);
  } finally {
    loading.value = false;
  }
};

// 监听acReg变化
watch(() => props.acReg, () => {
  if (props.acReg) {
    fetchMelData();
  }
}, { immediate: true });

onMounted(() => {
  if (props.acReg) {
    fetchMelData();
  }
});
</script>

<style lang="less" scoped>
.mel-retention-card {
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

  .mel-list {
    .mel-item {
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .mel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .mel-id {
          font-weight: bold;
          color: #111418;
          font-size: 14px;
        }

        .mel-category {
          color: #666;
          font-size: 12px;
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 4px;
        }
      }

      .mel-dates {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .rectification-date,
        .status {
          font-size: 12px;
          color: #777;
        }

        .status {
          font-weight: 500;
          color: #137fec;
        }
      }

      .mel-flags {
        margin-bottom: 8px;

        .deferral-class {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }
      }

      .mel-content {
        font-size: 13px;
        color: #333;
        margin-bottom: 6px;
        line-height: 1.4;
      }

      .mel-times {
        small {
          font-size: 11px;
          color: #999;
        }
      }
    }
  }

  .no-data {
    padding: 20px;
    text-align: center;
    color: #999;

    p {
      margin: 0;
      font-size: 14px;
    }
  }
}
</style>