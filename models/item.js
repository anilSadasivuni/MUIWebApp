class item {
    constructor(itemCode, itemName, catalogCategory, starCast, director, good, bad, watch, rating) {
        this._itemCode = itemCode;
        this._itemName = itemName;
        this._catalogCategory = catalogCategory;
        this._starCast = starCast;
        this._director = director;
        this._good = good;
        this._bad = bad;
        this._watch = watch;
        this._rating = rating;
        this._imageURL = this.getImageURL(itemCode);
    }

    get itemCode() {
        return this._itemCode;
    }

    set itemCode(value) {
        this._itemCode = value;
    }

    get itemName() {
        return this._itemName;
    }

    set itemName(value) {
        this._itemName = value;
    }

    get catalogCategory() {
        return this._catalogCategory;
    }

    set catalogCategory(value) {
        this._catalogCategory = value;
    }

    get starCast() {
        return this._starCast;
    }

    set starCast(value) {
        this._starCast = value;
    }

    get director() {
        return this._director;
    }

    set director(value) {
        this._director = value;
    }

    get good() {
        return this._good;
    }

    set good(value) {
        this._good = value;
    }

    get bad() {
        return this._bad;
    }

    set bad(value) {
        this._bad = value;
    }

    get watch() {
        return this._watch;
    }

    set watch(value) {
        this._watch = value;
    }

    get rating() {
        return this._rating;
    }

    set rating(value) {
        this._rating = value;
    }

    get imageURL() {
        return this._imageURL;
    }

    set imageURL(value) {
        this._imageURL = value;
    }

    getImageURL(itemCode)
    {
      let imageURL;
      if(itemCode == 'M1')
      {
        imageURL = '/images/alita.jpg';
      }
      else if(itemCode == 'M2')
      {
        imageURL = '/images/spiderman.jpg';
      }
      else if(itemCode == 'M3')
      {
        imageURL = '/images/gully.jpg';
      }
      else if(itemCode == 'S1')
      {
        imageURL = '/images/got.jpg';
      }
      else if(itemCode == 'S2')
      {
        imageURL = '/images/flash.jpg';
      }
      else if(itemCode == 'S3')
      {
        imageURL = '/images/arrow.jpg';
      }

      return imageURL;
    }
}

module.exports = item;
