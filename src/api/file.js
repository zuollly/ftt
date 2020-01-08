import request from '@/utils/request'
import * as appConfig from '../../static/appConfig'
let baseURl = ''
if (!appConfig.app_isXJBT) {
  baseURl = '/zuul'
}
// 上传文件
export function uploadFile(data) {
  return request({
    url: baseURl + '/tool/file/upload',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data: data
  })
}
// 上传图片headers: { "Content-Type": "multipart/form-data" }
export function uploadPic(data) {
  return request({
    url: baseURl + '/tool/file/uploadPic',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data: data
  })
}

// 下载文件
export function downloadFile(id) {
  return request({
    url: baseURl + '/tool/file/download',
    method: 'get',
    params: id
  })
}
// 获取服务器文件信息
export function fetchOneFile(data) {
  return request({
    url: baseURl + `/tool/file/queryOne?id=${data.id}`,
    method: 'post'
  })
}
// 查询文件信息
export function fetchFileOne(data) {
  return request({
    url: baseURl + '/tool/file/queryOne',
    method: 'post',
    data: data
  })
}
// 获取服务器文件信息
export function getFileInfo(data) {
  return request({
    url: baseURl + `/tool/file/queryOne`,
    method: 'post',
    data
  })
}
// 获取服务器文件信息
export function getPreviewURL(params) {
  return request({
    url: baseURl + `/tool/file/getPreSee`,
    method: 'get',
    params
  })
}
