var express = require('express');
var catalogController = require('./controller/catalogController');
var profileController = require('./controller/profileController');
var path = require('path');
var app = express();
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var helmet = require('helmet');

app.use(helmet());
//app.use(morgan('dev'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'assets')));

app.use(cookieParser());
app.use(session({
    secret: 'thisIsSecret',
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next)
{
  console.log(" set ");
  res.locals.userError = "valid";

  if(!req.session.theUser)
  {
    res.locals.theUser = null;
  }
  else
  {
      res.locals.theUser = req.session.theUser;
  }
  next();
});

app.use('/signin', profileController);
app.use('/', catalogController);

app.listen(8080,function(){
    console.log('app started')
    console.log('listening on port 8080')
});
