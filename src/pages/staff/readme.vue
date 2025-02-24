<template>
    <div class="readme-wrapper">
        <!-- <div class="header"></div> -->
        <div class="content">
            <div class="ol">
                <div class="li">
                    欢迎使用《中原龙浩》微信小程序
                </div>
                <div class="li">
                    本程序是"数字龙浩"项目一部分。短期内功能、界面很多不足，逐步解决中，更多功能逐步上线中…
                </div>
                <div class="li">
                    如果出现BUG，有两种可能：<br>
                    a. 代码算法有问题，这个发现一个解决一个<br>
                    b. 数据有问题，这个只能逐步治理
                </div>
                <div class="li">
                    有需要联系我：
                    <div class="phone">
                        <span class="phone1">1314</span>
                        <span class="phone2">004</span>
                        <span class="phone3">1314</span>
                    </div>
                    (微信同号)
                </div>
            </div>
        </div>
        <div class="footer">
            <button @click="close">已阅</button>
        </div>
    </div>
</template>
<script setup lang="ts">
const emits = defineEmits(['close']);
const close = () => {
    emits('close');
}
</script>
<style lang="less" scoped>
@import '@/css/base.less';

.readme-wrapper {
    width: 90vw;
    max-width: 600px; // 增加最大宽度限制
    background-color: #fff;

    .content {
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto; // 内容过多时显示滚动条

        .ol {
            list-style: none;
            padding-left: 0;
            margin: 0;

            .li {
                padding: 2px;
                margin-bottom: 4px;
                // line-height: 1.6;
                color: #606266;

                &:last-child {
                    margin-bottom: 0;
                }

                &::before {
                    content: "•";
                    color: #409eff;
                    font-weight: bold;
                    display: inline-block;
                    width: 1em;
                    margin-left: -1em;
                }
            }

            .phone {
                display: inline-block;

                .phone1,
                .phone2,
                .phone3 {
                    color: #333;
                }

                .phone2 {
                    color: #cc8282;
                    margin: auto 1px auto 3px;
                }
            }
        }
    }

    .footer {
        padding: 4px;
        text-align: center;
        border-top: 1px solid #ebeef5;

        button {
            padding: 6px 30px;
            background: @color-primary;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;

        }
    }
}
</style>