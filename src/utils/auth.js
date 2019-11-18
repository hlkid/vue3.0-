import Cookies from 'js-cookie';

const TokenKey = 'token';
const InfoKey = 'userInfo';

export function getCookie(key) {
  return Cookies.get(key);
}
export function setCookie(key,value) {
  return Cookies.set(key,value);
}
export function removeCookie(key) {
  return Cookies.remove(key);
}

export function getToken() {
  return Cookies.get(TokenKey);
};

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setSessionStorage(key,value) {
  return sessionStorage.setItem(key,JSON.stringify(value));
}
export function getSessionStorage(key) {
  return sessionStorage.getItem(key) && JSON.parse(sessionStorage.getItem(key));
}
export function removeSessionStorage(key) {
  return sessionStorage.removeItem(key);
}

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
      content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/**
* 获取localStorage
*/
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}

/**
* 删除localStorage
*/
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}


/**
 * 判断是否为手机号
 */

export const isPoneAvailable = (pone) => {
  if(!(/^1[0-9][0-9]{9}/.test(pone))){
    return false;
  }else{
    return true;
  }
}

