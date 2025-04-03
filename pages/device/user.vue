<template>
  <view class="container">
    <!-- 顶部标签页 -->
    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{'active': currentTab === 0}"
        @click="switchTab(0)"
      >
        <text>用户注册</text>
      </view>
      <view 
        class="tab-item" 
        :class="{'active': currentTab === 1}"
        @click="switchTab(1)"
      >
        <text>用户列表</text>
      </view>
    </view>
    
    <!-- 滑动区域 -->
    <swiper 
      class="swiper" 
      :current="currentTab"
      @change="handleSwiperChange"
    >
      <!-- 用户注册页面 -->
      <swiper-item>
        <form @submit="submitForm">
          <view class="form-item">
            <text class="label">用户名</text>
            <input 
              class="input" 
              v-model="userForm.username" 
              placeholder="请输入用户名"
              :class="{'error': errors.username}"
            />
            <text class="error-text" v-if="errors.username">{{errors.username}}</text>
          </view>
          
          <view class="form-item">
            <text class="label">密码</text>
            <input 
              class="input" 
              v-model="userForm.password" 
              type="password" 
              placeholder="请输入密码"
              :class="{'error': errors.password}"
            />
            <text class="error-text" v-if="errors.password">{{errors.password}}</text>
          </view>
          
          <view class="form-item">
            <text class="label">手机号</text>
            <input 
              class="input" 
              v-model="userForm.phone" 
              placeholder="请输入手机号"
              :class="{'error': errors.phone}"
            />
            <text class="error-text" v-if="errors.phone">{{errors.phone}}</text>
          </view>
          <view class="form-item">
            <text class="label">部门</text>
            <view class="picker-trigger" @click="showDepartmentPicker">
              <text class="picker-value">{{userForm.department || '请选择部门'}}</text>
              <text class="picker-arrow">></text>
            </view>
          </view>
          <view class="form-item">
            <text class="label">角色</text>
            <radio-group class="radio-group" @change="handleRoleChange">
              <label class="radio-label">
                <radio value="user" :checked="userForm.role === 'user'" color="#007AFF" />
                <text>普通用户</text>
              </label>
              <label class="radio-label">
                <radio value="admin" :checked="userForm.role === 'admin'    " color="#007AFF" />
                <text>管理员</text>
              </label>
            </radio-group>
          </view>
          
          <view class="btn-submit">
            <button class="submit-btn" form-type="submit" type="primary">提交</button>
          </view>
        </form>
      </swiper-item>
      
      <!-- 用户列表页面 -->
      <swiper-item>
        <view class="user-list">
          <view class="search-box">
            <input 
              class="search-input" 
              v-model="searchKey" 
              placeholder="搜索用户名或手机号"
              @input="handleSearch"
            />
          </view>
          
          <view class="list-content">
            <view 
              class="user-item" 
              v-for="(item, index) in filteredUserList" 
              :key="index"
            >
              <view class="user-info">
                <text class="username">{{item.username}}</text>
                <text class="phone">{{item.phone}}</text>
                <text class="role">{{item.role === 'user' ? '普通用户' : '管理员'}}</text>
              </view>
              <view class="actions">
                <text class="action-btn edit" @click="handleEdit(item)">编辑</text>
                <text class="action-btn delete" @click="handleDelete(item)">删除</text>
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      userForm: {
        username: '',
        password: '',
        phone: '',
        role: 'user',
        department: ''
      },
      errors: {
        username: '',
        password: '',
        phone: ''
      },
      // 模拟用户数据
      userList: [
      ],
      searchKey: '',
      departmentOptions: [
        { label: '财务组', value: '财务组' },
        { label: '硬件组', value: '硬件组' },
        { label: '光学组', value: '光学组' },
        { label: '软件组', value: '软件组' }
      ]
    }
  },
  computed: {
    filteredUserList() {
      if (!this.searchKey) return this.userList
      const key = this.searchKey.toLowerCase()
      return this.userList.filter(item => 
        item.username.toLowerCase().includes(key) || 
        item.phone.includes(key)
      )
    }
  },
  methods: {
    switchTab(index) {
      // 切换到用户列表页面
      this.currentTab = index
      // 获取用户列表
      if (index === 1) {
        this.getList()
      }
    },
    handleSwiperChange(e) {
      this.currentTab = e.detail.current
      // 获取用户列表
      if (this.currentTab === 1) {
        this.getList()
      }
    },
    validateForm() {
      let isValid = true
      this.errors = {
        username: '',
        password: '',
        phone: ''
      }
      
      if (!this.userForm.username) {
        this.errors.username = '请输入用户名'
        isValid = false
      }
      
      if (!this.userForm.password) {
        this.errors.password = '请输入密码'
        isValid = false
      }
      
      if (!this.userForm.phone) {
        this.errors.phone = '请输入手机号'
        isValid = false
      } else if (!/^1[3-9]\d{9}$/.test(this.userForm.phone)) {
        this.errors.phone = '请输入正确的手机号'
        isValid = false
      }
      
      return isValid
    },
    handleRoleChange(e) {
      this.userForm.role = parseInt(e.detail.value)
    },
    handleDepartmentChange(e) {
      this.userForm.department = e.detail.value
    },
   async submitForm() {
      if (this.validateForm()) {
        uni.showLoading({
          title: '提交中'
        })
        // 模拟API调用
         const res = await this.$api.user_add(this.userForm)
         console.log(res)
          uni.hideLoading()
          // 重置表单
          this.userForm = {
            username: '',
            password: '',
            phone: '',
            role: 'user',
            department: ''
          }
          // 切换到用户列表页面
          this.switchTab(1)

      }
    },
    handleSearch() {
      // 搜索功能已通过计算属性实现
    },
    handleEdit(user) {
      uni.showModal({
        title: '编辑用户',
        content: '确定要编辑该用户吗？',
        success: (res) => {
          if (res.confirm) {
            // 跳转到编辑页面或显示编辑弹窗
            uni.showToast({
              title: '编辑功能开发中',
              icon: 'none'
            })
          }
        }
      })
    },
    handleDelete(user) {
      uni.showModal({
        title: '删除用户',
        content: '确定要删除该用户吗？',
        success: async (res) => {
          if (res.confirm) {
            const index = this.userList.findIndex(item => item._id === user._id)
            console.log(index, this.userList);
            if (index > -1) {
              const res = await this.$api.user_delete({id: this.userList[index]._id})
              if (res.code === 0) {
                this.getList()
              }
            }
          }
        }
      })
    },
    async getList() {
      const res = await this.$api.user_list()
      this.userList = res.data.data
    },
    showDepartmentPicker() {
      uni.showActionSheet({
        itemList: this.departmentOptions.map(item => item.label),
        success: (res) => {
          this.userForm.department = this.departmentOptions[res.tapIndex].value;
        },
        fail: (res) => {
          console.log(res.errMsg);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.tabs {
  display: flex;
  background-color: #fff;
  padding: 20rpx 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  
  .tab-item {
    flex: 1;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    position: relative;
    
    &.active {
      color: #007AFF;
      font-weight: bold;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -10rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #007AFF;
        border-radius: 2rpx;
      }
    }
  }
}

.swiper {
  height: calc(100vh - 88rpx);
  margin-top: 88rpx;
}

// 用户注册表单样式
.form-item {
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
  
  .label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
  }
  
  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    padding: 0 20rpx;
    border: 1px solid #ddd;
    border-radius: 4rpx;
    
    &.error {
      border-color: #ff4d4f;
    }
  }
  
  .error-text {
    font-size: 24rpx;
    color: #ff4d4f;
    margin-top: 8rpx;
    display: block;
  }
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  
  .radio-label {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #333;
    
    text {
      margin-left: 10rpx;
    }
  }
}

.btn-submit {
  margin-top: 60rpx;
  padding: 0 20rpx;
  
  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background-color: #007AFF;
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
  }
}

// 用户列表样式
.user-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .search-box {
    padding: 20rpx;
    background-color: #fff;
    
    .search-input {
      width: 100%;
      height: 72rpx;
      background-color: #f5f5f5;
      border-radius: 36rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
    }
  }
  
  .list-content {
    flex: 1;
    overflow-y: auto;
    padding: 20rpx;
    
    .user-item {
      background-color: #fff;
      border-radius: 8rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .user-info {
        flex: 1;
        
        .username {
          font-size: 32rpx;
          color: #333;
          font-weight: bold;
          display: block;
        }
        
        .phone {
          font-size: 28rpx;
          color: #666;
          margin-top: 8rpx;
          display: block;
        }
        
        .role {
          font-size: 24rpx;
          color: #007AFF;
          margin-top: 8rpx;
          display: block;
        }
      }
      
      .actions {
        display: flex;
        gap: 20rpx;
        
        .action-btn {
          font-size: 28rpx;
          padding: 10rpx 20rpx;
          border-radius: 4rpx;
          
          &.edit {
            color: #007AFF;
            background-color: rgba(0, 122, 255, 0.1);
          }
          
          &.delete {
            color: #ff4d4f;
            background-color: rgba(255, 77, 79, 0.1);
          }
        }
      }
    }
  }
}

.picker-trigger {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  border: 1px solid #ddd;
  border-radius: 4rpx;
  background-color: #fff;
  
  .picker-value {
    font-size: 28rpx;
    color: #333;
    
    &:empty::before {
      content: '请选择部门';
      color: #999;
    }
  }
  
  .picker-arrow {
    color: #999;
    font-size: 28rpx;
    transform: rotate(90deg);
  }
}
</style>
