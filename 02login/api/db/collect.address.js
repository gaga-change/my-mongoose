/**
 * Created by yanjd on 2017/10/27.
 */

const Collect = require('../models/collect_schema')
const Address = require('../models/address_schema')

const only = require('only')

/**
 * 添加收藏链接
 */

exports.add = function (req, res) {
  let params = only(req.body, 'title detail url fileName')
  let adrs = only(params, 'title detail url')
  if (params.fileName) {}
  adrs = new Address(adrs)
  adrs.user = req.user
  adrs.save().then((address) => {
    Collect.update({user: req.user, grade: params.fileName}, {$push: {collect: {fileName: params.fileName, address}}}).then((msg) => {
      if (msg.nModified) {
        res.send({success: true})
      } else {
        adrs.remove()
        res.send({success: false, message: '目录名不存在'})
      }
    })
  }).catch((err) => {
    const errors = Object.keys(err.errors)
      .map(key => err.errors[key].message)
    res.send({success: false, message: errors[0], errors})
  })
}

/**
 * 删除收藏链接
 */

exports.delete = function (req, res, next) {
  let params = only(req.body, 'id')

}

/**
 * 修改收藏链接
 */

/**
 * 查询收藏链接
 */
