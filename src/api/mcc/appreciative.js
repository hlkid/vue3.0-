/* 艺术鉴赏 和 展览展示 ，景点旅游*/
import request from '@/utils/request'
let prefix = '/api-appreciative/appreciative'

// -----------------------艺术鉴赏 和 展览展示 start--------------------------------
/**
 * 列表
 * @param data:{title,type,childType,publicFlag,cover,content,commentFlag}
 */
export function getArtDataPage(params) {
    return request({
        url: prefix + '/artExhibition/dataPage',
        method: 'get',
        params
    })
}
/**
 * 新增
 * @param data:{title,type,childType,publicFlag,cover,content,commentFlag}
 */
export function addArt(data) {
    return request({
        url: prefix + '/artExhibition/create',
        method: 'post',
        data
    })
}

/**
 * 编辑
 */
export function editArt(data) {
    return request({
        url: prefix + `/artExhibition/update`,
        method: 'put',
        data
    })
}
/**
 * 详情
 */
export function getArtDetail(id) {
    return request({
        url: prefix + `/artExhibition/${id}`,
        method: 'get'
    })
}

/**
 发送审核
 */
export function artSendExamine(id) {
    return request({
        url: prefix + '/artExhibition/sendExamine/' + id,
        method: 'PUT'
    })
}
/**
 
/**
 审核 
 * */
export function auditArt(data) {
    return request({
        url: prefix + "/artExhibition/examine",
        method: 'PUT',
        data
    })
}

/*
artExhibition/sendExamine/{id}
put
发布 data:{publishStatus:0为撤销 1为发布}
*/
export function publishArt(data) {
    return request({
        url: prefix + `/artExhibition/publish`,
        method: 'PUT',
        data
    })
}


/*
artExhibition/sendExamine/{id}
delete
删除
*/
export function deleteArt(id) {
    return request({
        url: prefix + `/artExhibition/${id}`,
        method: 'DELETE'
    })
}

// -----------------------艺术鉴赏 和 展览展示 end--------------------------------

// -----------------------景点旅游 start--------------------------------
/**
 * /travelPlace/dataPage
 GET
 景点分页查询
 * @param data:{pageNum,pageSize,name,type,examineStatus,publishStatus}
 */
export function getTravelPlaceDataPage(params) {
  return request({
    url: prefix + '/travelPlace/dataPage',
    method: 'get',
    params
  })
}
/**
 * appreciative/travelPlace/create
 POST
 景点新增
 * @param data:{type,keyword,mobileCover,content,startTime,regionCode,regionName,address,name,pictureResources,videoResources}
 */
export function travelPlaceCreate(data) {
  return request({
    url: prefix + '/travelPlace/create',
    method: 'post',
    data
  })
}

/**
 * appreciative/travelPlace/update
 PUT
 景点修改
 * @param data:{id,type,keyword,mobileCover,content,startTime,regionCode,regionName,address,name,pictureResources,videoResources}
 */
export function travelPlaceUpdate(data) {
  return request({
    url: prefix + `/travelPlace/update`,
    method: 'put',
    data
  })
}
/**
 * appreciative/travelPlace/{id}
 GET
 景点详情
 */
export function travelPlaceDetail(id) {
  return request({
    url: prefix + `/travelPlace/${id}`,
    method: 'get'
  })
}
/**
 * appreciative/travelPlace/{id}
 DELETE
 景点删除
 */
export function travelPlaceDelete(id) {
  return request({
    url: prefix + `/travelPlace/${id}`,
    method: 'DELETE'
  })
}
/**
 * appreciative/travelPlace/publish
 PUT
 景点发布
 data:{id, publishStatus:0 撤销 1 发布}
 * */
export function travelPlacePublish(data) {
  return request({
    url: prefix + `/travelPlace/publish`,
    method: 'PUT',
    data
  })
}

/**
 * appreciative/travelPlace/{id}
 PUT
 景点发送审核
 */
export function travelPlaceSendExamine(id) {
  return request({
    url: prefix + '/travelPlace/' + id,
    method: 'PUT'
  })
}

/**
 * appreciative/travelPlace/examine
 PUT
 景点审核
 data:{idSource,status: 审核状态（2 不通过 1 通过）,reason}
 */
export function travelPlaceExamine(data) {
  return request({
    url: prefix + `/travelPlace/examine`,
    method: 'PUT',
    data
  })
}
// -----------------------景点旅游 end--------------------------------





