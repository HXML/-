import Cookies from 'js-cookie'


// const TokenKey = 'token'

// var millisecond = new Date().getTime();
// // var expiresTime = new Date(millisecond + 60 * 1000 * 1); //一分钟

// var expiresTime = 7; //七天

// export function _setToken(token) {
//   return Cookies.set(TokenKey, token, {
//     // expires: 7, //七天过期时间
//     expires: expiresTime, //20分钟过期时间
//   })
// }


// export function _getToken() {

//   return Cookies.get(TokenKey)

// }
// export function _removeToken() {
//   return Cookies.remove(TokenKey)

// }



var inFifteenMinutes = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);

export function _getToken(tokenname) {
  return Cookies.get(tokenname)
}

export function _setToken(tokenname, tokenvalue) {
  return Cookies.set(tokenname, tokenvalue, {
    expires: inFifteenMinutes
  })
}

export function _removeToken(tokenname) {
  return Cookies.remove(tokenname)
}