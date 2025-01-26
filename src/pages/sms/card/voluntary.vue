<template>
	<div class="item">
		<div class="ask">
			<div class="user">
				<i class="icon zl-icon-user" />
				<UserCardVue :userId="data.userId" :name="data.userName" class="name" v-if="data.userId"
					:show-icon="false" />
				<div class="name anonymous" v-else>
					匿名
				</div>
			</div>
			<div class="content">
				<div class="desc">{{ data.content }}</div>
				<div class="date">{{ dayjs(data.date).format('M月D日') }}</div>
			</div>
		</div>
		<template v-if="data.answers.length">
			<div class="answer" v-for="(answer, index) of data.answers" :key="answer.id">
				<div class="content">
					<div class="desc" :class="answer.content ? '' : 'blank'">
						{{ answer.content || `系统提示：用户未录入有效内容` }}
					</div>
					<div class="date">{{ dayjs(answer.date).format('M月D日') }}</div>
				</div>
				<div class="user">
					<i class="icon zl-icon-user" />
					<div class="name">{{ answer.userName }}</div>
				</div>
			</div>
		</template>
	</div>
</template>
<script lang="ts" setup>
	import dayjs from 'dayjs';
	import UserCardVue from '@/pages/hr/userCard.vue';
	const props = defineProps<{ data : Record<string, any> }>();
</script>
<style lang="less" scoped>
	@import '@/base.less';
	@gap: 10px;
	@color-background: #fefefe;
	@color-ask: #c2e7b0;
	@color-answer: #dfdfdf;

	.item {
		display: flex;
		flex-direction: column;
		background-color: @color-background;
		border: 1px solid #eeeeee;
		border-radius: 6px;
		padding: 10px;
		margin-bottom: 10px;

		// 
		.answer,
		.ask {
			display: flex;
			flex-direction: row;
			margin-bottom: 16px;
			align-items: flex-start;

			.user {
				align-self: flex-start;
				width: 40px;
				font-size: 12px;

				.icon {
					color: #ddd;
					font-size: 38px;
				}

				.name {
					color: #666;
					text-align: center;
				}
			}

			.anonymous {
				.icon {
					color: #eee;
				}
			}

			.content {
				display: flex;
				flex-direction: column;
				flex: 1;

				.desc {
					border-radius: 8px;
					padding: 8px;
					position: relative;
					min-width: 2rem;

					&::before,
					&::after {
						top: 10px;
						position: absolute;
						border-width: 5px;
						border-style: solid;
					}
				}

				.blank {
					color: #4834ff;
				}

				.date {
					font-size: 12px;
					color: #999;
					margin-top: 4px;
				}
			}
		}

		.ask {
			.user {
				margin-right: @gap;
			}

			.content {
				.desc {
					background-color: @color-ask;
					border: 1px solid @color-ask;


					&::before {
						content: '';
						left: -10px;
						border-color: transparent @color-ask transparent transparent;
					}
				}
			}
		}


		.answer {
			.content {
				.desc {
					background-color: @color-answer; // 更亮一点的颜色
					border: 1px solid @color-answer;

					&::after {
						content: '';
						right: -10px;
						border-color: transparent transparent transparent @color-answer;
					}
				}

				.date {
					align-self: flex-end;
				}
			}

			.user {
				margin-left: @gap;
			}
		}
	}
</style>