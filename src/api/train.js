import request from '@/utils/request'
// 获取培训分页列表
export function fetchTrainPage(data) {
  return request({
    url: `/workshop/jyActivity/queryPxPage`,
    method: 'post',
    data: data
  })
}
export function inviteTrainPage(data) {
  return request({
    url: `/workshop/jyUser/invite`,
    method: 'post',
    data: data
  })
}
// 发起培训活动会议
export function launchActivityVideo(data) {
  return request({
    url: `/tool/conference/relevance/px/insert`,
    method: 'post',
    data: data
  })
}
// 翻页查询活动中的用户
export function fetchJyUserPage(data) {
  return request({
    url: `/workshop/jyUser/queryPage`,
    method: 'post',
    data: data
  })
}
// 删除活动中的用户
export function deteleJyUserPage(data) {
  return request({
    url: `/workshop/jyUser/delete`,
    method: 'DELETE',
    data: data
  })
}

export function verifyJyUserPage(data) {
  return request({
    url: `/workshop/jyUser/apply/verify`,
    method: 'post',
    data: data
  })
}
