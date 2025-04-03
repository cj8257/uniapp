/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-01 15:50:36
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-01 15:50:36
 * @FilePath: \办公管理\uniCloud-aliyun\cloudfunctions\device_delete\index.js
 * @Description: 删除设备信息
 */
'use strict';

const db = uniCloud.database();
exports.main = async (event, context) => {
		
	try {
		const { id } = event;
		if (!id) {
			return {
				code: -1,
				msg: '设备ID不能为空'
			};
		}
		// 删除设备
		await db.collection("device").doc(id).remove();
		return {
			code: 0,
			msg: '删除成功'
		};
	} catch (error) {
		return {
			code: -1,
			msg: '删除失败',
			error: error.message
		};
	}
}; 