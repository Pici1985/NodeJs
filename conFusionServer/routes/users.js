var express = require('express');
let bodyParser = require('body-parser');
let User = require('../models/user');
let passport = require('passport');
let authenticate = require('../authenticate');

let router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
//eredeti verzio se
// router.get('/',authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//   User.find({})
//     .then((user) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(user);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

// Kolyok fele verzio
router.get('/', (req, res, next) => {
  console.log('barmi');
  authenticate.verifyAdmin(req, res, next, () => {
    console.log('akarmi');
    return User.find({})
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err));
  });  
});

// router.get('/users', (req, res, next) => {
//   Users.find({})
//     .then((users) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(users);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

router.post('/signup', (req,res, next) => {
  User.register(new User ({username: req.body.username}), 
    req.body.password, (err, user) => {
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});  
      } else {
        if(req.body.firstname){
          user.firstname = req.body.firstname;
        }
        if(req.body.lastname){
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
          if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return;    
          }
          passport.authenticate('local')(req,res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration successful.'});                
          });
        });
      }
    });
});

router.post('/login', passport.authenticate('local'),(req,res) => { 
    let token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in.'});   
});

router.get('/logout', (req, res) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    let err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
