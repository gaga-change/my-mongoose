const github = require('./db/github.js')

module.exports = function (app, router) {
  // GitHub Api
  router.post('/github/push/commit', github.pushCommit) // 拉取最新commit
  router.post('/github/push/tree', github.pushTree) // 拉取最新commit
  router.post('/github/push/file', github.pushFile) // 拉取文件内容
  router.post('/github/push/readme', github.parseReadme) // 拉取"关于我"
  router.post('/test', github.test) // 拉取文件内容

  // 错误捕获
  router.use('*', function (err, req, res) {
    res.send({err: err})
  })
  // 配置接口前缀
  app.use('/api', router)
}
