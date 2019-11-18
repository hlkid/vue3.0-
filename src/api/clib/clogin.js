import request from '@/utils/request';

let prefix = '/api-reserve/reserve';

/**
 * 云图登录
 * @param data
 */
export function getClibLogin(data) {
  return request({
    url: prefix+'/pc_pass/pc/login',
    method: 'post',
    data
  });
}
