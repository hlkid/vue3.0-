import request from '@/utils/request'
let prefix = '/api-reserve/reserve';

/*-------------------枚举---------------------*/
/**
 * enum/accessCardStatusList
 GET
 获取ID卡使用状态列表
 */
export function getCardStatusList(){
  return request({
    url: prefix+'/enum/accessCardStatusList',
    method: 'get',
  })
}

/**
 * enum/deviceTypeList
 GET
 获取设备类型列表
 */
export function getDeviceTypeList(){
  return request({
    url: prefix+'/enum/deviceTypeList',
    method: 'get',
  })
}

/**
 * enum/lampStatusList
 GET
 获取智能灯使用状态列表
 */
export function getLampStatusList(){
  return request({
    url: prefix+'/enum/lampStatusList',
    method: 'get',
  })
}

/**
 * enum/deviceFaultStatusList
 GET
 获取设备故障状态列表
 */
export function getDeviceFaultStatusList(){
  return request({
    url: prefix+'/enum/deviceFaultStatusList',
    method: 'get',
  })
}

/**
 * enum/deviceStatusList
 GET
 获取设备使用状态列表
 */
export function getDeviceStatusList(){
  return request({
    url: prefix+'/enum/deviceStatusList',
    method: 'get',
  })
}

/**
 * enum/deviceOnlineStatusList
 GET
 获取设备连接状态列表
 */
export function getDeviceOnlineStatusList(){
  return request({
    url: prefix+'/enum/deviceOnlineStatusList',
    method: 'get',
  })
}

/**
 * enum/deviceAuthTypeList
 GET
 获取授权类型列表
 */
export function getDeviceAuthTypeList(){
  return request({
    url: prefix+'/enum/deviceAuthTypeList',
    method: 'get',
  })
}
/*-------------------枚举end---------------------*/

/*-------------------id卡管理-----------------------*/
/**
 * accessCard/create
 POST
 新增ID卡
 */
export function addAccessCard (data) {
  return request({
    url: prefix+'/accessCard/create',
    method: 'post',
    data
  })
}

/**
 * accessCard/getPage
 GET
 分页获取ID卡列表
 * @param params
 */
export function getAccessCardPage (params) {
  return request({
    url: prefix+'/accessCard/getPage',
    method: 'GET',
    params
  })
}

/**
 * accessCard/getInfo/$id
 GET
 根据主键ID获取ID卡信息
 * @param params
 */
export function getAccessCardDetail (id) {
  return request({
    url: prefix+`/accessCard/getInfo/${id}`,
    method: 'GET',
  })
}

/**
 * accessCard/enable/$id
 POST
 启用ID卡信息
 * @param id
 */
export function getAccessCardEnable (id) {
  return request({
    url: prefix+`/accessCard/enable/${id}`,
    method: 'POST',
  })
}

/**
 * accessCard/$id
 DELETE
 删除ID卡信息
 * @param id
 */
export function deleteAccessCard (id) {
  return request({
    url: prefix+`/accessCard/${id}`,
    method: 'DELETE',
  })
}

/**
 * accessCard/exportExcel
 GET
 导出id卡信息到exce
 * @param id
 */
export function getAccessCardExport () {
  return request({
    url: prefix+`/accessCard/exportExcel`,
    method: 'GET',
    responseType: 'blob'
  })
}

/**
 *deviceAccessCard/create
 POST
 授权ID卡到设备
 * @param id
 */
export function addDeviceAccessCard (data) {
  return request({
    url: prefix+`/deviceAccessCard/createAccessCard`,
    method: 'POST',
    data
  })
}

/**
 * HTTP
 deviceAccessCard/del/$idDevice/$idAccessCard
 POST
 解除ID卡授权信息
 * @param id
 */
export function deleteDeviceAccessCard (idDevice,idAccessCard) {
  return request({
    url: prefix+`/deviceAccessCard/del/${idDevice}/${idAccessCard}`,
    method: 'POST',
  })
}

/**
 * accessCard/disable/$id
 POST
 禁用ID卡信息
 */
export function disableDeviceAccessCard (id) {
  return request({
    url: prefix+`/accessCard/disable/${id}`,
    method: 'POST',
  })
}

/**
 * deviceAccessCard/createReaderCard
 POST
 授权读者证到设备
 * @param id
 */
export function addReaderCardDevice (data) {
  return request({
    url: prefix+`/deviceAccessCard/createReaderCard`,
    method: 'POST',
    data
  })
}


/*-------------------id卡管理--end------------------*/

/*-----------------智能灯管理--------------------------*/
/**
 * device/getList
 POST
 根据条件获取设备列表
 * @param data
 */
export function getDeviceList (params) {
  return request({
    url: prefix+`/device/getList`,
    method: 'get',
    params
  })
}
/**
 * lamp/create
 POST
 新增智能灯
 * @param data
 */
export function addLampCreate (data) {
  return request({
    url: prefix+`/lamp/create`,
    method: 'POST',
    data
  })
}

/**
 * lamp/getPage
 GET
 分页获取智能灯列表
 * @param data
 */
export function getLampPage (params) {
  return request({
    url: prefix + `/lamp/getPage`,
    method: 'GET',
    params
  })
}

/**
 * Lamp
 PUT
 更新智能灯信息
 */
export function editLamp (data) {
  return request({
    url: prefix+`/lamp`,
    method: 'PUT',
    data
  })
}

/**
 * lamp/getInfo/$id
 GET
 根据主键ID查询智能灯信息
 * @param data
 */
export function getLampInfo (id) {
  return request({
    url: prefix+`/lamp/getInfo/${id}`,
    method: 'GET',
  })
}

