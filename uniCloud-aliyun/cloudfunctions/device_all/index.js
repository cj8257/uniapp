/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-01 11:06:56
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-02 13:46:41
 * @FilePath: \办公管理\uniCloud-aliyun\cloudfunctions\device_all\index.js
 * @Description: 获取所有设备信息
 */
'use strict';

const db = uniCloud.database();
exports.main = async (event, context) => {
	try {
		let result = []
		let count = 0
		let overdueCount = 0
		// 获取所有设备信息
		if(event.phone) {
			result = await db.collection("device").where({phone: event.phone}).get();
			count = result.data.length
			overdueCount = result.data.filter(item => {
				return new Date(item.nextMaintenanceDate) < new Date()
			}).length
		} else {
			result = await db.collection("device").get();
		}
		
		return {
			code: 0,
			msg: '获取成功',
			data: result.data,
			count: count,
			overdueCount: overdueCount
		};
	} catch (error) {
		return {
			code: -1,
			msg: '获取失败',
			error: error.message
		};
	}
};
