import request from '@/utils/request'
let prefix = '/api-live/live';

let webprefix='/api-web/web'; // 新增 更新  设置结束走业务模块

/**
 * liveBroadcast/create
 POST
 新增直播
 * @param params
 */
export function addLiveBroadcast(data) {
  return request({
    url: webprefix + '/bLiveBroadcast/create',
    method: 'POST',
    data
  })
}

/**
 * liveBroadcast/update
 PUT
 更新
 * @param data
 */
export function editLiveBroadcast(data) {
  return request({
    url: webprefix + '/bLiveBroadcast/update',
    method: 'PUT',
    data
  })
}

/**
 * liveBroadcast/{id}
 GET
 详情
 * @param data
 */
export function getLiveBroadcastData(id) {
  return request({
    url: prefix + `/liveBroadcast/${id}`,
    method: 'GET',
  })
}

/**
 * liveBroadcast/{id}
 DELETE
 删除直播
 * @param id
 */
export function deleteLiveBroadcast(id) {
  return request({
    url: prefix + `/liveBroadcast/${id}`,
    method: 'DELETE',
  })
}

/**
 * liveBroadcast/dataPage
 GET
 直播分页
 * @param id
 */
export function getLiveBroadcastPage(params) {
  return request({
    url: prefix + `/liveBroadcast/dataPage`,
    method: 'GET',
    params
  })
}

/**
 * liveBroadcast/sendExamine/{id}
 PUT
 发送审核
 * @param id
 */
export function sendLiveBroadcastExamine(id) {
  return request({
    url: prefix + `/liveBroadcast/sendExamine/${id}`,
    method: 'PUT',
  })
}

/**
 * liveBroadcast/examine
 PUT
 审核直播
 * @param id
 */
export function getLiveBroadcastExamine(data) {
  return request({
    url: prefix + `/liveBroadcast/examine`,
    method: 'PUT',
    data
  })
}

/**
 * liveBroadcast/publish
 PUT
 发布
 * @param id
 */
export function publishLiveBroadcast(data) {
  return request({
    url: prefix + `/liveBroadcast/publish`,
    method: 'PUT',
    data
  })
}


/**
 * liveBroadcast/setStart/{id}
 PUT
 设置开始
 * @param id
 */
export function setStartLiveBroadcast(id) {
  return request({
    url: prefix + `/liveBroadcast/setStart/${id}`,
    method: 'PUT',
  })
}


/**
 * liveBroadcast/setEnd/{id}
 PUT
 设置结束
 * @param data
 */
export function setEndLiveBroadcast(id) {
  return request({
    url: webprefix + `/bLiveBroadcast/setEnd/${id}`,
    method: 'PUT',
  })
}

/**
 * liveBroadcast/resourceUpload
 PUT
 资源视频上传
 * @param id
 */
export function uploadLiveBroadcast(data) {
  return request({
    url: prefix + `/liveBroadcast/resourceUpload`,
    method: 'PUT',
    data
  })
}

