<template>
	<view class="container">
		<view class="watermark">设备管理系统</view>
		<view class="device-list">
			<view v-for="(device, index) in devices" :key="index" 
				  class="device-item" 
				  :class="{'overdue': isOverdue(device.returnDate), 'normal': !isOverdue(device.returnDate)}">
				<image class="device-image" :src="device.image" mode="aspectFill"></image>
				<view class="device-info">
					<view class="device-header">
						<text class="device-name">{{device.name}}</text>
						<text class="device-code">编号：{{device.code}}</text>
					</view>
					<view class="date-info">
						<text>借出日期：{{formatDate(device.borrowDate)}}</text>
						<text>归还日期：{{formatDate(device.returnDate)}}</text>
						<text v-if="isOverdue(device.returnDate)" class="overdue-text">已逾期！</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			devices: []
		}
	},
	methods: {
		formatDate(date) {
			return new Date(date).toLocaleDateString()
		},
		isOverdue(returnDate) {
			return new Date(returnDate) < new Date()
		},
		async fetchDevices() {
			// TODO: 调用后端API获取设备列表
			const userInfo = uni.getStorageSync('userInfo')

			if (!userInfo) return
			const {data} = await this.$api.device_all({
				phone: userInfo.phone
			})
			console.log(data);
			// 模拟数据
			this.devices = data.map(item => {
				return {
					name: item.name,
					code: item.code,
					image: item.url,
					borrowDate: item.lastMaintenanceDate,
					returnDate: item.nextMaintenanceDate
				}
			})
		}
	},
	onShow() {
		this.fetchDevices()
	}
}
</script>

<style lang="scss">
.container {
	padding: 20rpx;
	position: relative;
	
	.watermark {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-45deg);
		font-size: 60rpx;
		color: rgba(0, 0, 0, 0.1);
		pointer-events: none;
		z-index: 1;
	}
	
	.device-list {
		position: relative;
		z-index: 2;
		
		.device-item {
			display: flex;
			background-color: #FFFFFF;
			padding: 20rpx;
			margin-bottom: 20rpx;
			border-radius: 12rpx;
			box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
			position: relative;
			overflow: hidden;
			
			&.normal {
				background-color: #F6FFED;
				border: 2rpx solid #52C41A;
				
				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(45deg, rgba(82,196,26,0.1) 0%, rgba(82,196,26,0.2) 100%);
					z-index: 0;
				}
			}
			
			&.overdue {
				background-color: #FFF1F0;
				border: 2rpx solid #FF4D4F;
				animation: pulse 2s infinite;
				
				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(45deg, rgba(255,77,79,0.1) 0%, rgba(255,77,79,0.2) 100%);
					z-index: 0;
				}
			}
			
			.device-image {
				width: 160rpx;
				height: 160rpx;
				border-radius: 8rpx;
				margin-right: 20rpx;
				position: relative;
				z-index: 1;
			}
			
			.device-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				position: relative;
				z-index: 1;
				
				.device-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.device-name {
						font-size: 32rpx;
						font-weight: bold;
						color: #333333;
					}
					
					.device-code {
						font-size: 24rpx;
						color: #666666;
					}
				}
				
				.date-info {
					display: flex;
					flex-direction: column;
					
					text {
						font-size: 24rpx;
						color: #666666;
						margin-top: 10rpx;
					}
					
					.overdue-text {
						color: #FF4D4F;
						font-weight: bold;
						font-size: 28rpx;
						margin-top: 15rpx;
					}
				}
			}
		}
	}
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(255,77,79,0.4);
	}
	70% {
		box-shadow: 0 0 0 10rpx rgba(255,77,79,0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(255,77,79,0);
	}
}
</style> 