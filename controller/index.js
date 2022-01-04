const { getNewVideo, like } = require('../api')
const { listInterval, taskInterval, likeCount } = require('../config')
const colors = require('colors')
let taskList = []
let isLock = false

function start() {
  console.log(`初始化中...${listInterval}秒后开始任务`.rainbow);
  setInterval(() => {
    getVideoList()
  }, 1000 * listInterval);
  setInterval(() => {
    lock()
  }, 1000 * taskInterval);
}

function lock() {
  function unlock() {
    let task = taskList.shift();
    if (task) {
      goLike(task)
    } else {
      isLock = false;
    }
  }
  if (isLock) {
    console.log("排队中...");
  } else {
    isLock = true;
    unlock()
  }
}

async function getVideoList() {
  const videoRes = await getNewVideo()
  if (videoRes.code != 0) return
  // 点赞数为0
  let list = videoRes.data.result.filter(item => item.like == 0)
  if (likeCount) {
    list = list.slice(0, likeCount)
  }
  // 过滤重复
  const filterList = list.filter(item => !taskList.find(item2 => item.bvid == item2.bvid))
  if (taskList.length > 5) {
    taskList = []
  }
  taskList.push(...filterList)
  console.log(`当前任务线程数：${taskList.length}`);
}

async function goLike(item) {
  const likeRes = await like(item.bvid)
  if (likeRes.code == 0) {
    console.log('\x1B[32m', `${item.bvid}----${item.title}----点赞成功`.green);
  } else {
    // 重复点赞不重新加入线程池
    if (likeRes.code != 65006) {
      taskList.push(item)
      console.log('\x1B[31m', `warning: ${item.bvid} >>> ${likeRes.message}`.red);
    }
  }
  console.log(likeRes.message);
  isLock = false
}

module.exports = start