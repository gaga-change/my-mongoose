/**
 * Created by yanjd on 2017/10/19.
 */

const Collect = require('../models/collect_schema')
const only = require('only')

/**
 * 获取目录
 */
exports.getGrade = function (req, res) {
  Collect.findOne({user: req.user._id}).select('grade').exec((err, collect) => {
    if (err) res.send({success: false, message: err.toString()})
    else if (collect) {
      res.send({success: true, collect})
    } else {
      new Collect({user: req.user}).save(err => {
        if (err) res.send({success: false, message: err.toString()})
        else res.send({success: true, grade: []})
      })
    }
  })
}

/**
 *
 */
exports.addGrade = function (req, res) {
  let gradeName = req.body.gradeName
  if (!gradeName) return res.send({success: false, message: '目录名不能为空'})
  Collect.update({user: req.user}, {$addToSet: {grade: gradeName}}, {upsert: true}).select('grade').exec((err, msg) => {
    if (err) res.send({success: false, message: err.toString()})
    else if (msg.nModified) {
      res.send({success: true})
    } else {
      res.send({success: false, message: '已存在相同目录'})
    }
  })
}
