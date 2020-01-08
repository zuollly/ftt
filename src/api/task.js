import request from '@/utils/request'
// 获取作业分页列表
export function fetchTaskPage(data) {
  return request({
    url: `/tool/homeworkassign/queryByPage`,
    method: 'post',
    params: data
  })
}
// 获取作业详情
export function fetchTaskById(data) {
  return request({
    url: `/tool/homeworkassign/queryByPage`,
    method: 'get',
    params: data
  })
}

// 查询所有作业
export function fetchAssignmenthomeworkById(data) {
  return request({
    url: `/tool/homeworkassign/queryById`,
    method: 'get',
    params: data
  })
}

// 查询所有作业
export function fetchAssignmentSubmit(data) {
  return request({
    url: `/tool/homeworksubmit/queryByPage`,
    method: 'post',
    data: data
  })
}

// 提交作业
export function assignmentSubmit(data) {
  return request({
    url: `/tool/homeworksubmit/insert`,
    method: 'post',
    data: data
  })
}

// 查询单个提交作业详情（阅读时阅读数自动增加使用）
export function fetchAssignmentSubmitInfo(data) {
  return request({
    url: `/tool/homeworksubmit/queryById`,
    method: 'get',
    params: data
  })
}

// 批改作业
export function assignmentReadOver(data) {
  return request({
    url: `/tool/homeworksubmit/update`,
    method: 'post',
    data: data
  })
}

// 查询用户参加的工作坊活动(或项目计划)的作业完成情况
export function fetchUserHomeworkScore(data) {
  return request({
    url: `/tool/homeworksubmit/queryUserHomeworkScore`,
    method: 'get',
    params: data
  })
}
// 提交作业
export function submitHomeWork(data) {
  return request({
    url: '/tool/homeworksubmit/insert',
    method: 'post',
    data: data
  })
}

// 查询项目下待批阅的作业数量
export function queryUnMarkCount(data) {
  return request({
    url: '/tool/homeworksubmit/queryUnMarkCount',
    method: 'get',
    params: data
  })
}

// 布置作业
export function insertHomeWork(data) {
  return request({
    url: '/tool/homeworkassign/insert',
    method: 'post',
    data: data
  })
}
