const user = require('./db/user.js')
const github = require('./db/github.js')
const address = require('./db/address.js')
const collect = require('./db/collect')
const auth = require('./middleware/auth.js')

module.exports = function (app, router) {
  /* 用户 User */
  router.use('/', user.session) // 获取session存储的用户
  router.post('/login', user.login) // 登入接口
  router.post('/register', user.register) // 注册接口
  router.get('/getAccount', user.getAccount) // 获取当前登入账号接口
  router.get('/logout', user.logout) // 退出登入接口

  /* 第三方登入 */
  router.get('/login/github', github.githubLogin) // github 第三方登入跳转地址
  router.get('/login/github/callback', github.githubCallback) // github登入回调地址

  /* 收藏 */
  router.post('/address/add', auth.requireLogin, address.add) //
  router.get('/collect/grade', auth.requireLogin, collect.getGrade) // 获取目录列表
  router.post('/collect/grade', auth.requireLogin, collect.addGrade) // 增加目录
  // 配置接口前缀
  app.use('/api', router)
}
