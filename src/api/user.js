// 与注册登录相关的
import request from '@/utils/request'

// 查询用户角色权限
export function fetchUserRolePower(data) {
  return request({
    url: '/user/project/role/query',
    method: 'post',
    data: data
  })
}
// 获取登录用户在当前活动的角色
export function getWorkshopUserRoles(groupId) {
  return request({
    url: '/api/groupUser/checkCurrentRight',
    method: 'get',
    params: groupId
  })
}
// 登录用户申请工作坊
export function applyWorkshop(groupId) {
  return request({
    url: '/api/groupUser/applyGroup',
    method: 'post',
    params: groupId
  })
}

// 查询是否拥有进入该活动的权限
export function getActivityRole(actId) {
  return request({
    url: '/api/actUser/getPermissionByActId',
    method: 'GET',
    params: { actId: actId }
  })
}

// 查询该活动所有参与人员
export function getActivityJoiner(actId) {
  return request({
    url: '/api/actUser/getAllActUsersByActId',
    method: 'GET',
    params: { actId: actId }
  })
}

/**
 *
 * @param {*} groupId
 */
// 根据多条件翻页查询成员
export function fetchWorkshopMemberPage(data) {
  return request({
    url: '/user/project/queryPage',
    method: 'post',
    data: data
  })
}
