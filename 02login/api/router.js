const user = require('./db/user.js')
const github = require('./db/github.js')
const address = require('./db/address.js')
const collectGrade = require('./db/collect.grade.js')
const collectAddress = require('./db/collect.address.js')
const auth = require('./middleware/auth.js')

module.exports = function (app, router) {
  /* 中间件 */
  router.use(/(\/collect\/)/, auth.requireLogin) // 获取session存储的用户
  router.use('/', user.session) // 获取session存储的用户

  /* 用户 User */
  router.post('/login', user.login) // 登入接口
  router.post('/register', user.register) // 注册接口
  router.get('/getAccount', user.getAccount) // 获取当前登入账号接口
  router.get('/logout', user.logout) // 退出登入接口

  /* 第三方登入 */
  router.get('/login/github', github.githubLogin) // github 第三方登入跳转地址
  router.get('/login/github/callback', github.githubCallback) // github登入回调地址

  /* 收藏 */
  router.post('/address/add', address.add) //
  router.get('/collect/grade', collectGrade.getGrade) // 获取目录列表
  router.post('/collect/grade', collectGrade.addGrade) // 增加目录
  router.delete('/collect/grade', collectGrade.deleteGrade) // 删除目录
  router.put('/collect/grade', collectGrade.rename) // 重命名目录

  router.post('/collect/address', collectAddress.add) // 添加收藏
  router.delete('/collect/address', collectAddress.delete) // 添加收藏

  // 配置接口前缀
  app.use('/api', router)
}
