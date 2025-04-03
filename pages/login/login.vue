<template>
	<view class="container">
		<view class="login-box">
			<view class="title">办公用品管理系统</view>
			<view class="subtitle">账号密码登录</view>
			
			<view class="form-box">
				<view class="form-item">
					<input class="input" type="text" v-model="form.username" placeholder="请输入用户名" />
				</view>
				<view class="form-item">
					<input class="input" type="password" v-model="form.password" placeholder="请输入密码" />
				</view>
				<view class="remember-box">
					<checkbox-group @change="handleRememberChange">
						<checkbox :checked="rememberPassword" style="transform:scale(0.7)"/>
						<text class="remember-text">记住密码</text>
					</checkbox-group>
					<text class="forget-text" @click="goToReset">忘记密码？</text>
				</view>
				<button class="login-btn" @click="handleLogin" :loading="loading">登录</button>
			</view>
			
			<view class="status-tip" :class="{'error': loginStatus === 'error'}">
				{{statusText}}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				username: '',
				password: ''
			},
			rememberPassword: false,
			loading: false,
			loginStatus: '', // success, error
			statusText: ''
		}
	},
	methods: {
		async handleLogin() {
			if (!this.form.username || !this.form.password) {
				this.loginStatus = 'error'
				this.statusText = '请输入用户名和密码'
				return
			}
			this.loading = true
			try {
				// TODO: 调用登录API
				const res = await this.$api.user_login(this.form)
				console.log(res);
				if (this.rememberPassword) {
					uni.setStorageSync('savedUsername', this.form.username)
					uni.setStorageSync('savedPassword', this.form.password)
				} else {
					uni.removeStorageSync('savedUsername')
					uni.removeStorageSync('savedPassword')
				}
				// // 模拟获取用户信息
				const userInfo = {
					avatar: res.data.data[0].avatar || '/static/user/默认.webp',
					nickname: res.data.data[0].username,
					department: res.data.data[0].department,
					role: res.data.data[0].role,
					phone: res.data.data[0].phone,
					username: res.data.data[0].username
				}
				uni.setStorageSync('token', 'mock-token')
				uni.setStorageSync('userInfo', userInfo)
				uni.switchTab({
					url: '/pages/my/my'
				})
				
			} catch (error) {
				this.loginStatus = 'error'
				this.statusText = '登录失败，请重试'
			} finally {
				this.loading = false
			}
		},
		handleRememberChange(e) {
			this.rememberPassword = e.detail.value.length > 0
		},
		goToReset() {
			uni.navigateTo({
				url: '/pages/login/reset-password'
			})
		}
	},
	onLoad() {
		// 加载保存的账号密码
		const savedUsername = uni.getStorageSync('savedUsername')
		const savedPassword = uni.getStorageSync('savedPassword')
		if (savedUsername && savedPassword) {
			this.form.username = savedUsername
			this.form.password = savedPassword
			this.rememberPassword = true
		}
	}
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
	
	.login-box {
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 60rpx 40rpx;
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
		
		.title {
			font-size: 40rpx;
			font-weight: bold;
			color: #333333;
			text-align: center;
			margin-bottom: 20rpx;
		}
		
		.subtitle {
			font-size: 28rpx;
			color: #666666;
			text-align: center;
			margin-bottom: 60rpx;
		}
		
		.form-box {
			margin-bottom: 40rpx;
			
			.form-item {
				margin-bottom: 30rpx;
				
				.input {
					width: 100%;
					height: 80rpx;
					background: #F8F8F8;
					border-radius: 8rpx;
					padding: 0 30rpx;
					font-size: 28rpx;
				}
			}
			
			.remember-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 40rpx;
				
				.remember-text {
					font-size: 26rpx;
					color: #666;
					margin-left: 4rpx;
				}
				
				.forget-text {
					font-size: 26rpx;
					color: #2d8cf0;
				}
			}
			
			.login-btn {
				width: 100%;
				height: 80rpx;
				background: #2d8cf0;
				color: #fff;
				border-radius: 8rpx;
				font-size: 28rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		
		.status-tip {
			text-align: center;
			font-size: 28rpx;
			color: #666666;
			
			&.error {
				color: #FF4D4F;
			}
		}
	}
}
</style> 