/**
 * lamp/disable/$id
 POST
 禁用智能灯
 */
export function disableLamp (id) {
  return request({
    url: prefix+`/lamp/disable/${id}`,
    method: 'POST',
  })
}

/**
 * lamp/enable/$id
 POST
 启用智能灯
 */
export function enableLamp (id) {
  return request({
    url: prefix+`/lamp/enable/${id}`,
    method: 'POST',
  })
}

/**
 * lamp/exportExcel
 GET
 导出智能灯信息
 * @param id
 */
export function exportLampExcel (params) {
  return request({
    url: prefix+`/lamp/exportExcel`,
    method: 'GET',
    responseType: 'blob',
    download: true,
    params
  })
}

/**
 * lamp/$id
 DELETE
 删除智能灯
 */
export function deleteLamp (id) {
  return request({
    url: prefix+`/lamp/${id}`,
    method: 'DELETE',
  })
}

/*-----------------智能灯管理--end--------------------------*/

/*------------------门禁/坐席设备管理---------------------------*/
/**
 * device/getPage
 GET
 分页查询设备列表
 * @param params
 */
export function getDevicePage (params) {
  return request({
    url: prefix+`/device/getPage`,
    method: 'GET',
    params
  })
}

/**
 *device/create
 POST
 门禁坐席新增
 * @param params
 */
export function addDevice (data) {
  return request({
    url: prefix+`/device/create`,
    method: 'POST',
    data
  })
}

/**
 * device
 PUT
 更新设备信息
 * @param data
 */
export function editDevice (data) {
  return request({
    url: prefix+`/device`,
    method: 'PUT',
    data
  })
}

/**
 * device/$id
 DELETE
 删除设备信息
 */
export function deleteDevice (id) {
  return request({
    url: prefix+`/device/${id}`,
    method: 'DELETE',
  })
}

/**
 * device/failure/$id
 POST
 设置为故障设备
 * @param id
 */
export function setFailureDevice (id) {
  return request({
    url: prefix+`/device/failure/${id}`,
    method: 'POST',
  })
}

/**
 * device/normal/$id
 POST
 设置为正常设备
 * @param id
 */
export function setNormalDevice (id) {
  return request({
    url: prefix+`/device/normal/${id}`,
    method: 'POST',
  })
}

/**
 * device/getInfo/$id
 GET
 根据主键ID查询设备信息
 * @param id
 */
export function getInfoDevice (id) {
  return request({
    url: prefix+`/device/getInfo/${id}`,
    method: 'GET',
  })
}

/**
 * device/enable/$id
 POST
 启用设备
 * @param id
 */
export function getEnableDevice (id) {
  return request({
    url: prefix+`/device/enable/${id}`,
    method: 'POST',
  })
}

/**
 * device/disable/$id
 POST
 禁用设备
 * @param id
 */
export function getDisableDevice (id) {
  return request({
    url: prefix+`/device/disable/${id}`,
    method: 'POST',
  })
}

/**
 * device/setting
 POST
 设置
 * @param id
 */
export function settingDevice (data) {
  return request({
    url: prefix+`/device/setting`,
    method: 'POST',
    data
  })
}

/**
 * deviceAccessCard/getPage
 GET
 设备授权门禁卡列表（通过设备主键查询）
 * @param data
 */
export function getPageDeviceAccessCard (params) {
  return request({
    url: prefix+`/deviceAccessCard/getPage`,
    method: 'GET',
    params
  })
}

/**
 * deviceAccessCard/setEmpty/$idDevice
 POST
 清空卡
 * @param params
 */
export function setEmptyDeviceAccessCard (idDevice) {
  return request({
    url: prefix+`/deviceAccessCard/setEmpty/${idDevice}`,
    method: 'POST',
  })
}

/**
 * lamp/setEmpty/$idDevice
 POST
 清空智能灯
 * @param idDevice
 */
export function setEmptyLamp (idDevice) {
  return request({
    url: prefix+`/lamp/setEmpty/${idDevice}`,
    method: 'POST',
  })
}

/**
 * lamp/unBindDevice/{id}
 POST
 解绑智能灯
 * @param idDevice
 */
export function setUnBindDeviceLamp (id) {
  return request({
    url: prefix+`/lamp/unBindDevice/${id}`,
    method: 'POST',
  })
}

/**
 * device/openDoor/$idDevice
 POST
 开门
 * @param idDevice
 */
export function setOpenDoor (idDevice) {
  return request({
    url: prefix+`/device/openDoor/${idDevice}`,
    method: 'POST',
  })
}

/**
 * device/sync/$idDevice
 POST
 设备同步
 * @param idDevice
 */
export function setSyncDevice (idDevice) {
  return request({
    url: prefix+`/device/sync/${idDevice}`,
    method: 'POST',
  })
}

/**
 * lamp/getPageByDevice
 GET
 座位设备绑定智能灯列表（根据设备查询智能灯分页列表）
 * @param idDevice
 */
export function getPageByDevice (params) {
  return request({
    url: prefix+`/lamp/getPageByDevice`,
    method: 'GET',
    params
  })
}

/**
 * device/exportExcel
 GET
 根据查询条件导出设备信息
 * @param params
 */
export function exportExcelDevice (params) {
  return request({
    url: prefix+`/device/exportExcel`,
    method: 'GET',
    responseType: 'blob',
    download:true,
    params
  })
}

/**
 * accessCard/getList
 GET
 根据场馆主键获取门禁卡列表
 * @param params
 */
export function getAccessCardList (params) {
  return request({
    url: prefix+`/accessCard/getList`,
    method: 'GET',
    params
  })
}

/*------------------门禁/坐席设备管理--end---------------------------*/
