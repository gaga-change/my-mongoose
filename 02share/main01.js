/**
 * Created by yanjd on 2017/9/26.
 */
const express = require('express')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const router = require('express').Router()

mongoose.Promise = global.Promise
let app = express()
app.use('/static', express.static('./static')) // 配置静态资源目录
app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'static/favicon.ico'))
})
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
/* cookie解析 */
app.use(cookieParser())
/* 配置session插件 */
app.use(session({
  secret: '123456',
  name: 'sessionId', // cookie中的键名，用于存储sessionId
  cookie: {secure: false, maxAge: 24 * 60 * 60 * 1000}, // cookie保存的时间
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    host: 'localhost',
    port: 27017,
    db: 'session',
    url: 'mongodb://localhost:27017/session01'
  })
}))

/* 配置静态目录 */
app.use('/', express.static('./page')) // 存放静态页面目录
require('./api/router.js')(app, router) // 所有api请求

/* 接收所有请求 */
app.get('*', function (req, res) {
  res.sendStatus(404)
})

mongoose.connect('mongodb://localhost/session01', {useMongoClient: true}).then(function () {
  app.listen(8082)
  console.log(`http://localhost:8082`)
})
