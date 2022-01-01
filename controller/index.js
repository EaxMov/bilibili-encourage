const { getNewVideo, hasLike, like } = require('../api')
const { listInterval, taskInterval, likeInterval, likeCount } = require('../config')
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
  taskList.push(...filterList)
  console.log(`当前任务线程数：${taskList.length}`);
}

async function goLike(item) {
  const res = await hasLike(item.bvid)
  if (res.data == 0) {
    console.log(`${item.bvid}无点赞，等待${likeInterval}秒进行点赞`);
    setTimeout(async () => {
      const likeRes = await like(item.bvid)
      if (likeRes.code == 0) {
        console.log('\x1B[32m', `${item.bvid}----${item.title}----点赞成功`.green);
      } else {
        // 重新进入线程
        taskList.push(item)
        console.log('\x1B[31m', `warning: ${item.bvid} >>> ${likeRes.message}`.red);
      }
      isLock = false
    }, 1000 * likeInterval);
  } else {
    isLock = false
  }
}

module.exports = start