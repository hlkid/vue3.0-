import request from '@/utils/request'
let prefix = '/api-volunteer/volunteer';
/*---------------组织团体信息更新--------------------------*/
/**
 * 获取主管单位列表
 * @param params
 */
export function getSysOrgDataPage(params) {
  return request({
    url: prefix+'/app/sysOrg/dataPage',
    method: 'get',
    params
  })
}
/**
 * app/user/detailGroupUser
 GET
 组织团体用户信息详情
 */
// export function getDetailGroupUser() {
//   return request({
//     url: prefix+'/app/user/detailGroupUser',
//     method: 'get'
//   })
// }

/**
 组织团体用户信息详情
 */
export function detailGroupUser() {
  return request({
    url: prefix+'/groupUser/detailGroupUser',
    method: 'get'
  })
}

/**
 * app/group/getDetailByGroupId/{id}
 GET
 获取详情
 */
export function getDetailByGroupId(id) {
  return request({
    url: prefix+'/app/group/getDetailByGroupId/'+id,
    method: 'get'
  })
}

/**
 * 注册
 * @param params
 */
export function saveGroupRegister(data) {
  return request({
    url: prefix+'/app/user/group/register',
    method: 'post',
    data
  })
}

/**
 * 团体获取详情
 * @param id
 */
export function getGroupDetail(id) {
  return request({
    url: prefix+'/app/group/getDetailByUserId/'+ id,
    method: 'get',
  })
}


/**
 *修改组织团体用户信息
 */
/*
export function updateGroupUser(params) {
  return request({
    url: prefix+'/app/user/updateGroupUser',
    method: 'post',
    data:params
  })
}
*/

/**
 * 组织团体信息新增
 * @param params
 */
export function groupRegister(data) {
  return request({
    url: prefix+'/group/web/register',
    method: 'POST',
    data
  })
}

/**
 * 组织团体删除
 * @param params
 */
export function groupDelete(id) {
  return request({
    url: prefix+'/group/delete/'+id,
    method: 'DELETE'
  })
}

/**
 * 组织团体信息更新
 * @param data
 */
export function updateGroup(data) {
  return request({
    url: prefix+`/group/update/${data.id}`,
    method: 'PUT',
    data:data
  })
}
/*---------------组织团体信息更新---end-----------------------*/
/*--------------志愿者-------------------------------------*/
/**
 * 分页查询列表
 * @param params
 */
export function getVolunteerDataPage(params) {
  return request({
    url: prefix+'/volunteer/dataPage',
    method: 'get',
    params
  })
}

/**
 * 活动管理分页查询列表
 * @param params
 */
export function activityDataPageByWeb(params) {
  return request({
    url: prefix+'/activity/dataPageByWeb',
    method: 'get',
    params
  })
}

/**
 * 活动管理创建
 * @param data
 */
export function insertActivity(data) {
  return request({
    url: prefix+'/activity/insertActivity',
    method: 'POST',
    data
  })
}

/**
 * 活动信息详情
 * @param id
 */
export function activityGetDetail(id) {
  return request({
    url: prefix+'/activity/getDetail/'+id,
    method: 'get'
  })
}


/**
 * 志愿者删除
 */
export function activityDel(id) {
  return request({
    url: prefix+'/activity/delete/'+id,
    method: 'DELETE'
  })
}


/**
 * 修改审核状态
 */
export function activityAudit(data) {
  return request({
    url: prefix+'/activity/audit',
    method: 'put',
    data
  })
}

/**
 * 批量修改审核状态
 */
export function activityAuditBatch(data) {
  return request({
    url: prefix+'/activity/auditBatch',
    method: 'POST',
    data
  })
}

/**
 * 修改发布状态
 */
export function activityPublish(data) {
  return request({
    url: prefix+'/activity/publish',
    method: 'put',
    data
  })
}


/**
 * 活动管理修改
 * @param data
 */
export function updateActivity(data) {
  return request({
    url: prefix+'/activity/updateActivity',
    method: 'POST',
    data
  })
}


/**
 * 活动管活动阶段枚举类
 */
export function activityStageEnum() {
  return request({
    url: prefix+'/activity/activityStageEnum',
    method: 'get'
  })
}

/**
 * 活动报名类型枚举类
 */
export function entryTypeEnum() {
  return request({
    url: prefix+'/activity/entryTypeEnum',
    method: 'get'
  })
}

