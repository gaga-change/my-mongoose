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

/* 实例方法 */
AddressSchema.methods = {}

/* 静态方法 */
AddressSchema.statics = {}

module.exports = mongoose.model('address', AddressSchema)
