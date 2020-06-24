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