/**
 * 活动是否限制人数枚举类
 */
export function quotaTypeEnum() {
  return request({
    url: prefix+'/activity/quotaTypeEnum',
    method: 'get'
  })
}

/**
 * 活动招募类型枚举类
 */
export function recruitTypeEnum() {
  return request({
    url: prefix+'/activity/recruitTypeEnum',
    method: 'get'
  })
}

/**
 * 活动审核状态枚举类
 */
export function activityExamineStatusEnum() {
  return request({
    url: prefix+'/activity/activityExamineStatusEnum',
    method: 'get'
  })
}


/**
 * 志愿者详情
 * @param id
 */
export function getVolunteerByUcid(ucId) {
  return request({
    url: prefix+'/volunteer/'+ucId,
    method: 'get'
  })
}

/**
 * 志愿者详情(包含审核意见)
 * @param id
 */
export function detailVolunteerApply(applyId) {
  return request({
    url: prefix+'/volunteer/detailVolunteerApply?applyId='+applyId,
    method: 'get'
  })
}

/**
 * 志愿者审核
 * @param ucId
 */
export function volunteerApply(data) {
  return request({
    url: prefix+'/volunteer/volunteerApply',
    method: 'put',
    data
  })
}

/**
 * 志愿之星推荐
 * @param ucId
 */
export function volunteerStar(data) {
  return request({
    url: prefix+'/volunteerStar/create',
    method: 'POST',
    data
  })
}

/**
 * 修改志愿者
 * @param data
 */
export function editVolunteer(data) {
  return request({
    url: prefix+'/volunteer/updateVolunteer',
    method: 'PUT',
    data
  })
}

/**
 * 志愿者导出
 * @param data
 */
export function exportVolunteerExcel(data) {
  return request({
    url: prefix+'/volunteer/exportVolunteerExcel',
    method: 'GET',
    responseType: 'blob',
    data
  })
}

/**
 * 志愿者导出
 * @param data
 */
export function exportGroupExcel(data) {
  return request({
    url: prefix+'/group/exportGroupExcel',
    method: 'GET',
    responseType: 'blob',
    data
  })
}

/**
 * 志愿者导入
 * @param data
 */
export function importVolunteerExcel(data) {
  return request({
    url: prefix+'/volunteer/importVolunteerExcel',
    method: 'POST',
    data
  })
}

/**
 * 志愿者删除
 * @param data
 */
export function volunteerDel(id) {
  return request({
    url: prefix+'/volunteer/'+id,
    method: 'DELETE'
  })
}


/**
 * 志愿者团队导入
 * @param data
 */
export function importGroupExcel(data) {
  return request({
    url: prefix+'/group/importGroupExcel',
    method: 'POST',
    data
  })
}

/**
 * 批量审批志愿者申请加入团体组织
 * @param data
 */
export function auditsVolunteer(data) {
  return request({
    url: prefix+'/volunteerApply/auditBatch',
    method: 'PUT',
    data
  })
}


/**
 * 审核状态枚举类
 */
export function statusList() {
  return request({
    url: prefix+'/volunteerApply/examineStatusEnum',
    method: 'get'
  })
}
/**
 * 志愿者数量统计
 */
export function getVolunteerStatistics() {
  return request({
    url: prefix+'/volunteer/volunteerStatistics',
    method: 'get'
  })
}
/*--------------志愿者---end----------------------------------*/
/*--------------团体---start--------------------------------------------*/
/**
 * 分页查询列表（分页）
 * @param params
 */
export function getGroupDataPage(params) {
  return request({
    url: prefix+'/group/dataPageByWeb',
    method: 'get',
    params
  })
}

/**
 * 团体组织列表（不分页）
 */
export function groupData() {
  return request({
    url: prefix+'/group/dataByWeb',
    method: 'get'
  })
}

/**
 * 批量审核组织团队
 */
export function auditsGroup(data) {
  return request({
    url: prefix+'/group/batchApproval',
    method: 'POST',
    data
  })
}

/**
 * 审核组织团队
 */
export function groupApply(params) {
  return request({
    url: prefix+'/group/approval',
    method: 'post',
    data: params
  })
}

/**
 * 组织详情
 * @param id
 */
export function getDetailById(id) {
  return request({
    url: prefix+'/group/getDetail/'+id,
    method: 'get'
  })
}

/**
 * 更新组织名称
 * @param id
 * @param data
 */
