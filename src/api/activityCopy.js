import * as appConfig from '../../static/appConfig'
import request from '@/utils/request'
// 获取活动分页列表
// export function fetchActivityPage(data) {
//   return request({
//     url: `/workshop/jyActivity/queryPage`,
//     method: 'post',
//     params: data
//   })
// }
// 获取活动关联分页列表
export function fetchActivityCategoryPage(data) {
  return request({
    url: `/workshop/jyActivityCategory/queryPage`,
    method: 'post',
    data: data
  })
}
// 获取活动详情
// export function fetchActivityById(data) {
//   return request({
//     url: `/workshop/jyActivity/queryById`,
//     method: 'get',
//     params: data
//   })
// }

/* ====== */
// 关于活动一类 活动列表 发布活动 删除活动 查看活动 编辑活动等
// import request from '@/utils/request.js' // 引用request.js

// 获取活动详情信息
export function fetchActivityById(id) {
  return request({
    url: '/workshop/jyActivity/queryById',
    method: 'get', // 请求方法
    params: id
  })
}
// 活动关联工作坊
export function activityRelevanceWorkshop(data) {
  return request({
    url: '/workshop/jyActivityCategory/insert',
    method: 'post', // 请求方法
    data: data
  })
}
// 活动指定主持人
export function activityRelevanceHolder(data) {
  return request({
    url: '/workshop/jyUser/activity/setActHost',
    method: 'get', // 请求方法
    params: data
  })
}
// 查询活动主持人
export function fetchActivityHolder(data) {
  return request({
    url: '/workshop/jyUser/activity/queryActRole',
    method: 'get', // 请求方法
    params: data
  })
}

// 查出工作坊的人的id
export function fetchWorkshopMember(data) {
  return request({
    url: '/user/project/queryAll/userIds',
    method: 'post', // 请求方法
    data: data
  })
}
// 查出工作坊的人
export function fetchWorkshopMembers(data) {
  return request({
    url: '/user/project/queryAll',
    method: 'post', // 请求方法
    data: data
  })
}
// 邀请人加入工作坊活动
export function inviteMemberJoinActivity(data) {
  return request({
    url: '/workshop/jyUser/invite',
    method: 'post', // 请求方法
    data: data
  })
}
// 删除工作坊活动（其实就是接除工作坊和活动的关联关系）
export function deleteActivityFromWorkshop(data) {
  return request({
    url: '/workshop/jyActivityCategory/delete',
    method: 'delete', // 请求方法
    data: data
  })
}
// 删除活动（支持批量删除）
export function deleteJyActivity(data) {
  return request({
    url: '/workshop/jyActivity/delete',
    method: 'delete', // 请求方法
    data: data
  })
}

// 修改活动信息
export function udateJyActivity(data) {
  return request({
    url: '/workshop/jyActivity/update',
    method: 'put', // 请求方法
    data: data
  })
}

// 条件分页查询活动列表
export function fetchJyActivityPage(data) {
  return request({
    url: '/workshop/jyActivity/queryPage',
    method: 'post', // 请求方法
    data: data
  })
}
// 条件分页查询活动关联详细信息
export function fetchRelevanceJyActivityPage(data) {
  return request({
    url: '/workshop/jyActivityCategory/queryPage',
    method: 'post', // 请求方法
    data: data
  })
}
// 根据id查询活动信息
export function fetchJyActivityById(data) {
  return request({
    url: '/workshop/jyActivity/queryById',
    method: 'get', // 请求方法
    params: data
  })
}

/* copy后台的活动管理 */

// 新建活动主题
export function insertActivityTheme(data) {
  return request({
    url: '/workshop/themeDict/insert',
    method: 'post',
    data
  })
}
// 活动list
export function fetchActivityTheme(params = { projectTypeCode: '0' }) {
  return request({
    url: `/workshop/themeDict/queryAll`,
    method: 'get',
    params: params
  })
}
// 分页活动list
export function fetchActivityThemePage(data) {
  return request({
    url: `/workshop/themeDict/queryPage`,
    method: 'post',
    data
  })
}
// 删除活动主题
export function deleteActivityTheme(data) {
  return request({
    url: '/workshop/themeDict/delete',
    method: 'delete',
    data
  })
}
// update 活动主题
export function updateActivityTheme(data) {
  return request({
    url: '/workshop/themeDict/update',
    method: 'post',
    data
  })
}

// insert活动模板
export function insertActivityTemplate(data) {
  return request({
    url: '/workshop/template/insert',
    method: 'post',
    data
  })
}
// update活动模板
export function updateActivityTemplate(data) {
  return request({
    url: '/workshop/template/update',
    method: 'post',
    data
  })
}
// insert活动阶段
export function insertActivityStage(data) {
  return request({
    url: '/workshop/stage/insert',
    method: 'post',
    data
  })
}

