"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const ajax_api_index = require("./ajax/api/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/manage/manage.js";
  "./pages/message/message.js";
  "./pages/my/my.js";
  "./pages/login/login.js";
  "./pages/device/upload.js";
  "./pages/device/overview.js";
  "./pages/device/user.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$api = ajax_api_index.api;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
