/**
 * Created by yanjd on 2017/10/12.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GradeSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  father: {type: Schema.ObjectId, ref: 'Grade'},
  name: {type: String, default: ''},
  sort: {type: Date, default: Date.now}
}, {timestamps: {createdAt: true, updateAt: true}})

GradeSchema.path('name').validate(function (name) {
  return name && name.length && name.length < 11
}, '目录名不能为空，且长度最多11位')

/* 实例方法 */
GradeSchema.methods = {}

/* 静态方法 */
GradeSchema.statics = {
  // 根据用户ID获取 收藏夹的目录
  findGradeByUserId (userId) {
  }
}

module.exports = mongoose.model('Grade', GradeSchema)
