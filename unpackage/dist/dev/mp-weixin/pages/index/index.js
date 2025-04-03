"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      borrowedCount: 0,
      overdueCount: 0
    };
  },
  methods: {
    handleBorrow() {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      common_vendor.index.scanCode({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:51", res);
          common_vendor.index.showActionSheet({
            itemList: ["7天", "15天", "30天"],
            success: async (e) => {
              const days = [7, 15, 30][e.tapIndex];
              const userInfo = common_vendor.index.getStorageSync("userInfo");
              common_vendor.index.__f__("log", "at pages/index/index.vue:59", userInfo);
              const { msg, mount, overCount } = await this.$api.device_borrow({
                code: res.result,
                days,
                phone: userInfo.phone,
                username: userInfo.username
              });
              common_vendor.index.showToast({
                title: msg,
                icon: "success"
              });
              this.borrowedCount = mount;
              this.overdueCount = overCount;
            },
            fail: (e) => {
              common_vendor.index.__f__("log", "at pages/index/index.vue:74", e.errMsg);
            }
          });
        }
      });
    },
    handleReturn() {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      common_vendor.index.scanCode({
        success: async (res) => {
          const userInfo = common_vendor.index.getStorageSync("userInfo");
          const { msg, mount, overCount } = await this.$api.device_return({
            code: res.result,
            phone: userInfo.phone,
            username: userInfo.username
          });
          common_vendor.index.showToast({
            title: msg,
            icon: "success"
          });
          this.borrowedCount = mount;
          this.overdueCount = overCount;
        }
      });
    }
  },
  async onShow() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    const { count, overdueCount } = await this.$api.device_all({
      phone: userInfo.phone,
      username: userInfo.username
    });
    common_vendor.index.__f__("log", "at pages/index/index.vue:117", count, overdueCount);
    this.borrowedCount = count;
    this.overdueCount = overdueCount;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.handleBorrow && $options.handleBorrow(...args)),
    b: common_vendor.o((...args) => $options.handleReturn && $options.handleReturn(...args)),
    c: common_vendor.t($data.borrowedCount),
    d: common_vendor.t($data.overdueCount)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
