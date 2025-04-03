<template>
	<view class="container">
		<view class="statistics">
			<view class="stat-item">
				<text class="stat-number">{{totalDevices}}</text>
				<text class="stat-label">设备总数</text>
			</view>
			<view class="stat-item">
				<text class="stat-number">{{borrowedDevices}}</text>
				<text class="stat-label">已借出</text>
			</view>
			<view class="stat-item">
				<text class="stat-number">{{availableDevices}}</text>
				<text class="stat-label">可用设备</text>
			</view>
			<view class="stat-item">
				<text class="stat-number warning">{{overdueDevices}}</text>
				<text class="stat-label">逾期设备</text>
			</view>
		</view>
		
		<view class="search-section">
			<view class="search-box">
				<text class="iconfont icon-search"></text>
				<input 
					type="text" 
					v-model="searchKeyword"
					placeholder="搜索设备名称或编号"
					@confirm="handleSearch"
					@input="handleSearch"
				/>
				<text class="clear-btn" @tap="handleClear" v-if="searchKeyword">×</text>
			</view>
		</view>
		
		<view class="filter-section">
			<view class="filter-item">
				<text class="label">设备类型</text>
				<picker class="picker" :range="deviceTypes" @change="handleTypeChange">
					<view class="picker-text">{{selectedType || '全部'}}</view>
				</picker>
			</view>
			<view class="filter-item">
				<text class="label">设备状态</text>
				<picker class="picker" :range="statusTypes" @change="handleStatusChange">
					<view class="picker-text">{{selectedStatus || '全部'}}</view>
				</picker>
			</view>
		</view>
		
		<view class="device-list">
			<view v-for="(device, index) in devices" :key="index" 
				class="device-item"
				:class="{ 
					'slide-active': device.isSlide, 
					'overdue': device.nextMaintenanceDate && new Date(device.nextMaintenanceDate) < new Date(),
					'available': device.status === 'available',
					'borrowed': device.status === 'borrowed' && (!device.nextMaintenanceDate || new Date(device.nextMaintenanceDate) >= new Date())
				}"
			>
				<view class="device-content" 
					@touchstart="touchStart($event, index)"
					@touchmove="touchMove($event, index)"
					@touchend="touchEnd($event, index)"
				>
					<view class="overdue-watermark" v-if="device.nextMaintenanceDate && new Date(device.nextMaintenanceDate) < new Date()">逾期</view>
					<view class="available-watermark" v-if="device.status === 'available'">可用</view>
					<view class="borrowed-watermark" v-if="device.status === 'borrowed' && (!device.nextMaintenanceDate || new Date(device.nextMaintenanceDate) >= new Date())">已借出</view>
					<image class="device-image" 
						:src="device.url || device.image" 
						mode="aspectFill"
						@tap="previewImage(device.image)"
					></image>
					<view class="device-info">
						<view class="device-header">
							<text class="device-name">{{device.name}}</text>
							<text class="device-code">{{device.code}}</text>
						</view>
						<view class="device-detail">
							<text class="device-type">{{device.type}}</text>
							<text class="device-status" :class="device.status">{{getStatusText(device.status)}}</text>
						</view>
						<view class="device-borrow" >
							<text>借用人：{{device.username}}</text>
							<text v-if="device.lastMaintenanceDate">归还日期：{{formatDate(device.nextMaintenanceDate)}}</text>
						</view>
					</view>
				</view>
				<view class="delete-btn" @tap="handleDelete(device)">
					<text>删除</text>
				</view>
				<view class="edit-btn" @tap="handleEdit(device)">
					<text>编辑</text>
				</view>
			</view>
		</view>
		
		<view class="empty-tip" v-if="devices.length === 0">
			<!-- <image class="empty-icon" src="/static/empty-device.png" mode="aspectFit"></image> -->
			<text>暂无设备数据</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			deviceTypes: ['全部', '办公设备', '电子设备', '家具', '其他'],
			statusTypes: ['全部', '可用', '已借出', '维护中', '已报废'],
			selectedType: '全部',
			selectedStatus: '全部',
			totalDevices: 0,
			borrowedDevices: 0,
			availableDevices: 0,
			overdueDevices: 0,
			devices: [],
			searchKeyword: '',
			startX: 0,
			moveX: 0,
			currentIndex: ''
		}
	},
	methods: {
		touchStart(e, index) {
			this.startX = e.touches[0].clientX
			this.currentIndex = index
		},
		touchMove(e, index) {
			if (this.currentIndex !== index) return
			this.moveX = e.touches[0].clientX - this.startX
			if (this.moveX < 0) {
				this.$set(this.devices[index], 'isSlide', true)
			} else {
				this.$set(this.devices[index], 'isSlide', false)
			}
		},
		touchEnd(e, index) {
			if (this.currentIndex !== index) return
			if (this.moveX < -50) {
				this.$set(this.devices[index], 'isSlide', true)
			} else {
				this.$set(this.devices[index], 'isSlide', false)
			}
			this.currentIndex = -1
		},
		async handleDelete(device) {
			let _this = this
			uni.showModal({
				title: '确认删除',
				content: '确定要删除该设备吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await _this.$api.device_delete({ id: device._id })
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							_this.fetchDevices()
						} catch (error) {
							uni.showToast({
								title: '删除失败',
								icon: 'error'
							})
						}
					}
				}
			})
		},
		handleSearch(e) {
			this.filterDevices()
		},
		handleClear() {
			this.searchKeyword = ''
			this.filterDevices()
		},
		filterDevices() {
			
			// 根据搜索关键词过滤
			if (this.searchKeyword) {
				this.devices = this.devices.filter(device => 
					device.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
					device.code.toLowerCase().includes(this.searchKeyword.toLowerCase())
				)
			} else {
				this.fetchDevices()
			}
		},
		updateStatistics() {
			this.totalDevices = this.devices.length
			this.borrowedDevices = this.devices.filter(e => e.status === 'borrowed').length
			this.availableDevices = this.devices.filter(e => e.status === 'available').length
			this.overdueDevices = this.devices.filter(e =>  e.nextMaintenanceDate < new Date()).length
		},
		async handleTypeChange(e) {
			await this.fetchDevices()
			this.selectedType = this.deviceTypes[e.detail.value]
			this.devices = this.devices.filter(e => (this.selectedType === '全部' || (e.type === this.selectedType)) && (this.selectedStatus === '全部' || (this.getStatusText(e.status) === this.selectedStatus)))
		},
		async handleStatusChange(e) {
			await this.fetchDevices()
			this.selectedStatus = this.statusTypes[e.detail.value]
			this.devices = this.devices.filter(e => (this.selectedType === '全部' || (e.type === this.selectedType)) && (this.selectedStatus === '全部' || (this.getStatusText(e.status) == this.selectedStatus)))
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
		formatDate(date) {
			return  new Date(date).toLocaleDateString()
		},
		async fetchDevices() {
			// TODO: 调用后端API获取设备列表和统计数据
			const { data } = await this._deviceAll()
			console.log(data);
			// 模拟数据
			this.totalDevices = data.length
			this.borrowedDevices = data.filter(e => e.status === 'borrowed').length
			this.availableDevices = data.filter(e => e.status === 'available').length
			this.overdueDevices = data.filter(e => e.nextMaintenanceDate && new Date(e.nextMaintenanceDate) < new Date()).length
			this.devices = data
			console.log(this.devices);
		},
		async _deviceAll() {
			const res= await this.$api.device_all({})
			return res
		},
		previewImage(url) {
			uni.previewImage({
				urls: [url],
				current: url
			})
		},
		handleEdit(device) {
			// 将设备数据转换为编辑页面需要的格式
			const editData = {
				...device,
				// 确保日期格式正确
				purchaseDate: device.purchaseDate ? new Date(device.purchaseDate).toISOString().split('T')[0] : '',
				lastMaintenanceDate: device.lastMaintenanceDate ? new Date(device.lastMaintenanceDate).toISOString().split('T')[0] : '',
				nextMaintenanceDate: device.nextMaintenanceDate ? new Date(device.nextMaintenanceDate).toISOString().split('T')[0] : ''
			}
			
			// 跳转到编辑页面并传递数据
			uni.navigateTo({
				url: `/pages/device/upload?mode=edit&data=${encodeURIComponent(JSON.stringify(editData))}`
			})
			// 关闭按钮
			this.currentIndex = ''
		}
	},
	onShow() {
		this.fetchDevices()
	}
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding: 20rpx;
	
	.search-section {
		margin-bottom: 20rpx;
		
		.search-box {
			position: relative;
			background-color: #FFFFFF;
			border-radius: 30rpx;
			padding: 0 30rpx;
			height: 70rpx;
			display: flex;
			align-items: center;
			
			.icon-search {
				font-size: 32rpx;
				color: #999;
				margin-right: 10rpx;
			}
			
			input {
				flex: 1;
				height: 100%;
				font-size: 28rpx;
			}
			
			.clear-btn {
				font-size: 40rpx;
				color: #999;
				padding: 0 10rpx;
			}
		}
	}
	
	.statistics {
		display: flex;
		justify-content: space-between;
		background-color: #FFFFFF;
		padding: 30rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		
		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.stat-number {
				font-size: 36rpx;
				font-weight: bold;
				color: #333333;
				margin-bottom: 10rpx;
				
				&.warning {
					color: #FF4D4F;
				}
			}
			
			.stat-label {
				font-size: 24rpx;
				color: #666666;
			}
		}
	}
	
	.filter-section {
		display: flex;
		justify-content: space-between;
		background-color: #FFFFFF;
		padding: 20rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		
		.filter-item {
			flex: 1;
			margin: 0 10rpx;
			
			.label {
				display: block;
				font-size: 24rpx;
				color: #666666;
				margin-bottom: 10rpx;
			}
			
			.picker {
				height: 60rpx;
				background-color: #F5F5F5;
				border-radius: 8rpx;
				padding: 0 20rpx;
				
				.picker-text {
					line-height: 60rpx;
					font-size: 28rpx;
					color: #333333;
				}
			}
		}
	}
	
	.device-list {
		.device-item {
			position: relative;
			width: 100%;
			overflow: hidden;
			margin-bottom: 20rpx;
			
			.overdue-watermark,
			.available-watermark,
			.borrowed-watermark {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%) rotate(-45deg);
				font-size: 80rpx;
				font-weight: bold;
				z-index: 1;
				pointer-events: none;
			}
			
			.overdue-watermark {
				color: rgba(255, 77, 79, 0.2);
			}
			
			.available-watermark {
				color: rgba(82, 196, 26, 0.2);
			}
			
			.borrowed-watermark {
				color: rgba(250, 140, 22, 0.2);
			}
			
			&.overdue {
				.device-content {
					background-color: #FFE6E6;
					border: 2rpx solid #FF4D4F;
					position: relative;
				}
				
				.device-name,
				.device-code,
				.device-type,
				.device-status,
				.device-borrow text {
					color: #FF4D4F;
				}
				
				.device-status {
					background-color: #FF4D4F;
					color: #FFFFFF;
				}
			}
			
			&.available {
				.device-content {
					background-color: #F6FFED;
					border: 2rpx solid #52C41A;
					position: relative;
				}
				
				.device-name,
				.device-code,
				.device-type,
				.device-status,
				.device-borrow text {
					color: #52C41A;
				}
				
				.device-status {
					background-color: #52C41A;
					color: #FFFFFF;
				}
			}
			
			&.borrowed {
				.device-content {
					background-color: #FFF7E6;
					border: 2rpx solid #FA8C16;
					position: relative;
				}
				
				.device-name,
				.device-code,
				.device-type,
				.device-status,
				.device-borrow text {
					color: #FA8C16;
				}
				
				.device-status {
					background-color: #FA8C16;
					color: #FFFFFF;
				}
			}
			
			.device-content {
				background-color: #FFFFFF;
				padding: 20rpx;
				border-radius: 12rpx;
				transition: transform 0.3s;
				display: flex;
				position: relative;
				z-index: 2;
				transform: translateX(0);
				
				.device-image {
					width: 160rpx;
					height: 160rpx;
					border-radius: 8rpx;
					margin-right: 20rpx;
				}
				
				.device-info {
					flex: 1;
					
					.device-header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 10rpx;
						
						.device-name {
							font-size: 32rpx;
							font-weight: bold;
							color: #333333;
						}
						
						.device-code {
							font-size: 24rpx;
							color: #999999;
						}
					}
					
					.device-detail {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 10rpx;
						
						.device-type {
							font-size: 24rpx;
							color: #666666;
						}
						
						.device-status {
							font-size: 24rpx;
							padding: 4rpx 12rpx;
							border-radius: 4rpx;
							
							&.available {
								background-color: #F6FFED;
								color: #52C41A;
							}
							
							&.borrowed {
								background-color: #E6F7FF;
								color: #1890FF;
							}
							
							&.maintenance {
								background-color: #FFF7E6;
								color: #FA8C16;
							}
							
							&.scrapped {
								background-color: #FFF1F0;
								color: #FF4D4F;
							}
						}
					}
					
					.device-borrow {
						display: flex;
						flex-direction: column;
						
						text {
							font-size: 24rpx;
							color: #666666;
							margin-top: 6rpx;
						}
					}
				}
			}
			
			.delete-btn {
				position: absolute;
				right: 0;
				top: 0;
				width: 120rpx;
				height: 100%;
				background-color: #FF4D4F;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 1;
				opacity: 0;
				transition: opacity 0.3s;
				
				text {
					color: #FFFFFF;
					font-size: 28rpx;
				}
			}
			
			.edit-btn {
				position: absolute;
				right: 120rpx;
				top: 0;
				width: 120rpx;
				height: 100%;
				background-color: #1890FF;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 1;
				opacity: 0;
				transition: opacity 0.3s;
				
				text {
					color: #FFFFFF;
					font-size: 28rpx;
				}
			}
			
			&.slide-active {
				.device-content {
					transform: translateX(-240rpx);
				}
				
				.delete-btn,
				.edit-btn {
					opacity: 1;
				}
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