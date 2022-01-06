const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favourites = require('../models/favourites');
const {object, isMongooseObject} = require("mongoose/lib/utils");
const Dishes = require("../models/dishes");
const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser,
        (req, res, next) => {
        Favourites.findOne({user: req.user._id})
            .then((favourites) => {
                console.log("Favourites raw: ", favourites)
                console.log("Favourites JSON: ",JSON.stringify(favourites))
            })
            .populate('user')
            .populate('dishes')
            .then((favourites) => {
                console.log("Favourites populated: ",JSON.stringify(favourites))
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({user: req.user._id})
             .then((favourites) => {
                 let err;
                 if (favourites != null) {

                     var myFavouritesToAdd = req.body;
                     favourites.dishes.forEach((favourite) => {
                         myFavouritesToAdd = myFavouritesToAdd.filter(value =>
                             (value['_id'] != favourite)
                         )
                     })
                     myFavouritesToAdd.forEach((value) =>
                         favourites.dishes.push(mongoose.Types.ObjectId(value['_id']))
                     )

                     if (myFavouritesToAdd.length > 0) {
                         Favourites.findByIdAndUpdate(favourites._id, {
                             $set: {dishes: favourites.dishes}
                         }, {new: true})
                             .then((favourites) => {
                                 res.statusCode = 200;
                                 res.setHeader('Content-Type', 'application/json');
                                 res.json(favourites);
                             }, (err) => next(err))
                             .catch((err) => next(err));
                     } else {
                         err = new Error('Nothing to add');
                         err.status = 404;
                         return next(err);
                     }

                 } else {
                     Favourites.create({user: req.user._id, dishes: req.body})
                         .then((favourites) => {
                             res.statusCode = 200;
                             res.setHeader('Content-Type', 'application/json');
                             res.json(favourites);
                         }, (err) => next(err))
                 }
            }, (err) => next(err))
            .catch((err) => next(err));

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favourites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOneAndDelete({user: req.user._id})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
favouriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /favourites/:dishId');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({user: req.user._id})
            .then((favourites) => {
                let err;
                if (favourites != null) {

                    var myFavouriteToAdd = true;
                    favourites.dishes.every((favourite) => {

                        myFavouriteToAdd = (req.params.dishId != favourite)
                        return myFavouriteToAdd

                    })
                    console.log("add ", req.params.dishId, "? ",myFavouriteToAdd);

                        favourites.dishes.push(mongoose.Types.ObjectId(req.params.dishId))


                    if (myFavouriteToAdd) {
                        Favourites.findByIdAndUpdate(favourites._id, {
                            $set: {dishes: favourites.dishes}
                        }, {new: true})
                            .then((favourites) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favourites);
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    } else {
                        err = new Error('Nothing to add');
                        err.status = 404;
                        return next(err);
                    }

                } else {
                    Favourites.create({user: req.user._id, dishes: req.body})
                        .then((favourites) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favourites);
                        }, (err) => next(err))
                }
            }, (err) => next(err))
            .catch((err) => next(err));

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favourites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({user: req.user._id})
            .then((favourites) => {
                let err;
                if (favourites != null) {

                    favourites.dishes = favourites.dishes.filter(favourite =>
                        (favourite != req.params.dishId)
                    )

                        console.log("After delete: ", favourites.dishes)
                        Favourites.findByIdAndUpdate(favourites._id, {
                            $set: {dishes: favourites.dishes}
                        }, {new: true})
                            .then((favourites) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favourites);
                            }, (err) => next(err))
                            .catch((err) => next(err));


                } else {
                    err = new Error('Nothing to delete !');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));

    })

module.exports = favouriteRouter;