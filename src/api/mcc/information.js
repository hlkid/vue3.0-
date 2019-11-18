import request from '@/utils/request'

let prefix = '/api-information/information'

// -----------------------资讯管理 start--------------------------------
/**
 * newNotice/newNoticeTypeEnum
 GET
 资讯类型--新闻公告父级类型枚举
 * */
export function getNewNoticeTypeEnum (params) {
  return request({
    url: prefix + '/newNotice/newNoticeTypeEnum',
    method: 'get',
    params
  })
}
/**
 * 新闻列表
 * @param params:{title,type,childType,examineStatus,publishStatus}
 */
export function getNewNoticeDataPage (params) {
  return request({
    url: prefix + '/newNotice/dataPage',
    method: 'get',
    params
  })
}
export function getNewNoticeData (params) {
  return request({
    url: prefix + '/newNotice/data',
    method: 'get',
    params
  })
}

/**
 * 新增
 * @param data:{title,type,childType,publicFlag,cover,content,commentFlag}
 */
export function addNewNotice (data) {
  return request({
    url: prefix + '/newNotice/create',
    method: 'post',
    data
  })
}

/**
 * 详情
 * @param id
 */
export function getNewNoticeDetail (id) {
  return request({
    url: prefix + `/newNotice/${id}`,
    method: 'get'
  })
}

/**
 * 修改
 * @param id
 * @param data{title,type,childType,publicFlag,cover,content,commentFlag}
 */
export function editNewNotice (id, data) {
  return request({
    url: prefix + `/newNotice/${id}`,
    method: 'put',
    data
  })
}
/*
* newNotice/{id}
DELETE
删除新闻公告
* */
export function deleteNewNotice (id) {
  return request({
    url: prefix + `/newNotice/${id}`,
    method: 'DELETE'
  })
}
// ---------------------------------资讯管理 end---------------------------------

// ---------------------------------我的消息 start---------------------------------
/**
 * messageRecord/messageNoticeType
 * GET
 * 消息类型获取接口
 * */
export function getMessageNoticeType () {
  return request({
    url: prefix + '/messageRecord/messageNoticeType',
    method: 'GET'
  })
}

/**
 *  分页查询
 * @param params
 */
export function getMessageRecordList (params) {
  return request({
    url: prefix + '/messageRecord/dataPage',
    method: 'GET',
    params
  })
}

/**
 * 消息已读更新
 * @param id
 */
export function uploadmessageRecord (id) {
  return request({
    url: prefix + `/messageRecord/${id}`,
    method: 'put'
  })
}
// --------------------------------我的消息 end-----------------------------

// -----------------------待办事项统计开始--------------------

// newNotice/toDoItem
// GET
// 待办事项统计
export function getTodoItem () {
  return request({
    url: prefix + '/newNotice/toDoItem',
    method: 'GET'
  })
}
// ------------------------待办事项统计结束--------------------

/**
 * 新闻公告审核
 * data:{id,status,reason}
 * */
export function auditNewNotice (data) {
  return request({
    url: prefix + '/newNotice/examine/'+data.id,
    method: 'PUT',
    data
  })
}
/**
 * 新闻公告发布publish/{id}/{publishStatus}
 PUT
 发布
 data:{publishStatus:0 撤销 1 发布}
 * */
export function releaseNewNotice (data) {
  return request({
    url: prefix + `/newNotice/publish/${data.id}/${data.publishStatus}`,
    method: 'PUT',
    data
  })
}

/*-----------------------------banner start----------------------------------*/
/**
 * banner/dataPage
 GET
 banner分页查询
 * params:{name,type,examineStatus,publishStatus,idSource,pageNum,pageSize}
 * */
export function getBannerDataPage(params) {
  return request({
    url: prefix+'/banner/dataPage',
    method: 'get',
    params
  })
}
/**
 * params:{name,type,examineStatus,publishStatus,idSource}
 * */
export function getBannerData(params) {
  return request({
    url: prefix+'/banner/data',
    method: 'get',
    params
  })
}
/**
 * banner/create
 POST
 新增banner
 * data:{name,author,mobile,nameSource,idSource,type,opus,prizeSort,description}
 * */
export function addBanner(data) {
  return request({
    url: prefix+'/banner/create',
    method: 'POST',
    data
  })
}
export function editBanner(data) {
  return request({
    url: prefix+'/banner/'+data.id,
    method: 'PUT',
    data
  })
}
export function deleteBanner(id) {
  return request({
    url: prefix+'/banner/'+id,
    method: 'delete'
  })
}
export function getBannerDetail(id) {
  return request({
    url: prefix+'/banner/'+id,
    method: 'GET'
  })
}
/**
 * HTTP
 banner/bannerModuleTypeEnum
 GET
 banner模块类型枚举
 * */
export function getBannerModuleTypeEnum(d) {
  return request({
    url: prefix+'/banner/bannerModuleTypeEnum',
    method: 'GET'
  })
}

/**
 * banner/examine/{id}
 PUT
 banner审核
 * data:{id,status,reason}
 * */
export function auditBanner (data) {
  return request({
    url: prefix + '/banner/examine/'+data.id,
    method: 'PUT',
    data
  })
}
/**
 * banner/publish/{id}/{publishStatus}
 PUT
 发布banner
 data:{publishStatus:0 撤销 1 发布}
 * */
export function releaseBanner (data) {
  return request({
    url: prefix + `/banner/publish/${data.id}/${data.publishStatus}`,
    method: 'PUT',
    data
  })
}
/**
 * banner/sendExamine/{id}
 PUT
 发送审核
 */
export function bannerSendExamine(id) {
  return request({
    url: prefix+'/banner/sendExamine/'+id,
    method: 'PUT'
  })
}
/*-----------------------------banner end----------------------------------*/

