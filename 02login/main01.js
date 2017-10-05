/**
 * Created by yanjd on 2017/9/26.
 */
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const User = require('./models/user_schema')

mongoose.Promise = global.Promise
let app = express()
app.use('/static', express.static('./static'))   // 配置静态资源目录
app.get('/favicon.ico', function (req, res) {
  res.send('gaga')
})
app.use(bodyParser.json())                       // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
/* cookie解析 */
app.use(cookieParser())
/* 配置session插件 */
app.use(session({
  secret: '123456',
  name: 'sessionId', // cookie中的键名，用于存储sessionId
  cookie: {maxAge: 2 * 60 * 1000}, // cookie保存的时间
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    host: 'localhost',
    port: 27017,
    db: 'session',
    url: 'mongodb://localhost:27017/session01'
  })
}))
/* 每个请求，获取当前登入的账号，并赋值到req */
app.use('/', function (req, res, next) {
  return next()
  if (req.session.accountId) {
    User.findOne({_id: req.session.accountId}, function (err, account) {
      if (err) {
        res.send({success: false, message: err.toString()})
      } else if (account) {
        req.account = account
        next()
      } else {
        next()
      }
    }).select('_id username createTime')
  } else {
    next()
  }
})
const userDb = require('./db/user')
/* 配置静态目录 */
app.use('/', express.static('./page'))  // 存放静态页面目录
app.use('/', userDb.session) // 获取session存储的用户
app.post('/api/login', userDb.login)           // 登入接口
app.post('/api/register', userDb.register)     // 注册接口
app.get('/api/getAccount', userDb.getAccount)  // 获取当前登入账号接口
app.get('/api/logout', userDb.logout)          // 退出登入接口
/* 接收所有请求 */
app.get('*', function (req, res) {
  res.send(404)
})

mongoose.connect('mongodb://localhost/session01', {useMongoClient: true}).then(function () {
  app.listen(8082)
  console.log(`http://localhost:8082`)
})