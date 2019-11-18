import request from '@/utils/request'
let prefix = '/api-integral/integral';

/**
 * integral/enum/integralTermList
 GET
 获取积分项列表
 */
export function getIntegralTermList () {
  return request({
    url: prefix+'/enum/integralTermList',
    method: 'GET',
  })
}

/**
 * integral/termConfig/getInfo
 GET
 根据ID查询规则信息
 */
export function getTermConfig (id) {
  return request({
    url: prefix+'/termConfig/getInfo/'+id,
    method: 'GET',
  })
}

/**
 integral/termConfig/create
 POST
 新增积分规则
 * @param params
 */
export function addTermConfig (data) {
  return request({
    url: prefix+'/termConfig/create',
    method: 'POST',
    data
  })
}

/**
 * integral/termConfig
 PUT
 更新积分规则
 * @param data
 */
export function editTermConfig (data) {
  return request({
    url: prefix+'/termConfig',
    method: 'PUT',
    data
  })
}

/**
 * integral/termConfig/getPage
 GET
 分页查询积分规则
 * @param data
 */
export function getTermConfigPage (params) {
  return request({
    url: prefix+'/termConfig/getPage',
    method: 'GET',
    params
  })
}

/**
 * integral/termConfig/setState
 POST
 保存修改规则状态
 * @param params
 */
export function setTermConfigState (data) {
  return request({
    url: prefix+`/termConfig/setState/${data.id}/${data.status}`,
    method: 'POST',
    data
  })
}

/**
 * integral/config/create
 POST
 新增应用积分规则
 * @param data
 */
export function addConfig (data) {
  return request({
    url: prefix+'/config/create',
    method: 'POST',
    data
  })
}

/**
 * integral/config
 PUT
 更新应用积分规则
 * @param data
 */
export function editConfig (data) {
  return request({
    url: prefix+'/config',
    method: 'PUT',
    data
  })
}

/**
 * integral/config/getPage
 POST
 根据条件查询应用积分规则
 * @param data
 */
export function getConfigPage (data) {
  return request({
    url: prefix+'/config/getPage',
    method: 'get',
    params:data
  })
}

/**
 * integral/record/getPage
 POST
 分页查询用户积分记录
 * @param data
 */
export function getRecordPage (data) {
  return request({
    url: prefix+'/record/getPage',
    method: 'get',
    params:data
  })
}

/**
 * integral/config/unBind
 DELETE
 根据ID解绑应用积分规则
 * @param data
 */
export function deleteConfig (id) {
  return request({
    url: prefix+'/config/unBind/'+ id,
    method: 'DELETE',
  })
}

/**
 * integral/enum/integralTermStatusList
 GET
 获取积分状态列表
 * @param data
 */
export function getIntegralTermStatusList () {
  return request({
    url: prefix+'/enum/integralTermStatusList',
    method: 'GET',
  })
}

/**
 * integral/enum/integralTypeList
 GET
 获取积分类型列表
 */
export function getIntegralTypeList () {
  return request({
    url: prefix+'/enum/integralTypeList',
    method: 'GET',
  })
}

