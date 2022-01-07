// Loading the necessary
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Dishes = require('../models/dishes');
const cors = require('./cors');
const favorites = require('../models/favorite');
const Users = require("../models/user");
const Leaders = require("../models/leaders");

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(authenticate.verifyCommonUser,authenticate.verifyAdmin, function(req, res, next) {
        user = req.user;
        favorites.find({"owner": user._id}).populate('dishes')
            .then((favorite) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            },(err)=> next(err)).catch((err) => next(err));
    })
    .post(authenticate.verifyCommonUser,authenticate.verifyAdmin, function(req, res, next) {
        user = req.user;
        favorites.find({"owner": user._id}).then((favorite)=>{
            if (favorite[0] == null){
                favor = new favorites({
                    owner: user._id,
                    dishes: req.body.dishes});
                favor.save().then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                },(err)=>next(err)).catch((err)=>next(err));
            }
            else {

                favorite[0].dishes = req.body.dishes;
                favorite[0].save().then((fav) =>{
                    favorites.findById(fav._id).populate('owner').then((fav)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(fav);
                    })
                },(err)=> next(err));
            }
        },(err)=>next(err)).catch((err)=>next(err));})
    .delete(authenticate.verifyCommonUser,authenticate.verifyAdmin, function(req, res, next) {
        favorites.remove({})
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            },(err)=>{next(err)}).catch((err)=>{next(err)});
    });


favoriteRouter.route('/:dishId')
    .post(authenticate.verifyCommonUser,authenticate.verifyAdmin,(req,res,next)=>{
        user = req.user;
        favorites.find({"owner": user._id}).then((favorite) =>{
            // if favorite does not exist:
            if (favorite[0] == null){
                favor = new favorites({
                    owner: user._id,
                    dishes: req.params.dishId});
                favor.save().then((favorite)=>{
                      res.statusCode = 200;
                      res.setHeader('Content-Type','application/json');
                      res.json(favorite);
                });
            }
            else {
                disheslist = favorite[0].dishes;
                // if dish is not in favorite object, add dishID in the list
                if (disheslist.indexOf(req.params.dishId) == -1){
                    favorite[0].dishes.push(req.params.dishId);
                }
                favorite[0].save().then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                });




            }
            },(err)=> next(err)).catch((err) => next(err));
    })
    .delete(authenticate.verifyCommonUser,authenticate.verifyAdmin,(req,res,next)=>{
        user = req.user;
        favorites.find({"owner": user._id}).then((favorite) =>{
            // if favorite does not exist:
            if (favorite[0] == null){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.end('dishes with '+req.params.dishId + 'not in favorite list');
            }
            else {
                disheslist = favorite[0].dishes;
                // if dish is not in favorite object, add dishID in the list
                if (disheslist.indexOf(req.params.dishId) == -1){
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.end('dishes with '+req.params.dishId + 'not in favorite list');
                }
                else{

                    var value = req.params.dishId;
                    dishlist = favorite[0].dishes;
                    dishlist = dishlist.filter(item => item != value);
                    favorite[0].dishes = dishlist;
                    favorite[0].save().then((favorite)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favorite);
                    });
                }






            }
        },(err)=> next(err)).catch((err) => next(err));


    });




module.exports = favoriteRouter;