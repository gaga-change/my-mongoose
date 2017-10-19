/**
 * Created by yanjd on 2017/10/19.
 */

const Collect = require('../models/collect_schema')
const only = require('only')

/**
 * 获取目录
 */
exports.getGrade = function (req, res) {
  Collect.findOne({user: req.user}).select('grade').exec((err, collect) => {
    if (err) res.send({success: false, message: err.toString()})
    else if (collect) {
      res.send({success: true, grade: collect.grade})
    } else {
      new Collect({user: req.user}).save(err => {
        if (err) res.send({success: false, message: err.toString()})
        else res.send({success: true, grade: []})
      })
    }
  })
}

/**
 * 增加目录
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

/**
 * 删除目录
 */
exports.deleteGrade = function (req, res) {
  let gradeNames = req.body.gradeNames
  try {
    gradeNames = JSON.parse(gradeNames)
  } catch (err) {
    return res.send({success: false, message: '参数不是JSON数组'})
  }
  if (gradeNames.constructor !== Array) return res.send({success: false, message: '参数需为数组'})
  if (!gradeNames.length) return res.send({success: false, message: '目录名不能为空'})
  console.log(gradeNames)
  Collect.update({user: req.user}, {$pullAll: {grade: gradeNames}}, {upsert: true}).select('grade').exec((err, msg) => {
    if (err) res.send({success: false, message: err.toString()})
    else {
      res.send({success: true, msg})
    }
  })
}
