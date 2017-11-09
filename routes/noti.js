'use strict';                                   // Strictly follow latest JS standards

// Required Dependencies
var express = require('express');
var router = express.Router();
var sanitize = require('mongo-sanitize');       // To stop NoSQL injections - any req starts with $ will be emitted
var Noti = require('../models/noti');     // Profile Model

router.route('/')
.get(function(req, res, next){                  // Give all keywords in ascending order
    
    Noti.find().sort('-date').limit(50)
    .exec(function(err, noti){
        if(err)
            next(err);
        res.status(200).json(noti);
    });
})

.post(function(req, res, next){
    var body = sanitize(req.body);      // NoSQL injection prevention
    
    body.date = new Date();
    Noti.create(body, function(err, noti){
        if(err)
            next(err);
        res.status(200).json(noti);
    });
});

module.exports = router;