/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-02 09:15:26
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-02 09:16:34
 * @FilePath: \办公管理\uniCloud-aliyun\cloudfunctions\device_login\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { username, password } = event;
  const user = await db.collection('user').where({ phone: username }).get();
  if (user.data.length === 0) {
    return { code: 1, msg: '用户不存在' };
  }
  if (user.data[0].password !== password) {
    return { code: 2, msg: '密码错误' };
  }
  return { code: 0, msg: '登录成功', user: user.data[0] };
}
