var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var userDbUtil = require('../utility/userDB');
var userProfile = require('../models/userProfile');
var userItemDb = require('../utility/userItemDb');
let itemDbUtil = require('../utility/ItemDB');
var validator = require('express-validator');

var urlencodedParser = bodyParser.urlencoded({extended : false });

app.use(validator());

app.use('/', router);

router.get('/', async function(req, res)
{
  if(!req.session.theUser)
  {
    res.render('login');
  }
  else
  {
    if(req.session.UserProfile)
    {
      res.render('myItems', { profile: req.session.UserProfile});
    }
    else
    {
      res.render('index');
    }
  }
});

router.post('/',urlencodedParser,async function(req,res,next)
{
  if(req.session.theUser)
  {
    if(req.session.UserProfile)
    {
      res.render('myItems', { profile: req.session.UserProfile});
    }
    else
    {
      res.render('index');
    }
  }
  else
  {
    if(req.query.action == "signin")
    {
      var checkSet = 1;

      req.check('Username').notEmpty().isAlphanumeric();
      req.check('Password').notEmpty().isLength({min:6});

      var errors = req.validationErrors();

      if(errors)
      {
        checkSet = 0;
      }

      if(checkSet != 0)
      {
        var users = await userDbUtil.getAllUsers();
        if(users != null)
        {
          for(var count=0;count<users.length;count++)
          {
            if(users[count].userId == req.body.Username && users[count].password == req.body.Password)
            {
              user = users[count];
              req.session.theUser = user;
              res.locals.theUser = req.session.theUser;
              userProfileItems = await userItemDb.getUserItems(req.session.theUser.userId);
              UserProfile = new userProfile(req.session.theUser.userId,userProfileItems);
              req.session.UserProfile = UserProfile;
              console.log('User Set');
              checkSet = 0;
              break;
            }
          }
          if(checkSet == 0)
          {
            res.render('myItems', { profile: req.session.UserProfile});
          }
          else
          {
            res.locals.userError = "invalid";
            res.render('login');
          }
        }
        else
        {
          console.log('No user to set');
          res.render('index');
        }
      }
      else
      {
        res.locals.userError = "invalid";
        console.log('else of invalid username or password');
        res.render('login');
      }
    }
    else
    {
      console.log('invalid action');
      res.render('login');
    }
  }
});

router.get('/signout', function(req, res) {
  res.locals.userError = "valid";
  res.locals.theUser = null;
  req.session.destroy();
  res.render('index');
});

router.get('/feedback', async function(req, res) {

  req.check('itemCode').notEmpty().isAlphanumeric();

  var errors = req.validationErrors();

  if(!errors)
  {
    var itemCode = req.query.itemCode;

    var theItem = await userItemDb.getUserItem(req.session.theUser.userId,itemCode);

    console.log("--------checking the item--------"+theItem);
    if (theItem == null)
    {
      res.render('myItems', { profile: req.session.UserProfile});
    }
    else
    {
      console.log(" item name"+theItem[0].item);
      res.render('feedback', { item: theItem[0],profile: req.session.UserProfile});
    }
  }
  else
  {
    res.render('myItems', { profile: req.session.UserProfile});
  }
});

