# MEL 管理功能页面设计

## 概述

基于 MEL 模块架构，设计 MEL 管理功能相关的页面，提供 MEL 记录的创建、编辑、审批、关闭等管理功能。

## 页面结构

### 1. MEL 管理主页 (`/pages/mel/management/index.vue`)

#### 1.1 页面功能
- 提供 MEL 管理功能的导航入口
- 展示待处理的 MEL 记录统计
- 提供快速操作入口
- 支持管理权限控制

#### 1.2 页面布局
```
┌─────────────────────────────────────┐
│ 管理权限验证                        │
├─────────────────────────────────────┤
│ 待处理统计卡片                      │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │待批 │ │待修 │ │待关 │ │超期 │ │
│ │10   │ │5    │ │3    │ │2    │ │
│ └─────┘ └─────┘ └─────┘ └─────┘ │
├─────────────────────────────────────┤
│ 快速操作入口                        │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │创建 │ │审批 │ │维修 │ │关闭 │ │
│ │MEL  │ │MEL  │ │记录 │ │记录 │ │
│ └─────┘ └─────┘ └─────┘ └─────┘ │
├─────────────────────────────────────┤
│ 最近管理记录                        │
│ ┌─────────────────────────────────┐ │
│ │ MEL001 - 待批准 - 2023-01-01 │ │
│ │ MEL002 - 待维修 - 2023-01-02 │ │
│ │ MEL003 - 待关闭 - 2023-01-03 │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 管理功能导航                        │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │审批 │ │维修 │ │关闭 │ │续保 │ │
│ │管理 │ │管理 │ │管理 │ │管理 │ │
│ └─────┘ └─────┘ └─────┘ └─────┘ │
└─────────────────────────────────────┘
```

