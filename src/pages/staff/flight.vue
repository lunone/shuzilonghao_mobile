<template>
	<view class="wrapper">
		<view class="text">
			<view class="summary">
				<view class="total">
					<text class="title">今日计划</text>
					<text class="value">{{ flightStats.total }}</text>
					<text class="unit">班</text>
				</view>
				<view class="executed">
					<text class="title">已执行</text>
					<text class="value">{{ flightStats.executed }}</text>
					<text class="unit">班</text>
				</view>
			</view>
			<view class="status">
				<view class="diverted">
					<text class="title">取消</text>
					<text class="value">{{ flightStats.cancle }}</text>
					<!-- <text class="unit">班</text> -->
				</view>
				<view class="diverted">
					<text class="title">备降</text>
					<text class="value">{{ flightStats.diverted }}</text>
					<!-- <text class="unit">班</text> -->
				</view>
				<view class="return">
					<text class="title">返航</text>
					<text class="value">{{ flightStats.return }}</text>
					<!-- <text class="unit">班</text> -->
				</view>
				<view class="return">
					<text class="title">延误</text>
					<text class="value">{{ flightStats.return }}</text>
					<!-- <text class="unit">班</text> -->
				</view>
			</view>
		</view>
		<view class="circle">yq
			<!--  <van-circle v-model:current-rate="executionRate" :rate="executionRate" :speed="10" :stroke-width="170"
                :clockwise="false" :text="`${executionRate}%`" layer-color="#fff0bc" color="#c52005" size="80px" /> -->
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, watch, Ref } from 'vue';
	import api from '@/utils/api';
	import CONFIG from '@/config';
	import dayjs from 'dayjs';
	import { FlightItem } from '@/interface';

	// const store = usebasisStore();

	const flights = ref<FlightItem[]>([]);
	const fetchFlights = async () => {
		const today = dayjs().format('YYYY-MM-DD');
		try {
			const res = await api(CONFIG.url.flightsDate, { startDate: today, endDate: today }) as FlightItem[];
			console.log('res', res);
			flights.value = res;
		} catch (err) {
			console.error('获取航班信息失败', err);
		}
	};

	const flightStats = computed(() => {
		const stats = {
			total: 0,
			executed: 0,
			normal: 0,
			cancle: 0,
			diverted: 0,
			delay: 0,
			return: 0,
		};

		for (let flight of flights.value) {
			// FLG_VR 返航/备降标记 R1，R2 返航新增2段，RC返航原段，V1，V2 备降新增2段，VC备降原段
			// FLG_VR1 返航/备降补充信息，原段为VC，备降第1段为V1，第2段为V2


			// ORIGIN_FLT_ID 原航段ID（在返航/备降时，用来关联最初始的航段）
			// console.log(flight.flagPatch)
			// FLG_PATCH 是否返航/备降新增段// 新增字段不处理，只处理旧有的航段
			if (flight.flagPatch) {
				continue;
			}

			if (flight.atd) {// 已执行
				stats.executed++;
			}

			if (flight.flagDelay == 'D') {// 延误
				stats.delay++
			}

			if (flight.flagVr == 'R') {// 返回
				stats.return++;
			} if (flight.flagVr == 'V') {// 备降
				stats.diverted++;
			} else if (flight.flagCs) {
				// FLG_CS 取消标记 签派员取消C，市场取消D，恢复R
				if (flight.flagCs == 'C')
					stats.cancle++;
				else if (flight.flagCs == 'R')
					stats.normal++;
			} else {
				stats.normal++;
			}
			stats.total++;

		};

		return stats;
	});

	const executionRate : Ref<number> = ref(0);
	watch(flights, () => {
		executionRate.value = flightStats.value.executed / flightStats.value.total * 100;
	});

	onMounted(() => {
		fetchFlights();
	});
</script>

<style lang="less" scoped>
	@import '@/css/base.less';

	.wrapper {
		display: flex;
		flex-direction: row;

		.text {
			display: flex;
			align-items: center;
			flex: 1;
			flex-direction: column;
			justify-content: space-around;


			.summary,
			.status {
				display: flex;
				flex-direction: row;
				width: 100%;

				.title {
					color: #333;
					margin-right: 5px;
				}

				.value {
					font-size: 1rem;
					color: #4a90e2;
					margin-right: 5px;
				}

				.unit {
					color: #555;
				}

				&.status {
					flex: 0 0 auto;
				}
			}
		}

		.circle {
			// flex: 0 0 auto;
			width: 80px;
			// border: red solid 1px;
			/* 调整宽度以适应内容 */
		}

	}
</style>