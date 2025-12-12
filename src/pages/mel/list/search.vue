<template>
  <div class="mel-search-page">
    <!-- 搜索表单 -->
    <div class="search-form">
      <div class="form-section">
        <h3 class="section-title">基础信息</h3>
        <div class="form-item">
          <label class="form-label">DD单编号</label>
          <input 
            v-model="searchForm.ddfNo" 
            class="form-input" 
            placeholder="请输入DD单编号"
          />
        </div>
        <div class="form-item">
          <label class="form-label">MEL编号</label>
          <input 
            v-model="searchForm.melNo" 
            class="form-input" 
            placeholder="请输入MEL编号"
          />
        </div>
        <div class="form-item">
          <label class="form-label">飞机注册号</label>
          <input 
            v-model="searchForm.acReg" 
            class="form-input" 
            placeholder="请输入飞机注册号"
          />
        </div>
        <div class="form-item">
          <label class="form-label">机型</label>
          <input 
            v-model="searchForm.actype" 
            class="form-input" 
            placeholder="请输入机型"
          />
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">ATA章节</h3>
        <div class="form-row">
          <div class="form-item flex-1">
            <label class="form-label">主章节</label>
            <picker
              :value="getSelectedAtaIndex()"
              :range="ataChapters"
              range-key="name"
              @change="onAtaChange"
              class="form-picker"
            >
              <view class="picker-text">
                {{ getSelectedAtaText() || '请选择' }}
              </view>
            </picker>
          </div>
          <div class="form-item flex-1">
            <label class="form-label">子章节</label>
            <input
              v-model="searchForm.ata2"
              class="form-input"
              placeholder="请输入子章节"
            />
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">状态信息</h3>
        <div class="form-item">
          <label class="form-label">状态</label>
          <picker
            :value="getSelectedStatusIndex()"
            :range="statusOptions"
            @change="onStatusChange"
            class="form-picker"
          >
            <view class="picker-text">
              {{ searchForm.status || '请选择' }}
            </view>
          </picker>
        </div>
        <div class="form-item">
          <label class="form-label">数据来源</label>
          <picker
            :value="getSelectedSourceIndex()"
            :range="sourceOptions"
            range-key="name"
            @change="onSourceChange"
            class="form-picker"
          >
            <view class="picker-text">
              {{ getSelectedSourceText() || '全部' }}
            </view>
          </picker>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">时间范围</h3>
        <div class="form-row">
          <div class="form-item flex-1">
            <label class="form-label">开始日期</label>
            <input 
              v-model="searchForm.startDate" 
              type="date" 
              class="form-input"
            />
          </div>
          <div class="form-item flex-1">
            <label class="form-label">结束日期</label>
            <input 
              v-model="searchForm.endDate" 
              type="date" 
              class="form-input"
            />
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">故障描述</h3>
        <div class="form-item">
          <label class="form-label">关键词</label>
          <input 
            v-model="searchForm.keyword" 
            class="form-input" 
            placeholder="请输入故障描述关键词"
          />
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button @click="resetForm" class="reset-btn">重置</button>
      <button @click="performSearch" class="search-btn">搜索</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMelStore } from '@/store/mel.store';

const melStore = useMelStore();

// 搜索表单数据
const searchForm = ref({
  ddfNo: '',
  melNo: '',
  acReg: '',
  actype: '',
  ata1: '',
  ata2: '',
  status: '',
  source: '',
  startDate: '',
  endDate: '',
  keyword: ''
});

// ATA章节数据
const ataChapters = ref([
  { code: '21', name: '空调系统' },
  { code: '22', name: '自动飞行系统' },
  { code: '23', name: '通信系统' },
  { code: '24', name: '电源系统' },
  { code: '25', name: '内饰设备' },
  { code: '26', name: '防火系统' },
  { code: '27', name: '飞行操纵系统' },
  { code: '28', name: '燃油系统' },
  { code: '29', name: '液压系统' },
  { code: '30', name: '防冰/防雨系统' },
  { code: '31', name: '指示/记录系统' },
  { code: '32', name: '起落架系统' },
  { code: '33', name: '灯光系统' },
  { code: '34', name: '导航系统' },
  { code: '35', name: '氧气系统' },
  { code: '36', name: '气源系统' },
  { code: '38', name: '水/废水系统' },
  { code: '49', name: '辅助动力装置' },
  { code: '52', name: '舱门/窗户' },
  { code: '53', name: '机身系统' },
  { code: '57', name: '机翼系统' }
]);

