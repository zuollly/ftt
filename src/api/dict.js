
import request from '@/utils/request.js' // 引用request.js

// 全部查询字典数据
export function fetchDictInfo(data) {
  return request({
    url: '/tool/dict/queryAll',
    method: 'GET', // 请求方法
    params: data
  })
}
// 分页查询关联记录
export function fetchDictRelationListPage(data) {
  return request({
    url: '/relation/queryPage',
    method: 'get',
    params: data
  })
}
