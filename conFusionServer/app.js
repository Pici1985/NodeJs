let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let FileStore = require('session-file-store')(session);
let passport = require('passport');
let authenticate = require('./authenticate');
let config = require('./config');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let dishRouter = require('./routes/dishRouter');
let promoRouter = require('./routes/promoRouter');
let leaderRouter = require('./routes/leaderRouter');
let uploadRouter = require('./routes/uploadRouter');
let favouriteRouter = require('./routes/favouriteRouter');

//Db 
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const url = config.mongoUrl;
const connect = mongoose.connect(url, {autoIndex: false});

connect.then((db) => {
  console.log('Server listening on localhost:3000');
  console.log('Connected to Database');
  },(err) => { console.log(err); 
});

var app = express();

app.all('*', (req, res, next) => {
  if(req.secure){
    return next();
  } else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url); 
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345'));

// sessions (used without JWT)
// app.use(session({
//   name: 'session-id',
//   secret: '12345',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore() 
// }));

// Passport functions
app.use(passport.initialize());

// session (without JWT)
// app.use(passport.session());



//basic authentication
// function auth(req,res,next){
//   console.log(req.headers);

//   let authHeader = req.headers.authorization;

//   if(!authHeader){
//     let err = new Error('You are not authenticated!!');

//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     next(err);
//   }

//   let auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');

//   let username = auth[0];
//   let password = auth[1];
  
//   if(username === 'admin' && password === 'password'){
//     next();
//   } else {
//     let err = new Error('You are not authenticated!!');

//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     next(err);  
//   }
// }

// authentication
// app.use(auth);
// checking for cookies

// function auth(req,res,next){
//   console.log(req.signedCookies);

//   if(!req.signedCookies.user){
//     let authHeader = req.headers.authorization;
  
//     if(!authHeader){
//       let err = new Error('You are not authenticated!!');
  
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       next(err);
//     }
  
//     let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  
//     let username = auth[0];
//     let password = auth[1];
    
//     if(username === 'admin' && password === 'password'){
//       res.cookie('user','admin', { signed: true });
//       next();
//     } else {
//       let err = new Error('You are not authenticated!!');
  
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);  
//     }
//   } else {
//     if(req.signedCookies.user === 'admin'){
//       next();
//     } else {
//       let err = new Error('You are not authenticated!!');
  
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);   
//     }
//   }
// }

// authentication
// app.use(auth);

// session
app.use('/', indexRouter);
app.use('/users', usersRouter);


//auth without passport 
//auth without passport 

// function auth(req,res,next){
//   console.log(req.session);

//   if(!req.session.user){
//     let err = new Error('You are not authenticated!!');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     next(err);  
//   } else {
//     if(req.session.user === 'authenticated'){
//       next();
//     } else {
//       let err = new Error('You are not authenticated!!');
  
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);   
//     }
//   }
// }

// auth with passport on all routes
// function auth(req,res,next){
//   if(!req.user){
//     let err = new Error('You are not authenticated!!');
//     err.status = 401;
//     next(err);  
//   } else {
//       next();
//   }
// };

// authentication
// app.use(auth);

// serve files from static folder 
app.use(express.static(path.join(__dirname, 'public')));

//routes

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favourites', favouriteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
