/* 师资管理 */
import request from '@/utils/request'
let prefix = '/api-inheritance/inheritance'

// ----------------------- 老师风采 和 教师课程 start--------------------------------
/**
 * 老师风采列表
 */
export function getTeacherMangeDataPage(params) {
    return request({
        url: prefix + '/teacherDemeanor/dataPage',
        method: 'get',
        params
    })
}

/**
 * 老师风采不分页列表
 */
export function getTeacherMangeDataNoPage(params) {
    return request({
        url: prefix + '/teacherDemeanor/data',
        method: 'get',
        params
    })
}

/**
 * 教师课程列表
 */
export function getTeacherCourseDataPage(params) {
    return request({
        url: prefix + '/course/dataPage',
        method: 'get',
        params
    })
}

/**
 * 老师风采新增
 */
export function addTeacherMange(data) {
    return request({
        url: prefix + '/teacherDemeanor/create',
        method: 'post',
        data
    })
}

/**
 * 教师课程新增
 */
export function addTeacherCourse(data) {
    return request({
        url: prefix + '/course/create',
        method: 'post',
        data
    })
}

/**
 * 老师风采编辑
 */
export function editTeacherMange(data) {
    return request({
        url: prefix + `/teacherDemeanor/update`,
        method: 'put',
        data
    })
}
/**
 * 教师课程编辑
 */
export function editTeacherCourse(data) {
    return request({
        url: prefix + `/course/update`,
        method: 'put',
        data
    })
}
/**
 * 老师风采详情
 */
export function getTeacherMangeDetail(id) {
    return request({
        url: prefix + `/teacherDemeanor/${id}`,
        method: 'get'
    })
}
/**
 * 教师课程详情
 */
export function getTeacherCourseDetail(id) {
    return request({
        url: prefix + `/course/${id}`,
        method: 'get',
    })
}

/**
 老师风采发送审核
 */
export function teacherMangeSendExamine(id) {
    return request({
        url: prefix + '/teacherDemeanor/sendExamine/' + id,
        method: 'PUT'
    })
}
/**
 * 
 * 
 * /**
 教师课程发送审核
 */
export function teacherCourseSendExamine(id) {
    return request({
        url: prefix + '/course/' + id,
        method: 'PUT'
    })
}
/**
 
/**
 老师风采审核 
 * */
export function auditTeacherMange(data) {
    return request({
        url: prefix + "/teacherDemeanor/examine",
        method: 'PUT',
        data
    })
}


/**
教师课程审核 
 * */
export function auditTeacherCourse(data) {
    return request({
        url: prefix + "/course/examine",
        method: 'PUT',
        data
    })
}

/*
老师风采发布 
*/
export function publishTeacherMange(data) {
    return request({
        url: prefix + `/teacherDemeanor/publish`,
        method: 'PUT',
        data
    })
}

/*
教师课程发布 
*/
export function publishTeacherCourse(data) {
    return request({
        url: prefix + `/course/publish`,
        method: 'PUT',
        data
    })
}

/*
老师风采删除
*/
export function deleteTeacherMange(id) {
    return request({
        url: prefix + `/teacherDemeanor/${id}`,
        method: 'DELETE'
    })
}

/*
教师课程删除
*/
export function deleteTeacherCourse(id) {
    return request({
        url: prefix + `/course/${id}`,
        method: 'DELETE'
    })
}

/**
 * 获取教师关联键
 */
export function getIdTeacher(params) {
    return request({
        url: prefix + `/teacherDemeanor/data`,
        method: 'GET',
        params
    })
}

/**
 * 获取课程类型
 */
export function getCourseType(params) {
    return request({
        url: prefix + `/course/courseType`,
        method: 'GET',
        params
    })
}

// ----------------------- 老师风采 和 教师课程 end--------------------------------

// ----------------------- 教师课程课件 start--------------------------------

/**
 * 列表
 */
export function getTeacherCoursewareDataPage(params) {
    return request({
        url: prefix + '/courseWare/dataPage',
        method: 'get',
        params
    })
}


/**
 * 新增
 */
export function addTeacherCourseware(data) {
    return request({
        url: prefix + '/courseWare/create',
        method: 'post',
        data
    })
}

/**
 * 编辑
 */
export function editTeacherCourseware(data) {
    return request({
        url: prefix + `/courseWare/update`,
        method: 'put',
        data
    })
}
/**
 * 详情
 */
export function getTeacherCoursewareDetail(id) {
    return request({
        url: prefix + `/courseWare/${id}`,
        method: 'get',
    })
}

/**
 发送审核
 */
export function teacherCoursewareSendExamine(id) {
    return request({
        url: prefix + '/courseWare/' + id,
        method: 'PUT'
    })
}

/**
审核 
 * */
export function auditTeacherCourseware(data) {
    return request({
        url: prefix + "/courseWare/examine",
        method: 'PUT',
        data
    })
}


/*
发布 
*/
export function publishTeacherCourseware(data) {
    return request({
        url: prefix + `/courseWare/publish`,
        method: 'PUT',
        data
    })
}

/*
获取课程关联键
*/
export function getLinkCourseList(params) {
    return request({
        url: prefix + `/course/courseList`,
        method: 'get',
        params
    })
}

/*
删除
*/
export function deleteTeacherCourseware(id) {
    return request({
        url: prefix + `/courseWare/${id}`,
        method: 'DELETE'
    })
}
// ----------------------- 教师课程课件 end--------------------------------








