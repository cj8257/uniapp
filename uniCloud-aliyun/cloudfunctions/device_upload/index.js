/*
 * @Author: chengjun 1@a.com
 * @Date: 2025-04-01 11:06:56
 * @LastEditors: chengjun 1@a.com
 * @LastEditTime: 2025-04-01 11:35:13
 * @FilePath: \办公管理\uniCloud-aliyun\cloudfunctions\device_upload\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use strict';

const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const { code, isEdit, _id } = event;
	if(isEdit) {
		await db.collection("device").doc(_id).remove();
	} 
		// 查询是否存在相同code的数据
		const existData = await db.collection("device").where({
			code: code
		}).get();
		
		if (existData.data.length > 0) {
			// 如果存在，则更新数据
			await db.collection("device").where({
				code: code
			}).update(event);
			return {
				code: 0,
				msg: '更新成功'
			};
		} else {
			// 如果不存在，则添加数据
			await db.collection("device").add(event);
			return {
				code: 0,
				msg: '添加成功'
			};
		}
	
};
