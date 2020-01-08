// 关于活动一类 活动列表 发布活动 删除活动 查看活动 编辑活动等
import request from '@/utils/request.js' // 引用request.js

// 活动list
export function fetchActivityTheme(params = { projectTypeCode: '0' }) {
  return request({
    url: `/workshop/themeDict/queryAll`,
    method: 'get',
    params: params
  })
}
// 翻页查询模板
export function fetchTemplatePage(data) {
  return request({
    url: '/workshop/template/queryPage',
    method: 'post',
    data
  })
}
// 根据活动id或者模板id换取阶段id
export function getStageId(params) {
  return request({
    url: '/workshop/stage/queryAll',
    method: 'get',
    params
  })
}
// 所有环节
export function activityStepList(params) {
  return request({
    url: '/workshop/step/query',
    method: 'get',
    params
  })
}
// 条件分页查询活动列表
export function fetchJyActivityPage(data) {
  return request({
    url: '/workshop/jyActivity/queryPage',
    method: 'post',
    data
  })
}
