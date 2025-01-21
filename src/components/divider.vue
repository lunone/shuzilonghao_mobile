<template>
	<div class="line-box">
		<span class="line"></span>
		<span class="text">
			<slot>分隔线</slot>
		</span>
		<span class="line"></span>
	</div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
	.line-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 6px auto;
	}

	.text {
		font-size: 12px;
		padding:0 1rem;
		text-align: center;
		color: #ccc;
	}

	.line {
		width: 20%;flex:1;
		height: 1px;
		background-color: #ccc;
	}
</style>