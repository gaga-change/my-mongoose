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

module.exports = mongoose.model('Collect', CollectSchema)
