"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false,
      userInfo: {
        avatar: "",
        nickname: "",
        department: ""
      }
    };
  },
  methods: {
    handleLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            this.isLoggedIn = false;
            this.isAdmin = false;
            this.userInfo = {
              avatar: "",
              nickname: "",
              department: ""
            };
          }
        }
      });
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    checkLoginStatus() {
      common_vendor.index.getStorageSync("token");
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.isLoggedIn = true;
        this.userInfo = userInfo;
        this.isAdmin = userInfo.role === "admin";
      }
    }
  },
  onShow() {
    this.checkLoginStatus();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    b: $data.userInfo.avatar || "/static/user/默认.webp",
    c: common_vendor.t($data.userInfo.nickname),
    d: common_vendor.t($data.userInfo.department)
  } : {
    e: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args))
  }, {
    f: $data.isAdmin
  }, $data.isAdmin ? {
    g: common_vendor.o(($event) => $options.navigateTo("/pages/device/upload")),
    h: common_vendor.o(($event) => $options.navigateTo("/pages/device/overview")),
    i: common_vendor.o(($event) => $options.navigateTo("/pages/device/user"))
  } : {}, {
    j: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    k: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
