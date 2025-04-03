/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-02 09:13:29
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-02 09:51:52
 * @FilePath: \办公管理\ajax\api\interface\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ajax from '../../http.js'

// 用户登录
export  default {
	//上传设备
  user_login: data => ajax({
    name: 'user_login',
    data
  }),
  //添加用户
  user_add: data => ajax({
    name: 'user_add',
    data
  }),
  //删除用户
  user_delete: data => ajax({
    name: 'user_delete',
    data
  }),
  //修改用户
  user_update: data => ajax({
    name: 'user_update',
    data
  }),
  //获取用户列表
  user_list: data => ajax({
    name: 'user_list',
    data
  })
}
