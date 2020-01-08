// 关于简报一类 简报列表 发布简报 删除简报 查看简报 编辑简报等
import request from '@/utils/request.js' // 引用request.js

// 简报列表
export function getHomeBulletinList(data) {
  return request({
    url: 'api/briefing/query',
    method: 'POST', // 请求方法
    data: data
  })
}

// 删除简报
export function delHomeBulletin(data) {
  return request({
    url: 'api/briefing/delete',
    method: 'POST', // 请求方法
    data: data
  })
}

// 发布简报
export function addHomeBulletin(data) {
  return request({
    url: 'api/briefing/insert',
    method: 'POST', // 请求方法
    data: data
  })
}

// 查看单个简报详情
export function getHomeBulletinDetails(data) {
  return request({
    url: 'api/briefing/info',
    method: 'GET', // 请求方法
    params: data
  })
}

// 修改简报
export function editBulletin(data) {
  return request({
    url: 'api/briefing/update',
    method: 'POST', // 请求方法
    data: data
  })
}

// 发布 撤回 简报
export function issueBulletin(data) {
  return request({
    url: 'api/briefing/updateStatus',
    method: 'POST', // 请求方法
    data: data
  })
}
