<template>
  <div class="aircraft-detail-tabs">
    <!-- Tab 切换 -->
    <press-tabs :active="infoTab" @change="onInfoTabClick" class="info">
      <press-tab name="detail" title="飞机参数">
        <detail v-if="aircraft" :aircraft="aircraft" />
      </press-tab>
      <press-tab name="mel" :title="`保留单详情(${mels?.length || 0})`">
        <mel-card-vue :acReg="aircraft?.acReg" @get-mel="acRegMelUpdate" />
      </press-tab>
    </press-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AircraftItem } from '@/api/aircraft.api';
import MelCardVue from '../../../pages/maintenance/mel/card.vue';
import detail from '../detail.vue';

interface Props {
  aircraft: AircraftItem | null;
}

const props = defineProps<Props>();

// 当前激活的 Tab
const infoTab = ref('detail');
const mels = ref<any[]>([]);

const onInfoTabClick = e => {
  infoTab.value = infoTab.value != e.name ? e.name : infoTab.value;
};

const acRegMelUpdate = (acRegMel: any[]) => {
  mels.value = acRegMel;
};
</script>

<style lang="less" scoped>
@import '@/css/base.less';

.aircraft-detail-tabs {
  .info {
    width: 100%;
  }
}
</style>