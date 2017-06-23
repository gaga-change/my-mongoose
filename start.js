/**
 * Created by 严俊东 on 2017/6/23.
 */
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/mongoose')
const Cat = mongoose.model('Cat', {name: String})
let kitty = new Cat({name: 'gaga1'})
kitty.save(err => {
  if(err)
    console.log(err)
  else
    console.log('ok')
})