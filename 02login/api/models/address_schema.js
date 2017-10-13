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
  url: {type: String, default: ''},
  time: {
    create: {type: Date, default: Date.now()},
    modify: {type: Date, default: Date.now()}
  }
})

AddressSchema.methods = {}

AddressSchema.statics = {
  add (address) {

  }
}

module.exports = mongoose.model('address', AddressSchema)