#### 1.3 组件结构
```vue
<template>
  <div class="mel-management-page">
    <!-- 权限验证 -->
    <div v-if="!hasManagementPermission" class="permission-denied">
      <uni-icons type="locked" size="48" color="#ff4757" />
      <p>您没有 MEL 管理权限</p>
      <button @click="requestPermission">申请权限</button>
    </div>
    
    <!-- 管理内容 -->
    <div v-else class="management-content">
      <!-- 待处理统计卡片 -->
      <div class="pending-stats">
        <StatsCard 
          v-for="stat in pendingStats"
          :key="stat.key"
          :title="stat.title"
          :value="stat.value"
          :icon="stat.icon"
          :color="stat.color"
          @click="navigateToPending(stat.type)"
        />
      </div>
      
      <!-- 快速操作入口 -->
      <div class="quick-actions">
        <div 
          v-for="action in quickActions"
          :key="action.key"
          class="action-item"
          @click="navigateToAction(action.path)"
        >
          <uni-icons :type="action.icon" size="24" />
          <span>{{ action.title }}</span>
        </div>
      </div>
      
      <!-- 最近管理记录 -->
      <div class="recent-records">
        <div class="section-header">
          <span>最近管理记录</span>
          <button @click="viewAllRecords">查看全部</button>
        </div>
        <div class="record-list">
          <div 
            v-for="record in recentRecords"
            :key="record.id"
            class="record-item"
            @click="navigateToRecord(record)"
          >
            <span class="mel-no">{{ record.melNo }}</span>
            <span class="action-type">{{ record.actionType }}</span>
            <span class="date">{{ formatDate(record.date) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 管理功能导航 -->
      <div class="management-nav">
        <div 
          v-for="nav in managementNav"
          :key="nav.key"
          class="nav-item"
          @click="navigateToManagement(nav.path)"
        >
          <uni-icons :type="nav.icon" size="24" />
          <span>{{ nav.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 2. MEL 创建页面 (`/pages/mel/management/create.vue`)

#### 2.1 页面功能
- 提供新 MEL 记录创建表单
- 支持主基地和外站数据创建
- 提供表单验证和保存
- 支持草稿保存

#### 2.2 页面布局
```
┌─────────────────────────────────────┐
│ 数据来源选择                        │
│ ○ 主基地数据  ○ 外站数据           │
├─────────────────────────────────────┤
│ 基础信息表单                        │
│ ┌─────────────────────────────────┐ │
│ │ 飞机注册号: [下拉选择]         │ │
│ │ 机型: [自动填充]               │ │
│ │ ATA章节: [选择器]              │ │
│ │ 故障描述: [文本域]              │ │
│ │ English Description: [文本域]   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 保留信息表单 (主基地)                │
│ ┌─────────────────────────────────┐ │
│ │ 保留类型: [下拉选择]           │ │
│ │ 保留依据: [文本域]              │ │
│ │ 保留原因: [文本域]              │ │
│ │ 保留日期: [日期选择]            │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 外站信息表单 (外站)                  │
│ ┌─────────────────────────────────┐ │
│ │ 航站: [下拉选择]             │ │
│ │ 座位号: [文本输入]            │ │
│ │ 是否有运行限制: [单选]         │ │
│ │ 纠正措施: [文本域]            │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 修复期限表单                        │
│ ┌─────────────────────────────────┐ │
│ │ 修复期限(日历日): [数字输入]   │ │
│ │ 修复期限(FH): [数字输入]       │ │
│ │ 修复期限(FC): [数字输入]       │ │
│ │ 修复期限(飞行日): [数字输入]   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 操作按钮                            │
│ [保存草稿] [预览] [提交] [取消]    │
└─────────────────────────────────────┘
```

#### 2.3 组件结构
```vue
<template>
  <div class="mel-create-page">
    <!-- 数据来源选择 -->
    <div class="source-selector">
      <div class="selector-title">数据来源</div>
      <radio-group @change="handleSourceChange">
        <label class="radio-item">
          <radio value="base" :checked="dataSource === 'base'" />
          <span>主基地数据</span>
        </label>
        <label class="radio-item">
          <radio value="outstation" :checked="dataSource === 'outstation'" />
          <span>外站数据</span>
        </label>
      </radio-group>
    </div>
    
    <!-- 创建表单 -->
    <uni-forms ref="createForm" :model="formData" :rules="formRules">
      <!-- 基础信息 -->
      <uni-section title="基础信息" type="line">
        <uni-forms-item label="飞机注册号" name="acReg" required>
          <uni-data-select 
            v-model="formData.acReg"
            :localdata="aircraftOptions"
            @change="handleAircraftChange"
          />
        </uni-forms-item>
        <uni-forms-item label="机型" name="acType">
          <uni-easyinput v-model="formData.acType" disabled />
        </uni-forms-item>
        <uni-forms-item label="ATA章节" name="ata" required>
          <MelATASelector v-model="formData.ata" />
        </uni-forms-item>
        <uni-forms-item label="故障描述" name="description" required>
          <uni-easyinput 
            v-model="formData.description"
            type="textarea"
            placeholder="请输入故障描述"
            maxlength="500"
          />
        </uni-forms-item>
        <uni-forms-item label="English Description" name="englishDescription">
          <uni-easyinput 
            v-model="formData.englishDescription"
            type="textarea"
            placeholder="Please enter fault description in English"
            maxlength="500"
          />
        </uni-forms-item>
      </uni-section>
      
      <!-- 主基地特有信息 -->
      <template v-if="dataSource === 'base'">
        <uni-section title="保留信息" type="line">
          <uni-forms-item label="保留类型" name="defferType" required>
            <uni-data-select 
              v-model="formData.defferType"
              :localdata="defferTypeOptions"
            />
          </uni-forms-item>
          <uni-forms-item label="保留依据" name="defferBasis" required>
            <uni-easyinput 
              v-model="formData.defferBasis"
              type="textarea"
              placeholder="请输入保留依据"
            />
          </uni-forms-item>
          <uni-forms-item label="保留原因" name="defferReason" required>
            <uni-easyinput 
              v-model="formData.defferReason"
              type="textarea"
              placeholder="请输入保留原因"
            />
          </uni-forms-item>
          <uni-forms-item label="保留日期" name="defferDate" required>
            <uni-datetime-picker 
              v-model="formData.defferDate"
              type="date"
            />
          </uni-forms-item>
        </uni-section>
      </template>
      
      <!-- 外站特有信息 -->
      <template v-else-if="dataSource === 'outstation'">
        <uni-section title="外站信息" type="line">
          <uni-forms-item label="航站" name="flightSite" required>
            <uni-data-select 
              v-model="formData.flightSite"
              :localdata="flightSiteOptions"
            />
          </uni-forms-item>
          <uni-forms-item label="座位号" name="seatNo">
            <uni-easyinput 
              v-model="formData.seatNo"
              placeholder="请输入座位号"
            />
          </uni-forms-item>
          <uni-forms-item label="是否有运行限制" name="hasLimit">
            <switch v-model="formData.hasLimit" />
          </uni-forms-item>
          <uni-forms-item label="纠正措施" name="correctiveAction">
            <uni-easyinput 
              v-model="formData.correctiveAction"
              type="textarea"
              placeholder="请输入纠正措施"
            />
          </uni-forms-item>
        </uni-section>
      </template>
      
      <!-- 修复期限 -->
      <uni-section title="修复期限" type="line">
        <uni-forms-item label="修复期限(日历日)" name="repairDays">
          <uni-easyinput 
            v-model="formData.repairDays"
            type="number"
            placeholder="请输入天数"
          />
        </uni-forms-item>
        <uni-forms-item label="修复期限(FH)" name="repairFH">
          <uni-easyinput 
            v-model="formData.repairFH"
            type="number"
            placeholder="请输入飞行小时"
          />
        </uni-forms-item>
        <uni-forms-item label="修复期限(FC)" name="repairFC">
          <uni-easyinput 
            v-model="formData.repairFC"
            type="number"
            placeholder="请输入飞行循环"
          />
        </uni-forms-item>
        <uni-forms-item label="修复期限(飞行日)" name="repairFlightDays">
          <uni-easyinput 
            v-model="formData.repairFlightDays"
            type="number"
            placeholder="请输入飞行日"
          />
        </uni-forms-item>
      </uni-section>
    </uni-forms>
    
    <!-- 操作按钮 -->
    <div class="form-actions">
      <button @click="saveDraft">保存草稿</button>
      <button @click="previewMel">预览</button>
      <button type="primary" @click="submitMel">提交</button>
      <button @click="cancelCreate">取消</button>
    </div>
  </div>
