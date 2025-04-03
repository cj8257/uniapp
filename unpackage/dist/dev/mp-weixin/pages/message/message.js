"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      messages: []
    };
  },
  methods: {
    formatTime(time) {
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4) {
        return "刚刚";
      }
      if (diff < 36e5) {
        return Math.floor(diff / 6e4) + "分钟前";
      }
      if (diff < 864e5) {
        return Math.floor(diff / 36e5) + "小时前";
      }
      if (diff < 2592e6) {
        return Math.floor(diff / 864e5) + "天前";
      }
      return date.toLocaleDateString();
    },
    async fetchMessages() {
      this.messages = [
        {
          title: "设备归还提醒",
          content: "您借用的笔记本电脑即将到期，请及时归还。",
          time: (/* @__PURE__ */ new Date()).getTime() - 36e5,
          read: false
        },
        {
          title: "系统通知",
          content: "系统升级完成，新功能已上线。",
          time: (/* @__PURE__ */ new Date()).getTime() - 864e5,
          read: true
        }
      ];
    }
  },
  onShow() {
    this.fetchMessages();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.messages, (message, index, i0) => {
      return {
        a: common_vendor.t(message.title),
        b: common_vendor.t(message.content),
        c: common_vendor.t($options.formatTime(message.time)),
        d: index,
        e: !message.read ? 1 : ""
      };
    }),
    b: $data.messages.length === 0
  }, $data.messages.length === 0 ? {
    c: common_assets._imports_0
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
