import request from '@/utils/request'
let prefix = '/api-web/web';

/* ----------------------------用户 start------------------------------------ */
// 添加用户
export function userAdd(data) {
  return request({
    url: prefix + '/bUser/create',
    method: 'post',
    data,
  })
}

// 用户详细
export function userMsg(id) {
  return request({
    url: prefix + '/bUser/' + id,
    method: 'get',
  })
}

// 编辑用户
export function reviseUser(id, data) {
  return request({
    url: prefix + '/bUser/' + id,
    method: 'put',
    data,
  })
}
/* ----------------------------用户 end-------------------------------- */


/* -----------------------------业务登陆 start---------------------------------- */
/**
 * 业务登陆
 * @param data
 */
export function getBLogin(data) {
  return request({
    url: prefix + '/bLogin/pc_pass/login',
    method: 'POST',
    data
  })
}
/* -----------------------------业务登陆 end---------------------------------- */
// --------------------------------------发送审核开始---------------------------------------
/**
 * HTTP
 newNotice/sendExamine/{id}
 PUT
 发送审核
 */
export function newNoticeSendExamine(id) {
  return request({
    url: prefix + '/newNotice/sendExamine/' + id,
    method: 'PUT'
  })
}

// --------------------------------------发送审核结束---------------------------------------
