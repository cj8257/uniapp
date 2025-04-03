"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      deviceTypes: ["全部", "办公设备", "电子设备", "家具", "其他"],
      statusTypes: ["全部", "可用", "已借出", "维护中", "已报废"],
      selectedType: "全部",
      selectedStatus: "全部",
      totalDevices: 0,
      borrowedDevices: 0,
      availableDevices: 0,
      overdueDevices: 0,
      devices: [],
      searchKeyword: "",
      startX: 0,
      moveX: 0,
      currentIndex: ""
    };
  },
  methods: {
    touchStart(e, index) {
      this.startX = e.touches[0].clientX;
      this.currentIndex = index;
    },
    touchMove(e, index) {
      if (this.currentIndex !== index)
        return;
      this.moveX = e.touches[0].clientX - this.startX;
      if (this.moveX < 0) {
        this.$set(this.devices[index], "isSlide", true);
      } else {
        this.$set(this.devices[index], "isSlide", false);
      }
    },
    touchEnd(e, index) {
      if (this.currentIndex !== index)
        return;
      if (this.moveX < -50) {
        this.$set(this.devices[index], "isSlide", true);
      } else {
        this.$set(this.devices[index], "isSlide", false);
      }
      this.currentIndex = -1;
    },
    async handleDelete(device) {
      let _this = this;
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除该设备吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await _this.$api.device_delete({ id: device._id });
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
              _this.fetchDevices();
            } catch (error) {
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "error"
              });
            }
          }
        }
      });
    },
    handleSearch(e) {
      this.filterDevices();
    },
    handleClear() {
      this.searchKeyword = "";
      this.filterDevices();
    },
    filterDevices() {
      if (this.searchKeyword) {
        this.devices = this.devices.filter(
          (device) => device.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) || device.code.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      } else {
        this.fetchDevices();
      }
    },
    updateStatistics() {
      this.totalDevices = this.devices.length;
      this.borrowedDevices = this.devices.filter((e) => e.status === "borrowed").length;
      this.availableDevices = this.devices.filter((e) => e.status === "available").length;
      this.overdueDevices = this.devices.filter((e) => e.nextMaintenanceDate < /* @__PURE__ */ new Date()).length;
    },
    async handleTypeChange(e) {
      await this.fetchDevices();
      this.selectedType = this.deviceTypes[e.detail.value];
      this.devices = this.devices.filter((e2) => (this.selectedType === "全部" || e2.type === this.selectedType) && (this.selectedStatus === "全部" || this.getStatusText(e2.status) === this.selectedStatus));
    },
    async handleStatusChange(e) {
      await this.fetchDevices();
      this.selectedStatus = this.statusTypes[e.detail.value];
      this.devices = this.devices.filter((e2) => (this.selectedType === "全部" || e2.type === this.selectedType) && (this.selectedStatus === "全部" || this.getStatusText(e2.status) == this.selectedStatus));
    },
    getStatusText(status) {
      const statusMap = {
        available: "可用",
        borrowed: "已借出",
        maintenance: "维护中",
        scrapped: "已报废"
      };
      return statusMap[status] || status;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    async fetchDevices() {
      const { data } = await this._deviceAll();
      common_vendor.index.__f__("log", "at pages/device/overview.vue:221", data);
      this.totalDevices = data.length;
      this.borrowedDevices = data.filter((e) => e.status === "borrowed").length;
      this.availableDevices = data.filter((e) => e.status === "available").length;
      this.overdueDevices = data.filter((e) => e.nextMaintenanceDate && new Date(e.nextMaintenanceDate) < /* @__PURE__ */ new Date()).length;
      this.devices = data;
      common_vendor.index.__f__("log", "at pages/device/overview.vue:228", this.devices);
    },
    async _deviceAll() {
      const res = await this.$api.device_all({});
      return res;
    },
    previewImage(url) {
      common_vendor.index.previewImage({
        urls: [url],
        current: url
      });
    },
    handleEdit(device) {
      const editData = {
        ...device,
        // 确保日期格式正确
        purchaseDate: device.purchaseDate ? new Date(device.purchaseDate).toISOString().split("T")[0] : "",
        lastMaintenanceDate: device.lastMaintenanceDate ? new Date(device.lastMaintenanceDate).toISOString().split("T")[0] : "",
        nextMaintenanceDate: device.nextMaintenanceDate ? new Date(device.nextMaintenanceDate).toISOString().split("T")[0] : ""
      };
      common_vendor.index.navigateTo({
        url: `/pages/device/upload?mode=edit&data=${encodeURIComponent(JSON.stringify(editData))}`
      });
      this.currentIndex = "";
    }
  },
  onShow() {
    this.fetchDevices();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.totalDevices),
    b: common_vendor.t($data.borrowedDevices),
    c: common_vendor.t($data.availableDevices),
    d: common_vendor.t($data.overdueDevices),
    e: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    f: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.handleSearch && $options.handleSearch(...args)]),
    g: $data.searchKeyword,
    h: $data.searchKeyword
  }, $data.searchKeyword ? {
    i: common_vendor.o((...args) => $options.handleClear && $options.handleClear(...args))
  } : {}, {
    j: common_vendor.t($data.selectedType || "全部"),
    k: $data.deviceTypes,
    l: common_vendor.o((...args) => $options.handleTypeChange && $options.handleTypeChange(...args)),
    m: common_vendor.t($data.selectedStatus || "全部"),
    n: $data.statusTypes,
    o: common_vendor.o((...args) => $options.handleStatusChange && $options.handleStatusChange(...args)),
    p: common_vendor.f($data.devices, (device, index, i0) => {
      return common_vendor.e({
        a: device.nextMaintenanceDate && new Date(device.nextMaintenanceDate) < /* @__PURE__ */ new Date()
      }, device.nextMaintenanceDate && new Date(device.nextMaintenanceDate) < /* @__PURE__ */ new Date() ? {} : {}, {
        b: device.status === "available"
      }, device.status === "available" ? {} : {}, {
        c: device.status === "borrowed" && (!device.nextMaintenanceDate || new Date(device.nextMaintenanceDate) >= /* @__PURE__ */ new Date())
      }, device.status === "borrowed" && (!device.nextMaintenanceDate || new Date(device.nextMaintenanceDate) >= /* @__PURE__ */ new Date()) ? {} : {}, {
        d: device.url || device.image,
        e: common_vendor.o(($event) => $options.previewImage(device.image), index),
        f: common_vendor.t(device.name),
        g: common_vendor.t(device.code),
        h: common_vendor.t(device.type),
        i: common_vendor.t($options.getStatusText(device.status)),
        j: common_vendor.n(device.status),
        k: common_vendor.t(device.username),
        l: device.lastMaintenanceDate
      }, device.lastMaintenanceDate ? {
        m: common_vendor.t($options.formatDate(device.nextMaintenanceDate))
      } : {}, {
        n: common_vendor.o(($event) => $options.touchStart($event, index), index),
        o: common_vendor.o(($event) => $options.touchMove($event, index), index),
        p: common_vendor.o(($event) => $options.touchEnd($event, index), index),
        q: common_vendor.o(($event) => $options.handleDelete(device), index),
        r: common_vendor.o(($event) => $options.handleEdit(device), index),
        s: index,
        t: device.isSlide ? 1 : "",
        v: device.nextMaintenanceDate && new Date(device.nextMaintenanceDate) < /* @__PURE__ */ new Date() ? 1 : "",
        w: device.status === "available" ? 1 : "",
        x: device.status === "borrowed" && (!device.nextMaintenanceDate || new Date(device.nextMaintenanceDate) >= /* @__PURE__ */ new Date()) ? 1 : ""
      });
    }),
    q: $data.devices.length === 0
  }, $data.devices.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/device/overview.js.map
