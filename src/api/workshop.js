// 工作坊 添加、 修改、 删除、 查询、 批量修改、详情
import request from '@/utils/request'

// 条件分页查询工作室
export function fetchGroupListPage(data, state) {
  return request({
    url: `/workshop/group/queryPage?state=${state}`,
    method: 'POST',
    data: data
  })
}
