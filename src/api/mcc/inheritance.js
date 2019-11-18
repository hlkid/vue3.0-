/* 非遗管理 */
import request from '@/utils/request'
let prefix = '/api-inheritance/inheritance'

// ----------------------- 非遗管理 start--------------------------------
/**
 * 列表
 * @param data:{title,type,childType,publicFlag,cover,content,commentFlag}
 */
export function getInheritanceDataPage(params) {
    return request({
        url: prefix + '/inHeritage/dataPage',
        method: 'get',
        params
    })
}
/**
 * 新增
 */
export function addInheritance(data) {
    return request({
        url: prefix + '/inHeritage/create',
        method: 'post',
        data
    })
}

/**
 * 编辑
 */
export function editInheritance(data) {
    return request({
        url: prefix + `/inHeritage/update`,
        method: 'put',
        data
    })
}
/**
 * 详情
 */
export function getInheritanceDetail(id) {
    return request({
        url: prefix + `/inHeritage/${id}`,
        method: 'get'
    })
}

/**
 发送审核
 */
export function inheritanceSendExamine(id) {
    return request({
        url: prefix + '/inHeritage/' + id,
        method: 'PUT'
    })
}
/**
 
/**
 审核 
 * */
export function auditInheritance(data) {
    return request({
        url: prefix + "/inHeritage/examine",
        method: 'PUT',
        data
    })
}

/*
artExhibition/sendExamine/{id}
put
发布 data:{publishStatus:0为撤销 1为发布}
*/
export function publishInheritance(data) {
    return request({
        url: prefix + `/inHeritage/publish`,
        method: 'PUT',
        data
    })
}

/**
 * 
 * 大类类型枚举
 */
export function getTypeData(data) {
    return request({
        url: prefix + `/inHeritage/inheritanceTypeEnum`,
        method: 'GET',
        data
    })
}

/**
 * 
 * 小类类型枚举
 */
export function getChildTypeData(data) {
    return request({
        url: prefix + `/inHeritage/inheritanceChildTypeEnum`,
        method: 'GET',
        data
    })
}

/**
 * 
 * 不分页列表
 */
export function getDataNoPage(params) {
    return request({
        url: prefix + `/inHeritage/data`,
        method: 'GET',
        params
    })
}

/**
 * 
 * 保护级别
 */
export function protectLevelData(data) {
    return request({
        url: prefix + `/inHeritage/inheritanceLevelEnum`,
        method: 'GET',
        data
    })
}

/*
删除
*/
export function deleteInheritance(id) {
    return request({
        url: prefix + `/inHeritage/${id}`,
        method: 'DELETE'
    })
}

// -----------------------非遗管理 end-------------------------------- //






