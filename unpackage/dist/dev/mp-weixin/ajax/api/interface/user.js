"use strict";
const ajax_http = require("../../http.js");
const user = {
  //上传设备
  user_login: (data) => ajax_http.ajax({
    name: "user_login",
    data
  }),
  //添加用户
  user_add: (data) => ajax_http.ajax({
    name: "user_add",
    data
  }),
  //删除用户
  user_delete: (data) => ajax_http.ajax({
    name: "user_delete",
    data
  }),
  //修改用户
  user_update: (data) => ajax_http.ajax({
    name: "user_update",
    data
  }),
  //获取用户列表
  user_list: (data) => ajax_http.ajax({
    name: "user_list",
    data
  })
};
exports.user = user;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/ajax/api/interface/user.js.map
