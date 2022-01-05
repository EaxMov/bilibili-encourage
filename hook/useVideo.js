const { likeCount } = require('../config')
function useFilterVideo(videoRes, taskList) {
  if (videoRes.code != 0) return
  // 点赞数为0
  let list = videoRes.data.result.filter((item) => item.like == 0)
  if (likeCount) {
    list = list.slice(0, likeCount)
  }
  // 过滤重复
  const filterList = list.filter(
    (item) => !taskList.find((item2) => item.bvid == item2.bvid)
  )
  return filterList
}

module.exports = {
  useFilterVideo
}
