let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('./models/user');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt = require('jsonwebtoken'); 

let config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {expiresIn: 3600}); 
};

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('JWT payload: ', jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if(err){
            return done(err, false);
        } else if (user){
            return done(null, user);
        } else {
            return done(null, false);    
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });



exports.verifyAdmin = function (req, res, next) {
    if (req.user.admin) {
        next();
    } else {
        let err = new Error('Not authorized!!');
        err.status = 403;
        return next(err);
    }
}

// Kolyok verzio 

// exports.verifyAdmin = (req, res, next, callback) => {
//     console.log('verifyAdmin');
//     passport.authenticate('jwt', (err, user, info) => {
//       console.log(user);
//         if (user.admin === true) {
//         callback()
//         .then(() => next()); // szerintem jo uresen
//       } else {
//         res.statusCode = 403;
//         res.json();
//       }
//     })(req,res,next);  
// };

