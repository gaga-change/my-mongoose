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
  const site = new Site({grade: params['gradeId']})
  address.user = req.user._id
  address.save((err, address) => {
    if (err) return res.send({success: false, message: err.message})
    else {

      return res.send({success: true})
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

