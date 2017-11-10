/**
 * Created by yanjd on 2017/10/19.
 */

const Grade = require('../models/grade_schema')
const only = require('only')

exports.load = function (req, res, next, _id) {
  Grade.findOne({_id}).then(grade => {
    if (grade && grade.user._id === req.user._id) { // 只能操作自己的目录
      req.grade = grade
      next()
    } else {
      res.send({success: false, msg: '目录不存在'})
    }
  })
}

/**
 * 增加目录
 *  限制最多20条
 */
exports.add = function (req, res) {
  const params = only(req.body, 'name')
  let gradeName = params.name
  if (!gradeName || gradeName.length > 10) return res.send({success: false, message: '目录名不能为空，且长度不能大于10位'})
  Grade.update({user: req.user, name: gradeName}, {}, {upsert: true}).then(msg => {
    if (msg.upserted) {
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
  const params = only(req.body, 'id')
  Grade.remove({_id: params.id}).then(() => {
    res.send({success: true})
  })
}

/**
 * 重命名目录
 */
exports.modify = function (req, res) {
  const params = only(req.body, 'id name')
  const gradeName = params.name
  if (!gradeName || gradeName.length > 10) return res.send({success: false, message: '目录名不能为空，且长度不能大于10位'})
  Grade.update({_id: params.id}, {name: gradeName}).then((msg) => {
    res.send({success: true, msg})
  })
}

/**
 * 获取目录
 */
exports.get = function (req, res) {
  Grade.find({user: req.user}).select('_id name').then(grade => {
    res.send({success: true, grade: grade})
  })
}
