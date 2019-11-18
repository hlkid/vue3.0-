import request from '@/utils/request'
let prefix = '/api-web/web';

/*-----------------------------主题 start----------------------------------*/

/**
 * subject/dataPage
 GET
 主题分页查询
 * params:{name,type,examineStatus,publishStatus,pageSize,pageNum}
 * */
export function getSubjectDataPage(params) {
  return request({
    url: prefix+'/subject/dataPage',
    method: 'get',
    params
  })
}
/**
 * subject/create
 POST
 新增主题
 * data:{name,pcCover,mobileCover,type,attribute,displayType,pcThemeDetails,mobileThemeDetails,pcAwardPictures,mobileAwardPictures,pcApplicationPicture,mobileApplicationPicture,selectFlag,startTime,endTime,material}
 * */
export function addSubject(data) {
  return request({
    url: prefix+'/subject/create',
    method: 'POST',
    data
  })
}
export function editSubject(data) {
  return request({
    url: prefix+'/subject/update',
    method: 'PUT',
    data
  })
}
export function deleteSubject(id) {
  return request({
    url: prefix+'/subject/'+id,
    method: 'delete'
  })
}
export function getSubjectDetail(id) {
  return request({
    url: prefix+'/subject/'+id,
    method: 'GET'
  })
}

/**
 * 主题审核
 * params:{id,examineStatus}
 * */
export function auditSubject(data) {
  return request({
    url: prefix+'/subject/audit/'+data.id,
    method: 'PUT',
    data
  })
}
/**
 * 主题发布
 * params:{id,publishStatus}
 * */
export function releaseSubject(params) {
  return request({
    url: prefix+'/subject/release',
    method: 'PUT',
    params
  })
}
/*-----------------------------主题 end----------------------------------*/
