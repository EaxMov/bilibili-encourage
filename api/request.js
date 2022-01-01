const rp = require('request-promise');
const tough = require('tough-cookie');
const { SESSDATA: Value } = require('../config')

class $http {
  instance = null
  cookiejar = null
  constructor() {
    this.instance = rp.defaults({
      // proxy: '127.0.0.1:7890',
      // strictSSL: false
    })
    this.cookiejar = rp.jar();
    const cookie = new tough.Cookie({
      key: 'SESSDATA',
      value: Value
    })
    this.cookiejar.setCookie(cookie, 'https://api.bilibili.com')
  }
  get(uri, qs) {
    const options = {
      uri,
      qs,
      jar: this.cookiejar,
      json: true
    }
    return this.instance.get(options)
  }
  post(uri, formData) {
    const options = {
      method: 'POST',
      uri,
      jar: this.cookiejar,
      formData,
      json: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return this.instance.post(options)
  }
}

module.exports = new $http()