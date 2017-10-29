/**
 * Created by yanjd on 2017/10/12.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  share: {type: Boolean, default: false},
  title: {type: String, default: ''},
  detail: {type: String, default: ''},
  url: {type: String, default: ''}
}, {timestamps: {createdAt: true, updateAt: true}})

AddressSchema.path('url').validate(function (url) {
  return url && url.length
}, '路径不能为空')

AddressSchema.path('title').required(true, '标题不能为空')

/* 实例方法 */
AddressSchema.methods = {
  // save
}

/* 静态方法 */
AddressSchema.statics = {}

module.exports = mongoose.model('address', AddressSchema)