export function editGroupName(id,data) {
  return request({
    url: prefix+'/group/updateGroupName/'+id,
    method: 'put',
    data
  })
}

/**
 * 修改组织团体用户信息
 * @param id
 * @param data
 */
export function updateGroupUser(data) {
  return request({
    url: prefix+'/groupUser/updateGroupUser',
    method: 'PUT',
    data
  })
}

/**
 * 管理员详情
 * @param id
 */
export function userDetail(id) {
  return request({
    url: prefix+'/groupUser/getUserDetail/'+id,
    method: 'get'
  })
}



/*---------------------------志愿者之星、活动报名管理开始----------------------------------*/

/**
 * 活动报名列表
 * @param params
 */
export function volunteerActivityApplyDataPage(params) {
  return request({
    url: prefix+'/volunteerActivityApply/dataPage',
    method: 'get',
    params
  })
}

/**
 * 活动报名审核
 * @param data
 */
export function volunteerActivityApplyAudit(data) {
  return request({
    url: prefix+'/volunteerActivityApply/audit',
    method: 'put',
    data
  })
}

/**
 * 活动申请状态枚举类
 * @param params
 */
export function activityExamineStatusEnumActivity() {
  return request({
    url: prefix+'/volunteerActivityApply/activityExamineStatusEnum',
    method: 'get'
  })
}


/**
 * 获取志愿者之星列表
 * @param params
 */
export function volunteerStarDataPage(params) {
  return request({
    url: prefix+'/volunteerStar/dataPage',
    method: 'get',
    params
  })
}

/**
 * 取消志愿者之星
 * @param id
 */
export function volunteerStarCancel(id) {
  return request({
    url: prefix+'/volunteerStar/cancel/'+id,
    method: 'PUT'
  })
}

/*---------------------------志愿者之星、活动报名管理结束----------------------------------*/




/*---------------------------数据词典开始----------------------------------*/

/*
* sysDictionary/dataPage
* GET
* 数据词典分页查询
* params:{typeCode,typeName,valueName,pageNum,pageSize}
* */
export function getDictionaryDataPage(params) {
  return request({
    url: prefix+'/sysDictionary/dataPage',
    method: 'get',
    params
  })
}
/*
* sysDictionary/create
* POST
* 新增数据词典
* params:{parentId，parentDicNum，typeCode，typeName，value，valueName}
* */
export function addDictionary(data) {
  return request({
    url: prefix+'/sysDictionary/create',
    method: 'POST',
    data
  })
}
/*
* sysDictionary/{dicNum}
* delete
* 删除数据词典
* */
export function deleteDictionary(dicNum) {
  return request({
    url: prefix+'/sysDictionary/'+dicNum,
    method: 'delete'
  })
}
/*
* sysDictionary/{id}
* PUT
* 修改数据词典
* params:{typeName,value,valueName}
* */
export function editDictionary(data) {
  return request({
    url: prefix+'/sysDictionary/'+data.id,
    method: 'PUT',
    data
  })
}
/*
* sysDictionary/{id}
* GET
* 获取字典详情
* */
export function getDictionaryDetail(id) {
  return request({
    url: prefix+'/sysDictionary/'+id,
    method: 'GET'
  })
}

/*
* sysDictionary/childes/{id}
* GET
* 获取字典详情
* */
export function getDictionaryChildes(id) {
  return request({
    url: prefix+'/sysDictionary/childes/'+id,
    method: 'GET'
  })
}

/*
* /sysDictionary/getDicListByTypeCode
* GET
* 根据typecode 获取值
* */
export function getDicListByTypeCode(typeCode) {
  return request({
    url: prefix+'/sysDictionary/getDicListByTypeCode',
    method: 'GET',
    params:{
      typeCode
    }
  })
}

/*
* /enum/dicTypeCodeEnum
* GET
* 字典TYPECODE列表
* */
export function getDicTypeCodeEnum() {
  return request({
    url: prefix+'/enum/dicTypeCodeEnum',
    method: 'GET',
  })
}
/*
* sysDictionary/childDicListByTypeCodeAndValue
GET
获取子级字典集合
* params:{typeCode,value}
* */
export function getChildDicListByTypeCodeAndValue(params) {
  return request({
    url: prefix+'/sysDictionary/childDicListByTypeCodeAndValue',
    method: 'GET',
    params
  })
}

/*---------------------------数据词典结束----------------------------------*/
