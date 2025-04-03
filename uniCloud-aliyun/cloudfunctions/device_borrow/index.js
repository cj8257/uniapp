/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-01 11:06:56
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-02 15:38:15
 * @FilePath: \办公管理\uniCloud-aliyun\cloudfunctions\device_upload\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use strict';

const db = uniCloud.database();
exports.main = async (event, context) => {
	const { code, days, phone, username } = event;
	const device = await db.collection("device").where({name: code}).get()
	if(device.data.filter(e => e.phone  === phone).length) {
		return {
			code: 1,
			msg: '自己正在借用'
		}
	}
	if(device.data.filter(e => e.phone  !== '').length) {
		return {
			code: 1,
			msg: `设备被${device.data[0].username}借走啦！`
		}
	}
	let obj = {
		lastMaintenanceDate: new Date().toISOString(),
		nextMaintenanceDate: new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000).toISOString(),
		status:  "borrowed",
		phone: phone,
		username: username
	}
	await db.collection("device").where({code: device.data[0].code}).update(obj);
	let count = await db.collection("device").where({phone: phone, status: "borrowed"}).get();
	let overCount = count.data.filter(item => {
		return new Date(item.nextMaintenanceDate) < new Date()
	}).length
	return {
		code: 0,
		msg: '借用成功',
		mount: count.data.length,
		overCount: overCount
	}
};
