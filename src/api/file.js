import request from '@/utils/request';
import upload from '@/utils/upload';

let prefix = '/api-hopshine-file/hopshine-file'

let zuul = '/zuul'

// 根据Id获取用户头像进行回显
export function fileDetail(id) {
  return request({
    url: prefix + '/file/pc_pass/' + id,
    method: 'GET',
  })
}
export function getfiles(params) {
  return request({
    url: prefix + '/file/ids',
    method: 'GET',
    params
  })
}

/**
 * 生成二维码
 * @param params
 */
export function createQrcode(params) {
  return request({
    url: prefix + '/file/qrCode',
    method: 'post',
    params
  })
}

export function uploadFile(data, url) {
  return upload({
    url: url,
    method: 'post',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  })
}

//  /file/upload
export const uploadFileUrl = (process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : process.env.VUE_APP_BASE_UPLOAD_FILE) + zuul + prefix + '/file/upload';
// /file/specialUpload
export const specialUploadUrl = (process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : process.env.VUE_APP_BASE_UPLOAD_FILE) + zuul + prefix + '/file/specialUpload';



