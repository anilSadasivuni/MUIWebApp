class userItem{
  constructor(userId,itemCode,item,category,rating,madeIt)
  {
    this.userId=userId;
    this.itemCode=itemCode;
    this.item=item;
    this.category=category;
    this.rating=rating;
    this.madeIt=madeIt;
  }
}

module.exports = userItem;
