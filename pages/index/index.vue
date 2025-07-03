<template>
	<view class="container">
		<view class="button-group">
			<view class="button-item" @click="handleBorrow">
				<view class="circle-button borrow">
					<text class="button-text">借</text>
				</view>
			</view>
			<view class="button-item" @click="handleReturn">
				<view class="circle-button return">
					<text class="button-text">还</text>
				</view>
			</view>
		</view>
		
		<view class="statistics">
			<view class="stat-item">
				<text class="stat-number">{{borrowedCount}}</text>
				<text class="stat-label">借用设备</text>
			</view>
			<view class="stat-item">
				<text class="stat-number overdue">{{overdueCount}}</text>
				<text class="stat-label">逾期设备</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				borrowedCount: 0,
				overdueCount: 0
			}
		},
		methods: {
			handleBorrow() {
				// 检查登录状态
				const token = uni.getStorageSync('token')
				if (!token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				
				// 调用扫码API
				uni.scanCode({
					success: (res) => {
						console.log(res);
						// 处理扫码结果
						uni.showActionSheet({
							itemList: ['7天', '15天', '30天'],
							success: async (e) => {
								const days = [7, 15, 30][e.tapIndex];
								// TODO: 调用后端API保存借用记录
								const userInfo = uni.getStorageSync('userInfo')
								console.log(userInfo);
								const {msg, mount, overCount} = await this.$api.device_borrow({
									code: res.result,
									days: days,
									phone: userInfo.phone,
									username: userInfo.username
								})
								uni.showToast({
									title: msg,
									icon: 'success',
									duration: 2000
								})
								this.borrowedCount = mount
								this.overdueCount = overCount
							},
							fail: (e) => {
								console.log(e.errMsg);
							}
						})
					}
				})
			},
			handleReturn() {
				// 检查登录状态
				const token = uni.getStorageSync('token')
				if (!token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				
				// 调用扫码API
				uni.scanCode({
					success: async (res) => {
						// TODO: 调用后端API处理归还逻辑
						const userInfo = uni.getStorageSync('userInfo')
						const {msg, mount, overCount} = await this.$api.device_return({
							code: res.result,
							phone: userInfo.phone,
							username: userInfo.username
						})
						uni.showToast({
							title: msg,
							icon: 'success'
						})
						this.borrowedCount = mount
						this.overdueCount = overCount
					}
				})
			}
		},
		async onShow() {
			// TODO: 获取用户设备统计信息
			const userInfo = uni.getStorageSync('userInfo')
			const {count, overdueCount} = await this.$api.device_all({
				phone: userInfo.phone,
				username: userInfo.username
			})
			console.log(count, overdueCount);
			this.borrowedCount = count
			this.overdueCount = overdueCount
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 40rpx;
		
		.button-group {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 60rpx;
			
			.button-item {
				margin: 20rpx 0;
			}
			
			.circle-button {
				width: 400rpx;
				height: 400rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				
				&.borrow {
					background-color: #FF4D4F;
				}
				
				&.return {
					background-color: #52C41A;
				}
				
				.button-text {
					color: #FFFFFF;
					font-size: 100rpx;
					font-weight: bold;
				}
			}
		}
		
		.statistics {
			display: flex;
			justify-content: space-around;
			background-color: #FFFFFF;
			padding: 30rpx;
			border-radius: 20rpx;
			box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
			
			.stat-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				
				.stat-number {
					font-size: 48rpx;
					font-weight: bold;
					color: #333333;
					
					&.overdue {
						color: #FF4D4F;
					}
				}
				
				.stat-label {
					font-size: 28rpx;
					color: #666666;
					margin-top: 10rpx;
				}
			}
		}
	}
</style>
