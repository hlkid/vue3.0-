import request from '@/utils/request'

let prefix = '/api-reserve/reserve'

// -----------------------空间管理 start--------------------------------
/**
 POST
 创建空间信息
 * */
export function createSpace(data) {
  return request({
    url: prefix+'/space/create',
    method: 'POST',
    data
  })
}

/**
 * 详情
 * @param id
 */
export function getSpaceDetail(id) {
  return request({
    url: prefix+'/space/'+id,
    method: 'GET'
  })
}


/**
 * 更新空间信息
 * @param id
 */

export function editSpace(data) {
  return request({
    url: prefix+'/space/update/',
    method: 'put',
    data
  })
}


/**
 * 列表
 *  pageSize	  每页数据量        是	[string]
 *  pageNum	    当前页数	        是	[string]
 *	name	      空间名称	        是	[string]
 *	applyType	  预约类型	        是	[string]
 *	applyWay	  预约方式	        是	[string]
 *	isSeatOrder	是否支持座位预约   是	[string]
 */
export function getSpacePage (params) {
  return request({
    url: prefix + '/space/dataPage',
    method: 'get',
    params
  })
}


/**
 * 删除空间信息
 * @param id
 */

export function delSpace(id) {
  return request({
    url: prefix+id,
    method: '/space/delete'
  })
}



/**
 * 发布空间信息
 * @param id
 */


export function publishSpace(data) {
  return request({
    url: prefix+'/space/publish/'+data.id,
    method:'PATCH',
    data
  })
}

/**
 * 取消发布空间信息
 * @param id
 */

export function cancelpublishSpace(data) {
  return request({
    url: prefix+'/space/cancelPublish/'+data.id,
    method: 'PATCH',
    data
  })
}



/**
 * 空间回收站列表
 */
export function getRecycleSpacePage (params) {
  return request({
    url: prefix + '/space/dataRecyclePage',
    method: 'get',
    params
  })
}


/**
 * 已删除数据恢复
 * @param id
 */

export function cancelDelete(id) {
  return request({
    url: prefix+'/space/cancelDelete/'+id,
    method: 'PATCH'
  })
}

/**
 * 空间信息审核
 */
export function getSendAduit(data) {
  return request({
    url: prefix + "/space/sendAduit",
    method: 'POST',
    data
  })
}

/**
 * 发送审核
 * @param data
 */
export function SendAduit(id) {
  return request({
    url: prefix + `/space/sendAduit/${id}`,
    method: 'PUT',
  })
}

/**
 * 空间信息设置
 * @param data
 */
export function setUpSpace(data) {
  return request({
    url: prefix + "/space/setUpSpace",
    method: 'PUT',
    data
  })
}

/**
 * 导出
 * @param data
 */
export function exportExcel(params) {
  return request({
    url: prefix + "/space/exportExcel",
    method: 'GET',
    responseType: 'blob',
    download:true,
    params
  })
}

/**
 * reserve/spaceScene/dataPage?pageSize=10&pageNum=1&idSpace=&orderDate=
 * GET
 * 空间场次分页查询
 * @param id
 */
export function getSpaceScenePage(params) {
  return request({
    url: prefix + `/spaceScene/dataPage`,
    method: 'get',
    params
  })
}

/**
 * reserve/spaceScene/{id}
 DELETE
 空间场次删除
 * @param params
 */
export function deleteSpaceScene(id) {
  return request({
    url: prefix + `/spaceScene/${id}`,
    method: 'DELETE',
  })
}

/**
 * reserve/spaceScene/update
 PUT
 空间场次更新
 * @param id
 */
export function editSpaceScene(params) {
  return request({
    url: prefix + `/spaceScene/update`,
    method: 'PUT',
    params
  })
}

/**
 * reserve/spaceScene/create
 POST
 空间场次创建
 * @param params
 */
export function addSpaceScene(params) {
  return request({
    url: prefix + `/spaceScene/create`,
    method: 'POST',
    params
  })
}

/**
 * reserve/spaceScene/{id}
 GET
 空间场次详情
 * @param params
 */
export function getSpaceSceneDetail(id) {
  return request({
    url: prefix + `/spaceScene/${id}`,
    method: 'GET'
  })
}

/**
 *   reserve/space/data
 GET
 空间信息列表
 */
export function getSpaceData (params) {
  return request({
    url: prefix + `/space/data`,
    method: 'GET',
    params
  })
}

/*----------------------空间 end-------------------------*/
/*-------------------空间订单 start---------------------*/
/**
 *
 reserve/space/spaceOpenList
 GET
 空间是否开放预约，枚举列表
 */
export function getSpaceOpenList () {
  return request({
    url: prefix + `/space/spaceOpenList`,
    method: 'GET',
  })
}

/**
 * reserve/space/spaceScaleList
 GET
 空间是否要审核
 */
