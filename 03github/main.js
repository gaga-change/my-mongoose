/**
 * Created by yanjd on 2017/11/22.
 */
/**
 * Created by yanjd on 2017/9/26.
 */
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
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

/* 配置静态目录 */
app.use('/', express.static('./page')) // 存放静态页面目录
require('./api/router.js')(app, router) // 所有api请求

/* 接收所有请求 */
app.get('*', function (req, res) {
  res.sendStatus(404)
})

mongoose.connect('mongodb://localhost/test', {useMongoClient: true}).then(function () {
  app.listen(8083)
  console.log(`http://localhost:8083`)
})
