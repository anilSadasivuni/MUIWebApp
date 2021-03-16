var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mpuDatabase');
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(" Connection Successfull! ");
});

var userSchema = new Schema({
    userId : String,
    password: String,
    firstName : String,
    lastName : String,
    email : String,
    add1 : String,
    add2 : String,
    city : String,
    state : String,
    zipCode : String,
    country : String
});

var user=mongoose.model('user',userSchema,'user');

module.exports.getAllUsers=function(){
  return new Promise((resolve, reject) => {
    user.find({}).then(data => {
      console.log("in find all "+data);
      resolve(data);
    }).catch(err => { return reject(err); })
  })
}

module.exports.getUser=function(userId){
  return new Promise((resolve, reject) => {
    user.find({ userId: userId }).then(data => {
      console.log("in find item ");
      resolve(data);
    }).catch(err => { return reject(err); })
  })
}
