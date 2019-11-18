import request from '@/utils/request'
let prefix = '/api-web/web';

/* -----------------------------场馆 start---------------------------------- */
/**
 * venue/dataPage
 * GET
 * 分页查询
 * data:{pageNum,pageSize,level,name}
 * */
export function getVenueDataPage(params) {
  return request({
    url: prefix + '/venue/dataPage',
    method: 'GET',
    params
  })
}

/**
 * 根据场馆编码查询详情
 * @param params
 */
export function getDetailByVenueNum(params) {
  return request({
    url: prefix + '/venue/getDetailByVenueNum',
    method: 'get',
    params
  })
}

/**
 * 查询
 * @param params
 */
export function getVenueData(params) {
  return request({
    url: prefix + '/venue/data',
    method: 'GET',
    params
  })
}
/**
 * venue/bindOperator
 * POST
 * 场馆分配运营人员
 * data:{idUser,idVenue}
 * */
export function bindOperatorVenue(data) {
  return request({
    url: prefix + '/venue/bindOperator',
    method: 'POST',
    data
  })
}
/**
 * venue/operatorList/{id}
 GET
 获取场馆的运营人员
 * */
export function getVenueOperatorList(id) {
  return request({
    url: prefix + '/venue/operatorList/' + id,
    method: 'GET'
  })
}

/**
 * /venue/create
 * POST
 * 新增场馆
 * data:{name,cover,logo,qrCode,startTime,districtCode,address,mapPoint,area,contactPerson,contactPhone,description,level}
 * */
export function addVenue(data) {
  return request({
    url: prefix + '/venue/create',
    method: 'POST',
    data
  })
}
/**
 * /venue/create
 * PUT
 * 场馆修改
 * data:{id, name,cover,logo,qrCode,startTime,districtCode,address,mapPoint,area,contactPerson,contactPhone,description,level}
 * */
export function editVenue(data) {
  return request({
    url: prefix + '/venue/update',
    method: 'PUT',
    data
  })
}
/**
* venue/{id}
* GET
* 场馆详情
**/
export function getVenueDetail(id) {
  return request({
    url: prefix + '/venue/' + id,
    method: 'GET'
  })
}
/**
* venue/{id}
* DELETE
* 场馆删除
 * **/
export function deleteVenue(id) {
  return request({
    url: prefix + '/venue/' + id,
    method: 'DELETE'
  })
}
/**
 *venue/audit
 * PUT
 * 审核
 * params:{id, examineStatus:0 未审核  1 已审核}
 **/
export function auditVenue(params) {
  return request({
    url: prefix + '/venue/audit',
    method: 'PUT',
    params
  })
}
/**
 * venue/release
 * PUT
 * 发布
 * params:{id, publishStatus:0  未发布  1 已发布}
 **/
export function releaseVenue(params) {
  return request({
    url: prefix + '/venue/release',
    method: 'PUT',
    params
  })
}
/* -----------------------------场馆 end---------------------------------- */
/* -----------------------------场馆微信 账号 start---------------------------------- */
/**
 * 账号列表（分页查询）
 * @param params
 */
export function getWechatAccountDataPage(params) {
  return request({
    url: prefix + "/wechatAccount/dataPage",
    method: 'GET',
    params
  })
}

/**
 * 账号列表（部分也查询）
 * @param params
 */
export function getWechatAccountData(params) {
  return request({
    url: prefix + "/wechatAccount/data",
    method: 'GET',
    params
  })
}

/**
 * 账号详情
 * @param id
 */
export function getWechatAccountDetail(id) {
  return request({
    url: prefix + `/wechatAccount/${id}`,
    method: 'GET',
  })
}

/**
 * 删除账号详情
 * @param id
 */
export function deleteWechatAccount(id) {
  return request({
    url: prefix + `/wechatAccount/${id}`,
    method: 'delete',
  })
}

/**
 * 账号修改
 * @param params
 */
export function editWechatAccount(params) {
  return request({
    url: prefix + `/wechatAccount/update`,
    method: 'PUT',
    data: params
  })
}

/**
 * 账号新增
 * @param params
 */
export function addWechatAccount(params) {
  return request({
    url: prefix + `/wechatAccount/create`,
    method: 'POST',
    data: params
  })
}

/**
 * wechatAccount/wechatAccountTypeEnum
 GET
 账号类型枚举
 * @param params
 */
export function getWechatAccountTypeEnum(params) {
  return request({
    url: prefix + "/wechatAccount/wechatAccountTypeEnum",
    method: 'GET',
  })
}
/**
 * wechatAccount/updatePublishStatus/{id}
 PUT
 更新发布状态
 * @param params：{publishStatus：1 发布 0 取消}
 */
export function wechatAccountUpdatePublishStatus(data) {
  return request({
    url: prefix + "/wechatAccount/updatePublishStatus/" + data.id,
    method: 'PUT',
    data
  })
}

/* -----------------------------账号 end---------------------------------- */
/**
 * venueAccount/create
 POST
 新增以及更新绑定
 data: { idVenue, wechatAccountIds}
 * */
export function venueAccountCreate(data) {
  return request({
    url: prefix + "/venueAccount/create",
    method: 'POST',
    data
  })
}
/**
 * venueAccount/getAccountByIdVenue
 GET
 场馆键查询已绑定的关系
 data: { idVenue, wechatAccountIds}
 * */
export function getAccountByIdVenue(idVenue) {
  return request({
    url: prefix + "/venueAccount/getAccountByIdVenue",
    method: 'GET',
    params:{
      idVenue: idVenue
    }
  })
}
