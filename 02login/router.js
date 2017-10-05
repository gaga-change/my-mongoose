const user = require('./db/user.js')

module.exports = function (app) {
  /* 用户 User */
  app.use('/', user.session)                   // 获取session存储的用户
  app.post('/api/login', user.login)           // 登入接口
  app.post('/api/register', user.register)     // 注册接口
  app.get('/api/getAccount', user.getAccount)  // 获取当前登入账号接口
  app.get('/api/logout', user.logout)          // 退出登入接口
}