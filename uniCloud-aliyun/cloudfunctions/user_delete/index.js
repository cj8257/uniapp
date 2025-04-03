/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-02 09:52:31
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-02 10:20:18
 * @FilePath: \办公管理\uniCloud-aliyun\cloudfunctions\user_add\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { id } = event;
  const user = await db.collection('user').doc(id).remove();
  return {
	  code: 0,
	  msg: '删除成功',
	  data: user
  };
}
