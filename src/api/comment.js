import request from '@/utils/request'

// 评论列表
export function fetchCommentPage(data) {
  return request({
    url: '/tool/comment/query',
    method: 'post',
    data
  })
}

// 点赞
export function likes(params) {
  return request({
    url: '/tool/comment/up',
    method: 'get',
    params
  })
}

// 点赞
export function insertComment(data) {
  return request({
    url: '/tool/comment/insert',
    method: 'post',
    data
  })
}
// 删除
export function deleteComment(data) {
  return request({
    url: '/tool/comment/delete',
    method: 'post',
    data
  })
}