</template>
```

### 3. MEL 审批页面 (`/pages/mel/management/approve.vue`)

#### 3.1 页面功能
- 展示待审批的 MEL 记录列表
- 提供 MEL 记录详情查看
- 支持批量审批操作
- 提供审批意见输入

#### 3.2 页面布局
```
┌─────────────────────────────────────┐
│ 筛选条件                            │
│ 状态: [待批准]  飞机: [全部]       │
├─────────────────────────────────────┤
│ 批量操作                            │
│ [全选] [批量批准] [批量拒绝]        │
├─────────────────────────────────────┤
│ 待审批列表                          │
│ ┌─────────────────────────────────┐ │
│ │ □ MEL001 - B-1234 - ATA27    │ │
│ │    故障描述...                 │ │
│ │    申请时间: 2023-01-01       │ │
│ │    [查看] [批准] [拒绝]        │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ □ MEL002 - B-5678 - ATA32    │ │
│ │    故障描述...                 │ │
│ │    申请时间: 2023-01-02       │ │
│ │    [查看] [批准] [拒绝]        │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 分页控件                            │
└─────────────────────────────────────┘
```

#### 3.3 组件结构
```vue
<template>
  <div class="mel-approve-page">
    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-item">
        <span class="filter-label">状态:</span>
        <uni-data-select 
          v-model="filters.status"
          :localdata="statusOptions"
        />
      </div>
      <div class="filter-item">
        <span class="filter-label">飞机:</span>
        <uni-data-select 
          v-model="filters.aircraft"
          :localdata="aircraftOptions"
        />
      </div>
      <button @click="applyFilters">应用筛选</button>
    </div>
    
    <!-- 批量操作 -->
    <div class="batch-actions">
      <label class="select-all">
        <checkbox :checked="selectAll" @change="handleSelectAll" />
        <span>全选</span>
      </label>
      <button 
        :disabled="selectedItems.length === 0"
        @click="batchApprove"
      >
        批量批准
      </button>
      <button 
        :disabled="selectedItems.length === 0"
        @click="batchReject"
      >
        批量拒绝
      </button>
    </div>
    
    <!-- 待审批列表 -->
    <div class="approve-list">
      <div 
        v-for="item in approveList"
        :key="item.id"
        class="approve-item"
      >
        <div class="item-checkbox">
          <checkbox 
            :checked="isSelected(item.id)"
            @change="handleItemSelect(item.id, $event)"
          />
        </div>
        <div class="item-content">
          <div class="item-header">
            <span class="mel-no">{{ item.melNo }}</span>
            <span class="aircraft">{{ item.acReg }}</span>
            <MelATATag :ata="`${item.ata1}-${item.ata2}`" />
          </div>
          <div class="item-description">{{ item.description }}</div>
          <div class="item-meta">
            <span class="apply-time">申请时间: {{ formatDate(item.applyDate) }}</span>
            <span class="applicant">申请人: {{ item.applicant }}</span>
          </div>
        </div>
        <div class="item-actions">
          <button @click="viewDetail(item.id)">查看</button>
          <button @click="approveItem(item.id)">批准</button>
          <button @click="rejectItem(item.id)">拒绝</button>
        </div>
      </div>
    </div>
    
    <!-- 分页控件 -->
    <MelPagination 
      v-model="currentPage"
      :total="total"
      :page-size="pageSize"
      @change="handlePageChange"
    />
    
    <!-- 审批意见弹窗 -->
    <uni-popup ref="approvalPopup" type="dialog">
      <uni-popup-dialog 
        title="审批意见"
        :value="approvalDialogVisible"
        placeholder="请输入审批意见"
        @confirm="confirmApproval"
        @close="cancelApproval"
      />
    </uni-popup>
  </div>
