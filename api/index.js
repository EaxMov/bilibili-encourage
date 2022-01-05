const { bili_jct } = require('../config')
const { idType } = require('./utils')
const $http = require('./request')
const baseUrl = 'https://api.bilibili.com/x/web-interface'

// 获取新人视频
function getNewVideo() {
  const query = {
    page: 1,
    order: 'pubdate',
    keyword: '新人',
    duration: 0,
    tids_: 2,
    from_source: 'webtop_search',
    from_spmid: 333.1007,
    __refresh__: true,
    platform: 'pc',
    search_type: 'video',
    tids: 0,
    highlight: 1,
    single_column: 0
  }
  return $http.get(`${baseUrl}/search/type`, query)
}

//是否已点赞
function hasLike(aidOrVId) {
  return $http.get(`${baseUrl}/archive/has/like`, { ...idType(aidOrVId) })
}

// 点赞
function like(aidOrVid, proxy) {
  const formData = {
    ...idType(aidOrVid),
    csrf: bili_jct,
    like: 1
  }
  return $http.post(`${baseUrl}/archive/like`, formData, proxy)
}

// 获取代理
function getProxy() {
  return $http.get(`http://demo.spiderpy.cn/get/?type=http`)
}

module.exports = {
  getNewVideo,
  hasLike,
  like,
  getProxy
}
