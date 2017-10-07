const user = require('./db/user.js')
const github = require('./db/github.js')

module.exports = function (app, router) {
  /* 用户 User */
  router.use('/', user.session)                   // 获取session存储的用户
  router.post('/login', user.login)           // 登入接口
  router.post('/register', user.register)     // 注册接口
  router.get('/getAccount', user.getAccount)  // 获取当前登入账号接口
  router.get('/logout', user.logout)          // 退出登入接口

  /* 第三方登入 */
  router.get('/login/github', github.githubLogin)
  router.get('/login/github/callback', github.githubCallback)

  app.use('/api', router)
}