</template>
```

### 4. MEL 维修管理页面 (`/pages/mel/management/repair.vue`)

#### 4.1 页面功能
- 展示待维修的 MEL 记录列表
- 提供维修进度更新
- 支持维修记录录入
- 提供维修历史查看

#### 4.2 页面布局
```
┌─────────────────────────────────────┐
│ 筛选条件                            │
│ 状态: [待维修]  飞机: [全部]       │
├─────────────────────────────────────┤
│ 维修列表                            │
│ ┌─────────────────────────────────┐ │
│ │ MEL001 - B-1234 - ATA27      │ │
│ │ 故障描述...                   │ │
│ │ 保留日期: 2023-01-01         │ │
│ │ 修复期限: 30天               │ │
│ │ [更新进度] [完成维修]         │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ MEL002 - B-5678 - ATA32      │ │
│ │ 故障描述...                   │ │
│ │ 保留日期: 2023-01-02         │ │
│ │ 修复期限: 15天               │ │
│ │ [更新进度] [完成维修]         │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 分页控件                            │
└─────────────────────────────────────┘
```

#### 4.3 组件结构
```vue
<template>
  <div class="mel-repair-page">
    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-item">
        <span class="filter-label">状态:</span>
        <uni-data-select 
          v-model="filters.status"
          :localdata="statusOptions"
        />
      </div>
      <div class="filter-item">
        <span class="filter-label">飞机:</span>
        <uni-data-select 
          v-model="filters.aircraft"
          :localdata="aircraftOptions"
        />
      </div>
      <button @click="applyFilters">应用筛选</button>
    </div>
    
    <!-- 维修列表 -->
    <div class="repair-list">
      <div 
        v-for="item in repairList"
        :key="item.id"
        class="repair-item"
      >
        <div class="item-header">
          <span class="mel-no">{{ item.melNo }}</span>
          <span class="aircraft">{{ item.acReg }}</span>
          <MelATATag :ata="`${item.ata1}-${item.ata2}`" />
        </div>
        <div class="item-description">{{ item.description }}</div>
        <div class="item-meta">
          <span class="deffer-date">保留日期: {{ formatDate(item.defferDate) }}</span>
          <span class="deadline">修复期限: {{ item.repairDays }}天</span>
          <span class="remaining" :class="getRemainingClass(item.remainingDays)">
            剩余: {{ item.remainingDays }}天
          </span>
        </div>
        <div class="item-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: item.progress + '%' }"
            ></div>
          </div>
          <span class="progress-text">{{ item.progress }}%</span>
        </div>
        <div class="item-actions">
          <button @click="updateProgress(item.id)">更新进度</button>
          <button @click="completeRepair(item.id)">完成维修</button>
          <button @click="viewHistory(item.id)">维修历史</button>
        </div>
      </div>
    </div>
    
    <!-- 分页控件 -->
    <MelPagination 
      v-model="currentPage"
      :total="total"
      :page-size="pageSize"
      @change="handlePageChange"
    />
    
    <!-- 进度更新弹窗 -->
    <uni-popup ref="progressPopup" type="dialog">
      <uni-popup-dialog 
        title="更新维修进度"
        :value="progressDialogVisible"
        :before-close="beforeProgressClose"
      >
        <div class="progress-form">
          <div class="form-item">
            <span class="form-label">维修进度:</span>
            <slider 
              v-model="progressForm.progress"
              :min="0"
              :max="100"
              show-value
            />
          </div>
          <div class="form-item">
            <span class="form-label">维修说明:</span>
            <uni-easyinput 
              v-model="progressForm.description"
              type="textarea"
              placeholder="请输入维修说明"
            />
          </div>
        </div>
      </uni-popup-dialog>
    </uni-popup>
  </div>