// insert活动环节
export function insertActivityStep(data) {
  return request({
    url: '/workshop/step/insert',
    method: 'post',
    data
  })
}
// 所有环节类型
export function activityStepTypeList() {
  return request({
    url: '/workshop/stepTypeDict/queryAll',
    method: 'get'
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

// 某一个环节
export function oneActivityStep(params) {
  return request({
    url: '/workshop/step/queryOne',
    method: 'get',
    params
  })
}
// 编辑某一个环节
export function updateActivityStep(data) {
  return request({
    url: '/workshop/step/update',
    method: 'post',
    data
  })
}
// 删除环节
export function deleteActivityStep(data) {
  return request({
    url: '/workshop/step/delete',
    method: 'delete',
    data
  })
}
// 某一个环节的要求
export function oneActivityStepRequirement(params) {
  return request({
    url: '/workshop/requirement/queryAll',
    method: 'get',
    params
  })
}
// 某一个环节的要求类型
export function oneStepRequirementTypeList(params) {
  return request({
    url: '/workshop/requirementDict/queryAll',
    method: 'get',
    params
  })
}

// 新增某一个环节的要求
export function addStepRequirement(data) {
  return request({
    url: '/workshop/requirement/insert',
    method: 'post',
    data
  })
}
// 编辑某一个环节的要求
export function updateStepRequirement(data) {
  return request({
    url: '/workshop/requirement/update',
    method: 'post',
    data
  })
}
// 删除某一个环节的要求
export function deleteStepRequirement(data) {
  return request({
    url: '/workshop/requirement/delete',
    method: 'delete',
    data
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
// 根据id查询模板
export function fetchTemplateById(params) {
  return request({
    url: '/workshop/template/queryOne',
    method: 'get',
    params
  })
}

// 添加活动
export function insertActivity(data) {
  return request({
    url: '/workshop/jyActivity/insert',
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
// 将某一个模板应用于活动
export function applyTemplate(params) {
  return request({
    url: '/workshop/template/applyTemplate',
    method: 'get',
    params
  })
}

// 环节服务
export function insertStepServer(data) {
  return request({
    url: '/workshop/content/insert',
    method: 'post',
    data
  })
}

// 环节所有服务
export function StepServerList(params) {
  return request({
    url: '/workshop/content/queryAll',
    method: 'get',
    params
  })
}
// 所有活动
export function fetchActivityPage(data) {
  return request({
    url: '/workshop/jyActivity/queryPage',
    method: 'post',
    data
  })
}

// 条件分页查询活动关联详细信息
export function fetchWorkShopActivityPage(data) {
  return request({
    url: '/workshop/jyActivityCategory/queryPage',
    method: 'post',
    data
  })
}

// 活动详情
export function fetchActivityInfo(params) {
  return request({
    url: '/workshop/jyActivity/queryById',
    method: 'get',
    params
  })
}
// 编辑活动
export function updateActivity(data) {
  return request({
    url: '/workshop/jyActivity/update',
    method: 'put',
    data
  })
}

// 删除环节服务
export function deleteStepServer(data) {
  return request({
    url: '/workshop/content/delete',
    method: 'delete',
    data
  })
}

/* 活动服务引用别的模块的api */
// 查询所有，支持翻页
export function fetchCourseInfoPage(data) {
  return request({
    url: '/course/info/queryPage',
    method: 'post',
    data: data
  })
}
// 获取单个作业详细信息
export function fetchOneHomeWork(data) {
  return request({
    url: '/tool/homeworkassign/queryById',
    method: 'get',
    params: data
  })
}

// 获取单个作业详细信息
export function fetchOneSubmitHomeWork(data) {
  return request({
    // url: '/text/submithomework/queryById',
    url: '/tool/homeworkassign/queryById',
    method: 'get',
    params: data
  })
}
// 查询提交作业列表,支持分页
export function fetchSubmitHomeWorkPage(data) {
  return request({
    url: '/tool/homeworksubmit/queryByPage',
    method: 'post',
    data: data
  })
}
export function fetchHomeWorkPage(data) {
  return request({
    url: '/tool/homeworkassign/queryByPage',
    method: 'post',
    data: data
  })
}
// 根据ID获取详细信息
export function fetchCourseInfo(data) {
  return request({
    url: '/course/info/queryInfo',
    method: 'get',
    params: data
  })
}
// 根据ID获取活动栏目详细信息
export function fetchChannelInfo(data) {
  return request({
    url: '/channel/queryInfo',
    method: 'get',
    params: data
  })
}

// 具体业务与内容关联管理
export function fetchContentPage(data) {
  return request({
    url: '/channel/content/relevance/queryPage',
    method: 'post',
    data
  })
}
// 内容详情
export function contentInfo(params) {
  return request({
    url: '/channel/content/queryInfo',
    method: 'get',
    params
  })
}
// 统计用户参加活动的情况
export function fetchActivityStatus(params) {
  return request({
    url: '/workshop/jyUser/activity/queryData',
    method: 'get',
    params
  })
}
// 活动用户完成节点操作
export function stepComplete(params) {
  return request({
    url: '/workshop/stepComplete/complete',
    method: 'get',
    params
  })
}

// 活动环节下面的资源列表
export function fetchResourcePage(data) {
  return request({
    url: appConfig.app_basehost + '/tool/resourceShare/queryPage',
    method: 'post',
    data
  })
}
// 新增活动环节下面的资源
export function insertResource(data) {
  return request({
    url: appConfig.app_basehost + '/tool/resourceShare/insert',
    method: 'post',
    data
  })
}
// 删除活动环节下面的资源
export function deleteResourceBatch(data) {
  return request({
    url: appConfig.app_basehost + '/tool/resourceShare/delete',
    method: 'post',
    data
  })
}
// 成果展示一键推送
export function filePublish(data) {
  return request({
    url: appConfig.app_basehost + '/tool/file/publish',
    method: 'post',
    data: data
  })
}
// 成果展示一键归档
export function filePige(data) {
  return request({
    url: appConfig.app_basehost + '/tool/resourceShare/publishToGroup',
    method: 'post',
    data: data
  })
}
