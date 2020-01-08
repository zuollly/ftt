// 整体全局的
import * as appConfig from '../../static/appConfig'
// 公用api
import request from '@/utils/request.js' // 引用request.js

// 获取学段
export function getStudyPhase() {
  return request({
    url: '/api/user/faculty/selectAllFaculty',
    method: 'get'
  })
}

// 根据学段查学科
export function getSubject(studyphaseId) {
  return request({
    url: `/api/user/subj/selectSubjByFacultyId/${studyphaseId}`,
    method: 'get'
  })
}

export function uploadImg(data) {
  return request({
    url: `/api/sourceHandle/upload`,
    method: 'post',
    data
  })
}

export function upImgLogo(data) {
  return request({
    url: `/api/sourceHandle/uploadPicture`,
    header: { 'Content-Type': 'application/octet-stream' },
    method: 'post',
    data
  })
}

// 获取工作坊文件(图片)
export function getPicture(key) {
  return request({
    url: `api/sourceHandle/getPicSource/${key}`,
    method: 'get',
    responseType: 'blob'
  })
}
// 获取预览地址
export function getPreviewURL(data) {
  return request({
    url: `${appConfig.app_basehost}/tool/file/getPreSee`,
    method: 'get',
    params: data
  })
}

// 下载文件
export function downloadFile(params) {
  return request({
    method: 'get',
    url: `${appConfig.app_basehost}/tool/file/download`,
    responseType: appConfig.app_isXJBT ? 'json' : 'blob',
    params: params
  })
}