</template>
```

### 5. MEL 关闭管理页面 (`/pages/mel/management/close.vue`)

#### 5.1 页面功能
- 展示待关闭的 MEL 记录列表
- 提供关闭条件验证
- 支持关闭信息录入
- 提供关闭历史查看

#### 5.2 页面布局
```
┌─────────────────────────────────────┐
│ 筛选条件                            │
│ 状态: [待关闭]  飞机: [全部]       │
├─────────────────────────────────────┤
│ 关闭列表                            │
│ ┌─────────────────────────────────┐ │
│ │ MEL001 - B-1234 - ATA27      │ │
│ │ 故障描述...                   │ │
│ │ 维修完成时间: 2023-01-15     │ │
│ │ [验证关闭条件] [关闭记录]     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ MEL002 - B-5678 - ATA32      │ │
│ │ 故障描述...                   │ │
│ │ 维修完成时间: 2023-01-10     │ │
│ │ [验证关闭条件] [关闭记录]     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 分页控件                            │
└─────────────────────────────────────┘
```

#### 5.3 组件结构
```vue
<template>
  <div class="mel-close-page">
    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-item">
        <span class="filter-label">状态:</span>
        <uni-data-select 
          v-model="filters.status"
          :localdata="statusOptions"
        />
      </div>
      <div class="filter-item">
        <span class="filter-label">飞机:</span>
        <uni-data-select 
          v-model="filters.aircraft"
          :localdata="aircraftOptions"
        />
      </div>
      <button @click="applyFilters">应用筛选</button>
    </div>
    
    <!-- 关闭列表 -->
    <div class="close-list">
      <div 
        v-for="item in closeList"
        :key="item.id"
        class="close-item"
      >
        <div class="item-header">
          <span class="mel-no">{{ item.melNo }}</span>
          <span class="aircraft">{{ item.acReg }}</span>
          <MelATATag :ata="`${item.ata1}-${item.ata2}`" />
        </div>
        <div class="item-description">{{ item.description }}</div>
        <div class="item-meta">
          <span class="repair-complete">维修完成时间: {{ formatDate(item.repairCompleteDate) }}</span>
          <span class="close-condition" :class="getCloseConditionClass(item.closeCondition)">
            关闭条件: {{ item.closeCondition }}
          </span>
        </div>
        <div class="item-actions">
          <button @click="validateCloseCondition(item.id)">验证关闭条件</button>
          <button @click="closeRecord(item.id)">关闭记录</button>
          <button @click="viewHistory(item.id)">关闭历史</button>
        </div>
      </div>
    </div>
    
    <!-- 分页控件 -->
    <MelPagination 
      v-model="currentPage"
      :total="total"
      :page-size="pageSize"
      @change="handlePageChange"
    />
    
    <!-- 关闭记录弹窗 -->
    <uni-popup ref="closePopup" type="dialog">
      <uni-popup-dialog 
        title="关闭MEL记录"
        :value="closeDialogVisible"
        :before-close="beforeCloseClose"
      >
        <div class="close-form">
          <div class="form-item">
            <span class="form-label">关闭日期:</span>
            <uni-datetime-picker 
              v-model="closeForm.closeDate"
              type="datetime"
            />
          </div>
          <div class="form-item">
            <span class="form-label">关闭人员:</span>
            <uni-easyinput 
              v-model="closeForm.closePerson"
              placeholder="请输入关闭人员"
            />
          </div>
          <div class="form-item">
            <span class="form-label">关闭说明:</span>
            <uni-easyinput 
              v-model="closeForm.description"
              type="textarea"
              placeholder="请输入关闭说明"
            />
          </div>
        </div>
      </uni-popup-dialog>
    </uni-popup>
  </div>
