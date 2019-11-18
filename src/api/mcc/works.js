import request from '@/utils/request'
let prefix = '/api-web/web';

/*-----------------------------作品 start----------------------------------*/
/**
 * opus/dataPage
 GET
 作品分页查询
 * params:{name,type,examineStatus,publishStatus,idSource,pageNum,pageSize}
 * */
export function getOpusDataPage(params) {
  return request({
    url: prefix+'/opus/dataPage',
    method: 'get',
    params
  })
}
/**
 * params:{name,type,examineStatus,publishStatus,idSource}
 * */
export function getOpusData(params) {
  return request({
    url: prefix+'/opus/data',
    method: 'get',
    params
  })
}
/**
 * opus/create
 POST
 新增作品
 * data:{name,author,mobile,nameSource,idSource,type,opus,prizeSort,description}
 * */
export function addOpus(data) {
  return request({
    url: prefix+'/opus/create',
    method: 'POST',
    data
  })
}
export function editOpus(data) {
  return request({
    url: prefix+'/opus/'+data.id,
    method: 'PUT',
    data
  })
}
export function deleteOpus(id) {
  return request({
    url: prefix+'/opus/'+id,
    method: 'delete'
  })
}
export function getOpusDetail(id) {
  return request({
    url: prefix+'/opus/'+id,
    method: 'GET'
  })
}
/**
 * opus/export
 GET
 作品列表导出
 params:{name,activityName,idSource,mobile,examineStatus,publishStatus}
 * */
export function opusExport(params) {
  return request({
    url: prefix+'/opus/export',
    method: 'GET',
    responseType: 'blob',
    params
  })
}
/**
 * opus/examine/{id}
 PUT
 审核作品
 * data:{id,status,reason}
 * */
export function auditOpus(data) {
  return request({
    url: prefix+'/opus/examine/'+data.id,
    method: 'PUT',
    data
  })
}
/**
 * 作品发布
 * params:{id}
 * */
export function releaseOpus(data) {
  return request({
    url: prefix+`/opus/publish/${data.id}/${data.publishStatus}`,
    method: 'PUT',
    data
  })
}

/**
 * opus/sendExamine/{id}
 PUT
 作品发送审核
 * */
export function opusSendExamine(id) {
  return request({
    url: prefix+'/opus/sendExamine/'+id,
    method: 'PUT'
  })
}
/**
 * opus/opusTypeEnum
 GET
 作品类型枚举
 * */
export function opusTypeEnum() {
  return request({
    url: prefix+'/opus/opusTypeEnum',
    method: 'GET'
  })
}
/*-----------------------------作品 end----------------------------------*/
