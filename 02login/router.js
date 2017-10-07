const user = require('./db/user.js')
const https = require('https')

module.exports = function (app, router) {
  /* 用户 User */
  router.use('/', user.session)                   // 获取session存储的用户
  router.post('/login', user.login)           // 登入接口
  router.post('/register', user.register)     // 注册接口
  router.get('/getAccount', user.getAccount)  // 获取当前登入账号接口
  router.get('/logout', user.logout)          // 退出登入接口

  /* 第三方登入 */
  router.get('/login/github', function (req, res) {
    res.redirect(`https://github.com/login/oauth/authorize?scope=123&client_id=274df6a3dc60b0dd834c`)
  })
  router.get('/login/github/callback', function (req, res) {
    // console.log('喵喵喵？')
    // console.log(req.query)
    let url = `https://github.com/login/oauth/access_token?scope=123&client_id=274df6a3dc60b0dd834c&code=${req.query.code}&client_secret=e8dfc09c2a5544087f4fc01c646d3f57b302e0f5&redirect_url=http://localhost:8082/api/login/github/success`
    console.log(url)
    let data = ''
    https.get(url, (res) => {
      console.log('状态码：', res.statusCode);
      // console.log('请求头：', res.headers);
      res.on('data', (d) => {
        data += d.toString()
      })
      res.on('end', () => {
        const options = {
          hostname: 'api.github.com',
          path: '/user?' + data,
          headers: {
            'User-Agent': 'gaga-change'
          }
        }
        data = ''
        // console.log(options)
        // https.get('https://' + hostname + path, (res) => {
        https.get(options, (res) => {
          res.on('data', (d) => {
            data += d.toString()
          })
          res.on('end', () => {
            console.log(data)
          })
        })
      })
    }).on('error', (e) => {
      console.log('error')
      console.error(e);
    })
  })
  router.get('/login/github/success', function (req, res) {
    console.log('喵喵喵？ success')
    console.log(req.query)
  })
  app.use('/api', router)
}