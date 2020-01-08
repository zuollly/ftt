import request from '@/utils/request.js'
// 查询研修日志(contentRelevance)列表
export function fetchContentRelevancePage(data) {
  return request({
    // url: `/workshop/channel/content/queryPage`,
    url: `/channel/content/relevance/queryPage`,
    method: 'post',
    data: data
  })
}
// 根据日志(contentRelevance)Id获取日志详情
export function fetchContentRelevanceById(data) {
  return request({
    // url: `/workshop/channel/content/queryInfo`,
    url: `/channel/content/relevance/queryInfo`,
    method: 'get',
    params: data
  })
}
// 添加日志(contentRelevance)
export function insertContentRelevance(data) {
  return request({
    // url: `/workshop/channel/content/insert`,
    url: `/channel/content/relevance/insert`,
    method: 'post',
    data: data
  })
}
// 编辑|推荐日志(contentRelevance)
export function updateContentRelevance(data) {
  return request({
    // url: `/workshop/channel/content/update`,
    url: `/channel/content/relevance/update`,
    method: 'post',
    data: data
  })
}

// 删除日志(contentRelevance)
export function deleteContentRelevance(data) {
  return request({
    // url: `/workshop/channel/content/delete`,
    url: `/channel/content/relevance/delete`,
    method: 'post',
    data: data
  })
}

// 内容类型查询全部
export function fetchContentType(params) {
  return request({
    method: 'get',
    url: `/channel/content/relevance/type/queryAll`,
    params: params
  })
}

// 查询文字内容详情
export function fetchContentById(data) {
  return request({
    url: `/channel/content/queryInfo`,
    method: 'get',
    params: data
  })
}

// 翻页查询内容
export function fetchQueryPage(params) {
  return request({
    method: 'post',
    url: `channel/content/queryPage`,
    data: params
  })
}

// 信息技术大全和培训展播
export function fetchRelevancePage(params) {
  return request({
    method: 'post',
    url: `/channel/content/relevance/queryPage`,
    data: params
  })
}

// 内容点赞
export function insertContentUp(params) {
  return request({
    method: 'get',
    url: `channel/content/up`,
    params: params
  })
}

// 翻页查询社区内容
export function fetchContentRelevanceCommunityPage(params) {
  return request({
    method: 'post',
    url: `channel/content/relevance/queryPage/community`,
    data: params
  })
}
// 根据ID获取详细信息
export function fetchRelevanceOne(params) {
  return request({
    method: 'get',
    url: `/channel/content/relevance/queryInfo`,
    params: params
  })
}
// 推送
export function pushContent(params) {
  return request({
    method: 'post',
    url: `/channel/content/relevance/push`,
    data: params
  })
}