</template>
```

## 组件设计

### 1. MelFormValidator 组件

#### 1.1 功能
- 提供 MEL 表单验证
- 支持自定义验证规则
- 提供实时验证反馈

#### 1.2 组件结构
```vue
<template>
  <div class="mel-form-validator">
    <div v-if="errors.length > 0" class="validation-errors">
      <div 
        v-for="error in errors"
        :key="error.field"
        class="error-item"
      >
        <uni-icons type="error" size="14" color="#ff4757" />
        <span>{{ error.message }}</span>
      </div>
    </div>
  </div>
</template>
```

### 2. MelProgressTracker 组件

#### 2.1 功能
- 展示维修进度跟踪
- 支持多阶段进度显示
- 提供进度历史记录

#### 2.2 组件结构
```vue
<template>
  <div class="mel-progress-tracker">
    <div class="progress-stages">
      <div 
        v-for="(stage, index) in stages"
        :key="stage.key"
        class="progress-stage"
        :class="{ 
          completed: stage.completed, 
          current: stage.current,
          pending: !stage.completed && !stage.current
        }"
      >
        <div class="stage-icon">
          <uni-icons 
            :type="getStageIcon(stage)" 
            :color="getStageColor(stage)"
          />
        </div>
        <div class="stage-info">
          <span class="stage-name">{{ stage.name }}</span>
          <span class="stage-time">{{ formatTime(stage.time) }}</span>
        </div>
      </div>
    </div>
    
    <div class="progress-bar">
      <div 
        class="progress-fill"
        :style="{ width: overallProgress + '%' }"
      ></div>
    </div>
    
    <div class="progress-details">
      <div class="detail-item">
        <span class="label">总体进度:</span>
        <span class="value">{{ overallProgress }}%</span>
      </div>
      <div class="detail-item">
        <span class="label">当前阶段:</span>
        <span class="value">{{ currentStage?.name }}</span>
      </div>
      <div class="detail-item">
        <span class="label">预计完成:</span>
        <span class="value">{{ formatTime(estimatedComplete) }}</span>
      </div>
    </div>
  </div>
</template>
```

### 3. MelApprovalWorkflow 组件

#### 3.1 功能
- 展示审批工作流
- 支持多级审批流程
- 提供审批状态跟踪

#### 3.2 组件结构
```vue
<template>
  <div class="mel-approval-workflow">
    <div class="workflow-steps">
      <div 
        v-for="(step, index) in workflowSteps"
        :key="step.key"
        class="workflow-step"
        :class="{ 
          completed: step.completed, 
          current: step.current,
          pending: !step.completed && !step.current
        }"
      >
        <div class="step-connector" v-if="index > 0"></div>
        <div class="step-icon">
          <uni-icons 
            :type="getStepIcon(step)" 
            :color="getStepColor(step)"
          />
        </div>
        <div class="step-info">
          <span class="step-name">{{ step.name }}</span>
          <span class="step-assignee">{{ step.assignee }}</span>
          <span class="step-time">{{ formatTime(step.time) }}</span>
        </div>
      </div>
    </div>
    
    <div class="workflow-actions">
      <button 
        v-if="canApprove"
        @click="approve"
        class="approve-btn"
      >
        批准
      </button>
      <button 
        v-if="canReject"
        @click="reject"
        class="reject-btn"
      >
        拒绝
      </button>
      <button 
        v-if="canSubmit"
        @click="submit"
        class="submit-btn"
      >
        提交
      </button>
    </div>
  </div>
</template>
```

## 数据流和状态管理

### 1. 管理数据状态管理

```typescript
// 扩展现有的 MelStore
interface MelManagementState {
  // 管理权限
  permissions: {
    canCreate: boolean;
    canApprove: boolean;
    canRepair: boolean;
    canClose: boolean;
    canRenew: boolean;
  };
  
  // 待处理统计
  pendingStats: {
    toApprove: number;
    toRepair: number;
    toClose: number;
    overdue: number;
  };
  
  // 管理列表数据
  managementLists: {
    approveList: VMel[];
    repairList: VMel[];
    closeList: VMel[];
    renewList: VMel[];
  };
  
  // 管理状态
  managementStates: {
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
  };
  
  // 表单数据
  formData: {
    create: MelCreateForm;
    edit: MelEditForm;
    approve: MelApproveForm;
    repair: MelRepairForm;
    close: MelCloseForm;
  };
}
```

### 2. 管理流程状态机

```typescript
// MEL 状态机
class MelStateMachine {
  private states = {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    IN_REPAIR: 'in_repair',
    REPAIR_COMPLETED: 'repair_completed',
    PENDING_CLOSE: 'pending_close',
    CLOSED: 'closed',
    RENEWAL_REQUESTED: 'renewal_requested',
    RENEWAL_APPROVED: 'renewal_approved'
  };
  
