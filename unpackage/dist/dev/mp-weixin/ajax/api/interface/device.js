"use strict";
const ajax_http = require("../../http.js");
const device = {
  //上传设备
  device_upload: (data) => ajax_http.ajax({
    name: "device_upload",
    data
  }),
  // 获取所有设备
  device_all: (data) => ajax_http.ajax({
    name: "device_all",
    data
  }),
  // 删除设备
  device_delete: (data) => ajax_http.ajax({
    name: "device_delete",
    data
  }),
  // 借用设备
  device_borrow: (data) => ajax_http.ajax({
    name: "device_borrow",
    data
  }),
  // 归还设备
  device_return: (data) => ajax_http.ajax({
    name: "device_return",
    data
  })
};
exports.device = device;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/ajax/api/interface/device.js.map
