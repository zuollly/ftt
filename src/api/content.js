// 公告/资讯/教学资源/成果展示
import request from '@/utils/request.js' // 引用request.js

// 新增内容并建立关联
export function insertRelevanceContent(data) {
  return request({
    url: '/channel/content/relevance/insert',
    method: 'POST', // 请求方法
    data: data
  })
}

// 根据ID删除业务与内容的关联关系（支持批量删除）
export function delRelevanceContent(data) {
  return request({
    url: '/channel/content/relevance/delete',
    method: 'POST', // 请求方法
    data: data
  })
}

// 修改内容
export function updateRelevanceContent(data) {
  return request({
    url: '/channel/content/relevance/update',
    method: 'POST', // 请求方法
    data: data
  })
}

// 翻页查询
export function fetchContentPage(data) {
  return request({
    url: '/channel/content/relevance/queryPage',
    method: 'POST', // 请求方法
    data: data
  })
}

// 根据ID获取详细信息
export function fetchContentById(data) {
  return request({
    url: '/channel/content/relevance/queryInfo',
    method: 'GET', // 请求方法
    params: data
  })
}

// 审核（支持批量）
export function verifyContentPage(data, status, userId) {
  return request({
    url: `/channel/content/relevance/verify?verifyStatus=${status}&userId=${userId}`,
    method: 'POST', // 请求方法
    data: data
  })
}
// 以工作坊为单位翻页查询内容列表
export function fetchRelevanceContentPage(data) {
  return request({
    url: '/channel/content/relevance/queryPage/group',
    method: 'POST', // 请求方法
    data: data
  })
}
