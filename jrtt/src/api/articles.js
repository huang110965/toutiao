// 导入 http
import http from '../utils/http'
// // 得到频道下的文章列表数据
function addGetArticles ({ channelid }) {
  return http({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: {
      channel_id: channelid,
      timestamp: Date.now(),
      with_top: 0
    }
  })
}
// 对文章不喜欢
function apiDislike (artid) {
  return http({
    url: '/article/dislikes',
    method: 'post',
    data: {
      target: artid
    }
  })
}
// 举报文章
function apiReports ({ artid, type }) {
  return http({
    url: '/article/reports',
    method: 'post',
    data: {
      target: artid,
      type: type,
      remark: ''
    }
  })
}
// 获取新闻文章详情
function apiGetArticles (artid) {
  return http({
    url: `/articles/${artid}`
  })
}
// 取消对文章的点赞
function apiNolike (artid) {
  return http({
    url: `/article/likings/${artid}`,
    method: 'DELETE'
  })
}
// 对文章进行点赞
function apilike (artid) {
  return http({
    url: '/article/likings',
    method: 'post',
    data: {
      target: artid
    }
  })
}
// 对文章不喜欢
function apidislike (artid) {
  return http({
    url: '/article/dislikes',
    method: 'post',
    data: {
      target: artid
    }
  })
}
// 取消对文章不喜欢
function apiNodislike (artid) {
  return http({
    url: `/article/dislikes/${artid}`,
    method: 'DELETE'
  })
}
// 获取评论
function apigetcomment ({ artid, offset }) {
  return http({
    url: '/comments',
    params: {
      type: 'a',
      source: artid,
      offset: offset,
      limit: 10
    }
  })
}
// 添加评论
function apiaddcomments ({ artid, content }) {
  return http({
    url: '/comments',
    method: 'post',
    data: {
      target: artid,
      content: content
    }
  })
}
// 获取评论回复
function apigetreply ({ commid, offset }) {
  return http({
    url: '/comments',
    params: {
      type: 'c',
      source: commid,
      offsetL: offset,
      limit: 10
    }
  })
}
// 添加评论
function apiaddreply ({ commid, content, artid }) {
  return http({
    url: '/comments',
    method: 'post',
    data: {
      target: commid,
      content: content,
      art_id: artid
    }
  })
}
// 暴露方法
export {
  addGetArticles,
  apiDislike,
  apiReports,
  apiGetArticles,
  apiNolike,
  apilike,
  apidislike,
  apiNodislike,
  apigetcomment,
  apiaddcomments,
  apigetreply,
  apiaddreply
}
