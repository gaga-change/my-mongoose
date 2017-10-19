/**
 * Created by yanjd on 2017/10/19.
 */

const Collect = require('../models/collect_schema')
// const only = require('only')

exports.getGrade = function (req, res) {
  Collect.findOne({user: req.user._id}).select('grade').exec((err, collect) => {
    if (err) res.send({success: false, message: err.toString()})
    else if (collect === null) {
      new Collect({user: req.user}).save(err => {
        if (err) res.send({success: false, message: err.toString()})
        else res.send({success: true, grade: []})
      })
    } else {
      res.send({success: true, collect})
    }
  })
}
