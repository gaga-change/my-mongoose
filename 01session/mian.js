/**
 * express-session 保存在内部版
 * Created by yanjd on 2017/9/25.
 */
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')

let app = express()
/* cookie解析 */
app.use(cookieParser())
/* 配置session插件 */
app.use(session({
  secret: '123',
  name: 'sessionId', // cookie中的键名，用于存储sessionId
  cookie: {maxAge: 80 * 1000}, // cookie保存的时间
  resave: false,
  saveUninitialized: true
}))

/* 接收所有请求 */
app.get('*', send)

function send (req, res) {
  const path = req.path // 获取请求路径
  res.write(`<head><meta charset="UTF-8"><title>Title</title></head>`) // 配置编码
  res.write(`<a href="/">Home</a> <a href="/page1">page1</a> <a href="/page2">page2</a><br>`) // 配置导航
  // 显示从session中提取的变量，（这个值是存储在当前内存中，浏览器中存储一个sesionId与其对应）
  res.write('上个页面是：' + (req.session.lastPage || '') + '<br>')
  req.session.lastPage = path
  res.end('cookie的有效时间是：' + req.session.cookie.maxAge)
}

/* 监听端口 */
app.listen(8080, function () {
  console.log('http://localhost:8080')
})
