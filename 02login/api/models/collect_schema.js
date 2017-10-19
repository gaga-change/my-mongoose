/**
 * Created by yanjd on 2017/10/12.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CollectSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  collect: [{
    fileName: {type: String, default: ''},
    url: {type: Schema.objectId, ref: 'Address'}
  }],
  grade: {type: Object, default: ''}
})

/* 实例方法 */
CollectSchema.methods = {}

/* 静态方法 */
CollectSchema.statics = {
  // 根据用户ID获取 收藏夹的目录
  findGradeByUserId (userId) {
  }
}

module.exports = mongoose.model('Collect', CollectSchema)
