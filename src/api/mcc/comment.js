import request from '@/utils/request'
let prefix = '/api-comment/comment';

/*-----------------------------评论 start----------------------------------*/
/**
 * comment/dataPage
 GET
 分页获取评论
 * params:{activityName,idSource,pageNum,pageSize}
 * */
export function getCommentDataPage(params) {
  return request({
    url: prefix+'/comment/dataPage',
    method: 'get',
    params
  })
}

/**
 * comment/create
 POST
 评论回复
 * data:{idSource,parentId,examineStatus,content,type}
 * */
export function addComment(data) {
  return request({
    url: prefix+'/comment/create',
    method: 'POST',
    data
  })
}
export function deleteComment(id) {
  return request({
    url: prefix+'/comment/'+id,
    method: 'delete'
  })
}
/**
 * 评论审核
 * params:{id,examineStatus}
 * */
export function auditComment(params) {
  return request({
    url: prefix+'/comment/audit',
    method: 'PUT',
    params
  })
}

/**
 * 审核状态枚举类
 */
export function getExamineStatusEnum() {
  return request({
    url: prefix+'/comment/examineStatusEnum',
    method: 'GET'
  })
}
/*-----------------------评论 end--------------------------*/
