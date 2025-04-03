"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      formData: {
        name: "",
        code: "",
        type: "",
        status: "available",
        image: "",
        description: "",
        purchaseDate: "",
        lastMaintenanceDate: "",
        nextMaintenanceDate: "",
        price: "",
        location: "",
        manufacturer: "",
        model: "",
        specification: "",
        serialNumber: "",
        warrantyPeriod: "",
        maintenanceCycle: "",
        lastMaintenanceContent: "",
        nextMaintenanceContent: "",
        remark: "",
        phone: "",
        username: ""
      },
      deviceTypes: ["办公设备", "电子设备", "家具", "其他"],
      statusTypes: ["可用", "已借出", "维护中", "已报废"],
      selectedType: "",
      selectedStatus: "",
      imageList: [],
      isEdit: false,
      editId: ""
    };
  },
  onLoad(options) {
    if (options.mode === "edit" && options.data) {
      try {
        const editData = JSON.parse(decodeURIComponent(options.data));
        this.isEdit = true;
        this.editId = editData._id;
        this.formData = {
          ...this.formData,
          ...editData,
          // 确保日期格式正确
          purchaseDate: editData.purchaseDate || "",
          lastMaintenanceDate: editData.lastMaintenanceDate || "",
          nextMaintenanceDate: editData.nextMaintenanceDate || ""
        };
        this.selectedType = editData.type;
        this.selectedStatus = this.getStatusText(editData.status);
        if (editData.image) {
          this.imageList = [editData.image];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/device/upload.vue:131", "解析编辑数据失败:", error);
        common_vendor.index.showToast({
          title: "数据加载失败",
          icon: "none"
        });
      }
    }
  },
  methods: {
    handleTypeChange(e) {
      this.selectedType = this.deviceTypes[e.detail.value];
    },
    handleStatusChange(e) {
      this.formData.status = e.detail.value;
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        success: async (res) => {
          this.formData.image = res.tempFilePaths[0];
          common_vendor.index.__f__("log", "at pages/device/upload.vue:151", res);
          let url = Math.random().toString(36).substring(2, 15) + ".jpg";
          const filePath = await this._uploadFile(res.tempFilePaths[0], url);
          this.formData.url = filePath;
        }
      });
    },
    async _uploadFile(filePath, cloudPath) {
      const { fileID } = await common_vendor.nr.uploadFile({
        filePath,
        cloudPath: `device/${cloudPath}`,
        cloudPathAsRealPath: true
      });
      return fileID;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      try {
        const submitData = {
          ...this.formData,
          type: this.selectedType,
          status: this.getStatusValue(this.selectedStatus)
        };
        delete submitData.isSlide;
        if (this.isEdit) {
          await this.$api.device_upload({
            ...submitData,
            _id: this.editId,
            isEdit: true
          });
          common_vendor.index.showToast({
            title: "更新成功",
            icon: "success"
          });
        } else {
          await this.$api.device_upload(submitData);
          common_vendor.index.showToast({
            title: "添加成功",
            icon: "success"
          });
        }
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/device/upload.vue:204", "提交失败:", error);
        common_vendor.index.showToast({
          title: this.isEdit ? "更新失败" : "添加失败",
          icon: "none"
        });
      }
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
    getStatusValue(text) {
      const statusMap = {
        "可用": "available",
        "已借出": "borrowed",
        "维护中": "maintenance",
        "已报废": "scrapped"
      };
      return statusMap[text] || "available";
    },
    validateForm() {
      if (!this.formData.name) {
        common_vendor.index.showToast({
          title: "请输入设备名称",
          icon: "none"
        });
        return false;
      }
      if (!this.selectedType) {
        common_vendor.index.showToast({
          title: "请选择设备类型",
          icon: "none"
        });
        return false;
      }
      if (!this.formData.code) {
        common_vendor.index.showToast({
          title: "请输入设备编号",
          icon: "none"
        });
        return false;
      }
      return true;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.isEdit ? "编辑设备" : "添加设备"),
    b: $data.formData.name,
    c: common_vendor.o(($event) => $data.formData.name = $event.detail.value),
    d: common_vendor.t($data.selectedType || "请选择设备类型"),
    e: $data.deviceTypes,
    f: common_vendor.o((...args) => $options.handleTypeChange && $options.handleTypeChange(...args)),
    g: $data.formData.code,
    h: common_vendor.o(($event) => $data.formData.code = $event.detail.value),
    i: $data.formData.url
  }, $data.formData.url ? {
    j: $data.formData.url
  } : {}, {
    k: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    l: $data.formData.description,
    m: common_vendor.o(($event) => $data.formData.description = $event.detail.value),
    n: $data.formData.status === "available",
    o: $data.formData.status === "borrowed",
    p: $data.formData.status === "maintenance",
    q: $data.formData.status === "scrapped",
    r: common_vendor.o((...args) => $options.handleStatusChange && $options.handleStatusChange(...args)),
    s: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/device/upload.js.map
