<template>
	<view class="container">
		<view class="message-list">
			<view v-for="(message, index) in messages" :key="index" 
				  class="message-item"
				  :class="{'unread': !message.read}">
				<view class="message-content">
					<view class="message-title">{{message.title}}</view>
					<view class="message-text">{{message.content}}</view>
				</view>
				<view class="message-time">{{formatTime(message.time)}}</view>
			</view>
		</view>
		
		<view class="empty-tip" v-if="messages.length === 0">
			<image class="empty-icon" src="/static/empty-message.png" mode="aspectFit"></image>
			<text>暂无消息</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			messages: []
		}
	},
	methods: {
		formatTime(time) {
			const date = new Date(time)
			const now = new Date()
			const diff = now - date
			
			// 小于1分钟
			if (diff < 60000) {
				return '刚刚'
			}
			// 小于1小时
			if (diff < 3600000) {
				return Math.floor(diff / 60000) + '分钟前'
			}
			// 小于24小时
			if (diff < 86400000) {
				return Math.floor(diff / 3600000) + '小时前'
			}
			// 小于30天
			if (diff < 2592000000) {
				return Math.floor(diff / 86400000) + '天前'
			}
			// 大于30天显示具体日期
			return date.toLocaleDateString()
		},
		async fetchMessages() {
			// TODO: 调用后端API获取消息列表
			// 模拟数据
			this.messages = [
				{
					title: '设备归还提醒',
					content: '您借用的笔记本电脑即将到期，请及时归还。',
					time: new Date().getTime() - 3600000,
					read: false
				},
				{
					title: '系统通知',
					content: '系统升级完成，新功能已上线。',
					time: new Date().getTime() - 86400000,
					read: true
				}
			]
		}
	},
	onShow() {
		this.fetchMessages()
	}
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding: 20rpx;
	
	.message-list {
		.message-item {
			background-color: #FFFFFF;
			padding: 30rpx;
			margin-bottom: 20rpx;
			border-radius: 12rpx;
			display: flex;
			justify-content: space-between;
			
			&.unread {
				background-color: #F0F7FF;
				
				.message-title {
					font-weight: bold;
				}
			}
			
			.message-content {
				flex: 1;
				margin-right: 20rpx;
				
				.message-title {
					font-size: 32rpx;
					color: #333333;
					margin-bottom: 10rpx;
				}
				
				.message-text {
					font-size: 28rpx;
					color: #666666;
					line-height: 1.5;
				}
			}
			
			.message-time {
				font-size: 24rpx;
				color: #999999;
			}
		}
	}
	
	.empty-tip {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 200rpx;
		
		.empty-icon {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 20rpx;
		}
		
		text {
			font-size: 28rpx;
			color: #999999;
		}
	}
}
</style> 