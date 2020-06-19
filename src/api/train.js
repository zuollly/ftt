import request from '@/utils/request'
// 获取培训分页列表
export function fetchTrainPage(data) {
  return request({
    url: `/workshop/jyActivity/queryPxPage`,
    method: 'post',
    data: data
  })
}
