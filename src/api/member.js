// 关于成员一类 包括 成员列表  添加  查看  撤销 删除 申请(通过，不通过)等
import request from '@/utils/request.js' // 引用request.js
// 根据多条件翻页查询成员
export function fetchMemberPage(data) {
  return request({
    url: '/user/project/queryPage',
    method: 'POST',
    data: data
  })
}

// 根据ID删除某个坊内的成员（支持批量删除）
export function deleteMemberPage(data) {
  return request({
    url: '/user/project/delete',
    method: 'POST',
    data: data
  })
}
// 翻页查询工作坊申请人
export function fetchApplyMemberPage(data) {
  return request({
    url: '/user/project/queryPage/apply',
    method: 'POST',
    data: data
  })
}
// 审核申请加入工作坊的用户，支持批量审核
export function verifyMember(data) {
  return request({
    url: '/user/project/insert/verify',
    method: 'POST', // 请求方法
    data: data
  })
}
// 根据工作室id获取工作室内成员活跃度排行
export function fetchLinessRank(data) {
  return request({
    url: '/behaviour/getLinessRank',
    method: 'GET', // 请求方法
    params: data
  })
}

// 获取成员列表
export function getMemberList(data) {
  return request({
    url: '/api/groupUser/queryUsers',
    method: 'GET', // 请求方法
    params: data
  })
}
// 删除坊内成员
export function deleteMember(data) {
  return request({
    url: '/api/groupUser/deleteUsers',
    method: 'POST', // 请求方法
    data: data
  })
}
// 获取可选成员列表
export function getPersonList(data) {
  return request({
    url: '/api/user/query',
    method: 'post', // 请求方法
    data: data
  })
}

// 新增成员
export function addMember(data, groupId) {
  return request({
    url: `/api/groupUser/insertUsers?groupId=${groupId}`,
    method: 'post', // 请求方法
    data: data
  })
}
// 查询申请加入工作坊成员
export function getApplyMember(data) {
  return request({
    url: `/api/groupUser/queryApply`,
    method: 'GET', // 请求方法
    params: data
  })
}
// 设置管理权限
export function setMemberManage(data, admin) {
  return request({
    url: '/api/groupUser/setManageRight',
    method: 'post', // 请求方法
    data: data,
    params: {
      admin: admin
    }
  })
}

// 设置工作坊成员
export function inviteMember(data, groupId) {
  return request({
    url: '/api/groupUser/insertUsers',
    method: 'post', // 请求方法
    data: data,
    params: {
      groupId: groupId
    }
  })
}

// 翻页查询活动中的用户
export function fetchActivityMember(data) {
  return request({
    url: 'workshop/jyUser/queryPage',
    method: 'post',
    data: data
  })
}
// 修改用户在某个坊内的角色或者修改用户所在坊（支持批量修改）
export function updateMemberRole(data) {
  return request({
    url: '/user/project/role/update',
    method: 'post',
    data: data
  })
}

// 用户申请加入工作坊
export function applyIntoWorkshop(data) {
  return request({
    url: '/user/project/insert/apply',
    method: 'GET', // 请求方法
    params: data
  })
}
