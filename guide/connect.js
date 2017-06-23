/**
 * Created by 严俊东 on 2017/6/23.
 */
const mongoose = require('mongoose')
module.exports = (function () {
  mongoose.connect('mongodb://localhost/mongoose')
  return mongoose
})()