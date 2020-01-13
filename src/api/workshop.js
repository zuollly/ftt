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

// 修改工作室信息
export function updatedWorkshop(data) {
  return request({
    url: '/workshop/group/update',
    method: 'PUT',
    data: data
  })
}

// 根据id获取工作室信息
export function fetchGroupById(data, state) {
  return request({
    url: '/workshop/group/queryById',
    method: 'GET',
    params: data
  })
}