// 状态选项
const statusOptions = ref([
  '待批准',
  '已批准',
  '进行中',
  '已完成',
  '已关闭'
]);

// 数据来源选项
const sourceOptions = ref([
  { value: '', name: '全部' },
  { value: 'base', name: '主基地' },
  { value: 'outstation', name: '外站' }
]);

// ATA章节选择处理
const getSelectedAtaIndex = () => {
  return ataChapters.value.findIndex(ata => ata.code === searchForm.value.ata1);
};

const getSelectedAtaText = () => {
  const selectedAta = ataChapters.value.find(ata => ata.code === searchForm.value.ata1);
  return selectedAta ? `${selectedAta.code} - ${selectedAta.name}` : '';
};

const onAtaChange = (e: any) => {
  const index = e.detail.value;
  searchForm.value.ata1 = ataChapters.value[index].code;
};

// 状态选择处理
const getSelectedStatusIndex = () => {
  return statusOptions.value.indexOf(searchForm.value.status);
};

const onStatusChange = (e: any) => {
  const index = e.detail.value;
  searchForm.value.status = statusOptions.value[index];
};

// 数据来源选择处理
const getSelectedSourceIndex = () => {
  return sourceOptions.value.findIndex(option => option.value === searchForm.value.source);
};

const getSelectedSourceText = () => {
  const selectedOption = sourceOptions.value.find(option => option.value === searchForm.value.source);
  return selectedOption ? selectedOption.name : '';
};

const onSourceChange = (e: any) => {
  const index = e.detail.value;
  searchForm.value.source = sourceOptions.value[index].value;
};

// 重置表单
const resetForm = () => {
  searchForm.value = {
    ddfNo: '',
    melNo: '',
    acReg: '',
    actype: '',
    ata1: '',
    ata2: '',
    status: '',
    source: '',
    startDate: '',
    endDate: '',
    keyword: ''
  };
};

// 执行搜索
const performSearch = () => {
  // 构建查询参数
  const queryParams: any = {};
  
  // 添加非空字段到查询参数
  Object.keys(searchForm.value).forEach(key => {
    const value = searchForm.value[key as keyof typeof searchForm.value];
    if (value) {
      queryParams[key] = value;
    }
  });
  
  // 跳转到搜索结果页面，并传递查询参数
  const queryString = Object.keys(queryParams)
    .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
    .join('&');
    
  uni.navigateTo({
    url: `/pages/mel/list/index?${queryString}`,
    success: () => {
      console.log('跳转到搜索结果页面成功');
    },
    fail: (err) => {
      console.error('跳转失败:', err);
      uni.showToast({
        title: '跳转失败',
        icon: 'none'
      });
    }
  });
};
</script>

<style lang="less" scoped>
.mel-search-page {
  padding: 16px;
  background: #f5f5f5;
  min-height: 100vh;
  
  .search-form {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    
    .form-section {
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .form-item {
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .form-label {
          display: block;
          font-size: 14px;
          color: #333;
          margin-bottom: 6px;
          font-weight: 500;
        }
        
        .form-input, .form-picker {
          width: 100%;
          height: 40px;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0 12px;
          font-size: 14px;
          background: white;
          
          &:focus {
            border-color: #137fec;
            outline: none;
          }
        }
        
        .form-picker {
          cursor: pointer;
          display: flex;
          align-items: center;
          
          .picker-text {
            color: #333;
            font-size: 14px;
          }
        }
      }
      
      .form-row {
        display: flex;
        gap: 12px;
        
        .flex-1 {
          flex: 1;
        }
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
    
    .reset-btn, .search-btn {
      flex: 1;
      height: 44px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.98);
      }
    }
    
    .reset-btn {
      background: #f8f9fa;
      color: #6c757d;
      border: 1px solid #dee2e6;
      
      &:active {
        background: #e9ecef;
      }
    }
    
    .search-btn {
      background: #137fec;
      color: white;
      
      &:active {
        background: #0e6bb8;
      }
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mel-search-page {
    padding: 12px;
    
    .search-form {
      padding: 12px;
      
      .form-section {
        .form-row {
          flex-direction: column;
          gap: 0;
        }
      }
    }
    
    .action-buttons {
      flex-direction: column;
      
      .reset-btn, .search-btn {
        width: 100%;
      }
    }
  }
}
</style>