  private transitions = {
    [this.states.DRAFT]: [
      { to: this.states.SUBMITTED, action: 'submit' }
    ],
    [this.states.SUBMITTED]: [
      { to: this.states.APPROVED, action: 'approve' },
      { to: this.states.REJECTED, action: 'reject' }
    ],
    [this.states.APPROVED]: [
      { to: this.states.IN_REPAIR, action: 'start_repair' }
    ],
    [this.states.IN_REPAIR]: [
      { to: this.states.REPAIR_COMPLETED, action: 'complete_repair' }
    ],
    [this.states.REPAIR_COMPLETED]: [
      { to: this.states.PENDING_CLOSE, action: 'request_close' }
    ],
    [this.states.PENDING_CLOSE]: [
      { to: this.states.CLOSED, action: 'close' }
    ],
    [this.states.CLOSED]: [
      { to: this.states.RENEWAL_REQUESTED, action: 'request_renewal' }
    ],
    [this.states.RENEWAL_REQUESTED]: [
      { to: this.states.RENEWAL_APPROVED, action: 'approve_renewal' }
    ]
  };
  
  // 获取可能的转换
  getPossibleTransitions(currentState: string): string[] {
    const stateTransitions = this.transitions[currentState] || [];
    return stateTransitions.map(t => t.to);
  }
  
  // 检查转换是否有效
  isValidTransition(currentState: string, action: string): boolean {
    const stateTransitions = this.transitions[currentState] || [];
    return stateTransitions.some(t => t.action === action);
  }
  
  // 执行状态转换
  transition(currentState: string, action: string): string {
    if (!this.isValidTransition(currentState, action)) {
      throw new Error(`Invalid transition: ${currentState} -> ${action}`);
    }
    
    const stateTransitions = this.transitions[currentState] || [];
    const transition = stateTransitions.find(t => t.action === action);
    
    if (!transition) {
      throw new Error(`Transition not found: ${action}`);
    }
    
    return transition.to;
  }
}
```

### 3. 权限管理

```typescript
// 权限管理
class MelPermissionManager {
  private permissions = {
    CREATE: 'mel:create',
    APPROVE: 'mel:approve',
    REPAIR: 'mel:repair',
    CLOSE: 'mel:close',
    RENEW: 'mel:renew',
    VIEW: 'mel:view',
    EDIT: 'mel:edit'
  };
  
  // 检查用户权限
  hasPermission(userId: string, permission: string): boolean {
    // 实际应用中应该从后端获取用户权限
    const userPermissions = this.getUserPermissions(userId);
    return userPermissions.includes(permission);
  }
  
  // 获取用户权限列表
  private getUserPermissions(userId: string): string[] {
    // 模拟用户权限数据
    const userPermissionMap: Record<string, string[]> = {
      'admin': [
        this.permissions.CREATE,
        this.permissions.APPROVE,
        this.permissions.REPAIR,
        this.permissions.CLOSE,
        this.permissions.RENEW,
        this.permissions.VIEW,
        this.permissions.EDIT
      ],
      'approver': [
        this.permissions.APPROVE,
        this.permissions.VIEW
      ],
      'technician': [
        this.permissions.REPAIR,
        this.permissions.VIEW
      ],
      'viewer': [
        this.permissions.VIEW
      ]
    };
    
    return userPermissionMap[userId] || [];
  }
  
  // 检查操作权限
  canPerformAction(userId: string, action: string, melRecord?: VMel): boolean {
    const permission = this.getActionPermission(action);
    
    if (!permission) {
      return false;
    }
    
    if (!this.hasPermission(userId, permission)) {
      return false;
    }
    
    // 检查特定记录的权限
    if (melRecord) {
      return this.checkRecordPermission(userId, action, melRecord);
    }
    
    return true;
  }
  
  // 获取操作对应的权限
  private getActionPermission(action: string): string | null {
    const actionPermissionMap: Record<string, string> = {
      'create': this.permissions.CREATE,
      'approve': this.permissions.APPROVE,
      'repair': this.permissions.REPAIR,
      'close': this.permissions.CLOSE,
      'renew': this.permissions.RENEW,
      'view': this.permissions.VIEW,
      'edit': this.permissions.EDIT
    };
    
    return actionPermissionMap[action] || null;
  }
  
