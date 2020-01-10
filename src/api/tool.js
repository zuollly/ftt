import request from '@/utils/request'
// export default {
//   /**
//    * 分页查询证书模板
//    * @param {*} params
//    */
//   fetchCertificateTemplatePage(params) {
//     return request({
//       method: 'post',
//       url: 'tool/certificate/queryPage',
//       data: params
//     })
//   }
// }
// 条件查询证书记录
export function fetchcertificateRecord(params) {
  return request({
    method: 'post',
    url: '/tool/certificateRecord/queryAll',
    data: params
  })
}

// 根据id查询单条证书模板
export function fetchOnecertificateRecord(id) {
  return request({
    method: 'get',
    url: `/tool/certificate/queryOne?id=${id}`
  })
}
// 下载某人的证书
export function insertcertificatePrintRecord(params) {
  return request({
    method: 'post',
    url: '/tool/certificateRecord/insertPrint',
    data: params
  })
}

// 发起活动会议
export function applyConference(params) {
  return request({
    method: 'get',
    url: '/tool/conference/relevance/insert',
    params: params
  })
}
// 更新会议信息
export function updateConference(params) {
  return request({
    method: 'get',
    url: '/tool/conference/relevance/update',
    params: params
  })
}
// 获取进入视频会议的链接
export function intoConference(params) {
  return request({
    method: 'get',
    url: '/tool/conference/query/conferenceUrl',
    params: params
  })
}

// 条件分页查询正在直播的会议室列表
export function fetchConferenceList(params) {
  return request({
    method: 'post',
    url: '/tool/conference/queryPage/live',
    data: params
  })
}

// 获取直播地址
export function fetchConferenceLiveUrl(params) {
  return request({
    method: 'get',
    url: '/tool/conference/query/liveUrl',
    params: params
  })
}

// 根据服务ID获取会议参与情况
export function fetchConferenceStatistics(params) {
  return request({
    method: 'get',
    url: '/tool/conference/query/statistics',
    params: params
  })
}

// 获取教研参与人员详情
export function fetchAttendMemberList(params) {
  return request({
    method: 'post',
    url: '/tool/conference/queryPage/attend',
    data: params
  })
}
// 获取互动会议视频文件
export function fetchConferenceFile(params) {
  return request({
    method: 'post',
    url: '/tool/conference/query/conferenceFile',
    data: params
  })
}
