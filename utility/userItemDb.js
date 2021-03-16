var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mpuDatabase');
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(" Connection Successfull! ");
});

var userItemsSchema= new Schema(
  {
    userId: String,
    itemCode: String,
    item: String,
    category : String,
    rating: String,
    madeIt:String,
    imageURL:String,
  }
);

var userItems=mongoose.model('userItem',userItemsSchema,'userItem');

module.exports.getUserItem= function(userId,itemCode){
  return new Promise((resolve, reject) => {
    userItems.find({ 'userId': userId,'itemCode': itemCode }).then(data => {
      resolve(data);
    }).catch(err => {
      return reject(err);
    })
  });
}

module.exports.getUserItems= function(userId){
  return new Promise((resolve, reject) => {
    userItems.find({ userId: userId }).then(data => {
      resolve(data);
    }).catch(err => {
      return reject(err);
    })
  });
}

module.exports.removeItem = async function(userId,itemCode){
  await userItems.find({'userId':userId, 'itemCode':itemCode}).remove();
}

module.exports.addItem = async function(userID,itemCode,item,category,rating,madeIt,imageURL){
  var userItemsObj = {userId: userID,itemCode : itemCode,item: item,category: category,rating: rating,madeIt: madeIt,imageURL: imageURL};
  var userItemsAdd = new userItems(userItemsObj);
  userItemsAdd.save();
}

module.exports.addItemRating = async function(userId,itemCode,rating){
  await userItems.update({'userId': userId,'itemCode': itemCode},{$set :{'rating' : rating}});
}

module.exports.addMadeIt = async function(userId,itemCode,madeIt){
  await userItems.update({'userId': userId,'itemCode': itemCode},{$set :{'madeIt' : madeIt}});
}
