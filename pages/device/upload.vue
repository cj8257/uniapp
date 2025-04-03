<template>
	<view class="container">
		<view class="form-title">{{ isEdit ? '编辑设备' : '添加设备' }}</view>
		<view class="form-box">
			<view class="form-item">
				<text class="label">设备名称</text>
				<input class="input" v-model="formData.name" placeholder="请输入设备名称" />
			</view>
			
			<view class="form-item">
				<text class="label">设备类型</text>
				<picker class="picker" :range="deviceTypes" @change="handleTypeChange">
					<view class="picker-text">{{selectedType || '请选择设备类型'}}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">设备编号</text>
				<input class="input" v-model="formData.code" placeholder="请输入设备编号" />
			</view>
			
			<view class="form-item">
				<text class="label">设备图片</text>
				<view class="image-upload" @click="chooseImage">
					<image v-if="formData.url" :src="formData.url" mode="aspectFill" class="preview-image"></image>
					<view v-else class="upload-placeholder">
						<text class="iconfont icon-camera"></text>
						<text>点击上传图片</text>
					</view>
				</view>
			</view>
			
			<view class="form-item">
				<text class="label">设备描述</text>
				<textarea class="textarea" v-model="formData.description" placeholder="请输入设备描述" />
			</view>
			
			<view class="form-item">
				<text class="label">设备状态</text>
				<radio-group class="radio-group" @change="handleStatusChange">
					<label class="radio-label">
						<radio value="available" :checked="formData.status === 'available'" />
						<text>可用</text>
					</label>
					<label class="radio-label">
						<radio value="borrowed" :checked="formData.status === 'borrowed'" />
						<text>已借出</text>
					</label>
					<label class="radio-label">
						<radio value="maintenance" :checked="formData.status === 'maintenance'" />
						<text>维护中</text>
					</label>
					<label class="radio-label">
						<radio value="scrapped" :checked="formData.status === 'scrapped'" />
						<text>已报废</text>
					</label>
				</radio-group>
			</view>
		</view>
		
		<view class="button-group">
			<button class="submit-btn" @click="handleSubmit">提交</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: {
				name: '',
				code: '',
				type: '',
				status: 'available',
				image: '',
				description: '',
				purchaseDate: '',
				lastMaintenanceDate: '',
				nextMaintenanceDate: '',
				price: '',
				location: '',
				manufacturer: '',
				model: '',
				specification: '',
				serialNumber: '',
				warrantyPeriod: '',
				maintenanceCycle: '',
				lastMaintenanceContent: '',
				nextMaintenanceContent: '',
				remark: '',
				phone: '' ,
				username: ''
			},
			deviceTypes: ['办公设备', '电子设备', '家具', '其他'],
			statusTypes: ['可用', '已借出', '维护中', '已报废'],
			selectedType: '',
			selectedStatus: '',
			imageList: [],
			isEdit: false,
			editId: ''
		}
	},
	onLoad(options) {
		// 检查是否是编辑模式
		if (options.mode === 'edit' && options.data) {
			try {
				const editData = JSON.parse(decodeURIComponent(options.data))
				this.isEdit = true
				this.editId = editData._id
				
				// 填充表单数据
				this.formData = {
					...this.formData,
					...editData,
					// 确保日期格式正确
					purchaseDate: editData.purchaseDate || '',
					lastMaintenanceDate: editData.lastMaintenanceDate || '',
					nextMaintenanceDate: editData.nextMaintenanceDate || ''
				}
				
				// 设置选择器值
				this.selectedType = editData.type
				this.selectedStatus = this.getStatusText(editData.status)
				
				// 如果有图片，添加到图片列表
				if (editData.image) {
					this.imageList = [editData.image]
				}
			} catch (error) {
				console.error('解析编辑数据失败:', error)
				uni.showToast({
					title: '数据加载失败',
					icon: 'none'
				})
			}
		}
	},
	methods: {
		handleTypeChange(e) {
			this.selectedType = this.deviceTypes[e.detail.value]
		},
		handleStatusChange(e) {
			this.formData.status = e.detail.value
		},
		chooseImage() {
			uni.chooseImage({
				count: 1,
				success: async (res) => {
					this.formData.image = res.tempFilePaths[0]
					console.log(res);
					let url  = Math.random().toString(36).substring(2, 15) + '.jpg'
					const filePath = await this._uploadFile(res.tempFilePaths[0], url)
					this.formData.url = filePath
				}
			})
		},
		async _uploadFile (filePath, cloudPath) {
		  const { fileID } = await uniCloud.uploadFile({
		    filePath,
		    cloudPath:`device/${cloudPath}`,
			cloudPathAsRealPath:true
		  })
		  return fileID
		},
		async handleSubmit() {
			// 表单验证
			if (!this.validateForm()) {
				return
			}
			
			try {
				const submitData = {
					...this.formData,
					type: this.selectedType,
					status: this.getStatusValue(this.selectedStatus)
				}
				delete submitData.isSlide
				if (this.isEdit) {
					// 编辑模式
					await this.$api.device_upload({
						...submitData,
						_id: this.editId,
						isEdit: true
					})
					uni.showToast({
						title: '更新成功',
						icon: 'success'
					})
				} else {
					// 新增模式
					await this.$api.device_upload(submitData)
					uni.showToast({
						title: '添加成功',
						icon: 'success'
					})
				}
				
				// 返回上一页并刷新
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			} catch (error) {
				console.error('提交失败:', error)
				uni.showToast({
					title: this.isEdit ? '更新失败' : '添加失败',
					icon: 'none'
				})
			}
		},
		getStatusText(status) {
			const statusMap = {
				available: '可用',
				borrowed: '已借出',
				maintenance: '维护中',
				scrapped: '已报废'
			}
			return statusMap[status] || status
		},
		getStatusValue(text) {
			const statusMap = {
				'可用': 'available',
				'已借出': 'borrowed',
				'维护中': 'maintenance',
				'已报废': 'scrapped'
			}
			return statusMap[text] || 'available'
		},
		validateForm() {
			if (!this.formData.name) {
				uni.showToast({
					title: '请输入设备名称',
					icon: 'none'
				})
				return false
			}
			if (!this.selectedType) {
				uni.showToast({
					title: '请选择设备类型',
					icon: 'none'
				})
				return false
			}
			if (!this.formData.code) {
				uni.showToast({
					title: '请输入设备编号',
					icon: 'none'
				})
				return false
			}
			return true
		}
	},
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding: 20rpx;
	
	.form-box {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		padding: 20rpx;
		
		.form-item {
			margin-bottom: 30rpx;
			
			.label {
				display: block;
				font-size: 28rpx;
				color: #333333;
				margin-bottom: 10rpx;
			}
			
			.input {
				width: 100%;
				height: 80rpx;
				background-color: #F5F5F5;
				border-radius: 8rpx;
				padding: 0 20rpx;
				font-size: 28rpx;
			}
			
			.picker {
				width: 100%;
				height: 80rpx;
				background-color: #F5F5F5;
				border-radius: 8rpx;
				padding: 0 20rpx;
				
				.picker-text {
					line-height: 80rpx;
					font-size: 28rpx;
					color: #333333;
				}
			}
			
			.textarea {
				width: 100%;
				height: 200rpx;
				background-color: #F5F5F5;
				border-radius: 8rpx;
				padding: 20rpx;
				font-size: 28rpx;
			}
			
			.image-upload {
				width: 200rpx;
				height: 200rpx;
				background-color: #F5F5F5;
				border-radius: 8rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				
				.preview-image {
					width: 100%;
					height: 100%;
					border-radius: 8rpx;
				}
				
				.upload-placeholder {
					text-align: center;
					
					.iconfont {
						font-size: 48rpx;
						color: #999999;
						margin-bottom: 10rpx;
					}
					
					text {
						font-size: 24rpx;
						color: #999999;
					}
				}
			}
			
			.radio-group {
				display: flex;
				flex-wrap: wrap;
				
				.radio-label {
					margin-right: 40rpx;
					margin-bottom: 20rpx;
					
					text {
						font-size: 28rpx;
						color: #333333;
					}
				}
			}
		}
	}
	
	.button-group {
		margin-top: 40rpx;
		padding: 0 20rpx;
		
		.submit-btn {
			width: 100%;
			height: 88rpx;
			background-color: #007AFF;
			color: #FFFFFF;
			font-size: 32rpx;
			border-radius: 44rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style> 