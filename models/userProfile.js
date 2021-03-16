var userItem = require('./userItem');
var itemDbUtil = require('../utility/ItemDB');

class userProfile{

  constructor(userId,items)
  {
    this.userId=userId;
    this.userItems = items.slice();
    console.log("user items"+this.userItems);
  }
  defaultItem()
  {
    var item = itemDbUtil.getItem('M1');
    let itemAdd =new userItem(item.itemCode,item.itemName,item.catalogCategory,item.rating,'Yes')
    this.userItems.push(itemAdd);
    var item2 = itemDbUtil.getItem('S1');
    let item2Add =new userItem(item2.itemCode,item2.itemName,item2.catalogCategory,item2.rating,'No')
    this.userItems.push(item2Add);
  }
  addItem(userId,itemCode,item,category,rating,madeIt)
  {
    let itemAdd =new userItem(userId,itemCode,item,category,rating,madeIt)
    this.userItems.push(itemAdd);
  }
  removeItem(itemCode)
  {
    for(var count=0;count<this.userItems.length;count++)
    {
      if(this.userItems[count].itemCode == itemCode)
      {
        this.userItems.splice(count,1);
        break;
      }
    }
  }
  updateItemRating(count,ratingUpd)
  {
      this.userItems[count].rating = ratingUpd;
  }
  updateItemFlag(count,flagUpd)
  {
    this.userItems[count].madeIt = flagUpd;
  }
  getItems()
  {
    return this.userItems;
  }
  emptyProfile()
  {
    this.userItems.length=0;
  }
}

module.exports = userProfile;
