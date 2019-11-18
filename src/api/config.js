import request from '@/utils/request';
let prefix = '/api-ucenter/ucenter';

/*if (process.env.NODE_ENV === 'production') {
  prefix = '/api-ucenter/ucenter'
}else{
  prefix = '/api/api-ucenter/ucenter'
}*/

/*---------------------------资源管理开始----------------------------------*/

/*
* sysMenu/data
* GET
* 菜单不分页查询
* params:{menuName,menuType:0菜单1按钮}
* */
export function getMenuData(params) {
  return request({
    url: prefix + '/sysMenu/data',
    method: 'get',
    params
  })
}
/*
* sysMenu/create
* POST
* 新增菜单
* params:{parentId，parentMenuNum，menuName，menuType，menuUrl，menuIcon，menuStatus，menuSort}
* */
export function addMenu(data) {
  return request({
    url: prefix + '/sysMenu/create',
    method: 'POST',
    data
  })
}
/*
* sysMenu/{menuNum}
* delete
* 删除菜单
* */
export function deleteMenu(menuNum) {
  return request({
    url: prefix + '/sysMenu/' + menuNum,
    method: 'delete'
  })
}



/*
* sysMenu/{id}
* PUT
* 修改菜单
* */
export function editMenu(data) {
  return request({
    url: prefix + '/sysMenu/' + data.id,
    method: 'PUT',
    data
  })
}
/*---------------------------资源管理结束----------------------------------*/
/*---------------------------机构管理开始----------------------------------*/

/*
* sysOrg/data
* GET
* 机构不分页查询
* params:{orgName,parentId}
* */
export function getOrgData(params) {
  return request({
    url: prefix + '/sysOrg/data',
    method: 'get',
    params
  })
}
/*
* sysOrg/create
* POST
* 新增机构
* params:{orgName，orgSort，parentOrgNum，parentId}
* */
export function addOrg(data) {
  return request({
    url: prefix + '/sysOrg/create',
    method: 'POST',
    data
  })
}
/*
* sysOrg/{id}
* delete
* 删除机构
* */
export function deleteOrg(id) {
  return request({
    url: prefix + '/sysOrg/' + id,
    method: 'delete'
  })
}
/*
* sysOrg/{id}
* PUT
* 修改机构
* params:{orgName,orgSort,parentId}
* */
export function editOrg(data) {
  return request({
    url: prefix + '/sysOrg/' + data.id,
    method: 'PUT',
    data
  })
}
/*---------------------------机构管理结束----------------------------------*/
/*---------------------------部门管理开始----------------------------------*/

/*
* sysDept/data
* GET
* 部门不分页查询
* params:{deptName,parentId}
* */
export function getDeptData(params) {
  return request({
    url: prefix + '/sysDept/data',
    method: 'get',
    params
  })
}
/*
* sysDept/create
* POST
* 新增部门
* params:{deptName，deptSort，parentId}
* */
export function addDept(data) {
  return request({
    url: prefix + '/sysDept/create',
    method: 'POST',
    data
  })
}
/*
* sysDept/{id}
* delete
* 删除部门
* */
export function deleteDept(id) {
  return request({
    url: prefix + '/sysDept/' + id,
    method: 'delete'
  })
}
/*
* sysDept/{id}
* PUT
* 修改部门
* params:{deptName,orgSort,parentId}
* */
export function editDept(data) {
  return request({
    url: prefix + '/sysDept/' + data.id,
    method: 'PUT',
    data
  })
}
/*---------------------------部门管理结束----------------------------------*/
/*---------------------------角色管理----------------------------------*/

/*
* sysRole/dataPage
* GET
* 角色分页查询
* params:{pageNum,pageSize,roleName:角色名称,roleStatus:角色状态}
* */
export function getRoleData(params) {
  return request({
    url: prefix + '/sysRole/dataPage',
    method: 'get',
    params
  })
}
/*
* sysRole/{id}
* DELETE
* 删除角色
* */
export function deleteRole(id) {
  return request({
    url: prefix + `/sysRole/${id}`,
    method: 'delete',
  })
}

/**
 * 新增角色
 * post
 * @param data:
 * roleName:角色名称,
 * roleStatus:角色状态(1启用 0 关闭)
 *  remark:备注
 */