  // 检查特定记录的权限
  private checkRecordPermission(userId: string, action: string, melRecord: VMel): boolean {
    // 根据业务规则检查特定记录的权限
    // 例如：只能审批自己负责的飞机的MEL记录
    if (action === 'approve' && melRecord.acReg !== this.getUserAircraft(userId)) {
      return false;
    }
    
    return true;
  }
  
  // 获取用户负责的飞机
  private getUserAircraft(userId: string): string {
    // 模拟用户负责的飞机数据
    const userAircraftMap: Record<string, string> = {
      'approver1': 'B-1234',
      'approver2': 'B-5678'
    };
    
    return userAircraftMap[userId] || '';
  }
}
```

## 用户体验优化

### 1. 表单优化

```typescript
// 表单优化配置
interface FormOptimization {
  // 自动保存
  autoSave: {
    enabled: boolean;
    interval: number;       // 自动保存间隔(秒)
    maxDrafts: number;     // 最大草稿数量
  };
  
  // 表单验证
  validation: {
    realTime: boolean;      // 实时验证
    debounce: number;       // 验证防抖延迟
    showErrors: 'inline' | 'summary' | 'both';
  };
  
  // 表单填充
  autoFill: {
    enabled: boolean;
    basedOn: 'history' | 'aircraft' | 'ata';
  };
}
```

### 2. 批量操作优化

```typescript
// 批量操作配置
interface BatchOperationConfig {
  // 选择优化
  selection: {
    selectAll: boolean;     // 全选功能
    selectPage: boolean;    // 选择当前页
    selectFiltered: boolean; // 选择筛选结果
  };
  
  // 操作确认
  confirmation: {
    enabled: boolean;
    threshold: number;     // 需要确认的数量阈值
    showDetails: boolean;  // 显示操作详情
  };
  
  // 进度显示
  progress: {
    enabled: boolean;
    showPercentage: boolean;
    showDetails: boolean;
  };
}
```

### 3. 工作流优化

```typescript
// 工作流优化配置
interface WorkflowOptimization {
  // 状态提示
  statusHints: {
    enabled: boolean;
    showNextSteps: boolean;
    showDeadlines: boolean;
  };
  
  // 快捷操作
  shortcuts: {
    enabled: boolean;
    commonActions: string[];
    customActions: string[];
  };
  
  // 通知设置
  notifications: {
    enabled: boolean;
    types: string[];
    channels: string[];
  };
}
```

## 测试策略

### 1. 组件测试

```typescript
// 组件测试示例
describe('MelFormValidator', () => {
  it('should validate required fields correctly', () => {
    const wrapper = mount(MelFormValidator, {
      props: {
        rules: {
          acReg: { required: true },
          description: { required: true }
        },
        data: {
          acReg: '',
          description: ''
        }
      }
    });
    
    expect(wrapper.find('.validation-errors').exists()).toBe(true);
    expect(wrapper.findAll('.error-item')).toHaveLength(2);
  });
  
  it('should pass validation when all fields are valid', () => {
    const wrapper = mount(MelFormValidator, {
      props: {
        rules: {
          acReg: { required: true },
          description: { required: true }
        },
        data: {
          acReg: 'B-1234',
          description: 'Test description'
        }
      }
    });
    
    expect(wrapper.find('.validation-errors').exists()).toBe(false);
  });
});
```

### 2. 集成测试

```typescript
// 页面集成测试示例
describe('MEL Management Page', () => {
  it('should load and display management data', async () => {
    const mockData = generateMockManagementData();
    jest.spyOn(melApi, 'getManagementData').mockResolvedValue(mockData);
    
    const wrapper = mount(MelManagementPage);
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('.management-content').exists()).toBe(true);
    expect(wrapper.findAll('.stats-card')).toHaveLength(4);
  });
});
```

## 总结

MEL 管理功能页面设计提供了完整的 MEL 记录管理功能，包括：

1. **MEL 管理主页**：提供管理功能导航和统计概览
2. **MEL 创建页面**：提供新记录创建功能
3. **MEL 审批页面**：提供审批流程管理
4. **MEL 维修管理页面**：提供维修进度跟踪
5. **MEL 关闭管理页面**：提供关闭流程管理

这些页面通过完整的权限控制、状态管理和工作流设计，确保 MEL 记录的全生命周期管理。