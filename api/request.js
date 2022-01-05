const rp = require('request-promise')
const tough = require('tough-cookie')
const { SESSDATA: Value } = require('../config')

class $http {
  instance = null
  cookiejar = null

  constructor() {
    this.instance = rp.defaults({
      // proxy: 'http://101.32.72.98:65001',
      json: true,
      timeout: 1000 * 2
    })
    this.cookiejar = rp.jar()
    const cookie = new tough.Cookie({
      key: 'SESSDATA',
      value: Value
    })
    this.cookiejar.setCookie(cookie, 'https://api.bilibili.com')
  }

  get(uri, qs, proxy) {
    const options = {
      uri,
      qs,
      proxy,
      jar: this.cookiejar
    }
    return this.instance.get(options)
  }

  post(uri, formData, proxy) {
    const options = {
      method: 'POST',
      uri,
      jar: this.cookiejar,
      formData,
      proxy,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return this.instance.post(options)
  }
}

module.exports = new $http()
