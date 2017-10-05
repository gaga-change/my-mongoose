/**
 * Created by 严俊东 on 2017/6/23.
 */
const mongoose = require('../connect.js')
/*创建 Schema*/
const studentSchema = new mongoose.Schema({
  name: String,
})
/*Schema 静态方法*/
studentSchema.methods.findName = function (cb) {
  return this.model('Student').find({name: this.name}, cb)
}
/*创建 Model*/
const Student = mongoose.model('Student', studentSchema)

// let yanStudent = new Student({name: 'yanjundong东'})
// yanStudent.save();

console.log(new Student({name: 'yanjundong东'}).get('name'))
new Student({name: 'yanjundong东'}).findName(function (err, stu) {
  if(err)
    console.log(err)
  else
    console.log(stu)
})