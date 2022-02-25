import Cookies from 'js-cookie'

const TokenKey = 'token'
const Sid = 'Sid'
const EndTime = "endtime"
const Flag = "flag"

export function _getToken() {
  return Cookies.get(TokenKey)
}

export function _setToken(token) {
  return Cookies.set(TokenKey, token, {
    expires: 7, //七天过期时间
  })
}

export function _removeToken() {
  return Cookies.remove(TokenKey)
}

//获取登陆的时间
export function _getEndTime() {
  return Cookies.get(EndTime)
}
//设置登陆的时间
export function _setEndTime(loginTime) {

  // console.log(new Date(Date.parse(new Date(loginTime)) + 604800000), "loginTime")
  //604800000 七天的时间戳
  return Cookies.set(EndTime, new Date(Date.parse(new Date(loginTime)) + 604800000), {
    expires: 7, //七天过期时间
  })
}
//清除登陆的时间
export function _removeEndTime() {
  return Cookies.remove(EndTime)
}

//设置flag
export function _setFlag(flag) {
  return Cookies.set(Flag, flag, {
    expires: 7, //七天过期时间
  })
}
//获取flag
export function _getFlag() {
  return Cookies.get(Flag)
}
//设置Sid
export function _setSid(sid) {
  return Cookies.set(Sid, sid, {
    expires: 7, //七天过期时间
  })
}
//获取Sid
export function _getSid() {
  return Cookies.get(Sid)
}