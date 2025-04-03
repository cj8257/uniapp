"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      devices: []
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    isOverdue(returnDate) {
      return new Date(returnDate) < /* @__PURE__ */ new Date();
    },
    async fetchDevices() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo)
        return;
      const { data } = await this.$api.device_all({
        phone: userInfo.phone
      });
      common_vendor.index.__f__("log", "at pages/manage/manage.vue:47", data);
      this.devices = data.map((item) => {
        return {
          name: item.name,
          code: item.code,
          image: item.url,
          borrowDate: item.lastMaintenanceDate,
          returnDate: item.nextMaintenanceDate
        };
      });
    }
  },
  onShow() {
    this.fetchDevices();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.devices, (device, index, i0) => {
      return common_vendor.e({
        a: device.image,
        b: common_vendor.t(device.name),
        c: common_vendor.t(device.code),
        d: common_vendor.t($options.formatDate(device.borrowDate)),
        e: common_vendor.t($options.formatDate(device.returnDate)),
        f: $options.isOverdue(device.returnDate)
      }, $options.isOverdue(device.returnDate) ? {} : {}, {
        g: index,
        h: $options.isOverdue(device.returnDate) ? 1 : "",
        i: !$options.isOverdue(device.returnDate) ? 1 : ""
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/manage/manage.js.map
