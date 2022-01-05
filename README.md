# bilibili-encourage

bilibili-新人点赞鼓励姬

- npm install
- Config.js 配置如下
- node index.js 启动

```javascript
module.exports = {
  bili_jct: '4251df1d2366d3d6a05a0355421c1a9a', // 从cookie取
  SESSDATA: '3b5467db%2C1656555864%2Cc7bc6%2A11', // 从cookie取
  taskInterval: 2, // 线程池执行间隔
  likeCount: 5 // 列表截取数量，数量过大线程会堆积过多
}
```
