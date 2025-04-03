<template>
	<view class="container">
		<view class="user-info">
			<block v-if="isLoggedIn">
				<image class="avatar" :src="userInfo.avatar || '/static/user/默认.webp'" mode="aspectFill"></image>
				<view class="info">
					<text class="nickname">{{userInfo.nickname}}</text>
					<text class="department">{{userInfo.department}}</text>
				</view>
			</block>
			<block v-else>
				<view class="login-btn" @click="handleLogin">
					<text>点击登录</text>
				</view>
			</block>
		</view>
		
		<view class="menu-list">
			<!-- 管理员功能区域 -->
			<!-- 管理员功能区域 -->
<view class="admin-section" v-if="isAdmin">
    <view class="section-title">管理员功能</view>
    <view class="menu-item" @click="navigateTo('/pages/device/upload')">
        <text>设备信息上传</text>
        <text class="arrow">></text>
    </view>
    <view class="menu-item" @click="navigateTo('/pages/device/overview')">
        <text>设备总览</text>
        <text class="arrow">></text>	
    </view>
    <view class="menu-item" @click="navigateTo('/pages/device/user')">
        <text>用户管理</text>
        <text class="arrow">></text>
    </view>
</view>
			
			<!-- 普通功能区域 -->
			<view class="menu-item" @click="handleLogout" v-if="isLoggedIn">
				<text>退出登录</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item">
				<text>关于我们</text>
				<text class="arrow">></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isLoggedIn: false,
			isAdmin: false,
			userInfo: {
				avatar: '',
				nickname: '',
				department: ''
			}
		}
	},
	methods: {
		handleLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorageSync('token')
						uni.removeStorageSync('userInfo')
						this.isLoggedIn = false
						this.isAdmin = false
						this.userInfo = {
							avatar: '',
							nickname: '',
							department: ''
						}
					}
				}
			})
		},
		navigateTo(url) {
			uni.navigateTo({
				url: url
			})
		},
		checkLoginStatus() {
			const token = uni.getStorageSync('token')
			const userInfo = uni.getStorageSync('userInfo')
			
			if (userInfo) {
				this.isLoggedIn = true
				this.userInfo = userInfo
				// 检查是否是管理员
				this.isAdmin = userInfo.role === 'admin'
			}
		}
	},
	onShow() {
		this.checkLoginStatus()
	}
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	
	.user-info {
		background-color: #FFFFFF;
		padding: 40rpx;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		
		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 60rpx;
			margin-right: 30rpx;
		}
		
		.info {
			.nickname {
				font-size: 36rpx;
				font-weight: bold;
				color: #333333;
				display: block;
			}
			
			.department {
				font-size: 28rpx;
				color: #666666;
				margin-top: 10rpx;
				display: block;
			}
		}
		
		.login-btn {
			width: 100%;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			text {
				font-size: 32rpx;
				color: #007AFF;
			}
		}
	}
	
	.menu-list {
		background-color: #FFFFFF;
		
		.admin-section {
			margin-bottom: 20rpx;
			
			.section-title {
				padding: 20rpx 40rpx;
				font-size: 28rpx;
				color: #999999;
				background-color: #F5F5F5;
			}
		}
		
		.menu-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 40rpx;
			border-bottom: 1rpx solid #EEEEEE;
			
			text {
				font-size: 30rpx;
				color: #333333;
			}
			
			.arrow {
				color: #999999;
			}
			
			&:last-child {
				border-bottom: none;
			}
		}
	}
}
</style> 