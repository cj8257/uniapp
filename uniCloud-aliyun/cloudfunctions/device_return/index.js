/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-01 11:06:56
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-03 16:47:08
 * @FilePath: \办公管理\uniCloud-aliyun\cloudfunctions\device_upload\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use strict';

const db = uniCloud.database();
exports.main = async (event, context) => {
	const { code, phone } = event;
	const device = await db.collection("device").where({name: code}).get()
	if(device.data[0].phone !== phone) {
		return {
			code: 1,
			msg: '设备不存在'
		}
	}
	let obj = {
		lastMaintenanceDate: "",
		nextMaintenanceDate: "",
		status:  "available",
		phone: 	"",
		username: "",
	}

	await db.collection("device").where({code: device.data[0].code}).update(obj);
	let mount = await db.collection("device").where({phone: phone}).get();
	let overCount = mount.data.filter(item => {
		return new Date(item.nextMaintenanceDate) < new Date()
	}).length
	return {
		code: 0,
		msg: '归还成功',
		mount: mount.data.length,
		overCount: overCount
	}
};
