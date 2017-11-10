/**
 * Created by yanjd on 2017/10/12.
 */
const Address = require('../models/address_schema')
const Site = require('../models/site_schema')
const Grade = require('../models/grade_schema')
const only = require('only')

// 添加收藏
exports.add = function (req, res) {
  const params = only(req.body, 'title detail url')
  const address = new Address(params)
  const site = new Site({grade: req.grade})
  address.user = req.user._id
  address.save((err, address) => {
    if (err) res.send({success: false, message: err.message})
    else if (address) {
      site.address = address
      site.save(err => {
        if (err) return res.send({success: false, message: err.message})
        else res.send({success: true})
      })
    } else {
      res.send({success: false, message: 'address 保存失败'})
    }
  })
}

// 删除收藏
exports.delete = function (req, res) {
  const params = only(req.body, 'siteId')
  if (!params['siteId']) {
    res.send({success: false, message: '参数异常'})
  } else {
    Site.findOne({_id: params.siteId, grade: req.grade._id}).populate('address', 'user _id').then(site => {
      if (!site) {
        res.send({success: false, message: 'SITE不存在'})
      } else {
        site.remove(msg => {
          const address = site.address
          if (address && address._id && address.user.toString() === req.user._id.toString()) {
            Address.remove({_id: address._id}).then(msg => {
              res.send({success: true, msg})
            })
          } else {
            res.send({success: true})
          }
        })
      }
    }).catch(err => {
      res.send({err})
    })
  }
}

// 修改收藏（迁移目录）
exports.moveAddress = function (req, res) {
  const params = only(req.body, 'siteId oldGrade')
  let siteId = []
  if (!params.siteId || !params.oldGrade) return res.send({success: false, message: '参数不能为空'})
  siteId = params.siteId.split(',')
  if (params['siteId'].length === 0 || siteId.length === 0 || siteId.length > 10) {
    res.send({success: false, message: '必须传递siteId值，且只支持最多10条操作'})
  } else {
    Grade.findOne({_id: params.oldGrade, user: req.user}).then(grade => {
      if (grade) {
        Site.update({_id: {$in: siteId}, grade: params.oldGrade}, {grade: req.grade}).then(msg => {
          res.send({msg})
        }).catch(err => {
          res.send({err})
        })
      } else {
        res.send({success: false, message: '没有权限操作'})
      }
    }).catch(err => {
      res.send({err})
    })
  }
}

// 查询收藏
exports.get = function (req, res) {
  const params = only(req.query, 'gradeId pageSize index')
  const page = Number(params.index) || 0
  const limit = Number(params.pageSize) || 30
  Site.find({grade: params.gradeId}).select('address').populate('address').sort({createDate: -1}).limit(limit).skip(page * limit).then(sites => {
    res.send({success: true, sites})
  })
}