export function createRole(data) {
  return request({
    url: prefix + `/sysRole/create`,
    method: 'post',
    data
  })
}

/**
 * 修改角色
 * @param id
 * data(roleName:角色名称,roleStatus:角色状态(1启用 0 关闭), remark:备注 )
 */
export function reviseRole(id, data) {
  return request({
    url: prefix + `/sysRole/${id}`,
    method: 'put',
    data
  })
}

/**
 * 查询改角色已选资源
 * @param id
 */
export function sysMenuList(id) {
  return request({
    url: prefix + `/sysRole/sysMenuList/${id}`,
    method: 'get',
  })
}

/**
 * 角色添加菜单
 * @param data(id :角色主键,sysMenuIds:资源主键，以逗号分割)
 */
export function relateMenu(data) {
  return request({
    url: prefix + `/sysRole/relateMenu`,
    method: 'POST',
    data
  })
}


/*---------------------------角色管理end----------------------------------*/
/*---------------------------数据词典开始----------------------------------*/
/**
* sys/application/dictionary/app_pass/dicNode
 GET
 字典节点封装接口
* */
export function getDictionaryNode() {
  return request({
    url: prefix + '/sys/application/dictionary/app_pass/dicNode',
    method: 'GET'
  })
}

/*
* sysDictionary/dataPage
* GET
* 数据词典分页查询
* params:{typeCode,typeName,valueName,pageNum,pageSize}
* */
export function getDictionaryDataPage(params) {
  return request({
    url: prefix + '/sysDictionary/dataPage',
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
    url: prefix + '/sysDictionary/create',
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
    url: prefix + '/sysDictionary/' + dicNum,
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
    url: prefix + '/sysDictionary/' + data.id,
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
    url: prefix + '/sysDictionary/' + id,
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
    url: prefix + '/sysDictionary/childes/' + id,
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
    url: prefix + '/sysDictionary/getDicListByTypeCode',
    method: 'GET',
    params: {
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
    url: prefix + '/enum/dicTypeCodeEnum',
    method: 'GET',
  })
}

/*---------------------------数据词典结束----------------------------------*/
/*---------------------------用户管理----------------------------------*/

/*
* sysMenu/data
* GET
* 菜单不分页查询
* params:{menuName,menuType:0菜单1按钮}
* */

// 用户列表
export function getUserList(params) {
  return request({
    url: prefix + '/sysUser/dataPage',
    method: 'get',
    params
  })
}

/**
 * 用户类型获取
 * @param params
 */
export function getUserTypeEnum() {
  return request({
    url: prefix + '/sysUser/userTypeEnum',
    method: 'get',
  })
}

/**
 * 用户属性类型获取
 */
export function getUserAttributeEnum() {
  return request({
    url: prefix + '/sysUser/userAttributeEnum',
    method: 'get',
  })
}



/**
 * 用户列表 不分页
 * @param params
 */
export function getUserData(params) {
  return request({
    url: prefix + '/sysUser/data',
    method: 'get',
    params
  })
}

/**
 * sysUser/attributeUser
 * GET
 * 用户属性获取用户
 */
export function getAttributeUser() {
  return request({
    url: prefix + '/sysUser/attributeUser',
    method: 'get',
  })
}

// 删除
export function userDelete(id) {
  return request({
    url: prefix + '/sysUser/' + id,
    method: 'delete'
  })
}

// sysUser/userRealNameCheck
// GET
// 用户真实姓名校验唯一
export function userRealNameCheck(userRealName) {
  return request({
    url: prefix + '/sysUser/userRealNameCheck?userRealName=' + userRealName,
    method: 'get'
  })
}

// 校验用户是否已经存在
export function exitUser(data) {
  return request({
    url: prefix + '/sysUser/accountCheck?userAccount=' + data,
    method: 'get'
  })
}

// 得到用户列表
export function getRole(data1, data2) {
  return request({
    url: prefix + '/sysRole/data?roleName=' + data1 + '&roleStatus=' + data2,
    method: 'get'
  })
}



// 重置密码
export function revisePas(id) {
  return request({
    url: prefix + '/sysUser/reset/password/' + id,
    method: 'PUT',
  })
}


// 修改密码
export function saveUserpassword(id, data) {
  return request({
    url: prefix + '/sysUser/update/password/' + id,
    method: 'POST',
    data,
  })
}
//--------------用户管理END--------
/*------------------------------------------地址行政区开始-----------------------------------------*/
/*district/parentData
GET
父级节点查询*/
export function districtParentData(districtName) {
  return request({
    url: prefix + '/district/parentData',
    method: 'GET',
    params: {
      districtName: districtName
    }
  })
}
/*district/parentData
GET
父级节点查询*/
export function districtChildData(parentId) {
  return request({
    url: prefix + '/district/data',
    method: 'GET',
    params: {
      parentId: parentId
    }
  })
}
/*------------------------------------------地址行政区结束-----------------------------------------*/

/*------------------------------------------应用管理开始-----------------------------------------*/
/**
 * hb/application/create
 POST
 新增应用
 data:{name,orgType}
 * */
export function hbApplicationCreate(data) {
  return request({
    url: prefix + '/hb/application/create',
    method: 'POST',
    data
  })
}
export function hbApplicationDelete(id) {
  return request({
    url: prefix + '/hb/application/' + id,
    method: 'DELETE'
  })
}
/**
 * hb/application/{id}
 PUT
 更新应用
 data:{name}
 * */
export function hbApplicationUpdate(data) {
  return request({
    url: prefix + '/hb/application/' + data.id,
    method: 'PUT',
    data
  })
}
/**
 * hb/application/{id}
 GET
 详情接口
 * */
export function hbApplicationDetail(id) {
  return request({
    url: prefix + '/hb/application/' + id,
    method: 'GET'
  })
}
/**
 * HTTP
 hb/application/data
 GET
 应用不分页查询
 params:{name}
 * */
export function hbApplicationDataPage(params) {
  return request({
    url: prefix + '/hb/application/dataPage',
    method: 'GET',
    params
  })
}
export function hbApplicationData(params) {
  return request({
    url: prefix + '/hb/application/data',
    method: 'GET',
    params
  })
}
/**
 * hb/application/orgTypeEnum
 GET
 应用类型
 * */
export function hbApplicationTypeEnum() {
  return request({
    url: prefix + '/hb/application/orgTypeEnum',
    method: 'GET'
  })
}

// -------------------------分配数据字典-------------------------------
/**
 * sys/application/dictionary/create
 POST
 新增绑定关系
 data:{venueNums:[],hbAppId,dicIds:[]}
 * */
export function applicationDictionaryCreate(data) {
  return request({
    url: prefix + '/sys/application/dictionary/create',
    method: 'POST',
    data
  })
}
/**
 * sys/application/dictionary/update
 PUT
 单场馆更新字典关联接口
 data:{venueNum,hbAppId,typeCode,dicIds}
 * */
export function applicationDictionaryUpdate(data) {
  return request({
    url: prefix + '/sys/application/dictionary/update',
    method: 'PUT',
    data
  })
}
/**
 * sys/application/dictionary/dicEnum
 GET
 数据字典code获取
 * */
export function applicationDictionaryDicEnum() {
  return request({
    url: prefix + '/sys/application/dictionary/dicEnum',
    method: 'GET'
  })
}
/**
 * sys/application/dictionary/dictionaryData
 GET
 已绑定字典类型查找
 * */
export function applicationDictionaryData(params) {
  return request({
    url: prefix + '/sys/application/dictionary/dictionaryData',
    method: 'GET',
    params
  })
}
/**
 * HTTP
 sys/application/dictionary/app_pass/dictionaryDataByTypeCode
 GET
 应用场景字典类型查找
 * */
export function applicationDictionaryDataByTypeCode(typeCode) {
  return request({
    url: prefix + '/sys/application/dictionary/app_pass/dictionaryDataByTypeCode',
    method: 'GET',
    params: {
      typeCode: typeCode
    }
  })
}
// ---------------------用户绑定应用
/**
* userApp/create
 POST
 用户绑定应用
 data:{id,hbAppIds:[]}
* */
export function userBindApplication(data) {
  return request({
    url: prefix + '/userApp/create',
    method: 'POST',
    data
  })
}
/**
* userApp/{id}
 GET
 用户查应用
* */
export function userApplicationList(id) {
  return request({
    url: prefix + '/userApp/' + id,
    method: 'GET'
  })
}
// ------------------角色绑定应用
/**
* roleApp/create
 POST
 角色绑定应用
 data:{id,hbAppIds:[]}
* */
export function roleBindApplication(data) {
  return request({
    url: prefix + '/roleApp/create',
    method: 'POST',
    data
  })
}
/**
* roleApp/{id}
 GET
 用户查应用
* */
export function roleApplicationList(id) {
  return request({
    url: prefix + '/roleApp/' + id,
    method: 'GET'
  })
}

/*------------------------------------------应用管理结束-----------------------------------------*/

/*------------------------------------------应用图标开始-----------------------------------------*/
/**
 * appImg/create
 POST
 新增应用图标
 * */
export function appImgCreate(data) {
  return request({
    url: prefix + '/appImg/create',
    method: 'POST',
    data
  })
}

/**
 * appImg/create
 POST
 应用图标列表
 * */
export function appImgDataPage(params) {
  return request({
    url: prefix + '/appImg/dataPage',
    method: 'GET',
    params
  })
}


/**
 * appImg/update
 PUT
 编辑应用图标
 * */
export function appImgUpdate(data) {
  return request({
    url: prefix + '/appImg/update',
    method: 'PUT',
    data
  })
}

/**
 * appImg/update
 GET
 应用图标详情
 * */
export function appImgDetail(id) {
  return request({
    url: prefix + `/appImg/${id}`,
    method: 'GET'
  })
}

/**
 * appImg/checkIdentification
 GET
 校验标识是否存在
 * */
export function appImgCheckIdentification(params) {
  return request({
    url: prefix + `/appImg/checkIdentification`,
    method: 'GET',
    params
  })
}


/*------------------------------------------应用图标结束-----------------------------------------*/


/*------------------------------------------分组管理开始-----------------------------------------*/
/**
 * sys/group/dataPage
 GET
 分页查询
 params:{name,pageSize,pageNum}
 * */
export function getSysGroupDataPage(params) {
  return request({
    url: prefix + '/sys/group/dataPage',
    method: 'GET',
    params
  })
}
export function getSysGroupData(params) {
  return request({
    url: prefix + '/sys/group/data',
    method: 'GET',
    params
  })
}
/**
 * sys/group/create
 POST
 新增组别
 data:{name,remark}
 * */
export function sysGroupCreate(data) {
  return request({
    url: prefix + '/sys/group/create',
    method: 'POST',
    data
  })
}
/**
 * HTTP
 sys/group/update
 PUT
 更新组别
 data:{name,remark}
 * */
export function sysGroupUpdate(data) {
  return request({
    url: prefix + '/sys/group/update',
    method: 'PUT',
    data
  })
}
/**
 * sys/group/{id}
 GET
 详情接口
 * */
export function sysGroupDetail(id) {
  return request({
    url: prefix + '/sys/group/' + id,
    method: 'GET'
  })
}
/**
 * sys/group/{id}
 DELETE
 删除组别
 * */
export function sysGroupDelete(id) {
  return request({
    url: prefix + '/sys/group/' + id,
    method: 'DELETE'
  })
}

/**
 * groupUser/create
 POST
 组别绑用户
 data:{idSysGroup,idSysUsers:[]}
 * */
export function groupUserCreate(data) {
  return request({
    url: prefix + '/groupUser/create',
    method: 'POST',
    data
  })
}
/**
 * groupUser/userByGroupId
 GET
 组别查询用户
 * */
export function groupUserByGroupId(idSysGroup) {
  return request({
    url: prefix + '/groupUser/userByGroupId',
    method: 'GET',
    params: {
      idSysGroup: idSysGroup
    }
  })
}

/**
 * groupApp/create
 POST
 组别选应用
 data:{idSysGroup,hbAppIds:[]}
 * */
export function groupAppCreate(data) {
  return request({
    url: prefix + '/groupApp/create',
    method: 'POST',
    data
  })
}
/**
 * groupApp/appByGroupId
 GET
 组别查应用
 * */
export function groupAppByGroupId(idSysGroup) {
  return request({
    url: prefix + '/groupApp/appByGroupId',
    method: 'GET',
    params: {
      idSysGroup: idSysGroup
    }
  })
}
/*------------------------------------------分组管理结束-----------------------------------------*/
