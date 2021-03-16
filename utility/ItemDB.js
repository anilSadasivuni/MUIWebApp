var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mpuDatabase');
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(" Connection Successfull! ");
});

var itemSchema=new Schema({
  itemCode : String,
  itemName : String,
  catalogCategory : String,
  starCast: String,
  director: String,
  good: String,
  bad: String,
  watch: String,
  rating : String,
  imageURL : String
});

var items=mongoose.model('item',itemSchema,'item');

module.exports.getAllItems=function(){
    return new Promise((resolve, reject) => {
      items.find({}).then(data => {
        console.log("in find all ");
        resolve(data);
      }).catch(err => { return reject(err); })
    })
}

module.exports.getItem= function(itemCode){
  return new Promise((resolve, reject) => {
    items.find({ itemCode: itemCode }).then(data => {
      console.log("in find item--------- "+data);
      resolve(data);
    }).catch(err => { return reject(err); })
  })
}
