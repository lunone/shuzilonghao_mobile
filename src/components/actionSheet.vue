<template>
    <div class="action-sheet-wrapper">
        <uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" background-color="#fff" class="popup">
            <div class="title-wrapper">
                <slot name="title">
                    <span class="text">{{ title }}</span>
                    <i class="icon zl-icon zl-icon-close" @click="show = false" />
                </slot>
            </div>
            <div class="content-wrapper">
                <slot> </slot>
            </div>
        </uni-popup>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
const props = defineProps({
    title: {
        type: String,
        default: '标题',
    },
});
const show = defineModel({ default: false });
const popup = ref();

watch(show, (newValue) => {
    console.log('show--------', newValue);
    if (newValue) {
        popup.value.open();
    } else {
        popup.value.close();
    }
});
</script>
<style lang="less" scoped>
@import '@/base.less';
@gap: 10px;

.action-sheet-wrapper {
    .popup {
        display: flex;
        flex-direction: column;

        .title-wrapper {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin: 4px auto;
            align-items: center;

            .text {
                font-size: 1.1rem;
                color: #000;
                flex: 1;
                padding-left: @gap;

            }

            .icon {
                font-size: 1.2rem;
                color: #ccc;
                justify-self: flex-end;
                padding-right: @gap;
            }
        }

    }
}
</style>