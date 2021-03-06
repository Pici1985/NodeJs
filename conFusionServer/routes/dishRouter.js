const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//API endpoints
// old version

// dishRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next();
// })
// .get((req,res,next) => {
//     res.end('Will send all the dishes to you!');
// })
// .post((req,res,next) => {
//     res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description );
// })
// .put((req,res,next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /dishes' );
// })
// .delete((req,res,next) => {
//     res.end('Deleting all the dishes!!');
// });

// API endpoints NEW version with mongoose

dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);   
    })
    .get(cors.cors, (req,res,next) => {
        Dishes.find(req.query)
            .populate('comments.author')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));        
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish Created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            },(err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes' );
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);    
            },(err) => next(err))
            .catch((err) => next(err));
    });

//API endpoints witg dish ID
// old version
 
// dishRouter.route('/:dishId')
// .get((req,res,next) => {
//     res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
// })
// .post((req,res,next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /dishes/' + req.params.dishId );
// })
// .put((req,res,next) => {
//     res.write('Updating the dish: ' + req.params.dishId + '\n');
//     res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
// })
// .delete((req,res,next) => {
//     res.end('Deleting dish: ' + req.params.dishId );
// });


//API andpoints with mongoose

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);   
})
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
        .populate('comments.author')
        .then((dish) => {
            console.log('Dish Created', dish);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        },(err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId );
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then((dish) => {
        console.log('Dish Created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);    
    },(err) => next(err))
    .catch((err) => next(err));
});

// API endpoints for /dishes/:dishId/comments
// API endpoints for /dishes/:dishId/comments/:commentId

dishRouter.route('/:dishId/comments')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);   
    })
    .get(cors.cors, (req,res,next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if(dish != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found!!');
                    err.status = 404;
                    return next(err);
                } 
            }, (err) => next(err))
            .catch((err) => next(err));        
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if(dish != null){
                    req.body.author = req.user._id;
                    dish.comments.push(req.body);
                    dish.save()
                    .then((dish) => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err))
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found!!');
                    err.status = 404;
                    return next(err);
                } 
            },(err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/ ' + req.params.dishId + ' /comments' );
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if(dish != null){
                    for( let i = (dish.comments.lenght -1); i >= 0; i--){
                        dish.comments.id(dish.comments[i]._id).remove();   
                    }
                    dish.save()
                    .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err))         
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found!!');
                    err.status = 404;
                    return next(err);
                }    
            },(err) => next(err))
            .catch((err) => next(err));
    });

//API andpoints with mongoose for comment ID

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);   
})
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
        .populate('comments.author')
        .then((dish) => {
            if(dish != null && dish.comments.id(req.params.commentId) != null ){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments.id(req.params.commentId));
            } else if (dish == null){
                err = new Error('Dish ' + req.params.dishId + ' not found!!');
                err.status = 404;
                return next(err);
            } else {
                err = new Error('Comment ' + req.params.commentId + ' not found!!');
                err.status = 404;
                return next(err);
            }    
        },(err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId + ' /comments/' + req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null ){
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    }) 
                }, (err) => next(err));           
        } else if (dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found!!');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found!!');
            err.status = 404;
            return next(err);
        }    
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){
            dish.comments.id(req.params.commentId).remove();   
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }) 
            }, (err) => next(err));         
        } else if (dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found!!');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found!!');
            err.status = 404;
            return next(err);
        }    
    },(err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter; 
