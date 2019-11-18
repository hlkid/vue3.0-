import request from '@/utils/request'
let prefix = '/api-web/web';


/*-----------------------------活动 start----------------------------------*/
/**
 * activity/dataPage
 GET
 活动分页查询
 * params:{name,type,attribute,pageNum,pageSize}
 * */
export function getActivityDataPage(params) {
  return request({
    url: prefix + '/activity/dataPage',
    method: 'get',
    params
  })
}
/**
 * params:{name,type,attribute}
 * */
export function getActivityData(params) {
  return request({
    url: prefix + '/activity/data',
    method: 'get',
    params
  })
}
/**
 * opus/create
 POST
 新增活动
 * data:{name,pcCover,mobileCover,type,attribute,requirement,contactInfo,detail,appointmentNum,startTime,endTime,
 sequence,districtCode,address,contactPerson,content,copyright,idSubject}
 * */
export function addActivity(data) {
  return request({
    url: prefix + '/activity/create',
    method: 'POST',
    data
  })
}
/**
 * activity/photoOrVideoUpdate/{id}
 PUT
 视频图片上传接口
 * */
export function photoOrVideoUpdate(data) {
  return request({
    url: prefix + '/activity/photoOrVideoUpdate/' + data.id,
    method: 'PUT',
    data
  })
}
export function editActivity(data) {
  return request({
    url: prefix + '/activity/' + data.id,
    method: 'PUT',
    data
  })
}
export function deleteActivity(id) {
  return request({
    url: prefix + '/activity/' + id,
    method: 'delete'
  })
}
export function getActivityDetail(id) {
  return request({
    url: prefix + '/activity/' + id,
    method: 'GET'
  })
}

/**
 * 活动审核
 * params:{id,status}
 * */
export function auditActivity(params) {
  return request({
    url: prefix + '/activity/examin',
    method: 'POST',
    params
  })
}
/**
 * 活动发布
 * params:{id}
 * */
export function releaseActivity(params) {
  return request({
    url: prefix + '/activity/publish',
    method: 'POST',
    params
  })
}

/**
 * 活动审核状态枚举
 */
export function getActivityStatusEnum() {
  return request({
    url: prefix + '/activity/activityExamineStatusEnum',
    method: 'get'
  })
}
/**
 * activity/sendExamine
 POST
 发送审核
 params:{id}
 * */
export function activitySendExamine(params) {
  return request({
    url: prefix + '/activity/sendExamine',
    method: 'POST',
    params
  })
}
/**
 * 保存二维码
 * @param params
 */
export function saveQrCode(params) {
  return request({
    url: prefix + '/activity/qrCode',
    method: 'POST',
    params
  })
}

/**
 * 添加活动总结
 * @param params
 */
export function saveSummary(params) {
  return request({
    url: prefix + '/activity/summary',
    method: 'POST',
    data: params
  })
}

/**
 * 活动总结审核
 * @param params
 */
export function setSummartyExamin(params) {
  return request({
    url: prefix + '/activity/summartyExamin',
    method: 'POST',
    params
  })
}

/**
 * 活动列表导出
 * @param params
 */
export function getActivityExport(params) {
  // window.location.href = process.env.BASE_API + prefix + `/activity/export?name=${params.name}&type=${params.type}`
  return request({
    url: prefix + '/activity/export',
    method: 'get',
    responseType: 'blob',
    download: true,
    params
  })
}
/*-----------------------------活动 end----------------------------------*/

/*-----------------------------活动预约 start----------------------------------*/
/**
 * appointment/dataPage
 GET分页查询
 * params:{idActivity,idUser,statuspageNum,pageSize}
 * */
export function getAppointmentDataPage(params) {
  return request({
    url: prefix + '/appointment/dataPage',
    method: 'get',
    params
  })
}
export function getAppointmentData(params) {
  return request({
    url: prefix + '/appointment/data',
    method: 'get',
    params
  })
}

/**
 * 签到状态枚举
 * appointmentSignStatusEnum
 * @param params
 */
export function getAppointmentSignStatusEnum() {
  return request({
    url: prefix + '/appointment/appointmentSignStatusEnum',
    method: 'get',
  })
}

/**
 * 预约状态枚举
 * get
 */
export function getAppointmentStatusEnum() {
  return request({
    url: prefix + '/appointment/appointmentStatusEnum',
    method: 'get',
  })
}

/**
 * appointment/create
 POST
 新增
 * data:{idActivity,activityName,phone}
 * */
export function addAppointment(data) {
  return request({
    url: prefix + '/appointment/create',
    method: 'POST',
    data
  })
}
export function cancelAppointment(id) {
  return request({
    url: prefix + '/appointment/cancel',
    method: 'POST',
    params: {
      id: id
    }
  })
}
export function appointmentSigned(id) {
  return request({
    url: prefix + '/appointment/signed',
    method: 'POST',
    params: {
      id: id
    }
  })
}
export function getAppointmentDetail(id) {
  return request({
    url: prefix + '/appointment/' + id,
    method: 'GET'
  })
}

/**
 * 导出
 * @param params
 * @constructor
 */
export function ExportAppointment(params) {
  // window.location.href = process.env.BASE_API + prefix + `/appointment/export?signStatus=${params.signStatus}&userName=${params.userName}&phone=${params.phone}`
  return request({
    url: prefix + '/appointment/export',
    method: 'GET',
    responseType: 'blob',
    download: true,
    params
  })
}
/*-----------------------------活动预约 end----------------------------------*/


/**
 * web/informationBanner/getBannerLocation
 GET
 banner内部链接数据列表
 * params:{pageNum,pageSize,moduleType}
 * */
export function getRourceByMoculeTypeDataPage(params) {
  return request({
    url: prefix + '/informationBanner/getBannerLocation',
    method: 'get',
    params
  })
}

/**
 * 场馆详情
 *  GET
 *  app/venue/app_pass/{id}
 */

export function getVenueData(id) {
  return request({
    url: `/api-web/web/app/venue/app_pass/${id}`,
    method: 'GET',
    id
  })
}