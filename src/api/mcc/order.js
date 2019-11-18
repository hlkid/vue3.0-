import request from '@/utils/request'
let prefix = '/api-order/order';

/*-----------------------------付款 start--------------------------------*/
/**
 * order/dataPageByAttribute
 * GET
 * 分页列表
 * @param params
 */
export function getByAttributeDataPage(params) {
  return request({
    url: prefix+'/order/dataPageByAttribute',
    method: 'get',
    params
  })
}

/**
 * 订单状态枚举
 * @param params
 */
export function getOrderStatusEnum(params) {
  return request({
    url: prefix+'/order/orderStatusEnum',
    method: 'get',
  })
}

/**
 * 导出付款列表
 */
export function getOrderExpor(params) {
  return request({
    url: prefix+'/order/exportOrder',
    method: 'GET',
    responseType: 'blob',
    download:true,
    params
  })
}
/*-----------------------------付款 end----------------------------------*/

