/**
 * Created by yanjd on 2017/10/12.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CollectSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  private: [{
    fileName: {type: String, default: ''},
    url: {type: Schema.objectId, ref: 'Url'}
  }],
  grade: {type: Object, default: ''},
  share: [{
    url: {type: Schema.objectId, ref: 'Url'}
  }]
})

module.exports = mongoose.model('Collect', CollectSchema)
