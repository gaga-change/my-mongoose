/**
 * Created by yanjd on 2017/10/12.
 */
const Address = require('../models/address_schema')
const only = require('only')

exports.add = function (req, res) {
  let address = only(req.body, 'title detail url')
  address = new Address(address)
  address.save((err, address) => {
    if (err) return res.send({success: false, message: err.message})
    else return res.send({success: true})
  })
}
