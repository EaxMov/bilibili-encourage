function useProxyTimeOutCheck(time) {
  time = new Date().getTime() - time
  const flag = time / 1000 > 2
  if (flag) console.log('代理响应时间过长,将重新获取')
  return !flag
}

module.exports = {
  useProxyTimeOutCheck
}
