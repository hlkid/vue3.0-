/**
 * 环境参数配置
 * VUE_APP_BASE_NAME: '牧心活动云管理平台', // 平台名称
 * VUE_APP_BASE_ENNAME: 'mxhdy', // 平台名称简称
 * VUE_APP_BASE_HOST: 'https://manager.i-read.net.cn', // 接口请求地址
 * VUE_APP_BASE_UPLOAD_FILE: 'https://api.ggwh.net', // 文件上传地址
 * VUE_APP_BASE_IMG: 'https://manager.i-read.net.cn/file/', // 图片访问地址
 * // VUE_APP_BASE_IMG: 'https://file.ggwh.net/file/', // 图片访问地址
 * VUE_APP_BASE_SOCKET: '', // websocket接入地址
 * VUE_APP_BASE_PUBLIC_PATH: '/' // publicPath、路由基路径
 * */

module.exports = {
  // 爱读网管理平台
  dev: {
    VUE_APP_BASE_NAME: '爱读网管理平台',
    VUE_APP_BASE_ENNAME: 'iread', // 平台名称简称
    VUE_APP_BASE_HOST: 'https://hdy.hopshine.net',
    VUE_APP_BASE_UPLOAD_FILE: 'https://hdy.hopshine.net',
    VUE_APP_BASE_IMG: `https://hdy.hopshine.net/file/`,

    VUE_APP_BASE_SOCKET: '',
    VUE_APP_BASE_PUBLIC_PATH: '/'
  },
  'test-iread': {
    VUE_APP_BASE_NAME: '爱读网管理平台',
    VUE_APP_BASE_ENNAME: 'iread', // 平台名称简称
    VUE_APP_BASE_HOST: 'https://hdy.hopshine.net',
    VUE_APP_BASE_UPLOAD_FILE: 'https://hdy.hopshine.net',
    VUE_APP_BASE_IMG: `https://hdy.hopshine.net/file/`,
    VUE_APP_BASE_SOCKET: '',
    VUE_APP_BASE_PUBLIC_PATH: '/test/'
  },
  'dev-clib': {
    VUE_APP_BASE_NAME: '云图管理平台',
    VUE_APP_BASE_ENNAME: 'clib', // 平台名称简称
    VUE_APP_BASE_HOST: 'https://hdy.hopshine.net',
    VUE_APP_BASE_UPLOAD_FILE: 'https://hdy.hopshine.net',
    VUE_APP_BASE_IMG: `https://hdy.hopshine.net/file/`,
    VUE_APP_BASE_SOCKET: '',
    VUE_APP_BASE_PUBLIC_PATH: '/dev/'
  },


  'prod-iread': {
    VUE_APP_BASE_NAME: '爱读网管理平台', // 平台名称
    VUE_APP_BASE_ENNAME: 'iread', // 平台名称简称
    VUE_APP_BASE_HOST: 'https://manager.i-read.net.cn', // 接口请求地址
    VUE_APP_BASE_UPLOAD_FILE: 'https://api.ggwh.net', // 文件上传地址
    VUE_APP_BASE_IMG: 'https://manager.i-read.net.cn/file/', // 图片访问地址
    // VUE_APP_BASE_IMG: 'https://file.ggwh.net/file/', // 图片访问地址
    VUE_APP_BASE_SOCKET: '', // websocket接入地址
    VUE_APP_BASE_PUBLIC_PATH: '/' // publicPath路由基路径
  },

  // 牧心活动云管理平台
  'prod-mxhdy': {
    VUE_APP_BASE_NAME: '牧心活动云管理平台', // 平台名称
    VUE_APP_BASE_ENNAME: 'mxhdy', // 平台名称简称
    VUE_APP_BASE_HOST: 'https://mxhdy.hopshine.net', // 接口请求地址
    VUE_APP_BASE_UPLOAD_FILE: 'https://api.ggwh.net', // 文件上传地址
    VUE_APP_BASE_IMG: 'https://mxhdy.hopshine.net/file/', // 图片访问地址
    // VUE_APP_BASE_IMG: 'https://file.ggwh.net/file/', // 图片访问地址
    VUE_APP_BASE_SOCKET: '', // websocket接入地址
    VUE_APP_BASE_PUBLIC_PATH: '/' // publicPath路由基路径
  }
};
