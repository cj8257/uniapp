<template>
	<view class="container">
		<view class="reset-box">
			<view class="title">重置密码</view>
			<view class="form-box">
				<view class="form-item">
					<input class="input" type="text" v-model="form.username" placeholder="请输入用户名" />
				</view>
				<view class="form-item">
					<input class="input" type="password" v-model="form.oldPassword" placeholder="请输入原密码" />
				</view>
				<view class="form-item">
					<input class="input" type="password" v-model="form.newPassword" placeholder="请输入新密码" />
				</view>
				<view class="form-item">
					<input class="input" type="password" v-model="form.confirmPassword" placeholder="请确认新密码" />
				</view>
				<button class="submit-btn" @click="handleReset" :loading="loading">确认重置</button>
				<button class="back-btn" @click="goBack">返回登录</button>
			</view>
			
			<view class="status-tip" :class="{'error': status === 'error'}">
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
				oldPassword: '',
				newPassword: '',
				confirmPassword: ''
			},
			loading: false,
			status: '',
			statusText: ''
		}
	},
	methods: {
		async handleReset() {
			if (!this.form.username || !this.form.oldPassword || !this.form.newPassword || !this.form.confirmPassword) {
				this.status = 'error'
				this.statusText = '请填写完整信息'
				return
			}
			
			if (this.form.newPassword !== this.form.confirmPassword) {
				this.status = 'error'
				this.statusText = '两次输入的新密码不一致'
				return
			}
			
			this.loading = true
			try {
				// TODO: 调用重置密码API
				await new Promise(resolve => setTimeout(resolve, 1500))
				
				this.status = 'success'
				this.statusText = '密码重置成功'
				
				setTimeout(() => {
					this.goBack()
				}, 1500)
				
			} catch (error) {
				this.status = 'error'
				this.statusText = '密码重置失败，请重试'
			} finally {
				this.loading = false
			}
		},
		goBack() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding: 40rpx;
	
	.reset-box {
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 60rpx 40rpx;
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
		
		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333333;
			text-align: center;
			margin-bottom: 60rpx;
		}
		
		.form-box {
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
			
			.submit-btn {
				width: 100%;
				height: 80rpx;
				background: #2d8cf0;
				color: #fff;
				border-radius: 8rpx;
				font-size: 28rpx;
				margin-bottom: 20rpx;
			}
			
			.back-btn {
				width: 100%;
				height: 80rpx;
				background: #fff;
				color: #666;
				border: 1px solid #ddd;
				border-radius: 8rpx;
				font-size: 28rpx;
			}
		}
		
		.status-tip {
			text-align: center;
			font-size: 28rpx;
			color: #666666;
			margin-top: 30rpx;
			
			&.error {
				color: #FF4D4F;
			}
		}
	}
}
</style> 