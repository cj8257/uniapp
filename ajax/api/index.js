/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-01 10:08:15
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-02 09:56:28
 * @FilePath: \办公管理\ajax\api\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* 批量进行文件导出 */
// . =>API目录的相对路径
// true => 是否查询子目录
// /.js/ => 需要查询的文件的后缀名

// 直接导入各个模块
import device from './interface/device'
import user from './interface/user'

// 合并所有API
const api = {
	...device,
	...user
}

export default api
