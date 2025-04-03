/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-01 10:35:57
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-01 10:42:55
 * @FilePath: \办公管理\vue.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  transpileDependencies: ['@dcloudio/uni-ui'],
  configureWebpack: {
      resolve: {
          fallback: {
              "fs": false,
              "path": false
          }
      }
  }
}