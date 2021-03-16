var express = require('express');
let router = express.Router();
let itemDbUtil = require('../utility/ItemDB');
var validator = require('express-validator');
var app = express();

app.use(validator());
app.use('/', router);

router.get('/index', function(req, res) {
  res.render('index');
});

router.get('/categories', async function(req, res) {

    itemData = await itemDbUtil.getAllItems();

    var categories = getCategories(itemData);
    var data= {
        categories: categories,
        items: itemData
    }
    console.log("item name"+data.items[0].catalogCategory)
    res.render('categories', { data: data });
});

router.get('/contact', function(req, res) {
    res.render('contact');
});

router.get('/feedback', function(req, res) {
    res.render('feedback');
});

router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/categories/item', async function(req, res) {

    req.check('itemCode').notEmpty().isAlphanumeric();
    var errors = req.validationErrors();

    if(!errors)
    {
      var itemCode = req.query.itemCode;

      var item = await itemDbUtil.getItem(itemCode);

      if (item == null)
      {
        itemData = await itemDbUtil.getAllItems();

        var categories = getCategories(itemData);

        var data= {
            categories: categories,
            items: itemData
        }
        res.render('categories', { data: data });
      }
      else
      {
        console.log("This is item"+item);
        console.log("This is item Name ---------------------------------"+item[0].rating);
        res.render('item', { data: item[0]});
      }
    }
    else
    {
      itemData = await itemDbUtil.getAllItems();

      var categories = getCategories(itemData);

      var data= {
          categories: categories,
          items: itemData
      }
      res.render('categories', { data: data });
    }
});

/*router.get('/myItems', function(req, res) {
    res.render('myItems');
});*/

var categories = [];

let getCategories = function(itemData) {
    itemData.forEach(function (item) {
        if(!categories.includes(item.catalogCategory)){
            categories.push(item.catalogCategory);
        }
    });
    return categories;
};

router.get('/*', function(req, res) {
  res.render('index');
});

module.exports = router;
module.exports = app;
