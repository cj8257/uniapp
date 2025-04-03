"use strict";
const ajax_api_interface_device = require("./interface/device.js");
const ajax_api_interface_user = require("./interface/user.js");
const api = {
  ...ajax_api_interface_device.device,
  ...ajax_api_interface_user.user
};
exports.api = api;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/ajax/api/index.js.map
