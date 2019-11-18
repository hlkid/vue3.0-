import request from '@/utils/request';

let prefix = '/api-ucenter/ucenter';
/*if (process.env.NODE_ENV === 'production') {
  prefix = '/api-ucenter/ucenter'
}else{
  prefix = '/api/api-ucenter/ucenter'
  //prefix = '/api-ucenter/ucenter'
}*/

/*
*登录
* params:{userAccount,userPassword}
* */
 export function login(data) {
  return request({
    url: prefix+'/pc/login',
    method: 'post',
    data
  });
};

/**
 * 登出
 */
export function logOut() {
  return request({
    url: prefix+'/logOut',
    method: 'get',
  });
};


/*export default {
  login,
  logOut
}*/
