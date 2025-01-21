<template>
	<view :style="`width:100%; height:${getHeight()}`"><l-echart ref="chartRef"/></view>
</template>

<script setup lang="ts">
	import LEchart from './l-echart/l-echart.vue'
	import { PropType, onMounted, ref } from 'vue';
	// static目录不会编译,放其他目录会被编译报错.
	const echarts = require('../../static/echarts.min.js');
	
	const props = defineProps({
		option: { type: Object as PropType<Record<string, any>>, default: () => { } },
		height: { type: String, default: '20vh' } // 添加 height 属性
	})

	const chartRef = ref(null)
	const getHeight = () => {
		// 如果是px,vh,百分数，则直接返回,如果是纯数字，则加上px，如果是小于1的小数，则乘以100加上个%，
		if (typeof props.height === 'string') {
			if (props.height.includes('%') || props.height.includes('vh') || props.height.includes('px')) {
				return props.height;
			}
			return props.height;
		}
		if (props.height < 1) {
			return props.height * 100 + '%';
		} else {
			return props.height + 'px';
		}
	}
	const emits = defineEmits(['select']);

	const selectchanged = (params : any) => {
		emits('select', params);
	};

	onMounted(() => {
		// 组件能被调用必须是组件的节点已经被渲染到页面上
		setTimeout(async () => {
			if (!chartRef.value) return
			const myChart = await chartRef.value.init(echarts)
			myChart.setOption(props.option)
		}, 600)
	})
</script>