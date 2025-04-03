/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-01 10:08:15
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-02 11:47:11
 * @FilePath: \办公管理\ajax\api\interface\device.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ajax from '../../http.js'

// 用户登录
export  default {
	//上传设备
  device_upload: data => ajax({
    name: 'device_upload',
    data
  }),
  // 获取所有设备
  device_all: data => ajax({
    name: 'device_all',
    data
  }),
  // 删除设备
  device_delete: data => ajax({
    name: 'device_delete',
    data
  }),
  // 借用设备
  device_borrow: data => ajax({
    name: 'device_borrow',
    data
  }),
  // 归还设备
  device_return: data => ajax({
    name: 'device_return',
    data
  })
}
