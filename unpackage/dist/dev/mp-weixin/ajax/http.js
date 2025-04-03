"use strict";
const common_vendor = require("../common/vendor.js");
const ajax = ({ name, data = {} }) => {
  const loading = data.isLoading;
  data.isLoading && delete data.isLoading;
  return new Promise((resolve, reject) => {
    !loading && common_vendor.index.showLoading({
      title: "加载中"
    });
    common_vendor.nr.callFunction({
      name,
      data,
      success({ result }) {
        if (result.code === 0) {
          resolve(result);
        } else {
          common_vendor.index.showToast({ icon: "none", title: result.msg });
        }
      },
      fail(err) {
        reject(err);
      },
      complete(res) {
        !loading && common_vendor.index.hideLoading();
      }
    });
  });
};
exports.ajax = ajax;
//# sourceMappingURL=../../.sourcemap/mp-weixin/ajax/http.js.map
