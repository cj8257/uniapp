"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rememberPassword: false,
      loading: false,
      loginStatus: "",
      // success, error
      statusText: ""
    };
  },
  methods: {
    async handleLogin() {
      if (!this.form.username || !this.form.password) {
        this.loginStatus = "error";
        this.statusText = "请输入用户名和密码";
        return;
      }
      this.loading = true;
      try {
        const res = await this.$api.user_login(this.form);
        common_vendor.index.__f__("log", "at pages/login/login.vue:56", res);
        if (this.rememberPassword) {
          common_vendor.index.setStorageSync("savedUsername", this.form.username);
          common_vendor.index.setStorageSync("savedPassword", this.form.password);
        } else {
          common_vendor.index.removeStorageSync("savedUsername");
          common_vendor.index.removeStorageSync("savedPassword");
        }
        const userInfo = {
          avatar: res.data.data[0].avatar || "/static/user/默认.webp",
          nickname: res.data.data[0].username,
          department: res.data.data[0].department,
          role: res.data.data[0].role,
          phone: res.data.data[0].phone,
          username: res.data.data[0].username
        };
        common_vendor.index.setStorageSync("token", "mock-token");
        common_vendor.index.setStorageSync("userInfo", userInfo);
        common_vendor.index.showModal({
          title: "用户信息收集说明",
          content: "为了给您提供更好的服务，我们需要收集您的以下信息：\n\n1. 头像：用于在系统中显示您的个人头像\n2. 昵称：用于在系统中显示您的名称\n\n这些信息仅用于系统内部使用，我们承诺不会将您的信息用于其他用途或提供给第三方。\n\n您是否同意授权我们收集这些信息？",
          confirmText: "同意",
          cancelText: "拒绝",
          success: async (res2) => {
            if (res2.confirm) {
              try {
                const userProfile = await common_vendor.index.getUserProfile({
                  desc: "用于完善用户资料，提供个性化服务"
                });
                const updatedUserInfo = {
                  ...userInfo,
                  avatar: userProfile.userInfo.avatarUrl || userInfo.avatar,
                  nickname: userProfile.userInfo.nickName || userInfo.nickname
                };
                common_vendor.index.setStorageSync("userInfo", updatedUserInfo);
              } catch (err) {
                common_vendor.index.__f__("log", "at pages/login/login.vue:97", "用户拒绝授权", err);
              }
            }
            common_vendor.index.switchTab({
              url: "/pages/my/my"
            });
          }
        });
      } catch (error) {
        this.loginStatus = "error";
        this.statusText = "登录失败，请重试";
      } finally {
        this.loading = false;
      }
    },
    handleRememberChange(e) {
      this.rememberPassword = e.detail.value.length > 0;
    },
    goToReset() {
      common_vendor.index.navigateTo({
        url: "/pages/login/reset-password"
      });
    }
  },
  onLoad() {
    const savedUsername = common_vendor.index.getStorageSync("savedUsername");
    const savedPassword = common_vendor.index.getStorageSync("savedPassword");
    if (savedUsername && savedPassword) {
      this.form.username = savedUsername;
      this.form.password = savedPassword;
      this.rememberPassword = true;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.form.username,
    b: common_vendor.o(($event) => $data.form.username = $event.detail.value),
    c: $data.form.password,
    d: common_vendor.o(($event) => $data.form.password = $event.detail.value),
    e: $data.rememberPassword,
    f: common_vendor.o((...args) => $options.handleRememberChange && $options.handleRememberChange(...args)),
    g: common_vendor.o((...args) => $options.goToReset && $options.goToReset(...args)),
    h: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    i: $data.loading,
    j: common_vendor.t($data.statusText),
    k: $data.loginStatus === "error" ? 1 : ""
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
