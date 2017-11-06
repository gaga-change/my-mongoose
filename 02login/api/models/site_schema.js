/**
 * Created by yanjd on 2017/11/06.
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SiteSchema = new Schema({
  grade: {type: Schema.ObjectId, ref: 'Grade'},
  address: {type: Schema.ObjectId, ref: 'address'},
})

/* 实例方法 */
SiteSchema.methods = {}

/* 静态方法 */
SiteSchema.statics = {}

module.exports = mongoose.model('site', SiteSchema)
