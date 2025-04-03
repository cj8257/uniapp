"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentTab: 0,
      userForm: {
        username: "",
        password: "",
        phone: "",
        role: "user",
        department: ""
      },
      errors: {
        username: "",
        password: "",
        phone: ""
      },
      // 模拟用户数据
      userList: [],
      searchKey: "",
      departmentOptions: [
        { label: "财务组", value: "财务组" },
        { label: "硬件组", value: "硬件组" },
        { label: "光学组", value: "光学组" },
        { label: "软件组", value: "软件组" }
      ]
    };
  },
  computed: {
    filteredUserList() {
      if (!this.searchKey)
        return this.userList;
      const key = this.searchKey.toLowerCase();
      return this.userList.filter(
        (item) => item.username.toLowerCase().includes(key) || item.phone.includes(key)
      );
    }
  },
  methods: {
    switchTab(index) {
      this.currentTab = index;
      if (index === 1) {
        this.getList();
      }
    },
    handleSwiperChange(e) {
      this.currentTab = e.detail.current;
      if (this.currentTab === 1) {
        this.getList();
      }
    },
    validateForm() {
      let isValid = true;
      this.errors = {
        username: "",
        password: "",
        phone: ""
      };
      if (!this.userForm.username) {
        this.errors.username = "请输入用户名";
        isValid = false;
      }
      if (!this.userForm.password) {
        this.errors.password = "请输入密码";
        isValid = false;
      }
      if (!this.userForm.phone) {
        this.errors.phone = "请输入手机号";
        isValid = false;
      } else if (!/^1[3-9]\d{9}$/.test(this.userForm.phone)) {
        this.errors.phone = "请输入正确的手机号";
        isValid = false;
      }
      return isValid;
    },
    handleRoleChange(e) {
      this.userForm.role = parseInt(e.detail.value);
    },
    handleDepartmentChange(e) {
      this.userForm.department = e.detail.value;
    },
    async submitForm() {
      if (this.validateForm()) {
        common_vendor.index.showLoading({
          title: "提交中"
        });
        const res = await this.$api.user_add(this.userForm);
        common_vendor.index.__f__("log", "at pages/device/user.vue:221", res);
        common_vendor.index.hideLoading();
        this.userForm = {
          username: "",
          password: "",
          phone: "",
          role: "user",
          department: ""
        };
        this.switchTab(1);
      }
    },
    handleSearch() {
    },
    handleEdit(user) {
      common_vendor.index.showModal({
        title: "编辑用户",
        content: "确定要编辑该用户吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "编辑功能开发中",
              icon: "none"
            });
          }
        }
      });
    },
    handleDelete(user) {
      common_vendor.index.showModal({
        title: "删除用户",
        content: "确定要删除该用户吗？",
        success: async (res) => {
          if (res.confirm) {
            const index = this.userList.findIndex((item) => item._id === user._id);
            common_vendor.index.__f__("log", "at pages/device/user.vue:261", index, this.userList);
            if (index > -1) {
              const res2 = await this.$api.user_delete({ id: this.userList[index]._id });
              if (res2.code === 0) {
                this.getList();
              }
            }
          }
        }
      });
    },
    async getList() {
      const res = await this.$api.user_list();
      this.userList = res.data.data;
    },
    showDepartmentPicker() {
      common_vendor.index.showActionSheet({
        itemList: this.departmentOptions.map((item) => item.label),
        success: (res) => {
          this.userForm.department = this.departmentOptions[res.tapIndex].value;
        },
        fail: (res) => {
          common_vendor.index.__f__("log", "at pages/device/user.vue:283", res.errMsg);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentTab === 0 ? 1 : "",
    b: common_vendor.o(($event) => $options.switchTab(0)),
    c: $data.currentTab === 1 ? 1 : "",
    d: common_vendor.o(($event) => $options.switchTab(1)),
    e: $data.errors.username ? 1 : "",
    f: $data.userForm.username,
    g: common_vendor.o(($event) => $data.userForm.username = $event.detail.value),
    h: $data.errors.username
  }, $data.errors.username ? {
    i: common_vendor.t($data.errors.username)
  } : {}, {
    j: $data.errors.password ? 1 : "",
    k: $data.userForm.password,
    l: common_vendor.o(($event) => $data.userForm.password = $event.detail.value),
    m: $data.errors.password
  }, $data.errors.password ? {
    n: common_vendor.t($data.errors.password)
  } : {}, {
    o: $data.errors.phone ? 1 : "",
    p: $data.userForm.phone,
    q: common_vendor.o(($event) => $data.userForm.phone = $event.detail.value),
    r: $data.errors.phone
  }, $data.errors.phone ? {
    s: common_vendor.t($data.errors.phone)
  } : {}, {
    t: common_vendor.t($data.userForm.department || "请选择部门"),
    v: common_vendor.o((...args) => $options.showDepartmentPicker && $options.showDepartmentPicker(...args)),
    w: $data.userForm.role === "user",
    x: $data.userForm.role === "admin",
    y: common_vendor.o((...args) => $options.handleRoleChange && $options.handleRoleChange(...args)),
    z: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    A: common_vendor.o([($event) => $data.searchKey = $event.detail.value, (...args) => $options.handleSearch && $options.handleSearch(...args)]),
    B: $data.searchKey,
    C: common_vendor.f($options.filteredUserList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.username),
        b: common_vendor.t(item.phone),
        c: common_vendor.t(item.role === "user" ? "普通用户" : "管理员"),
        d: common_vendor.o(($event) => $options.handleEdit(item), index),
        e: common_vendor.o(($event) => $options.handleDelete(item), index),
        f: index
      };
    }),
    D: $data.currentTab,
    E: common_vendor.o((...args) => $options.handleSwiperChange && $options.handleSwiperChange(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-62d27a8b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/device/user.js.map
