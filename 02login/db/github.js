const only = require('only')
const https = require('https')

const User = require('../models/user_schema')

exports.githubLogin =  function (req, res) {
  res.redirect(`https://github.com/login/oauth/authorize?scope=123&client_id=274df6a3dc60b0dd834c`)
}

exports.githubCallback =  function (req, res) {
  let url = `https://github.com/login/oauth/access_token?scope=123&client_id=274df6a3dc60b0dd834c&code=${req.query.code}&client_secret=e8dfc09c2a5544087f4fc01c646d3f57b302e0f5&redirect_url=http://localhost:8082/api/login/github/success`
  console.log(url)
  let data = ''
  https.get(url, (resGetToken) => {
    console.log('状态码：', res.statusCode);
    // console.log('请求头：', res.headers);
    resGetToken.on('data', (d) => {
      data += d.toString()
    })
    resGetToken.on('end', () => {
      const options = {
        hostname: 'api.github.com',
        path: '/user?' + data,
        headers: {
          'User-Agent': 'gaga-change'
        }
      }
      data = ''
      https.get(options, (resGetUser) => {
        resGetUser.on('data', (d) => {
          data += d.toString()
        })
        resGetUser.on('end', () => {
          console.log('data#', data)
          data = JSON.parse(data)
          if(data.message === 'Requires authentication') {
            return res.send({success: false, message: '停留时间过长，登入已失效，请重新登入'})
          }
          User.findOne({'github.id': data.id}).exec((err, user) => {
            if (err)
              return res.send({success: false, message: err.toString()})
            if(user) {
              req.session.userId = user._id
              req.session.modifyNum = user.modifyNum
              res.send({success: true})
              return
            }
            // 获取到第三方信息后注册用户并登入
            User.register({provider: 'github', github: data}, function (err, user) {
              if (err)
                return res.send({success: false, message: err.toString()})
              req.session.userId = user._id
              req.session.modifyNum = user.modifyNum
              res.send({success: true})
            })
          })

        })
      })
    })
  }).on('error', (e) => {
    console.log('error')
    console.error(e);
  })
}