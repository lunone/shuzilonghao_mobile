<template>
	<view class="shortcut-wrapper">
		<view v-for="(cols, index) in data" :key="index" class="line">
			<navigator v-for="col in cols" :key="col.link" class="item" :style="{ width: col.size * 16 + 'vw' }"
				hover-class="navigator-hover" :url="col.link">
				<i class="icon zl-icon" :class="`zl-icon-${col.class}`" />
				<view class="text">{{ col.text }}</view>
			</navigator>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';

	const data = ref([
		[
			{ size: 12, link: '/pages/analysis/Analysis', class: 'analysis', text: '运行分析' },
			{ size: 6, link: '/pages/airplane/Airplane', class: 'airplane', text: '机队' },
			{ size: 6, link: '/sale', class: 'sale', text: '销售' },
			{ size: 6, link: '/pages/hr/Hr', class: 'person', text: '人员' },
		],
		[
			{ size: 8, link: '/pages/sms/Sms', class: 'sms', text: '安全' },
			{ size: 8, link: '/pages/pilot/Pilot', class: 'pilot', text: '飞行' },
			{ size: 8, link: '/maintenance', class: 'maintenance', text: '维修' },

		],

	]);
</script>

<style lang="less" scoped>
	@import "@/base.less";

	@background-color: #fafafa;
	@active-background-color: #e0e0e0; // 激活时的背景颜色
	@active-border-color: #bbb; // 激活时的边框颜色

	.shortcut-wrapper {
		display: flex;
		flex-direction: column;

		.line {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			height: 14vw;
			margin: 4px 0;

			.item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				text-align: center;

				margin: 2px;
				border-radius: 8px;
				background-color: @background-color;
				/* 浅色背景 */
				border: 1px solid #ddd;
				height: 100%;

				.icon {
					font-size: 2rem;
					color: #c52005;
				}

				.text {
					font-size: 0.7rem;
					color: #999;
				}

			}
		}
	}
</style>