export function getSpaceScaleList () {
  return request({
    url: prefix + `/space/spaceScaleList`,
    method: 'GET',
  })
}


/**
 * reserve/spaceConfig/dataSpacePage
 GET
 空间设置 -> 空间列表
 */
export function getDataSpacePage (params) {
  return request({
    url: prefix + `/spaceConfig/dataSpacePage`,
    method: 'GET',
    params
  })
}

/**
 * reserve/spaceConfig/dataSeatPage
 GET
 座位管理 ->空间列表
 * @param params
 */
export function getDataSeatPage (params) {
  return request({
    url: prefix + `/spaceConfig/dataSeatPage`,
    method: 'GET',
    params
  })
}

/**
 * reserve/spaceConfig/{idSpace}
 GET
 获取空间设置详情
 * @param id
 */
export function getDataSeatDetail (id) {
  return request({
    url: prefix + `/spaceConfig/${id}`,
    method: 'GET',
  })
}

/**
 *reserve/spaceConfig/updateAppointWay
 PUT
 更新空间预约方式
 * @param id
 */
export function editAppointWay (data) {
  return request({
    url: prefix + `/spaceConfig/updateAppointWay`,
    method: 'PUT',
    data
  })
}

/**
 * reserve/spaceConfig/close
 PUT
 空间关闭预约
 * @param data
 */
export function closeSpaceConfig (data) {
  return request({
    url: prefix + `/spaceConfig/close`,
    method: 'PUT',
    data
  })
}

/**
 * reserve/spaceConfig/open
 PUT
 空间开放预约
 * @param data
 */
export function openSpaceConfig (data) {
  return request({
    url: prefix + `/spaceConfig/open`,
    method: 'PUT',
    data
  })
}

/**
 * reserve/spaceConfig/setOpenCycle
 PUT
 空间设置开放周期
 */
export function setOpenCycleSpaceConfig (data) {
  return request({
    url: prefix + `/spaceConfig/setOpenCycle`,
    method: 'PUT',
    data
  })
}

/**
 * reserve/spaceConfig/setFee
 PUT
 空间费用设置
 * @param data
 */
export function setFeeSpaceConfig (data) {
  return request({
    url: prefix + `/spaceConfig/setFee`,
    method: 'PUT',
    data
  })
}

/*-------------------空间订单 end---------------------*/
/*--------------------推荐设置 --------------------------*/
/**
 * reserve/recommendTime/dataPage
 GET
 空间推荐时段分页查询
 */
export function getRecommendTimeData (params) {
  return request({
    url: prefix + `/recommendTime/dataPage`,
    method: 'GET',
    params
  })
}

/**
 * reserve/recommendTime/create
 POST
 空间推荐时段创建
 */
export function addRecommendTimeData (data) {
  return request({
    url: prefix + `/recommendTime/create`,
    method: 'POST',
    data
  })
}

/**
 * reserve/recommendTime/{id}
 GET
 空间推荐时段详情
 * @param data
 */
export function getRecommendTimeDetail (id) {
  return request({
    url: prefix + `/recommendTime/${id}`,
    method: 'GET',
  })
}

/**
 * reserve/recommendTime/{id}
 DELETE
 空间推荐时段删除
 * @param id
 */
export function deleteRecommendTimeData (id) {
  return request({
    url: prefix + `/recommendTime/${id}`,
    method: 'DELETE',
  })
}

/**
 * reserve/recommendTime/update
 PUT
 空间推荐时段更新
 * @param id
 */
export function editRecommendTimeData (data) {
  return request({
    url: prefix + `/recommendTime/update`,
    method: 'PUT',
    data
  })
}

/**
 * reserve/recommendTime/valid
 PUT
 空间推荐时段启用
 * @param data
 */
export function validRecommendTimeData (data) {
  return request({
    url: prefix + `/recommendTime/valid`,
    method: 'PUT',
    data
  })
}

/**
 * reserve/recommendTime/forbidden
 PUT
 空间推荐时段禁用
 * @param data
 */
export function forbiddenRecommendTimeData (data) {
  return request({
    url: prefix + `/recommendTime/forbidden`,
    method: 'PUT',
    data
  })
}

/*--------------------推荐设置 end--------------------------*/

/*-----------------------座位管理  start-----------------------*/
/**
 * 根据id 获取座位数据
 * @param params
 */
export function getSeatData(params) {
  return request({
    url: prefix + "/seat/data",
    method: 'GET',
    params
  })
}

/**
 * 保存座位数据
 * @param params
 */
export function setSeatData(data) {
  return request({
    url: prefix + "/seat/save",
    method: 'POST',
    data
  })
}

/**
 * 获取空间座位布局信息
 * @param id
 */
export function getSeatDatas(id) {
  return request({
    url: prefix + `/seat/spaceSeats/${id}`,
    method: 'get  ',
  })
}



/*-----------------------座位管理  end---------------------------*/
