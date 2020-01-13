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
export function fetchGroupById(data) {
  return request({
    url: '/workshop/group/queryById',
    method: 'GET',
    params: data
  })
}

// 查询工作室单表信息,主要用于排序
export function fetchWorkshopListByOrders(data) {
  return request({
    url: '/workshop/group/queryByOrders',
    method: 'post',
    data: data
  })
}
// 根据code查询联动关系
export function getArea(code) {
  return request({
    url: `/districtController/getByParentCode?code=${code}`,
    method: 'GET'
  })
}

// 根据工作室id获取工作室数据信息
export function fetchBehaviourById(data) {
  return request({
    url: '/behaviour/queryById',
    method: 'GET',
    params: data
  })
}
// 根据code查询联动关系
export function getSchool(data) {
  return request({
    url: `/schoolController/selectListBySchool`,
    method: 'GET',
    params: data
  })
}
// 根据code查询联动关系
export function getTeacherList(data) {
  return request({
    url: `/userInfo/selectTeacherOrStudentInSchool`,
    method: 'post',
    data: data
  })
}
// 根据code查询联动关系
export function insertMember(data) {
  return request({
    url: `/user/project/insert/batch`,
    method: 'post',
    data: data
  })
}
