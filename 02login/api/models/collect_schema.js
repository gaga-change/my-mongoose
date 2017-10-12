/**
 * Created by yanjd on 2017/10/12.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CollectSchema = new Schema({
  // user: { type : Schema.ObjectId, ref : 'User' },
  arr: {
    user: {type: Schema.ObjectId, ref: 'Address'}
  }
})

module.exports = mongoose.model('Collect', CollectSchema)
