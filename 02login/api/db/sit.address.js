/**
 * Created by yanjd on 2017/10/12.
 */
const Address = require('../models/address_schema')
const Site = require('../models/site_schema')
const only = require('only')

// 添加收藏
exports.add = function (req, res) {
  const params = only(req.body, 'title detail url gradeId')
  const address = new Address(only(params, 'title detail url'))
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
  const params = only(req.body, 'addressId siteId')
}

// 修改收藏（迁移目录）
exports.moveAddress = function (req, res) {
  const params = only(req.body, 'addressId siteId')
}

// 查询收藏
exports.get = function (req, res) {
  const params = only(req.body, 'gradeId pageSize index')
}

