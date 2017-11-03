/**
 * Created by yanjd on 2017/10/19.
 */

const Grade = require('../models/grade_schema')
// const only = require('only')

/**
 * 增加目录
 */
exports.add = function (req, res) {
  let gradeName = req.body.gradeName
  if (!gradeName) return res.send({success: false, message: '目录名不能为空'})
  Grade.update({user: req.user}, {$addToSet: {grade: gradeName}}, {upsert: true}).select('grade').then(msg => {
    if (msg.nModified) {
      res.send({success: true})
    } else {
      res.send({success: false, message: '已存在相同目录'})
    }
  })
}

/**
 * 删除目录
 */
exports.delete = function (req, res) {
  let gradeNames = req.body.gradeNames
  try {
    gradeNames = JSON.parse(gradeNames)
  } catch (err) {
    return res.send({success: false, message: '参数不是JSON数组'})
  }
  if (gradeNames.constructor !== Array) return res.send({success: false, message: '参数需为数组'})
  if (!gradeNames.length) return res.send({success: false, message: '目录名不能为空'})
  console.log(gradeNames)
  Grade.update({user: req.user}, {$pullAll: {grade: gradeNames}}, {upsert: true}).select('grade').then(msg => {
    if (msg.nModified) {
      res.send({success: true})
    } else {
      res.send({success: false, message: '目录名不存在'})
    }
  })
}

/**
 * 重命名目录
 */
exports.modify = function (req, res) {
  let oldGradeName = req.body.oldGradeName || ''
  let newGradeName = req.body.newGradeName || ''
  if (oldGradeName === newGradeName) return res.send({success: false, message: '目录名相同'})
  if (!oldGradeName || !newGradeName) return res.send({success: false, message: '目录名不能为空'})
  Grade.findOne({user: req.user, grade: newGradeName}).select('grade').then(Grade => {
    return !!Grade
  }).then((exist) => {
    if (exist) return res.send({success: false, message: '新目录名已存在'})
    Grade.update({user: req.user, grade: oldGradeName}, {$set: {'grade.$': newGradeName}}).select('grade').then(msg => {
      if (msg.nModified) {
        res.send({success: true})
      } else {
        res.send({success: false, message: '目录名不存在'})
      }
    })
  })
}

/**
 * 获取目录
 */
exports.get = function (req, res) {
  Grade.findOne({user: req.user}).select('grade').then(Grade => {
    if (Grade) {
      res.send({success: true, grade: Grade.grade})
    } else {
      new Grade({user: req.user}).save(err => {
        if (err) res.send({success: false, message: err.toString()})
        else res.send({success: true, grade: []})
      })
    }
  })
}
