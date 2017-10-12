/**
 * Created by yanjd on 2017/10/12.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = new Schema({
  title: {type: String, default: ''},
  detail: {type: String, default: ''},
  url: {type: String, default: ''}
})

AddressSchema.methods = {}

AddressSchema.statics = {
  add (address) {

  }
}

module.exports = mongoose.model('address', AddressSchema)
