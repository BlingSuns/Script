/*
VQQ Checkin Get Cookie.

Update 2020.2.12 11:30

Description :
Get vqq Cookie From APP. Log in VQQ APP, then click "Personal Center".

script will be performed every day at 9:30 am. You can modify the execution time.
Note that the following config is only a local script configuration, please put both scripts into Quantumult X/Script.

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
http-request ^https:\/\/access.video.qq.com\/user\/auth_refresh script-path=https://raw.githubusercontent.com/BlingSuns/Script/master/Rewrite/vqq_getcookie.js
cron "10 0 0 * * *" script-path=https://raw.githubusercontent.com/BlingSuns/Script/master/Rewrite/vqq_bonus.js
~~~~~~~~~~~~~~~~

QX:
[rewrite_local]
# 189及以前版本
^https:\/\/access.video.qq.com\/user\/auth_refresh url script-response-body Suns/Rewrite/vqq_getcookie.js
# 190及以后版本
^https:\/\/access.video.qq.com\/user\/auth_refresh url script-request-header Suns/Rewrite/vqq_getcookie.js

[task_local]
30 9 * * * Suns/Task/vqq_bonus.js
~~~~~~~~~~~~~~~~

QX or Surge MITM = *.video.qq.com
~~~~~~~~~~~~~~~~
*/

const cookieName = '腾讯视频'
const cookieKey = 'chavy_cookie_videoqq'
const authUrlKey = 'chavy_auth_url_videoqq'
const authHeaderKey = 'chavy_auth_header_videoqq'
const chavy = init()

const cookieVal = $request.headers['Cookie']
if (cookieVal) {
  if ($request.url.indexOf('auth_refresh') > 0) {
    const authurl = $request.url
    const authHeader = JSON.stringify($request.headers)
    if (cookieVal) chavy.setdata(cookieVal, cookieKey)
    if (authurl) chavy.setdata(authurl, authUrlKey)
    if (authHeader) chavy.setdata(authHeader, authHeaderKey)
    chavy.msg(`${cookieName}`, '获取Cookie: 成功', '')
    chavy.log(`[${cookieName}] 获取Cookie: 成功, Cookie: ${cookieVal}`)
    chavy.log(`[${cookieName}] 获取Cookie: 成功, AuthUrl: ${authurl}`)
    chavy.log(`[${cookieName}] 获取Cookie: 成功, AuthHeader: ${authHeader}`)
  } else {
    chavy.setdata(cookieVal, cookieKey)
    chavy.setdata(``, authUrlKey)
    chavy.setdata(``, authHeaderKey)
    chavy.msg(`${cookieName}`, '获取Cookie: 成功', '')
    chavy.log(`[${cookieName}] 获取Cookie: 成功, Cookie: ${cookieVal}`)
  }
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
chavy.done()