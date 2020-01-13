import request from '@/utils/request'
// import locals from '@/utils/storage/locals'
const Base64 = require('js-base64').Base64
// 通过帐号密码登录获取Token
export function loginByUsername(data) {
  const argument = {
    'grant_type': 'password',
    'scope': 'all',
    'username': data.username,
    'password': data.password
  }
  const base = Base64.encode('client1:123456')
  return request({
    url: '/oauth/token',
    headers: { 'Authorization': 'basic ' + base },
    method: 'post',
    params: argument
  })
}
// 获取用户信息
export function fetchUserInfo() {
  return request({
    url: '/oauth/login',
    method: 'get',
    params: {}
  })
}
