<template>
  <div class="mel-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
      </div>
      <p class="loading-message">加载中...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <uni-icons type="error" size="48" color="#ff4757" />
      <p class="error-message">{{ error }}</p>
      <button @click="fetchDetail" class="retry-btn">重试</button>
    </div>
    
    <!-- MEL详情内容 -->
    <div v-else-if="melDetail" class="mel-detail-content">
      <!-- 数据来源标识 -->
      <div class="source-indicator" :class="getSourceClass(melDetail.source)">
        <uni-icons :type="getSourceIcon(melDetail.source)" size="16" />
        <span>{{ getSourceText(melDetail.source) }}</span>
      </div>
      
      <!-- 基础信息卡片 -->
      <div class="info-card">
        <h3 class="card-title">基础信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">DD单编号</span>
            <span class="value">{{ getFieldValue('DDF_NO', 'ddfNo') }}</span>
          </div>
          <div class="info-item">
            <span class="label">MEL编号</span>
            <span class="value">{{ getFieldValue('BLBS_NO', 'melNo') }}</span>
          </div>
          <div class="info-item">
            <span class="label">飞机注册号</span>
            <span class="value">{{ getFieldValue('ACNO', 'acReg') }}</span>
          </div>
          <div class="info-item">
            <span class="label">机型</span>
            <span class="value">{{ getFieldValue('ACTYPE', 'actype') }}</span>
          </div>
          <div class="info-item">
            <span class="label">ATA章节</span>
            <span class="value">{{ getFieldValue('ATA1', 'ata1') }}{{ getFieldValue('ATA2', 'ata2') ? '-' + getFieldValue('ATA2', 'ata2') : '' }}</span>
          </div>
          <div class="info-item">
            <span class="label">状态</span>
            <MelStatusBadge :status="getFieldValue('STATUS', 'status')" />
          </div>
        </div>
      </div>
      
      <!-- 故障描述卡片 -->
      <div class="info-card">
        <h3 class="card-title">故障描述</h3>
        <div class="description-content">
          <p>{{ getFieldValue('FAUREP', 'des') }}</p>
          <p v-if="melDetail.source === 'base' && getFieldValue('FAUREP_EN')" class="english-desc">
            {{ getFieldValue('FAUREP_EN', '') }}
          </p>
        </div>
      </div>
      
      <!-- 主基地特有信息 -->
      <div v-if="melDetail.source === 'base'" class="base-specific-info">
        <!-- 保留信息 -->
        <div class="info-card">
          <h3 class="card-title">保留信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">保留类型</span>
              <span class="value">{{ (melDetail.fullEntity as any).BLTYP || (melDetail.fullEntity as any).deffer }}</span>
            </div>
            <div class="info-item">
              <span class="label">保留依据</span>
              <span class="value">{{ (melDetail.fullEntity as any).BLBS || (melDetail.fullEntity as any).blbs }}</span>
            </div>
            <div class="info-item">
              <span class="label">保留原因</span>
              <span class="value">{{ (melDetail.fullEntity as any).BLREA || (melDetail.fullEntity as any).blrea }}</span>
            </div>
            <div class="info-item">
              <span class="label">保留日期</span>
              <span class="value">{{ formatDate((melDetail.fullEntity as any).APPLY_DATE || (melDetail.fullEntity as any).applyDate) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 修复期限 -->
        <div class="info-card">
          <h3 class="card-title">修复期限</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">修复期限(日历日)</span>
              <span class="value">{{ (melDetail.fullEntity as any).DYD || (melDetail.fullEntity as any).dyd }}</span>
            </div>
            <div class="info-item">
              <span class="label">修复期限(FH)</span>
              <span class="value">{{ (melDetail.fullEntity as any).FH || (melDetail.fullEntity as any).fh }}</span>
            </div>
            <div class="info-item">
              <span class="label">修复期限(FC)</span>
              <span class="value">{{ (melDetail.fullEntity as any).FC || (melDetail.fullEntity as any).fc }}</span>
            </div>
            <div class="info-item">
              <span class="label">修复期限(飞行日)</span>
              <span class="value">{{ (melDetail.fullEntity as any).FLD || (melDetail.fullEntity as any).fld }}</span>
            </div>
          </div>
        </div>
        
        <!-- 人员信息 -->
        <div class="info-card">
          <h3 class="card-title">人员信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">录入人</span>
              <span class="value">{{ (melDetail.fullEntity as any).INPUTTER_NAME || (melDetail.fullEntity as any).inputter }}</span>
            </div>
            <div class="info-item">
              <span class="label">录入日期</span>
              <span class="value">{{ formatDateTime((melDetail.fullEntity as any).INPUTTER_DATE || (melDetail.fullEntity as any).inputterDate) }}</span>
            </div>
            <div class="info-item">
              <span class="label">批准人</span>
              <span class="value">{{ (melDetail.fullEntity as any).APPROVE_NAME || (melDetail.fullEntity as any).approver }}</span>
            </div>
            <div class="info-item">
              <span class="label">批准日期</span>
              <span class="value">{{ formatDate((melDetail.fullEntity as any).APPROVE_DATE || (melDetail.fullEntity as any).approveDate) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 外站特有信息 -->
      <div v-else-if="melDetail.source === 'outstation'" class="outstation-specific-info">
        <!-- 外站基础信息 -->
        <div class="info-card">
          <h3 class="card-title">外站信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">航站</span>
              <span class="value">{{ (melDetail.fullEntity as any).flightSite }}</span>
            </div>
            <div class="info-item">
              <span class="label">座位号</span>
              <span class="value">{{ (melDetail.fullEntity as any).seatNo }}</span>
            </div>
            <div class="info-item">
              <span class="label">是否有运行限制</span>
              <span class="value">{{ (melDetail.fullEntity as any).ifLimit }}</span>
            </div>
            <div class="info-item">
              <span class="label">纠正措施</span>
              <span class="value">{{ (melDetail.fullEntity as any).corrAction }}</span>
            </div>
          </div>
        </div>
        
        <!-- 外站人员信息 -->
        <div class="info-card">
          <h3 class="card-title">人员信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">录入人</span>
              <span class="value">{{ (melDetail.fullEntity as any).inputter }}</span>
            </div>
            <div class="info-item">
              <span class="label">录入日期</span>
              <span class="value">{{ formatDateTime((melDetail.fullEntity as any).inputterDate) }}</span>
            </div>
            <div class="info-item">
              <span class="label">申请日期</span>
              <span class="value">{{ formatDate((melDetail.fullEntity as any).applyDate) }}</span>
            </div>
            <div class="info-item">
              <span class="label">修改人</span>
              <span class="value">{{ (melDetail.fullEntity as any).modifyBy }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 备注信息 -->
      <div v-if="getNoteContent()" class="info-card">
        <h3 class="card-title">备注信息</h3>
        <div class="note-content">
          <p>{{ getNoteContent() }}</p>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button @click="printMel" class="action-btn">
          <uni-icons type="print" size="16" />
          打印
        </button>
        <button @click="shareMel" class="action-btn">
          <uni-icons type="redo" size="16" />
          分享
        </button>
        <button @click="exportMel" class="action-btn">
          <uni-icons type="download" size="16" />
          导出
        </button>
      </div>
    </div>
    
    <!-- 空数据状态 -->
    <div v-else class="no-data">
      <uni-icons type="info" size="48" color="#ccc" />
      <p>暂无MEL详情数据</p>
      <button @click="fetchDetail" class="refresh-btn">刷新数据</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMelStore } from '@/store/mel.store';
import type { MelDetailResponse } from '@/types/mel';
import MelStatusBadge from '@/components/mel/common/MelStatusBadge.vue';
import dayjs from 'dayjs';

// 获取页面参数
const props = defineProps<{
  id: string;
  source?: string;
}>();

// 将字符串ID转换为数字
const melId = ref<number>(0);
const melSource = ref<string>('');

// 从URL参数中获取ID和source
onMounted(() => {
  console.log('MEL详情页面加载，获取参数...');
  
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  console.log('当前页面:', currentPage);
  
  if (currentPage && 'options' in currentPage) {
    const options = (currentPage as any).options;
    console.log('页面参数:', options);
    
    if (options) {
      melId.value = parseInt(options.id) || 0;
      melSource.value = options.source || '';
      console.log('解析的ID:', melId.value, 'Source:', melSource.value);
    }
  }
  
  // 获取参数后立即获取详情
  fetchDetail();
});

const melStore = useMelStore();
const loading = ref(false);
const error = ref<string | null>(null);
const melDetail = ref<MelDetailResponse | null>(null);

// 获取MEL详情
const fetchDetail = async () => {
  console.log('fetchDetail被调用，ID:', melId.value, 'Source:', melSource.value);
  
  if (!melId.value) {
    error.value = '缺少MEL记录ID';
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    console.log('调用melStore.fetchDetail，参数:', melId.value, melSource.value);
    const result = await melStore.fetchDetail(melId.value, melSource.value || undefined);
    console.log('获取到的MEL详情:', result);
    melDetail.value = result;
  } catch (err: any) {
    console.error('获取MEL详情失败:', err);
    error.value = err.message || '获取MEL详情失败';
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formatDate = (date?: string) => {
  if (!date) return '未设置';
  return dayjs(date).format('YYYY-MM-DD');
};

// 格式化日期时间
const formatDateTime = (date?: string) => {
  if (!date) return '未设置';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

// 获取数据来源样式类
const getSourceClass = (source: string) => {
  return source === 'base' ? 'source-base' : 'source-outstation';
};

// 获取数据来源图标
const getSourceIcon = (source: string) => {
  return source === 'base' ? 'home' : 'location';
};

// 获取数据来源文本
const getSourceText = (source: string) => {
  return source === 'base' ? '主基地数据' : '外站数据';
};

// 获取字段值的辅助函数，优先使用大写字段名，回退到小写字段名
const getFieldValue = (upperField: string, lowerField?: string) => {
  if (!melDetail.value) return '';
  
  const entity = melDetail.value.fullEntity as any;
  
  // 优先返回大写字段名
  if (entity[upperField] !== undefined && entity[upperField] !== null) {
    return entity[upperField];
  }
  
  // 回退到小写字段名
  if (lowerField && entity[lowerField] !== undefined && entity[lowerField] !== null) {
    return entity[lowerField];
  }
  
  return '';
};

// 获取备注内容
const getNoteContent = () => {
  if (!melDetail.value) return '';
  
  const entity = melDetail.value.fullEntity;
  
  if (melDetail.value.source === 'base') {
    const baseEntity = entity as any;
    return baseEntity.NOTE || baseEntity.NOTES || baseEntity.LS_MEMO || baseEntity.SG_MEMO || baseEntity.TS_MEMO ||
           baseEntity.note || baseEntity.notes || baseEntity.lsMemo || baseEntity.sgMemo || baseEntity.tsMemo;
  } else {
    const outstationEntity = entity as any;
    return ''; // 外站数据中没有备注字段
  }
};

// 操作方法
const printMel = () => {
  // 实现打印功能
  window.print();
};

const shareMel = () => {
  // 实现分享功能
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    href: `${window.location.origin}/pages/mel/detail/index?id=${melId.value}`,
    title: `MEL详情 - ${getFieldValue('BLBS_NO', 'melNo')}`,
    summary: getFieldValue('FAUREP', 'des'),
    imageUrl: '',
    success: function () {
      console.log('分享成功');
    },
    fail: function () {
      console.log('分享失败');
    }
  });
};

const exportMel = () => {
  // 实现导出功能
  const data = melDetail.value?.fullEntity;
  const jsonString = JSON.stringify(data, null, 2);
  
  uni.downloadFile({
    url: `data:text/json;charset=utf-8,${encodeURIComponent(jsonString)}`,
    fileName: `MEL_${getFieldValue('BLBS_NO', 'melNo')}.json`
  });
};
</script>

<style lang="less" scoped>
.mel-detail-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 8px;
}

.loading-state, .error-state, .no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  .loading-spinner {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
    justify-content: center;
    
    .spinner-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #777;
      animation: loading-bounce 1.4s infinite ease-in-out both;
      
      &:nth-child(1) {
        animation-delay: -0.32s;
      }
      
      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }
  
  .loading-message {
    font-size: 14px;
    color: #777;
    margin: 0;
  }
  
  .error-message {
    color: #ff4757;
    margin: 12px 0;
    font-size: 16px;
  }
  
  .retry-btn, .refresh-btn {
    background: #137fec;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    margin-top: 16px;
    font-size: 14px;
  }
}

.mel-detail-content {
  .source-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
    
    &.source-base {
      background: #e8f5e8;
      color: #27ae60;
    }
    
    &.source-outstation {
      background: #e8f4f8;
      color: #3498db;
    }
  }
  
  .info-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    .card-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      
      .info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        .label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }
        
        .value {
          font-size: 14px;
          color: #333;
          word-break: break-all;
        }
      }
    }
    
    .description-content, .note-content {
      p {
        font-size: 14px;
        color: #333;
        line-height: 1.6;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      .english-desc {
        font-style: italic;
        color: #666;
        padding-top: 8px;
        border-top: 1px dashed #e0e0e0;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-around;
    gap: 12px;
    margin: 16px 0;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 12px;
      color: #6c757d;
      
      &:active {
        background: #e9ecef;
      }
    }
  }
}

@keyframes loading-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@media (max-width: 480px) {
  .mel-detail-content {
    .info-card {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .action-buttons {
      flex-wrap: wrap;
      
      .action-btn {
        flex: 1;
        min-width: 80px;
      }
    }
  }
}
</style>