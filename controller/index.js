const { taskInterval } = require('../config')
const { getNewVideo, like, getProxy } = require('../api')
const { useProxyTimeOutCheck } = require('../hook/useLike')
const { useFilterVideo } = require('../hook/useVideo')
const colors = require('colors')

let taskList = []
let isLock = false
let taskId = null
let proxy = null
let lastLikeResult = false

async function start() {
  if (taskId) clearInterval(taskId)
  console.log(`线程启动>>>>`)
  const res = await getVideoList()
  taskId = setInterval(() => {
    lock()
  }, 1000 * taskInterval)
}

function lock() {
  function unlock() {
    let task = taskList.shift()
    if (task) {
      goLike(task)
    } else {
      isLock = false
    }
  }
  if (isLock) {
    console.log('waitting...')
  } else {
    isLock = true
    unlock()
  }
}

async function getVideoList() {
  const videoRes = await getNewVideo()
  const video = useFilterVideo(videoRes, taskList)
  taskList.push(...video)
  console.log(`当前任务线程数：${taskList.length}`)
}

async function goLike(item) {
  // 如果上次点赞失败就重新获取代理
  if (!lastLikeResult || !proxy) {
    const proxyRes = await getProxy()
    proxy = proxyRes.proxy
    console.log('获取代理成功', proxy)
  }
  try {
    const likeStartTime = new Date().getTime()
    const likeRes = await like(item.bvid, `http://${proxy}`)
    if (likeRes.code == 0) {
      console.log('\x1B[32m', `${item.bvid}----${item.title}----点赞成功`.green)
    } else {
      // 重复点赞不重新加入线程池,其他情况重新加入线程池
      if (likeRes.code != 65006) {
        taskList.push(item)
        console.log(
          '\x1B[31m',
          `warning: ${item.bvid} >>> ${likeRes.message}`.red
        )
      }
    }

    // 任务为0，重新开始
    if (taskList.length == 0) {
      console.log('列表执行完毕，重新执行线程')
      start()
    }

    // 监测代理超时
    lastLikeResult = useProxyTimeOutCheck(likeStartTime)

    isLock = false
  } catch (error) {
    console.log('代理超时或点赞出错，重新执行'.red)
    taskList.push(item)
    lastLikeResult = false
    isLock = false
  }
}

module.exports = start
