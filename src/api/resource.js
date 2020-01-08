// 关于资源一类 资源列表 删除资源 查看资源 编辑资源 下载资源 推送资源等
import request from '@/utils/request.js' // 引用request.js

// 获取资源列表
export function getHomeResourceList(data) {
  return request({
    url: 'api/actAttach/queryAll',
    method: 'GET', // 请求方法
    params: data
  })
}

// 删除资源
export function delHomeResource(data) {
  return request({
    url: 'api/actAttach/deleteById',
    method: 'DELETE', // 请求方法
    data: data
  })
}

// 上传资源
export function uploadHomeResource(data) {
  return request({
    url: 'api/actAttach/uploadActSource',
    method: 'POST', // 请求方法
    data: data
  })
}

// 标记对外公开资源
export function openResource(data, flag) {
  return request({
    url: `api/actAttach/publicSourceById?isPublic=${flag}`,
    method: 'PUT', // 请求方法
    data: data
  })
}