router.get('/*', async function(req, res) {
  if(!req.query.action)
  {
    res.render('myItems', { profile: req.session.UserProfile});
  }
  else
  {

    req.check('itemCode').notEmpty().isAlphanumeric();

    var errors = req.validationErrors();

    if(!errors)
    {
      var check=0;
      var action = req.query.action;
      var itemCode = req.query.itemCode;
      if(action == 'remove')
      {
        for(var count=0;count<UserProfile.userItems.length;count++)
        {
          if(UserProfile.userItems[count].itemCode == itemCode)
          {
            UserProfile.removeItem(itemCode);
            await userItemDb.removeItem(req.session.theUser.userId,itemCode);
            req.session.UserProfile = UserProfile;
            break;
          }
          else
          {
            console.log('Item Id does not exist in user profile');
          }
        }
        res.render('myItems', { profile: req.session.UserProfile});
      }
      else if(action == 'save')
      {
        for(var count=0;count<UserProfile.userItems.length;count++)
        {
          if(UserProfile.userItems[count].itemCode == itemCode)
          {
            check = 1;
            console.log('Item already exist in the user profile');
            res.render('myItems', { profile: req.session.UserProfile});
            break;
          }
        }
        if(check == 0)
        {
          var itemCode = req.query.itemCode;
  		    var item = await itemDbUtil.getItem(itemCode);
          if (item == null)
          {
            res.render('myItems', { profile: req.session.UserProfile});
          }
          else
          {
            UserProfile.addItem(req.session.theUser.userId,item[0].itemCode,item[0].itemName,item[0].catalogCategory,0,'No',item[0].imageURL);
            await userItemDb.addItem(req.session.theUser.userId,item[0].itemCode,item[0].itemName,item[0].catalogCategory,0,'No',item[0].imageURL);
            req.session.UserProfile = UserProfile;
            res.render('myItems', { profile: req.session.UserProfile});
          }
        }
        else
        {
          check = 0;
        }
      }
      else if(action == 'updateProfile')
      {
        for(var count=0;count<UserProfile.userItems.length;count++)
        {
          if(UserProfile.userItems[count].itemCode == itemCode)
          {
            check = 1;
            var theItem = await userItemDb.getUserItem(req.session.theUser.userId,itemCode);

            if (theItem == null)
            {
              res.render('myItems', { profile: req.session.UserProfile});
            }
            else
            {
              res.render('feedback', { item: theItem[0],profile: req.session.UserProfile});
            }
            break;
          }
        }
        if(check == 0)
        {
            res.render('myItems', { profile: req.session.UserProfile});
        }
      }
    }
    else
    {
      res.render('myItems', { profile: req.session.UserProfile});
    }
  }
});

router.post('/myitems',urlencodedParser,async function(req,res,next)
{
  if(!req.query.action)
  {
    res.render('myItems', { profile: req.session.UserProfile});
  }
  else
  {

    req.check('itemCode').notEmpty().isAlphanumeric();

    if (action == 'updateRating')
    {
      req.check('rating').notEmpty().isNumeric();
    }
    if(action == 'updateFlag')
    {
      req.check('flag').notEmpty().isAlpha();
    }
    var errors = req.validationErrors();

    if(!errors)
    {
      var check=0;
      var action = req.query.action;
      var itemCode = req.query.itemCode;
      if(action == 'updateRating' || action == 'updateFlag')
      {
        if(action == 'updateRating')
        {
          var rating = req.body.rating;
          if(rating >= 0 && rating<=5)
          {
            for(var count=0;count<UserProfile.userItems.length;count++)
            {
              if(UserProfile.userItems[count].itemCode == itemCode)
              {
                UserProfile.updateItemRating(count,rating);
                req.session.UserProfile = UserProfile;
                await userItemDb.addItemRating(req.session.theUser.userId,itemCode,rating);
                res.render('myItems', { profile: req.session.UserProfile});
                check =1;
                break;
              }
            }
            if(check == 0)
            {
              console.log('Item Id does not exist in user profile');
  			      res.render('myItems', { profile: req.session.UserProfile});
            }
          }
          else
          {
              res.render('myItems', { profile: req.session.UserProfile});
          }
        }
        else if(action == 'updateFlag')
        {
          var flag = req.body.flag;
          if(flag == 'Yes' || flag == 'No' )
          {
            for(var count=0;count<UserProfile.userItems.length;count++)
            {
              if(UserProfile.userItems[count].itemCode == itemCode)
              {
                UserProfile.updateItemFlag(count,flag);
                req.session.UserProfile = UserProfile;
                await userItemDb.addMadeIt(req.session.theUser.userId,itemCode,flag);
                res.render('myItems', { profile: req.session.UserProfile});
                check =1;
                break;
              }
            }
            if(check == 0)
            {
              res.render('myItems', { profile: req.session.UserProfile});
            }
          }
          else
          {
            res.render('myItems', { profile: req.session.UserProfile});
          }

        }
        else
        {
            res.render('myItems', { profile: req.session.UserProfile});
        }
      }
      else
      {
        res.render('myItems', { profile: req.session.UserProfile});
      }
    }
    else
    {
      console.log("It did not set the values");
      res.render('myItems', { profile: req.session.UserProfile});
    }
  }
 });
module.exports = router;
module.exports = app;
