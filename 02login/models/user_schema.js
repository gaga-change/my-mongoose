const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {type: String},
  // password: {type: String},
  hashed_password: {type: String, default: ''},
  salt: {type: String, default: ''},
  createTime: {type: Date, default: Date.now}
})

/**
 * 创建虚拟属性password
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt() // 获取随机 salt
    this.hashed_password = this.encryptPassword(password) // 加密密码
  })
  .get(function () {
    return this._password
  })

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * 创建 salt
   *
   * @return {String}
   */
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },
  /**
   * 验证 - 检测密码是否正确
   * 原理：使用同样的salt加密输入的密码得到的密文是否和存储的密文相同
   * @param {String} 输入的密码
   * @return {Boolean}
   */
  authenticate: function (password) {
    return this.encryptPassword(password) === this.hashed_password
  },

  /**
   * 加密 password
   *
   * @param {String} password
   * @return {String}
   */
  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  }
}
module.exports = mongoose.model('User', UserSchema)